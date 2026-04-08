"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/app/actions";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", password);
      
      const res = await loginAdmin(formData);
      if (res.error) setError(res.error);
      else {
        router.push("/admin");
        router.refresh();
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter">PORTAL ACCESS</h1>
          <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest">Restricted Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 border border-pink-500 text-pink-500 text-sm font-bold uppercase tracking-widest">{error}</div>}
          
          <input
            autoFocus
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="MASTER KEY..."
            className="w-full bg-neutral-900 border border-neutral-800 p-4 text-white focus:outline-none focus:border-pink-500 transition-colors uppercase font-mono text-sm tracking-widest placeholder-neutral-600"
          />
          <button
            disabled={isPending || !password.trim()}
            type="submit"
            className="w-full py-4 bg-pink-500 text-black font-bold tracking-widest uppercase hover:bg-pink-400 transition-colors disabled:opacity-50"
          >
            {isPending ? "VERIFYING..." : "ENTER"}
          </button>
        </form>
      </div>
    </div>
  );
}
