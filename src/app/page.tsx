'use client';

import { useState, useEffect, useCallback } from 'react';
import { Phone } from '@/types/phone';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface FormState {
  name: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
}

export default function HomePage() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>({ name: '', phone: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<FormState>({ name: '', phone: '' });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const fetchPhones = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/phones');
      const data = await res.json();
      if (data.success) setPhones(data.data);
      else addToast('error', data.message || 'Gagal memuat data');
    } catch {
      addToast('error', 'Koneksi ke server gagal');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchPhones();
  }, [fetchPhones]);

  // Validation
  const validate = (values: FormState): FormErrors => {
    const errors: FormErrors = {};
    if (!values.name.trim()) errors.name = 'Nama wajib diisi';
    if (!values.phone.trim()) errors.phone = 'Nomor telepon wajib diisi';
    else if (!/^[\d\s\+\-\(\)]{6,20}$/.test(values.phone.trim()))
      errors.phone = 'Format nomor tidak valid';
    return errors;
  };

  // CREATE
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/phones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setPhones(prev => [data.data, ...prev]);
        setForm({ name: '', phone: '' });
        setShowForm(false);
        addToast('success', 'Kontak berhasil ditambahkan');
      } else {
        addToast('error', data.message || 'Gagal menambahkan data');
      }
    } catch {
      addToast('error', 'Gagal terhubung ke server');
    } finally {
      setSubmitting(false);
    }
  };

  // START EDIT
  const startEdit = (phone: Phone) => {
    setEditingId(phone.id);
    setEditForm({ name: phone.name, phone: phone.phone });
    setConfirmDeleteId(null);
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', phone: '' });
  };

  // UPDATE
  const handleUpdate = async (id: number) => {
    const errors = validate(editForm);
    if (Object.keys(errors).length > 0) {
      addToast('error', Object.values(errors)[0] || 'Validasi gagal');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/phones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setPhones(prev => prev.map(p => (p.id === id ? data.data : p)));
        cancelEdit();
        addToast('success', 'Kontak berhasil diperbarui');
      } else {
        addToast('error', data.message || 'Gagal memperbarui data');
      }
    } catch {
      addToast('error', 'Gagal terhubung ke server');
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/phones/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPhones(prev => prev.filter(p => p.id !== id));
        setConfirmDeleteId(null);
        addToast('success', 'Kontak berhasil dihapus');
      } else {
        addToast('error', data.message || 'Gagal menghapus data');
      }
    } catch {
      addToast('error', 'Gagal terhubung ke server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-brand">
          <div className="header-icon">📞</div>
          <span className="header-title">Phone<span>Book</span></span>
        </div>
        <span className="header-meta">Next.js · MySQL</span>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* Section Header */}
        <div className="section-header">
          <div>
            <h1 className="section-title">Daftar Kontak</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span className="section-count">
              Total: <span className="count-num">{phones.length}</span>
            </span>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(v => !v);
                setFormErrors({});
                setForm({ name: '', phone: '' });
              }}
            >
              {showForm ? '✕ Batal' : '+ Tambah'}
            </button>
          </div>
        </div>

        {/* CREATE FORM */}
        {showForm && (
          <div className="form-card">
            <div className="form-card-header">
              <span className="form-card-label">// Tambah Kontak Baru</span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-body">
                <div className="form-group">
                  <label className="form-label">Nama</label>
                  <input
                    className={`form-input ${formErrors.name ? 'error' : ''}`}
                    placeholder="Masukkan nama"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {formErrors.name && (
                    <span className="form-error">{formErrors.name}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    placeholder="+62 812 3456 7890"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                  {formErrors.phone && (
                    <span className="form-error">{formErrors.phone}</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? '...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TABLE */}
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            Memuat data...
          </div>
        ) : phones.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">Belum ada kontak</p>
            <p className="empty-sub">Klik "+ Tambah" untuk menambahkan kontak baru</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Nama</th>
                  <th>Nomor Telepon</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {phones.map(phone => (
                  <>
                    <tr
                      key={phone.id}
                      className={editingId === phone.id ? 'editing' : ''}
                    >
                      <td>{phone.id}</td>
                      <td>
                        {editingId === phone.id ? (
                          <input
                            className="table-input"
                            value={editForm.name}
                            onChange={e =>
                              setEditForm(f => ({ ...f, name: e.target.value }))
                            }
                            autoFocus
                          />
                        ) : (
                          <span className="cell-name">{phone.name}</span>
                        )}
                      </td>
                      <td>
                        {editingId === phone.id ? (
                          <input
                            className="table-input"
                            value={editForm.phone}
                            onChange={e =>
                              setEditForm(f => ({ ...f, phone: e.target.value }))
                            }
                          />
                        ) : (
                          <span className="cell-phone">{phone.phone}</span>
                        )}
                      </td>
                      <td>
                        <div className="cell-actions">
                          {editingId === phone.id ? (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleUpdate(phone.id)}
                                disabled={submitting}
                              >
                                ✓ Simpan
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={cancelEdit}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => startEdit(phone)}
                                disabled={submitting}
                              >
                                ✎ Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => {
                                  setConfirmDeleteId(
                                    confirmDeleteId === phone.id ? null : phone.id
                                  );
                                  cancelEdit();
                                }}
                                disabled={submitting}
                              >
                                ✕ Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Confirm delete row */}
                    {confirmDeleteId === phone.id && (
                      <tr key={`confirm-${phone.id}`} className="confirm-row">
                        <td colSpan={4}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span className="confirm-text">
                              ⚠ Hapus &quot;{phone.name}&quot;? Aksi ini tidak dapat dibatalkan.
                            </span>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(phone.id)}
                                disabled={submitting}
                              >
                                {submitting ? '...' : 'Ya, Hapus'}
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setConfirmDeleteId(null)}
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span>© 2024 PhoneBook App</span>
        <div className="footer-stack">
          <span className="stack-badge">Next.js 14</span>
          <span className="stack-badge">MySQL</span>
          <span className="stack-badge">TypeScript</span>
        </div>
      </footer>

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✓' : '✕'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
