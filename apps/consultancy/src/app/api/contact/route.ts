import { NextResponse } from "next/server";
import { z } from "zod";
import { escapeHtml, mailFrom, transporter } from "@/lib/mail";
import { formatEuro, getContactOffer } from "@/lib/queries";
import { isRateLimited } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  topics: z.array(z.string().max(100)).max(20).default([]),
  other: z.boolean().default(false),
  message: z.string().trim().max(5000).default(""),
  website: z.string().optional(), // honeypot, real visitors never see it
});

const DEFAULT_REPLY_TOPICS =
  "Obrigada pela sua mensagem! Vou analisar o seu caso e respondo pessoalmente em até 2 dias úteis com uma sugestão de quantas horas fazem sentido para você.";
const DEFAULT_REPLY_OTHER =
  "Obrigada pela sua mensagem! Vou ler com calma e respondo pessoalmente em até 2 dias úteis.";

// Plain paragraphs -> text part + simple HTML part, with bare URLs turned into links.
function renderMail(paragraphs: string[]) {
  const text = paragraphs.join("\n\n");
  const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">${paragraphs
    .map(
      (p) =>
        `<p>${escapeHtml(p)
          .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
          .replace(/\n/g, "<br />")}</p>`
    )
    .join("")}</div>`;
  return { text, html };
}

export async function POST(request: Request) {
  if (isRateLimited(request, "contact")) {
    return NextResponse.json(
      { error: "Muitas mensagens. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Informe um nome e um e-mail válidos" },
      { status: 400 }
    );
  }
  const { name, email, other, message, website } = parsed.data;

  // Bots fill every field. Pretend it worked so they don't retry.
  if (website) return NextResponse.json({ success: true });

  const offer = await getContactOffer();
  // Only accept topics that exist in Sanity, never free text from the browser.
  const topics = parsed.data.topics.filter((t) => offer.topics.includes(t));

  if ((other || topics.length === 0) && message.length < 10) {
    return NextResponse.json(
      { error: "Conte um pouco o que você precisa (pelo menos 10 caracteres)" },
      { status: 400 }
    );
  }

  const toEmail = process.env.CONTACT_EMAIL;
  if (!toEmail) {
    console.error("CONTACT_EMAIL environment variable is not set");
    return NextResponse.json(
      { error: "Erro de configuração do servidor" },
      { status: 500 }
    );
  }

  const labels = [...topics, ...(other ? ["Outro assunto"] : [])];
  const subjectTag = labels.length ? `[${labels.join(", ")}] ` : "";
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    labels: escapeHtml(labels.join(", ") || "Nenhum"),
    message: escapeHtml(message || "(sem mensagem)"),
  };

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: toEmail,
      replyTo: email,
      subject: `Nova mensagem ${subjectTag}— ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Nova mensagem — Consultoria Holanda</h2>
          <p><strong>Nome:</strong> ${safe.name}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
          <p><strong>Temas:</strong> ${safe.labels}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${safe.message}</div>
          <p style="color: #666;">${
            topics.length
              ? "A pessoa recebeu uma resposta automática com os temas, o valor por hora e o link da conversa gratuita."
              : "A pessoa recebeu uma resposta automática dizendo que você responde pessoalmente."
          }</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Falha ao enviar. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  // Luiza already has the message, so a failed auto-reply is only logged.
  try {
    const paragraphs = topics.length
      ? [
          `Olá, ${name}!`,
          offer.autoReplyTopics || DEFAULT_REPLY_TOPICS,
          `Temas escolhidos: ${topics.join(", ")}`,
          `Valor: ${formatEuro(offer.hourlyRate)} por hora. ${offer.rateIncludes}`,
          ...(offer.bookingUrl
            ? [
                `Se preferir conversar antes, agende uma conversa inicial gratuita de 15 a 20 minutos: ${offer.bookingUrl}`,
              ]
            : []),
          "Qualquer dúvida, é só responder este e-mail.",
          "Um abraço,\nLuiza",
        ]
      : [
          `Olá, ${name}!`,
          offer.autoReplyOther || DEFAULT_REPLY_OTHER,
          "Um abraço,\nLuiza",
        ];

    await transporter.sendMail({
      from: { name: "Luiza Sabaini", address: process.env.SMTP_USER || toEmail },
      to: email,
      replyTo: toEmail,
      subject: "Recebi a sua mensagem",
      ...renderMail(paragraphs),
    });
  } catch (error) {
    console.error("Contact auto-reply error:", error);
  }

  return NextResponse.json({ success: true });
}
