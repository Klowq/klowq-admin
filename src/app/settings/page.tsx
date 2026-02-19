"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  HiOutlineUser,
  HiOutlineLockClosed,
  HiOutlinePaintBrush,
  HiOutlineTrash,
} from "react-icons/hi2";
import { HiOutlineCamera } from "react-icons/hi";

type TabId = "personal" | "password" | "appearance" | "delete";

const TABS: {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "personal", label: "Personal Info", icon: HiOutlineUser },
  { id: "password", label: "Change Password", icon: HiOutlineLockClosed },
  { id: "appearance", label: "Appearance", icon: HiOutlinePaintBrush },
  { id: "delete", label: "Delete Account", icon: HiOutlineTrash },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  const [personalForm, setPersonalForm] = useState({
    email: "",
    fullname: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user) {
      setPersonalForm((p) => ({
        ...p,
        email: session.user?.email ?? p.email,
        fullname: session.user?.name ?? p.fullname,
      }));
    }
  }, [session?.user?.email, session?.user?.name]);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [appearanceTheme, setAppearanceTheme] = useState<
    "light" | "dark" | "system"
  >("system");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Sync appearance state with saved theme when settings mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | "system"
        | null;
      if (saved) setAppearanceTheme(saved);
    } catch {
      // ignore
    }
  }, []);

  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // In a real app, call API to update profile
      await new Promise((r) => setTimeout(r, 600));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      // In a real app, call API to change password
      await new Promise((r) => setTimeout(r, 600));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ type: "success", text: "Password updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to change password." });
    } finally {
      setSaving(false);
    }
  };

  const handleAppearanceChange = (theme: "light" | "dark" | "system") => {
    setAppearanceTheme(theme);
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // ignore localStorage errors (e.g. private mode)
    }
    setMessage({ type: "success", text: "Appearance preference saved." });
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    setSaving(true);
    setMessage(null);
    try {
      // In a real app, call API to delete account
      await new Promise((r) => setTimeout(r, 600));
      setMessage({
        type: "error",
        text: "Account deletion is disabled in this demo.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left nav */}
          <div>
          <nav className="md:w-56 shrink-0 p-3 bg-card rounded-xl border border-border shadow-sm" aria-label="Settings">
            <ul className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0 overflow-hidden">
            
            {activeTab === "personal" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Personal Info
                </h2>
                <div className="space-y-6 mb-8">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-3xl font-semibold text-muted-foreground overflow-hidden">
                      {personalForm.fullname
                        ? personalForm.fullname.slice(0, 2).toUpperCase()
                        : "?"}
                    </div>
                  </div>
                  <form
                    onSubmit={handlePersonalSubmit}
                    className="flex-1 space-y-4 max-w-md"
                  >
                    <div>
                      <label
                        htmlFor="settings-email"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="settings-email"
                        value={personalForm.email}
                        onChange={(e) =>
                          setPersonalForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="settings-fullname"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Fullname
                      </label>
                      <input
                        type="text"
                        id="settings-fullname"
                        value={personalForm.fullname}
                        onChange={(e) =>
                          setPersonalForm((p) => ({
                            ...p,
                            fullname: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="settings-phone"
                        className="block text-sm font-medium text-foreground mb-1.5"
                      >
                        Phone number
                      </label>
                      <input
                        type="tel"
                        id="settings-phone"
                        value={personalForm.phone}
                        onChange={(e) =>
                          setPersonalForm((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Phone number"
                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition-colors"
                    >
                      {saving ? "Saving…" : "Confirm"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Change Password
                </h2>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Current password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          currentPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      New password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 transition-colors"
                  >
                    {saving ? "Saving…" : "Confirm"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Appearance
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose how the app looks on your device.
                </p>
                <div className="flex flex-wrap gap-3">
                  {(["light", "dark", "system"] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => handleAppearanceChange(theme)}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${
                        appearanceTheme === theme
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "delete" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Delete Account
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Once you delete your account, there is no going back. All your
                  data will be permanently removed.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Processing…" : "Delete Account"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
