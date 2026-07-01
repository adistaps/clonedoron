'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

type HomepageSection = {
  id: string;
  key: string;
  label?: string;
  heading?: string;
  subheading?: string;
  cta_text?: string;
  cta_link?: string;
  is_visible: boolean;
  sort_order: number;
  content: any;
};

type Product = {
  id: string;
  name: string;
};

type Bundle = {
  id: string;
  name: string;
};

type SectionItem = {
  id: string;
  section_id: string;
  item_type: 'product' | 'bundle';
  item_id: string;
  sort_order: number;
};

export default function HomepageCMSPage() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [sectionItems, setSectionItems] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state for section content / forms
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HomepageSection>>({});
  const [selectedItems, setSelectedItems] = useState<{ id: string; type: 'product' | 'bundle' }[]>([]);

  const loadData = async () => {
    setLoading(true);
    
    const [secRes, prodRes, bundRes, itemsRes] = await Promise.all([
      supabase.from('homepage_sections').select('*').order('sort_order', { ascending: true }),
      supabase.from('products').select('id, name'),
      supabase.from('bundles').select('id, name'),
      supabase.from('section_items').select('*').order('sort_order', { ascending: true })
    ]);

    if (secRes.data) setSections(secRes.data as HomepageSection[]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    if (bundRes.data) setBundles(bundRes.data as Bundle[]);
    if (itemsRes.data) setSectionItems(itemsRes.data as SectionItem[]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenSection = (section: HomepageSection) => {
    setActiveSectionId(section.id);
    setFormData(section);
    
    // Filter items belonging to this section
    const currentItems = sectionItems
      .filter(item => item.section_id === section.id)
      .map(item => ({ id: item.item_id, type: item.item_type }));
    
    setSelectedItems(currentItems);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionId) return;

    setSavingId(activeSectionId);
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Update text content
    const { error: textErr } = await supabase
      .from('homepage_sections')
      .update({
        label: formData.label,
        heading: formData.heading,
        subheading: formData.subheading,
        cta_text: formData.cta_text,
        cta_link: formData.cta_link,
        is_visible: formData.is_visible,
        content: formData.content,
      })
      .eq('id', activeSectionId);

    if (textErr) {
      setErrorMsg(textErr.message);
      setSavingId(null);
      return;
    }

    // 2. Update linked items (delete old, insert new)
    const { error: delErr } = await supabase
      .from('section_items')
      .delete()
      .eq('section_id', activeSectionId);

    if (delErr) {
      setErrorMsg(delErr.message);
      setSavingId(null);
      return;
    }

    if (selectedItems.length > 0) {
      const inserts = selectedItems.map((item, index) => ({
        section_id: activeSectionId,
        item_type: item.type,
        item_id: item.id,
        sort_order: index
      }));

      const { error: insErr } = await supabase
        .from('section_items')
        .insert(inserts);

      if (insErr) {
        setErrorMsg(insErr.message);
        setSavingId(null);
        return;
      }
    }

    setSuccessMsg('Section updated successfully!');
    setSavingId(null);
    loadData();
  };

  const handleAddItemLink = (itemId: string, type: 'product' | 'bundle') => {
    if (!itemId) return;
    if (selectedItems.some(i => i.id === itemId)) return;
    setSelectedItems([...selectedItems, { id: itemId, type }]);
  };

  const handleRemoveItemLink = (itemId: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== itemId));
  };

  const getItemName = (id: string, type: 'product' | 'bundle') => {
    if (type === 'product') {
      return products.find(p => p.id === id)?.name || 'Unknown Product';
    }
    return bundles.find(b => b.id === id)?.name || 'Unknown Bundle';
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
            Homepage CMS
          </h1>
          <p className="text-[#555555] text-sm mt-1">Manage text content, visibility, and product placement for all homepage sections.</p>
        </div>
        {successMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
            <i className="fa-solid fa-check mr-1.5"></i>
            {successMsg}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#888888] text-xs">
          <i className="fa-solid fa-spinner fa-spin mr-1.5 text-base text-[#7C6CFF]"></i>
          Loading sections list...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Section Selector Grid */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#555555]">Select Section to Edit</h2>
            <div className="space-y-3">
              {sections.map(sec => {
                const isActive = activeSectionId === sec.id;
                const itemCount = sectionItems.filter(i => i.section_id === sec.id).length;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleOpenSection(sec)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? 'bg-white border-[#7C6CFF] shadow-md'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-white hover:border-[#7C6CFF]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                        {sec.label || `[${sec.key}]`}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        sec.is_visible
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {sec.is_visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-[#111111]">{sec.heading || 'No Heading'}</div>
                    <div className="text-[11px] text-[#555555] mt-1 line-clamp-1">{sec.subheading || 'No Subheading'}</div>
                    {['crowd_favorites', 'popular_bundles'].includes(sec.key) && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#7C6CFF] font-semibold">
                        <i className="fa-solid fa-link"></i>
                        {itemCount} Featured {sec.key === 'crowd_favorites' ? 'Products' : 'Bundles'}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Editing details Form */}
          <div className="lg:col-span-7">
            {activeSectionId ? (
              <div className="bg-white border border-[#E2E8F0] p-7 rounded-3xl shadow-sm">
                <h2 className="text-sm font-bold text-[#111111] mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-[#7C6CFF]"></i>
                  Edit Section Settings: {formData.key}
                </h2>

                {errorMsg && (
                  <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSaveSection} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                        Label / Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.label || ''}
                        onChange={e => setFormData({ ...formData, label: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                        Visibility
                      </label>
                      <select
                        value={formData.is_visible ? 'true' : 'false'}
                        onChange={e => setFormData({ ...formData, is_visible: e.target.value === 'true' })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                      >
                        <option value="true">Visible</option>
                        <option value="false">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={formData.heading || ''}
                      onChange={e => setFormData({ ...formData, heading: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                      Section Subheading
                    </label>
                    <textarea
                      value={formData.subheading || ''}
                      onChange={e => setFormData({ ...formData, subheading: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                      rows={2}
                    />
                  </div>

                  {formData.key !== 'shop_by_type' && formData.key !== 'mission' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                          CTA Action Text
                        </label>
                        <input
                          type="text"
                          value={formData.cta_text || ''}
                          onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-1.5">
                          CTA Action Link
                        </label>
                        <input
                          type="text"
                          value={formData.cta_link || ''}
                          onChange={e => setFormData({ ...formData, cta_link: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Section Content Linkages: Products or Bundles Selection */}
                  {formData.key === 'crowd_favorites' && (
                    <div className="border-t border-[#E2E8F0] pt-5">
                      <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-3">
                        Featured Products Placement
                      </label>
                      <div className="flex gap-2 mb-4">
                        <select
                          id="addProductSelect"
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                          defaultValue=""
                          onChange={e => {
                            handleAddItemLink(e.target.value, 'product');
                            e.target.value = '';
                          }}
                        >
                          <option value="" disabled>Select Product to Add...</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0]">
                        {selectedItems.length === 0 ? (
                          <div className="text-center py-4 text-[#888888] text-xs font-semibold">
                            No products linked to section
                          </div>
                        ) : (
                          selectedItems.map((item, idx) => (
                            <div key={item.id} className="flex justify-between items-center bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-xl text-xs">
                              <span className="font-semibold text-slate-800">
                                {idx + 1}. {getItemName(item.id, 'product')}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemLink(item.id)}
                                className="text-rose-600 hover:text-rose-700 font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {formData.key === 'popular_bundles' && (
                    <div className="border-t border-[#E2E8F0] pt-5">
                      <label className="block text-[11px] font-bold text-[#555555] uppercase tracking-wider mb-3">
                        Curated Bundles Placement
                      </label>
                      <div className="flex gap-2 mb-4">
                        <select
                          id="addBundleSelect"
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7C6CFF] text-[#111111] text-xs focus:outline-none"
                          defaultValue=""
                          onChange={e => {
                            handleAddItemLink(e.target.value, 'bundle');
                            e.target.value = '';
                          }}
                        >
                          <option value="" disabled>Select Bundle to Add...</option>
                          {bundles.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-50 p-3.5 rounded-xl border border-[#E2E8F0]">
                        {selectedItems.length === 0 ? (
                          <div className="text-center py-4 text-[#888888] text-xs font-semibold">
                            No bundles linked to section
                          </div>
                        ) : (
                          selectedItems.map((item, idx) => (
                            <div key={item.id} className="flex justify-between items-center bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-xl text-xs">
                              <span className="font-semibold text-slate-800">
                                {idx + 1}. {getItemName(item.id, 'bundle')}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveItemLink(item.id)}
                                className="text-rose-600 hover:text-rose-700 font-semibold"
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={savingId !== null}
                      className="w-full bg-[#7C6CFF] hover:bg-[#6B5BEE] text-white py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-xs"
                    >
                      {savingId ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-cloud-arrow-up"></i>
                          Save Section Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full min-h-[300px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl border-dashed flex flex-col justify-center items-center text-center p-8">
                <i className="fa-solid fa-square-pen text-[#7C6CFF] text-3xl mb-3"></i>
                <div className="text-[#111111] font-bold text-sm">No Section Selected</div>
                <div className="text-[#888888] text-xs mt-1 max-w-[280px]">
                  Click on any homepage section on the left to start editing its settings.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
