import { getPublicSubmissions } from "@/app/actions";
import StatusClient from "./StatusClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicStatusPage() {
  const res = await getPublicSubmissions();
  
  if (res.error || !res.submissions) {
    return (
      <div className="min-h-screen bg-black text-pink-500 font-mono p-6 flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold uppercase mb-4">SYSTEM ERROR</h1>
        <p className="text-neutral-500 text-sm">COULD NOT LOAD SUBMISSIONS</p>
      </div>
    );
  }

  return <StatusClient initialSubmissions={res.submissions} />
}
