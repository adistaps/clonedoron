import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter: use Gmail credentials if provided, otherwise use a test account
let transporterPromise: Promise<nodemailer.Transporter>;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporterPromise = Promise.resolve(
    nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  );
} else {
  // Fallback to Ethereal test account (no real email sending)
  transporterPromise = nodemailer.createTestAccount().then((testAccount) =>
    nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  );
}

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();
    if (!to || !subject || !text) {
      return NextResponse.json({ error: 'Missing required fields (to, subject, text)' }, { status: 400 });
    }
    const transporter = await transporterPromise;
    const mailOptions = {
      from: process.env.GMAIL_USER || 'no-reply@example.com',
      to,
      subject,
      text,
    };
    const info = await transporter.sendMail(mailOptions);
    // If using a test account, include preview URL
    const preview = nodemailer.getTestMessageUrl(info);
    return NextResponse.json({ success: true, previewUrl: preview || undefined });
  } catch (error: any) {
    console.error('Nodemailer error', error);
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
}
