"use client";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

// Define a type for better DX
interface Bookmark {
  id: string;
  url: string;
  title: string;
  inserted_at: string;
}

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId) // Ensure we only fetch for this user
        .order("inserted_at", { ascending: false });

      if (data) setBookmarks(data);
      setLoading(false);
    };

    fetchBookmarks();

    const channel = supabase
      .channel(`user-bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`, // Server-side filtering for efficiency
        },
        (payload) => {
          console.log("Real-time event received:", payload);
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? (payload.new as Bookmark) : b,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      console.error("Full Error Object:", error);
      alert(`Delete failed: ${error.message}`);
      return;
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (bookmarks.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="group relative flex flex-col justify-between p-5 bg-white border border-[#e8e4df] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#d4cfc7] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex gap-4 items-start">
            {/* Favicon Container */}
            <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-[#f8f7f4] border border-[#e8e4df] rounded-xl overflow-hidden">
              <img
                src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=128`}
                alt=""
                className="w-6 h-6 object-contain grayscale-[0.2] group-hover:grayscale-0 transition-all"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://www.svgrepo.com/show/509930/earth.svg")
                }
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[0.95rem] text-stone-900 leading-tight truncate font-serif italic">
                {bookmark.title || "Untitled Bookmark"}
              </h3>
              <p className="text-[0.75rem] text-stone-400 mt-1 font-medium tracking-wide truncate">
                {new URL(bookmark.url).hostname.replace("www.", "")}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-[#f0ede9] my-5" />

          <div className="flex items-center justify-between">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-widest text-stone-600 bg-[#f4f2ef] border border-[#e8e4df] rounded-lg transition-all hover:bg-stone-900 hover:text-white hover:border-stone-900"
            >
              Visit
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="hover:cursor-pointer p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200"
              title="Delete bookmark"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Sub-components for cleaner main component
function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-36 rounded-2xl bg-stone-100 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-4xl bg-stone-50/50">
      <div className="w-16 h-16 bg-white border border-stone-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
        <svg
          className="w-8 h-8 text-stone-300"
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
      <h3 className="text-lg font-semibold text-stone-800 font-serif italic">
        Your library is empty
      </h3>
      <p className="text-stone-400 text-sm mt-1">
        Save links to build your personal collection.
      </p>
    </div>
  );
}
