import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { escapeHtml, mailFrom, transporter } from "@/lib/mail";
import { formatEuro } from "@/lib/queries";
import { sanityClient, sanityWriteClient } from "@/lib/sanity";

const orderSchema = z.object({
  guideId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
});

// ponytail: in-memory per-IP limit, fine for one container; resets on restart.
const recentOrders = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function isRateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentOrders.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recentOrders.set(ip, hits);
  return hits.length > LIMIT;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitos pedidos. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Informe um nome e um e-mail válidos" },
      { status: 400 }
    );
  }
  const { guideId, name, email } = parsed.data;

  const paypalMeUrl = process.env.PAYPAL_ME_URL?.replace(/\/+$/, "");
  const toEmail = process.env.CONTACT_EMAIL;
  if (!paypalMeUrl || !toEmail) {
    console.error("PAYPAL_ME_URL or CONTACT_EMAIL environment variable is not set");
    return NextResponse.json(
      { error: "Erro de configuração do servidor" },
      { status: 500 }
    );
  }

  // Price comes from Sanity, never from the browser.
  const guide = await sanityClient.fetch<{ title: string; price: number } | null>(
    `*[_type == "tourGuide" && _id == $guideId && available != false && defined(price)][0]{title, price}`,
    { guideId }
  );
  if (!guide) {
    return NextResponse.json({ error: "Guia não encontrado" }, { status: 404 });
  }

  const orderRef = `G-${randomUUID().slice(0, 6).toUpperCase()}`;
  const price = formatEuro(guide.price);
  const paypalUrl = `${paypalMeUrl}/${guide.price.toFixed(2)}EUR`;
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    title: escapeHtml(guide.title),
  };

  // Best effort: the emails below are the source of truth if this fails.
  try {
    if (!sanityWriteClient) throw new Error("SANITY_WRITE_TOKEN is not set");
    await sanityWriteClient.create({
      _type: "guideOrder",
      orderRef,
      status: "pending",
      name,
      email,
      guideTitle: guide.title,
      guide: { _type: "reference", _ref: guideId, _weak: true },
      price: guide.price,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Guide order save error:", error);
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: toEmail,
      replyTo: email,
      subject: `Novo pedido de guia ${orderRef} — ${guide.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Novo pedido de guia</h2>
          <p><strong>Pedido:</strong> ${orderRef}</p>
          <p><strong>Guia:</strong> ${safe.title}</p>
          <p><strong>Valor:</strong> ${price}</p>
          <p><strong>Nome:</strong> ${safe.name}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
          <p style="color: #666;">Confira o pagamento no PayPal e responda este e-mail com o guia em anexo.</p>
        </div>
      `,
    });

    // Personal sender, a plain-text part and a plain link (no "pay" button)
    // keep this out of spam: a styled payment button from a new sender reads as phishing.
    await transporter.sendMail({
      from: { name: "Luiza Sabaini", address: process.env.SMTP_USER || toEmail },
      to: email,
      replyTo: toEmail,
      subject: `Seu pedido ${orderRef} — ${guide.title}`,
      text: [
        `Olá, ${name}!`,
        "",
        "Recebi o seu pedido. Aqui está o resumo:",
        "",
        `Pedido: ${orderRef}`,
        `Guia: ${guide.title}`,
        `Valor: ${price}`,
        "",
        `Se ainda não pagou, finalize o pagamento pelo PayPal e coloque o código ${orderRef} na mensagem: ${paypalUrl}`,
        "",
        "Assim que o pagamento for confirmado, o guia chega no seu e-mail em até 48 horas.",
        "",
        "Qualquer dúvida, é só responder este e-mail.",
        "",
        "Um abraço,",
        "Luiza",
      ].join("\n"),
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Obrigada pelo seu pedido!</h2>
          <p>Olá, ${safe.name}!</p>
          <p>Recebi o seu pedido. Aqui está o resumo:</p>
          <table style="border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Pedido</td><td><strong>${orderRef}</strong></td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Guia</td><td>${safe.title}</td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #666;">Valor</td><td>${price}</td></tr>
          </table>
          <p>Se ainda não pagou, finalize o pagamento pelo PayPal e coloque o código <strong>${orderRef}</strong> na mensagem:</p>
          <p><a href="${paypalUrl}">${paypalUrl}</a></p>
          <p>Assim que o pagamento for confirmado, o guia chega no seu e-mail em até <strong>48 horas</strong>.</p>
          <p>Qualquer dúvida, é só responder este e-mail.</p>
          <p>Um abraço,<br />Luiza</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Guide order email error:", error);
    return NextResponse.json(
      { error: "Falha ao registrar o pedido. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  return NextResponse.json({ orderRef, paypalUrl, price });
}
