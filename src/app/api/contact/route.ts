import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_EMAIL = "testingm858@gmail.com";
const MAX_LEN = { name: 100, email: 254, subject: 150, message: 5000 };

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_LEN.email;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, subject, message, company } = body;

  // Honeypot — real users never see or fill this field, bots that fill every
  // input do. Silently report success so bots don't learn to skip it.
  if (typeof company === "string" && company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== "string" || !name.trim() || name.length > MAX_LEN.name) {
    return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
  }
  if (typeof email !== "string" || !isValidEmail(email.trim())) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (typeof subject !== "string" || !subject.trim() || subject.length > MAX_LEN.subject) {
    return NextResponse.json({ error: "Please enter a subject" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim() || message.length > MAX_LEN.message) {
    return NextResponse.json({ error: "Please enter a message" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Contact form is not configured yet" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    const { error } = await resend.emails.send({
      from: "SaaSToolz Contact <contact@saastoolz.com>",
      to: CONTACT_EMAIL,
      replyTo: email.trim(),
      subject: `[Contact] ${subject.trim()}`,
      html: `
        <p><strong>From:</strong> ${escape(name.trim())} (${escape(email.trim())})</p>
        <p><strong>Subject:</strong> ${escape(subject.trim())}</p>
        <p><strong>Message:</strong></p>
        <p>${escape(message.trim()).replace(/\n/g, "<br>")}</p>
      `,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
    }
  } catch (err) {
    console.error("Contact form send failed:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
