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
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo must be less than 5MB");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("message", message);
      if (photo) {
        formData.append("photo", photo);
      }
      
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

          <div className="space-y-3">
            <label className="block text-sm text-neutral-400 uppercase tracking-widest">
              Upload Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full bg-neutral-900 border border-neutral-800 p-3 text-white text-sm file:bg-pink-500 file:text-black file:border-0 file:py-2 file:px-4 file:rounded-none file:font-bold file:cursor-pointer hover:border-pink-500 transition-colors"
            />
            {photoPreview && (
              <div className="relative w-full border border-neutral-800 bg-neutral-950 rounded-none overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-pink-500 text-black px-3 py-1 text-xs font-bold uppercase hover:bg-pink-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

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
