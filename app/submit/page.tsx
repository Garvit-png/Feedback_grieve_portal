"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSubmission } from "@/app/actions";
import Link from "next/link";
import { Suspense } from "react";

function SubmitForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [type, setType] = useState(searchParams.get("type") === "GRIEVANCE" ? "GRIEVANCE" : "FEEDBACK");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("message", message);
      
      const res = await createSubmission(formData);
      if (res.error) setError(res.error);
      else if (res.success) router.push("/status");
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-8">
        <Link href="/" className="text-neutral-500 hover:text-pink-500 text-sm uppercase tracking-widest inline-block transition-colors">
          {"< Back"}
        </Link>
        
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">Submit</h1>
          <p className="text-neutral-500 text-sm mt-1">Total anonymity guaranteed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-pink-500 border border-pink-500 p-3 text-sm">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType("GRIEVANCE")}
              className={`p-4 border uppercase tracking-widest text-sm font-bold transition-colors ${
                type === "GRIEVANCE" ? "bg-pink-500 text-black border-pink-500" : "border-neutral-800 text-neutral-500 hover:border-pink-500"
              }`}
            >
              Grievance
            </button>
            <button
              type="button"
              onClick={() => setType("FEEDBACK")}
              className={`p-4 border uppercase tracking-widest text-sm font-bold transition-colors ${
                type === "FEEDBACK" ? "bg-white text-black border-white" : "border-neutral-800 text-neutral-500 hover:border-white"
              }`}
            >
              Feedback
            </button>
          </div>

          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="TYPE HERE..."
            className="w-full h-48 bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-pink-500 resize-none font-mono text-sm placeholder-neutral-600 transition-colors"
          />

          <button
            disabled={isPending || !message.trim()}
            type="submit"
            className="w-full py-4 bg-pink-500 text-black font-bold uppercase tracking-widest hover:bg-pink-400 transition-colors disabled:opacity-50"
          >
            {isPending ? "SENDING..." : "SECURE SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-pink-500 flex items-center justify-center font-mono">LOADING...</div>}>
      <SubmitForm />
    </Suspense>
  );
}
