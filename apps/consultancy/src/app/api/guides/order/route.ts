import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { emailLayout, escapeHtml, mailFrom, transporter } from "@/lib/mail";
import { formatEuro } from "@/lib/queries";
import { isRateLimited } from "@/lib/rateLimit";
import { sanityClient, sanityWriteClient } from "@/lib/sanity";

const orderSchema = z.object({
  guideId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
});

export async function POST(request: Request) {
  if (isRateLimited(request, "guide-order")) {
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
      html: await emailLayout(
        "Novo pedido de guia",
        `
          <p style="margin: 0 0 8px;"><strong>Pedido:</strong> ${orderRef}</p>
          <p style="margin: 0 0 8px;"><strong>Guia:</strong> ${safe.title}</p>
          <p style="margin: 0 0 8px;"><strong>Valor:</strong> ${price}</p>
          <p style="margin: 0 0 8px;"><strong>Nome:</strong> ${safe.name}</p>
          <p style="margin: 0 0 16px;"><strong>E-mail:</strong> <a href="mailto:${safe.email}" style="color: #1a1a1a;">${safe.email}</a></p>
          <p style="margin: 0; color: #6b6b6b; font-size: 13px;">Confira o pagamento no PayPal e responda este e-mail com o guia em anexo.</p>
        `
      ),
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
      html: await emailLayout(
        "Obrigada pelo seu pedido!",
        `
          <p style="margin: 0 0 16px;">Olá, ${safe.name}!</p>
          <p style="margin: 0 0 16px;">Recebi o seu pedido. Aqui está o resumo:</p>
          <table role="presentation" style="border-collapse: collapse; margin: 0 0 16px;">
            <tr><td style="padding: 4px 16px 4px 0; color: #6b6b6b;">Pedido</td><td><strong>${orderRef}</strong></td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #6b6b6b;">Guia</td><td>${safe.title}</td></tr>
            <tr><td style="padding: 4px 16px 4px 0; color: #6b6b6b;">Valor</td><td>${price}</td></tr>
          </table>
          <p style="margin: 0 0 16px;">Se ainda não pagou, finalize o pagamento pelo PayPal e coloque o código <strong>${orderRef}</strong> na mensagem:</p>
          <p style="margin: 0 0 16px;"><a href="${paypalUrl}" style="color: #1a1a1a;">${paypalUrl}</a></p>
          <p style="margin: 0 0 16px;">Assim que o pagamento for confirmado, o guia chega no seu e-mail em até <strong>48 horas</strong>.</p>
          <p style="margin: 0 0 16px;">Qualquer dúvida, é só responder este e-mail.</p>
          <p style="margin: 0;">Um abraço,<br />Luiza</p>
        `
      ),
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
