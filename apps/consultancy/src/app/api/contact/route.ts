import { NextResponse } from "next/server";
import { escapeHtml, mailFrom, transporter } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    const safe = {
      name: escapeHtml(String(name ?? "")),
      email: escapeHtml(String(email ?? "")),
      message: escapeHtml(String(message ?? "")),
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nome, e-mail e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Informe um e-mail válido" },
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

    await transporter.sendMail({
      from: mailFrom,
      to: toEmail,
      replyTo: email,
      subject: `Nova mensagem da consultoria — ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
            Nova mensagem — Consultoria Holanda
          </h2>
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>Nome:</strong></p>
            <p style="margin: 8px 0; color: #333;">${safe.name}</p>
          </div>
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>E-mail:</strong></p>
            <p style="margin: 8px 0; color: #333;">
              <a href="mailto:${safe.email}" style="color: #0066cc;">${safe.email}</a>
            </p>
          </div>
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>Mensagem:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 8px;">
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${safe.message}</p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Falha ao enviar. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
