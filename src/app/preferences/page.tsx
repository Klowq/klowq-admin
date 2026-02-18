'use client';

import { useEffect, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import AppModal from '@/components/organisms/AppModal';
import type { Preference } from '@/types/preference';
import { HiOutlineSearch } from 'react-icons/hi';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';

const PAGE_SIZE = 10;

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/preferences');
      if (!response.ok) throw new Error('Failed to fetch preferences');
      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredPreferences = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return preferences;
    return preferences.filter((pref) => pref.name.toLowerCase().includes(q));
  }, [preferences, search]);

  const totalPages = Math.max(1, Math.ceil(filteredPreferences.length / PAGE_SIZE));
  const paginatedPreferences = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPreferences.slice(start, start + PAGE_SIZE);
  }, [filteredPreferences, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create preference');
      }

      setNewName('');
      setShowAddModal(false);
      await fetchPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create preference');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (pref: Preference) => {
    setEditingId(pref.id);
    setEditName(pref.name);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/preferences/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update preference');
      }

      setEditingId(null);
      setEditName('');
      await fetchPreferences();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preference');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this preference?')) return;

    try {
      const response = await fetch(`/api/preferences/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete preference');
      await fetchPreferences();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete preference');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preferences Management</h1>
          <p className="text-gray-500">Loading…</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Preferences Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage categories and tags for your content.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3C3C6F] text-white font-medium hover:bg-[#2d2d52] focus:outline-none focus:ring-2 focus:ring-[#3C3C6F]/40 transition-colors"
          >
            <HiOutlinePlus className="w-5 h-5" />
            Add Preference
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-xs">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search preferences…"
                aria-label="Search preferences"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C3C6F]/20 focus:border-[#3C3C6F] text-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {preferences.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="font-medium">No preferences yet</p>
                <p className="text-sm mt-1">Add your first preference using the button above.</p>
              </div>
            ) : filteredPreferences.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>No preferences match your search.</p>
              </div>
            ) : (
              paginatedPreferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  {editingId === pref.id ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="text"
                        id={`edit-pref-${pref.id}`}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Preference name"
                        title="Edit preference name"
                        aria-label="Edit preference name"
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3C3C6F]/20 focus:border-[#3C3C6F] text-sm"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdate(pref.id)}
                        disabled={saving || !editName.trim()}
                        className="px-3 py-2 rounded-lg bg-[#3C3C6F] text-white text-sm font-medium hover:bg-[#2d2d52] disabled:opacity-50 shrink-0"
                      >
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={saving}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900 truncate">{pref.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEdit(pref)}
                          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(pref.id)}
                          className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredPreferences.length)} of {filteredPreferences.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AppModal
        mode={showAddModal}
        onClose={() => {
          if (!saving) {
            setShowAddModal(false);
            setNewName('');
          }
        }}
      >
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Add New Preference</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create a new category or tag.</p>
          </div>
          <form onSubmit={handleAdd} className="p-6">
            <label htmlFor="newPreferenceName" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="newPreferenceName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              placeholder="Enter preference name"
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3C3C6F]/20 focus:border-[#3C3C6F] disabled:opacity-60"
            />
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving || !newName.trim()}
                className="px-4 py-2.5 rounded-lg bg-[#3C3C6F] text-white font-medium hover:bg-[#2d2d52] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Adding…' : 'Add Preference'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setNewName('');
                }}
                disabled={saving}
                className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </AppModal>
    </DashboardLayout>
  );
}
