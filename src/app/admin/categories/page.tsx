'use client';

import { supabase } from '@/lib/supabase';
import type { DbCategory } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formParentId, setFormParentId] = useState<string>('');
  const [formSort, setFormSort] = useState(0);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) setCategories(data as DbCategory[]);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const openAdd = () => {
    setEditingId(null);
    setFormName('');
    setFormSlug('');
    setFormParentId('');
    setFormSort(0);
    setErrorMsg('');
    setSuccessMsg('');
    setShowForm(true);
  };

  const openEdit = (cat: DbCategory) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormParentId(cat.parent_id || '');
    setFormSort(cat.sort_order || 0);
    setErrorMsg('');
    setSuccessMsg('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const payload = {
      name: formName,
      slug: formSlug || autoSlug(formName),
      parent_id: formParentId || null,
      sort_order: formSort,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('categories').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('categories').insert(payload));
    }

    setSaving(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setSuccessMsg(editingId ? 'Category updated!' : 'Category created!');
    setShowForm(false);
    loadCategories();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabase.from('categories').delete().eq('id', deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    loadCategories();
  };

  // Build hierarchy tree for display
  const parents = categories.filter((c) => !c.parent_id);
  const getChildren = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Categories</h1>
          <p className="text-[#555555] text-sm mt-1">
            Manage product categories and sub-categories.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#7C6CFF] hover:bg-[#6B5BEE] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm"
        >
          <i className="fa-solid fa-plus" />
          Add Category
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
          <i className="fa-solid fa-check mr-1.5" />{successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
            <i className="fa-solid fa-triangle-exclamation text-rose-500 text-3xl mb-3" />
            <h3 className="text-lg font-bold text-[#111111] mb-2">Delete Category?</h3>
            <p className="text-sm text-[#555555] mb-6">
              This will also remove all sub-categories. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#555555] hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <h3 className="text-lg font-bold text-[#111111] mb-6">
              {editingId ? 'Edit Category' : 'New Category'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (!editingId) setFormSlug(autoSlug(e.target.value));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none"
                  placeholder="e.g. Textures"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none font-mono"
                  placeholder="e.g. textures"
                />
                <p className="text-[10px] text-[#888] mt-1">
                  Used in URLs: /category/<strong>{formSlug || '...'}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Parent Category
                </label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none"
                >
                  <option value="">— None (Top-Level) —</option>
                  {parents
                    .filter((p) => p.id !== editingId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  min={0}
                  value={formSort}
                  onChange={(e) => setFormSort(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-sm focus:outline-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600">{errorMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-sm font-semibold text-[#555555] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#7C6CFF] text-white text-sm font-bold hover:bg-[#6B5BEE] disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div className="text-center py-12 text-[#888] text-xs">
          <i className="fa-solid fa-spinner fa-spin text-[#7C6CFF] mr-2" />
          Loading categories...
        </div>
      ) : parents.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-[#E2E8F0] rounded-2xl">
          <i className="fa-solid fa-sitemap text-[#7C6CFF] text-3xl mb-3" />
          <p className="text-[#111111] font-bold">No categories yet</p>
          <p className="text-[#888] text-xs mt-1">
            Apply the DB migration in Supabase first, then click "Add Category".
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {parents.map((parent) => {
            const children = getChildren(parent.id);
            return (
              <div
                key={parent.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
              >
                {/* Parent row */}
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-folder text-[#7C6CFF]" />
                    <div>
                      <span className="font-bold text-[#111111] text-sm">{parent.name}</span>
                      <span className="ml-2 font-mono text-[10px] text-[#888]">/{parent.slug}</span>
                    </div>
                    {children.length > 0 && (
                      <span className="text-[10px] bg-[#7C6CFF]/10 text-[#7C6CFF] font-bold px-2 py-0.5 rounded-full">
                        {children.length} sub
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(parent)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] text-[#555] hover:bg-slate-50"
                    >
                      <i className="fa-solid fa-pen-to-square mr-1" />Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(parent.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                    >
                      <i className="fa-solid fa-trash mr-1" />Delete
                    </button>
                  </div>
                </div>

                {/* Children */}
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between px-6 py-3 border-t border-[#F1F5F9] bg-[#FAFBFC]"
                  >
                    <div className="flex items-center gap-3 pl-6">
                      <i className="fa-solid fa-folder-open text-[#A0AABB] text-sm" />
                      <div>
                        <span className="font-semibold text-[#333] text-sm">{child.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-[#AAA]">/{child.slug}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(child)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E2E8F0] text-[#555] hover:bg-slate-50"
                      >
                        <i className="fa-solid fa-pen-to-square mr-1" />Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(child.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                      >
                        <i className="fa-solid fa-trash mr-1" />Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
