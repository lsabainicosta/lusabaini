import { NextResponse } from "next/server";
import { z } from "zod";
import { emailLayout, escapeHtml, mailFrom, paragraphs, transporter } from "@/lib/mail";
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
      html: await emailLayout(
        "Nova mensagem pelo site",
        `
          <p style="margin: 0 0 8px;"><strong>Nome:</strong> ${safe.name}</p>
          <p style="margin: 0 0 8px;"><strong>E-mail:</strong> <a href="mailto:${safe.email}" style="color: #1a1a1a;">${safe.email}</a></p>
          <p style="margin: 0 0 16px;"><strong>Temas:</strong> ${safe.labels}</p>
          <div style="background: #f7f5f2; padding: 16px; border-radius: 12px; white-space: pre-wrap;">${safe.message}</div>
          <p style="margin: 16px 0 0; color: #6b6b6b; font-size: 13px;">${
            topics.length
              ? "A pessoa recebeu uma resposta automática com os temas, o valor por hora e o link da conversa gratuita."
              : "A pessoa recebeu uma resposta automática dizendo que você responde pessoalmente."
          }</p>
        `
      ),
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
    const reply = topics.length
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

    const { text, html } = paragraphs(reply);
    await transporter.sendMail({
      from: { name: "Luiza Sabaini", address: process.env.SMTP_USER || toEmail },
      to: email,
      replyTo: toEmail,
      subject: "Recebi a sua mensagem",
      text,
      html: await emailLayout("Obrigada pela sua mensagem!", html),
    });
  } catch (error) {
    console.error("Contact auto-reply error:", error);
  }

  return NextResponse.json({ success: true });
}
