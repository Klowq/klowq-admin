'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineLogout,
} from 'react-icons/hi';
import Image from 'next/image';
import logo from '@assets/images/logo.png';

type SubItem = { label: string; href: string };

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: SubItem[];
  href?: string;
};

const menuList: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: HiOutlineHome,
    href: '/',
  },
  {
    label: 'Manage Blogs',
    icon: HiOutlineFolder,
    children: [
      { label: 'Blogs', href: '/blogs' },
      { label: 'Create Blog', href: '/blogs/new' },
    ],
  },
  {
    label: 'Manage Preferences',
    icon: HiOutlineCog,
    href: '/preferences',
  },
  {
    label: 'Manage Doctors',
    icon: HiOutlineDocumentText,
    children: [
      { label: 'Doctors', href: '/doctors' },
      { label: 'Pending Approval', href: '/doctors/pending' },
    ],
  },
  {
    label: 'Account Settings',
    icon: HiOutlineCog,
    href: '/settings',
  }
];


export function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  const isActive = (href: string) => pathname === href;
  const hasActiveChild = (children?: SubItem[]) =>
    children?.some((sub) => pathname === sub.href) ?? false;

  return (
    <div className="flex w-72 fixed flex-col left-0 top-0 h-screen overflow-y-auto bg-card px-2 py-6 border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-5 px-1">
          <Image src={logo} alt="Logo" width={25} height={25} />
          <span className="text-2xl font-bold text-primary">Klowq</span>
        </div>

      {/* Nav */}
      <nav className="flex-1" role="navigation" aria-label="Main">
        <ul className="list-none p-0 m-0 space-y-0.5">
          {menuList.map((item) => {
            const Icon = item.icon;
            if (item.href) {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-2 py-3 rounded-lg text-[0.9375rem] font-medium transition-colors ${
                      active ? 'bg-primary/15 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className={`shrink-0 w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            }
            const activeChild = hasActiveChild(item.children);
            const isOpen = activeChild || (expanded[item.label] ?? false);
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setExpanded((p) => ({ ...p, [item.label]: !isOpen }))}
                  className={`flex w-full items-center justify-between gap-3 px-2 py-3 rounded-lg text-[0.9375rem] font-medium transition-colors text-left ${
                    activeChild ? 'text-primary bg-primary/10' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`shrink-0 w-5 h-5 ${activeChild ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{item.label}</span>
                  </span>
                  <HiOutlineChevronDown
                    className={`shrink-0 w-4 h-4 text-muted-foreground transition-transform ${isOpen ? '' : '-rotate-95'}`}
                  />
                </button>
                {isOpen && item.children && (
                  <ul className="list-none pl-6 pr-4 py-1 space-y-0.5">
                    {item.children.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          className={`block py-2 text-sm transition-colors ${
                            isActive(sub.href) ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-3 mt-auto">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg border-none bg-transparent text-foreground text-[0.9375rem] font-medium cursor-pointer hover:bg-muted transition-colors text-left"
        >
          <HiOutlineLogout className="text-muted-foreground shrink-0 w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
