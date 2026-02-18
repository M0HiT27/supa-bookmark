"use client";
import { useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function BookmarkForm({ userId }: { userId: string }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("bookmarks")
      .insert([{ url, title, user_id: userId }]);

    if (!error) {
      setUrl("");
      setTitle("");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mb-10 p-1 bg-[#fcfbf9] border border-[#e8e4df] rounded-[28px] shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-2 p-1.5"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Name your bookmark..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-5 py-3.5 bg-transparent text-stone-800 placeholder:text-stone-400 font-serif italic text-sm outline-none focus:ring-0"
          />
        </div>

        {/* Subtle Vertical Divider for Desktop */}
        <div className="hidden md:block w-px h-8 self-center bg-[#e8e4df]" />

        <div className="flex-[1.5] relative">
          <input
            type="url"
            placeholder="Paste link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-5 py-3.5 bg-transparent text-stone-600 text-sm outline-none focus:ring-0 font-mono tracking-tight"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !url || !title}
          className="hover:cursor-pointer group relative flex items-center justify-center px-8 py-3.5 bg-stone-900 text-stone-50 rounded-[22px] font-bold text-xs uppercase tracking-widest transition-all hover:bg-stone-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 overflow-hidden"
        >
          <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
            {isSubmitting ? "Saving..." : "Add Link"}
          </span>

          {/* Subtle loading state inside button */}
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-50 rounded-full animate-spin" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
