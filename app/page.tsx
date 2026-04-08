import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
      <main className="max-w-xl w-full flex flex-col items-center text-center space-y-16">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">
            SPEAK <span className="text-pink-500">FREELY.</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-sm mx-auto">
            A secure, zero-trace portal for grievances and feedback. We do not track you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <Link 
            href="/submit?type=GRIEVANCE"
            className="flex-1 py-4 flex items-center justify-center border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-colors rounded-none font-bold tracking-widest uppercase"
          >
            Grievance
          </Link>
          <Link 
            href="/submit?type=FEEDBACK"
            className="flex-1 py-4 flex items-center justify-center border border-white text-white hover:bg-white hover:text-black transition-colors rounded-none font-bold tracking-widest uppercase"
          >
            Feedback
          </Link>
          <Link 
            href="/status"
            className="flex-1 py-4 flex items-center justify-center border border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors rounded-none font-bold tracking-widest uppercase"
          >
            Status
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-neutral-700 text-xs tracking-widest uppercase">
        System Active
      </footer>
    </div>
  );
}
