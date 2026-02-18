import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import BookmarkForm from "../../components/BookMarkForm";
import BookmarkList from "../../components/BookmarkList";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] selection:bg-[#e8e4df]">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-1">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-stone-400 font-bold">
              Personal Collection
            </p>
            <h1 className="text-4xl md:text-5xl font-serif italic text-stone-900 tracking-tight">
              SupaMark
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[0.7rem] text-stone-400 font-medium">
                Signed in as
              </p>
              <p className="text-xs text-stone-600 font-mono">{user.email}</p>
            </div>

            <form action="/auth/signout" method="post">
              <button className="hover:cursor-pointer border border-red-500 p-1 rounded-md text-[0.65rem] uppercase tracking-widest font-bold text-stone-400 hover:text-red-500 transition-colors border-b  hover:border-red-200 pb-0.5">
                Sign Out
              </button>
            </form>
          </div>
        </header>

        <main className="space-y-12">
          {/* Submission Section */}
          <section className="relative">
            <div className="flex items-center gap-3 mb-4 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              <h2 className="text-[0.7rem] font-bold text-stone-400 uppercase tracking-[0.15em]">
                Quick Add
              </h2>
            </div>
            <BookmarkForm userId={user.id} />
          </section>

          {/* List Section */}
          <section className="pt-4">
            <BookmarkList userId={user.id} />
          </section>
        </main>

        {/* Subtle Footer */}
        <footer className="mt-24 pt-8 border-t border-stone-200/60 flex justify-center">
          <p className="text-[0.65rem] text-stone-300 uppercase tracking-widest">
            Curated with Care &bull; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
}
