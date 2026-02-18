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
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-72 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-3 py-3 bg-white border-b border-gray-100">
          <h1 className="font-bold">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-2 shrink-0">
          <button
              type="button"
              className="relative p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Messages"
            >
              <HiOutlineChat className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 py-0.5 px-1.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">1</span>
            </button>   
            <button
              type="button"
              className="relative rounded-lg bg-[#FCF4E0] p-2 text-[#DAA520] hover:bg-[#F9EBC8] transition-colors"
              aria-label="Notifications"
            >
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" aria-hidden />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-bold truncate">{userName}</p>
                <p className="text-xs text-[#A0A0A0]">{userRole}</p>
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
