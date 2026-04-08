import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function sendNotificationEmail(submissionId: string, type: string, message: string) {
  // If no SMTP settings configured, gracefully skip
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email skipped: SMTP not configured.");
    return;
  }

  try {
    const config = await prisma.notificationConfig.findMany();
    if (config.length === 0) return;

    const bccList = config.map(c => c.email).join(",");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    const portalUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    await transporter.sendMail({
      from: `"Feedback Portal" <${process.env.SMTP_USER}>`,
      to: `admin@feedbackportal.local`, 
      bcc: bccList,
      subject: `New ${type} Submitted`,
      text: `A new ${type.toLowerCase()} was just submitted.\n\nMessage:\n"${message}"\n\nView it here: ${portalUrl}/admin`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #333;">New ${type} Submitted</h2>
          <p>A new ${type.toLowerCase()} has been received.</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; font-style: italic; margin: 20px 0;">
            "${message}"
          </div>
          <a href="${portalUrl}/admin" style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 6px;">View on Dashboard</a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}
