'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import type { Preference } from '@/types/preference';

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create preference');
      }

      setNewName('');
      setShowAddForm(false);
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
        headers: {
          'Content-Type': 'application/json',
        },
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
    if (!confirm('Are you sure you want to delete this preference?')) {
      return;
    }

    try {
      const response = await fetch(`/api/preferences/${id}`, {
        method: 'DELETE',
      });

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
        <div className="container">
          <div className="header">
            <h1>Preferences Management</h1>
          </div>
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container">
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Preferences Management</h1>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Preference'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ffe6e6',
            color: '#e00',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {showAddForm && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Add New Preference</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label htmlFor="newName">Preference Name</label>
                <input
                  type="text"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="Enter preference name"
                  disabled={saving}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving || !newName.trim()}>
                  {saving ? 'Adding...' : 'Add Preference'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewName('');
                  }}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>All Preferences ({preferences.length})</h2>
          {preferences.length === 0 ? (
            <div className="empty-state">
              <p>No preferences found. Add your first preference!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '0.75rem',
            }}>
              {preferences.map((pref) => (
                <div
                  key={pref.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  {editingId === pref.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <input
                        type="text"
                        id={`edit-pref-${pref.id}`}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Preference name"
                        title="Edit preference name"
                        aria-label="Edit preference name"
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '1rem',
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdate(pref.id)}
                        className="btn btn-primary"
                        disabled={saving || !editName.trim()}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn btn-secondary"
                        disabled={saving}
                        style={{ padding: '0.5rem 1rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: '1rem', fontWeight: '500' }}>{pref.name}</span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(pref)}
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pref.id)}
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

