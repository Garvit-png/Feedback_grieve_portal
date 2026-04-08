import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_session");

  if (!auth || auth.value !== (process.env.ADMIN_SECRET || "admin123")) {
    redirect("/admin/login");
  }

  const submissions = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <DashboardClient initialSubmissions={submissions} />;
}
