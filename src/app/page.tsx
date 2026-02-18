"use client";
import { createClient } from "../lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full space-y-12">
        {/* Brand Identity */}
        <div className="text-center space-y-6">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto transition-transform hover:rotate-3 duration-500"
            style={{
              background: "linear-gradient(135deg, #292524 0%, #44403c 100%)",
              boxShadow: "0 12px 24px -8px rgba(0,0,0,0.15)",
            }}
          >
            <svg
              className="w-7 h-7 text-[#fafaf8]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-serif italic text-stone-900 tracking-tight">
              SupaMark
            </h1>
            <p className="text-stone-400 text-sm font-medium leading-relaxed max-w-60 mx-auto uppercase tracking-widest">
              Your digital study for the modern web.
            </p>
          </div>
        </div>

        {/* Action Area */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="group w-full flex items-center justify-center gap-3 bg-white border border-[#e8e4df] text-stone-700 font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-[20px] transition-all duration-300 hover:border-stone-400 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] active:scale-[0.98]"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all duration-300"
              alt="Google"
            />
            Continue with Google
          </button>

          <p className="text-center text-[0.65rem] text-stone-300 font-bold uppercase tracking-[0.2em] pt-4">
            Encrypted &bull; Real-time
          </p>
        </div>
      </div>

      {/* Subtle background element */}
      <div className="fixed bottom-10 text-stone-200 pointer-events-none select-none italic font-serif text-8xl opacity-20">
        Index
      </div>
    </div>
  );
}
