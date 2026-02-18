// "use client";
// import { useEffect, useState } from "react";
// import { createClient } from "../lib/supabase/client";

// export default function BookmarkList({ userId }: { userId: string }) {
//   const [bookmarks, setBookmarks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const supabase = createClient();

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       const { data } = await supabase
//         .from("bookmarks")
//         .select("*")
//         .order("inserted_at", { ascending: false });
//       if (data) setBookmarks(data);
//       setLoading(false);
//     };

//     fetchBookmarks();

//     const channel = supabase
//       .channel("schema-db-changes")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "bookmarks" },
//         (payload) => {
//           if (payload.eventType === "INSERT") {
//             setBookmarks((prev) => [payload.new, ...prev]);
//           } else if (payload.eventType === "DELETE") {
//             setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
//           }
//         },
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [supabase]);

//   const deleteBookmark = async (id: string) => {
//     await supabase.from("bookmarks").delete().eq("id", id);
//   };

//   if (loading) {
//     return (
//       <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
//         {[...Array(4)].map((_, i) => (
//           <div
//             key={i}
//             className="h-24 bg-slate-100 rounded-2xl border border-slate-200"
//           />
//         ))}
//       </div>
//     );
//   }

//   if (bookmarks.length === 0) {
//     return (
//       <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
//         <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//           <svg
//             className="w-8 h-8 text-slate-300"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//             />
//           </svg>
//         </div>
//         <h3 className="text-lg font-medium text-slate-900">No bookmarks yet</h3>
//         <p className="text-slate-500">
//           Add your first link above to get started.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
//       {bookmarks.map((bookmark) => (
//         <div
//           key={bookmark.id}
//           className="group relative bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
//         >
//           <div className="flex gap-4">
//             {/* Favicon Icon */}
//             <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
//               <img
//                 src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`}
//                 alt=""
//                 className="w-6 h-6 object-contain"
//                 onError={(e) =>
//                   (e.currentTarget.src =
//                     "https://www.svgrepo.com/show/509930/earth.svg")
//                 }
//               />
//             </div>

//             <div className="flex-1 min-w-0">
//               <h3 className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
//                 {bookmark.title}
//               </h3>
//               <p className="text-sm text-slate-500 truncate mb-2">
//                 {new URL(bookmark.url).hostname}
//               </p>
//             </div>
//           </div>

//           <div className="mt-4 flex items-center justify-between">
//             <a
//               href={bookmark.url}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
//             >
//               Visit Link
//               <svg
//                 className="w-3 h-3 ml-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                 />
//               </svg>
//             </a>

//             <button
//               onClick={() => deleteBookmark(bookmark.id)}
//               className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
//               title="Delete bookmark"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

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
    // Optimistic UI update could be added here for extra "polish"
    await supabase.from("bookmarks").delete().eq("id", id);
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
