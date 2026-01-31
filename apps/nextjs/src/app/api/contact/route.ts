import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_EMAIL;
    if (!toEmail) {
      console.error("CONTACT_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send email using nodemailer
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"Contact Form" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>Name:</strong></p>
            <p style="margin: 8px 0; color: #333;">${name}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>Email:</strong></p>
            <p style="margin: 8px 0; color: #333;">
              <a href="mailto:${email}" style="color: #0066cc;">${email}</a>
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0; color: #666;"><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 8px;">
              <p style="margin: 0; color: #333; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">
            This message was sent from the contact form on your website.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
