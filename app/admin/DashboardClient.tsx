"use client";

import { useState, useTransition } from "react";
import { updateSubmissionStatus, logoutAdmin } from "@/app/actions";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  type: string;
  message: string;
  status: string;
  adminReply: string | null;
  createdAt: Date;
};

export default function DashboardClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"ACTIVE" | "RESOLVED">("ACTIVE");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isPending, startTransition] = useTransition();

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    let nextStatus = currentStatus;
    if (currentStatus === "PENDING") nextStatus = "REVIEWING";
    else if (currentStatus === "REVIEWING") nextStatus = "RESOLVED";
    else if (currentStatus === "RESOLVED") nextStatus = "PENDING";

    startTransition(async () => {
      await updateSubmissionStatus(id, nextStatus);
      router.refresh();
    });
  };

  const handleSendReply = (id: string) => {
    const reply = replyText[id];
    if (!reply || reply.trim() === "") return;

    startTransition(async () => {
      await updateSubmissionStatus(id, "REVIEWING", reply);
      setReplyText(prev => ({ ...prev, [id]: "" }));
      router.refresh();
    });
  };

  const activeCount = initialSubmissions.filter(s => s.status !== "RESOLVED").length;
  const resolvedCount = initialSubmissions.filter(s => s.status === "RESOLVED").length;

  const displayed = initialSubmissions.filter(s => 
    tab === "ACTIVE" ? s.status !== "RESOLVED" : s.status === "RESOLVED"
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 font-mono">
      <header className="max-w-4xl mx-auto flex items-center justify-between border-b border-neutral-800 pb-6 mb-12">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tighter">DATA CENTER</h1>
          <p className="text-pink-500 text-xs uppercase tracking-widest mt-1">Admin Access Only</p>
        </div>
        <button 
          onClick={async () => { await logoutAdmin(); router.push("/admin/login"); router.refresh(); }}
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-pink-500 transition-colors border border-transparent hover:border-pink-500 p-2"
        >
          LOG OFF
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex gap-4 border-b border-neutral-800 pb-4 mb-8">
          <button
            onClick={() => setTab("ACTIVE")}
            className={`uppercase tracking-widest text-sm font-bold pb-2 transition-colors ${
              tab === "ACTIVE" ? "text-pink-500 border-b-2 border-pink-500" : "text-neutral-500 hover:text-white"
            }`}
          >
            ACTIVE [{activeCount}]
          </button>
          <button
            onClick={() => setTab("RESOLVED")}
            className={`uppercase tracking-widest text-sm font-bold pb-2 transition-colors ${
              tab === "RESOLVED" ? "text-white border-b-2 border-white" : "text-neutral-500 hover:text-white"
            }`}
          >
            RESOLVED [{resolvedCount}]
          </button>
        </div>

        <div className="space-y-6">
          {displayed.length === 0 ? (
            <div className="border border-neutral-800 p-12 text-center text-neutral-600 uppercase tracking-widest text-sm">
              NO SUBMISSIONS FOUND.
            </div>
          ) : (
            displayed.map(sub => (
              <div key={sub.id} className="border border-neutral-800 bg-neutral-900 p-6">
                <div className="flex justify-between items-start mb-6 border-b border-neutral-800 pb-6">
                  <div className="space-y-1">
                    <span className={`text-xs uppercase font-bold px-2 py-1 ${sub.type === "GRIEVANCE" ? "bg-pink-500 text-black" : "bg-white text-black"}`}>
                      {sub.type}
                    </span>
                    <p className="text-xs text-neutral-500 tracking-widest pt-2">ID: {sub.id}</p>
                    <p className="text-xs text-neutral-500 tracking-widest">DATE: {new Date(sub.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button
                      disabled={isPending}
                      onClick={() => handleUpdateStatus(sub.id, sub.status)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                        sub.status === "PENDING" ? "border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black" :
                        sub.status === "REVIEWING" ? "border-white text-white hover:bg-white hover:text-black" :
                        "border-neutral-600 text-neutral-500 hover:text-white"
                      }`}
                    >
                      {sub.status === "PENDING" && "MARK: REVIEWING"}
                      {sub.status === "REVIEWING" && "MARK: RESOLVED"}
                      {sub.status === "RESOLVED" && "UNDO: RESOLVED"}
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-mono leading-relaxed whitespace-pre-wrap text-neutral-300">
                    {sub.message}
                  </p>
                </div>

                {sub.adminReply && (
                  <div className="mb-6 border-l-2 border-pink-500 pl-4">
                    <span className="text-xs uppercase tracking-widest text-pink-500 mb-2 block">LAST REPLY</span>
                    <p className="text-sm text-neutral-400 whitespace-pre-wrap">{sub.adminReply}</p>
                  </div>
                )}

                {tab === "ACTIVE" && (
                  <div className="flex gap-4 mt-8">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-neutral-800 p-3 text-sm focus:outline-none focus:border-pink-500 transition-colors uppercase tracking-widest placeholder-neutral-700"
                      placeholder="TYPE VISIBLE REPLY..."
                      value={replyText[sub.id] || ""}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [sub.id]: e.target.value }))}
                    />
                    <button
                      disabled={isPending || !replyText[sub.id]?.trim()}
                      onClick={() => handleSendReply(sub.id)}
                      className="px-6 py-3 bg-pink-500 text-black font-bold text-sm tracking-widest uppercase hover:bg-pink-400 transition-colors disabled:opacity-50"
                    >
                      SEND
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
