'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { RichTextEditor } from '@/components/rich-text-editor';
import { Preference } from '@/types/preference';
import { HiOutlinePhotograph, HiOutlineSearch, HiOutlineTag } from 'react-icons/hi';

export default function NewBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    bannerImage: '',
    featured: false,
    featuredDoctorId: '',
    selectedPreferences: [] as string[],
  });
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [preferenceSearch, setPreferenceSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredPreferences = preferenceSearch.trim()
    ? preferences.filter((pref) =>
        pref.name.toLowerCase().includes(preferenceSearch.trim().toLowerCase())
      )
    : preferences;

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (err) {
      console.error('Failed to fetch preferences:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const selectedPreferenceNames = formData.selectedPreferences
        .map((id) => preferences.find((p) => p.id === id)?.name)
        .filter((name): name is string => name !== undefined);

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          bannerImage: formData.bannerImage || undefined,
          featured: formData.featured,
          featuredDoctorId: formData.featuredDoctorId || undefined,
          preferences: selectedPreferenceNames.length > 0 ? selectedPreferenceNames : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create blog');
      }
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handlePreferenceToggle = (preferenceId: string) => {
    setFormData({
      ...formData,
      selectedPreferences: formData.selectedPreferences.includes(preferenceId)
        ? formData.selectedPreferences.filter((id) => id !== preferenceId)
        : [...formData.selectedPreferences, preferenceId],
    });
  };

  const handleBannerImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (e.g. JPEG, PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, bannerImage: reader.result as string }));
      setError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearBannerImage = () => {
    setFormData((prev) => ({ ...prev, bannerImage: '' }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create New Blog Post</h1>
          <p className="text-muted-foreground mt-1">Add a new article with title, content, and optional banner image.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Basic details</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Title, author, and featured image.</p>
            </div>
            <div className="p-6 space-y-5">

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <span className="inline-flex items-center gap-1.5">
                    <HiOutlinePhotograph className="w-4 h-4 text-muted-foreground" />
                    Banner Image
                  </span>
                </label>
                <input
                  type="file"
                  id="bannerImage"
                  name="bannerImage"
                  accept="image/*"
                  onChange={handleBannerImagePick}
                  className="sr-only"
                  aria-label="Choose banner image"
                />
                {formData.bannerImage ? (
                  <div className="space-y-2">
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img
                        src={formData.bannerImage}
                        alt="Banner preview"
                        className="w-full h-72 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="bannerImage"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground bg-background hover:bg-muted cursor-pointer transition-colors"
                      >
                        <HiOutlinePhotograph className="w-4 h-4" />
                        Change image
                      </label>
                      <button
                        type="button"
                        onClick={clearBannerImage}
                        className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="bannerImage"
                    className="flex flex-col items-center justify-center w-full h-72 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 hover:border-muted-foreground/30 cursor-pointer transition-colors"
                  >
                    <HiOutlinePhotograph className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium text-muted-foreground">Click to choose an image</span>
                    <span className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WebP, etc.</span>
                  </label>
                )}
              </div>


              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter blog title"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <div className="px-6 pb-6 space-y-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-foreground">Featured blog</span>
              </label>

              {formData.featured && (
                <div>
                  <label htmlFor="featuredDoctorId" className="block text-sm font-medium text-foreground mb-1.5">
                    Featured Doctor ID
                  </label>
                  <input
                    type="text"
                    id="featuredDoctorId"
                    name="featuredDoctorId"
                    value={formData.featuredDoctorId}
                    onChange={handleChange}
                    placeholder="Enter doctor ID"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <HiOutlineTag className="w-4 h-4 text-muted-foreground" />
                    Preferences (categories)
                  </span>
                </label>
                {preferences.length > 0 && (
                  <div className="relative mb-2">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
                    <input
                      type="search"
                      value={preferenceSearch}
                      onChange={(e) => setPreferenceSearch(e.target.value)}
                      placeholder="Search preferences…"
                      aria-label="Search preferences"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                )}
                <div className="border border-border rounded-lg p-3 bg-muted/30 max-h-48 overflow-y-auto">
                  {preferences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Loading preferences…</p>
                  ) : filteredPreferences.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No preferences match your search.</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {filteredPreferences.map((pref) => (
                        <label
                          key={pref.id}
                          className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.selectedPreferences.includes(pref.id)}
                            onChange={() => handlePreferenceToggle(pref.id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                          />
                          <span className="text-sm text-foreground">{pref.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {formData.selectedPreferences.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {formData.selectedPreferences.length} preference(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-semibold text-foreground">Content</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Use the toolbar for bold, lists, and more.</p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">Body</label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                placeholder="Write your blog content here..."
                className="min-h-[320px]"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/20 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating…' : 'Create Blog'}
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
