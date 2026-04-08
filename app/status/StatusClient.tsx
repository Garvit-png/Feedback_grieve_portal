"use client";

import { useState } from "react";
import Link from "next/link";

type Submission = {
  id: string;
  type: string;
  message: string;
  photo?: string | null;
  status: string;
  adminReply: string | null;
  createdAt: Date;
};

export default function StatusClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [tab, setTab] = useState<"PENDING" | "REVIEWING" | "RESOLVED">("PENDING");

  const displayed = initialSubmissions.filter(s => s.status === tab);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12 py-12">
        <header className="flex justify-between items-end border-b border-neutral-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter">PUBLIC STATUS</h1>
            <p className="text-pink-500 text-sm mt-1 uppercase tracking-widest">Global Overview</p>
          </div>
          <Link href="/" className="text-neutral-500 hover:text-pink-500 text-xs uppercase tracking-widest transition-colors mb-1">
            {"< Home"}
          </Link>
        </header>

        <div className="flex gap-4 border-b border-neutral-800 pb-4">
          <button
            onClick={() => setTab("PENDING")}
            className={`uppercase tracking-widest text-sm font-bold pb-2 transition-colors ${
              tab === "PENDING" ? "text-pink-500 border-b-2 border-pink-500" : "text-neutral-500 hover:text-white"
            }`}
          >
            PENDING [{initialSubmissions.filter(s => s.status === "PENDING").length}]
          </button>
          <button
            onClick={() => setTab("REVIEWING")}
            className={`uppercase tracking-widest text-sm font-bold pb-2 transition-colors ${
              tab === "REVIEWING" ? "text-pink-500 border-b-2 border-pink-500" : "text-neutral-500 hover:text-white"
            }`}
          >
            REVIEWING [{initialSubmissions.filter(s => s.status === "REVIEWING").length}]
          </button>
          <button
            onClick={() => setTab("RESOLVED")}
            className={`uppercase tracking-widest text-sm font-bold pb-2 transition-colors ${
              tab === "RESOLVED" ? "text-white border-b-2 border-white" : "text-neutral-500 hover:text-white"
            }`}
          >
            RESOLVED [{initialSubmissions.filter(s => s.status === "RESOLVED").length}]
          </button>
        </div>

        <div className="space-y-6">
          {displayed.length === 0 ? (
            <div className="border border-neutral-800 p-12 text-center text-neutral-600 uppercase tracking-widest text-sm">
              NO SUBMISSIONS FOUND FOR &quot;{tab}&quot;
            </div>
          ) : (
            displayed.map(sub => (
              <div key={sub.id} className="border border-neutral-800 bg-neutral-900 p-6 space-y-6">
                <div className="flex justify-between items-start border-b border-neutral-800 pb-4">
                  <div className="space-y-1">
                    <span className={`text-xs uppercase font-bold px-2 py-1 ${sub.type === "GRIEVANCE" ? "bg-pink-500 text-black border border-pink-500" : "bg-white text-black border border-white"}`}>
                      {sub.type}
                    </span>
                    <p className="text-xs text-neutral-500 tracking-widest pt-2">DATE: {new Date(sub.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 border font-bold text-xs uppercase tracking-widest ${
                      sub.status === "RESOLVED" ? "text-white border-white bg-black" : "text-pink-500 border-pink-500 bg-black"
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-neutral-300">
                    {sub.message}
                  </p>
                </div>

                {sub.photo && (
                  <div className="border border-neutral-800 bg-neutral-950">
                    <img
                      src={sub.photo}
                      alt="Submission attachment"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                )}

                {sub.adminReply && (
                  <div className="border border-neutral-800 border-l-4 border-l-pink-500 p-4 bg-black">
                    <span className="text-xs uppercase tracking-widest text-pink-500 mb-2 block">LEADERSHIP REPLY</span>
                    <p className="text-sm border-neutral-700 text-neutral-400 whitespace-pre-wrap">{sub.adminReply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
