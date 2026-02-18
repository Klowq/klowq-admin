'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Preference } from '@/types/preference';

export default function NewBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    bannerImage: '',
    featured: false,
    featuredDoctorId: '',
    selectedPreferences: [] as string[],
  });
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Get preference names from selected IDs
      const selectedPreferenceNames = formData.selectedPreferences
        .map(id => preferences.find(p => p.id === id)?.name)
        .filter((name): name is string => name !== undefined);

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          author: formData.author,
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
        ? formData.selectedPreferences.filter(id => id !== preferenceId)
        : [...formData.selectedPreferences, preferenceId],
    });
  };

  return (
    <DashboardLayout>
      <div className="container">
        <div className="header">
          <h1>Create New Blog Post</h1>
        </div>

        <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter blog title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bannerImage">Banner Image URL</label>
            <input
              type="url"
              id="bannerImage"
              name="bannerImage"
              value={formData.bannerImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.bannerImage && (
              <img 
                src={formData.bannerImage} 
                alt="Banner preview" 
                style={{ 
                  marginTop: '0.5rem', 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  borderRadius: '6px',
                  objectFit: 'cover'
                }} 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="Write your blog content here..."
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured Blog
            </label>
          </div>

          {formData.featured && (
            <div className="form-group">
              <label htmlFor="featuredDoctorId">Featured Doctor ID</label>
              <input
                type="text"
                id="featuredDoctorId"
                name="featuredDoctorId"
                value={formData.featuredDoctorId}
                onChange={handleChange}
                placeholder="Enter doctor ID"
              />
            </div>
          )}

          <div className="form-group">
            <label>Preferences</label>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '0.75rem',
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: '#fff'
            }}>
              {preferences.length === 0 ? (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Loading preferences...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {preferences.map((pref) => (
                    <label
                      key={pref.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedPreferences.includes(pref.id)}
                        onChange={() => handlePreferenceToggle(pref.id)}
                      />
                      <span>{pref.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {formData.selectedPreferences.length > 0 && (
              <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                {formData.selectedPreferences.length} preference(s) selected
              </small>
            )}
          </div>

          {error && (
            <div style={{ color: '#e00', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
            <Link href="/" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

