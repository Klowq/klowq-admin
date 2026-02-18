"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { HiOutlineSearch, HiOutlineBell, HiOutlineChat } from "react-icons/hi";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const pathnameToTitle: Record<string, string> = {
  "/": "Dashboard",
  "/blogs": "Blogs",
  "/blogs/new": "Create Blog",
  "/preferences": "Preferences",
  "/doctors": "Doctors",
  "/doctors/pending": "Pending Approval",
  "/settings": "My Account",
};

function getPageTitle(pathname: string): string {
  const fromPath = pathnameToTitle[pathname];
  if (fromPath) return fromPath;
  const slug = pathname.slice(1);
  return slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "Dashboard";
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const pageTitle = getPageTitle(pathname);
  const userName = session?.user?.name ?? "User";
  const userRole = "Admin";

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-3 py-3 bg-card border-b border-border">
          <h1 className="font-bold text-foreground">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
          <button
              type="button"
              className="relative p-2 rounded-xl bg-muted text-muted-foreground hover:bg-accent transition-colors"
              aria-label="Messages"
            >
              <HiOutlineChat className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 py-0.5 px-1.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">1</span>
            </button>   
            <button
              type="button"
              className="relative rounded-lg bg-amber-500/20 p-2 text-amber-400 hover:bg-amber-500/30 transition-colors"
              aria-label="Notifications"
            >
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm shrink-0">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-bold truncate text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
