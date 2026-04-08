"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sendNotificationEmail } from "@/lib/email";

// ===============
// MEMBER ACTIONS
// ===============

export async function createSubmission(formData: FormData) {
  const message = formData.get("message") as string;
  const type = formData.get("type") as string;

  if (!message || message.trim() === "") {
    return { error: "Message is required." };
  }
  if (type !== "GRIEVANCE" && type !== "FEEDBACK") {
    return { error: "Invalid submission type." };
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        message,
        type,
      },
    });

    // Fire and forget email notification
    sendNotificationEmail(submission.id, type, message).catch(console.error);

    return { success: true, trackingId: submission.id };
  } catch (error) {
    console.error("Error creating submission:", error);
    return { error: "Internal server error." };
  }
}

export async function getPublicSubmissions() {
  try {
    const submissions = await prisma.submission.findMany({
      select: {
        id: true,
        type: true,
        status: true,
        message: true,
        adminReply: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return { submissions };
  } catch (error) {
    if (error) console.error(error);
    return { error: "Internal server error." };
  }
}


// ===============
// ADMIN ACTIONS
// ===============

// Basic authentication check
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_session");
  if (!auth || auth.value !== process.env.ADMIN_SECRET) {
    throw new Error("Unauthorized");
  }
}

export async function getSubmissions(tab: "ACTIVE" | "RESOLVED") {
  await checkAdminAuth();

  try {
    const submissions = await prisma.submission.findMany({
      where: {
        status: tab === "RESOLVED" ? "RESOLVED" : { not: "RESOLVED" },
      },
      orderBy: { createdAt: "desc" },
    });

    return { submissions };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Internal server error." };
  }
}

export async function updateSubmissionStatus(id: string, status: string, reply?: string) {
  await checkAdminAuth();

  if (!["PENDING", "REVIEWING", "RESOLVED"].includes(status)) {
    return { error: "Invalid status." };
  }

  try {
    await prisma.submission.update({
      where: { id },
      data: { 
        status,
        ...(reply !== undefined && { adminReply: reply })
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Unauthorized") return { error: "Unauthorized" };
    return { error: "Internal server error." };
  }
}

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  const adminSecret = process.env.ADMIN_SECRET || "admin123"; // Fallback for local testing

  if (password === adminSecret) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", adminSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
    return { success: true };
  }

  return { error: "Invalid password." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
