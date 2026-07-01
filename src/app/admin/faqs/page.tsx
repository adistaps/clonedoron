"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronUp, ChevronDown, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    setLoading(true);
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    setFaqs(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      // Update
      const { error } = await supabase
        .from("faqs")
        .update({
          question: formData.question,
          answer: formData.answer,
        })
        .eq("id", editingId);

      if (error) {
        console.error("Error updating FAQ:", error);
        return;
      }
    } else {
      // Create
      const maxSort = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) : 0;
      const { error } = await supabase.from("faqs").insert({
        question: formData.question,
        answer: formData.answer,
        sort_order: maxSort + 1,
        is_active: true,
      });

      if (error) {
        console.error("Error creating FAQ:", error);
        return;
      }
    }

    setFormData({ question: "", answer: "" });
    setEditingId(null);
    setShowForm(false);
    fetchFaqs();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;

    const { error } = await supabase.from("faqs").delete().eq("id", id);

    if (error) {
      console.error("Error deleting FAQ:", error);
      return;
    }

    fetchFaqs();
  }

  async function handleToggleActive(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from("faqs")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error toggling FAQ:", error);
      return;
    }

    fetchFaqs();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const index = faqs.findIndex((f) => f.id === id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === faqs.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const currentSort = faqs[index].sort_order;
    const targetSort = faqs[targetIndex].sort_order;

    // Swap sort orders
    await Promise.all([
      supabase
        .from("faqs")
        .update({ sort_order: targetSort })
        .eq("id", faqs[index].id),
      supabase
        .from("faqs")
        .update({ sort_order: currentSort })
        .eq("id", faqs[targetIndex].id),
    ]);

    fetchFaqs();
  }

  function handleEdit(faq: FAQ) {
    setFormData({ question: faq.question, answer: faq.answer });
    setEditingId(faq.id);
    setShowForm(true);
  }

  function handleCancel() {
    setFormData({ question: "", answer: "" });
    setEditingId(null);
    setShowForm(false);
  }

  if (loading) return <div className="p-6">Loading FAQs...</div>;

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-display-m">FAQs</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-text-primary text-bg-primary px-4 py-2 rounded font-mono text-sm uppercase hover:opacity-90 transition-opacity"
            >
              <Plus size={16} /> New FAQ
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-6 mb-8">
            <h2 className="font-display text-display-s mb-4">
              {editingId ? "Edit FAQ" : "New FAQ"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-sm uppercase text-text-tertiary mb-2">
                  Question
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full border border-[rgba(0,0,0,0.1)] rounded px-3 py-2 font-sans text-body"
                  placeholder="Enter FAQ question..."
                />
              </div>

              <div>
                <label className="block font-mono text-sm uppercase text-text-tertiary mb-2">
                  Answer
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full border border-[rgba(0,0,0,0.1)] rounded px-3 py-2 font-sans text-body h-32 resize-none"
                  placeholder="Enter FAQ answer..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-[rgba(0,0,0,0.1)] rounded font-mono text-sm uppercase hover:bg-bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-text-primary text-bg-primary rounded font-mono text-sm uppercase hover:opacity-90 transition-opacity"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-4 flex items-start gap-4"
            >
              <div className="flex-1">
                <p className="font-mono text-sm text-text-tertiary mb-1">
                  Q{index + 1}.
                </p>
                <p className="font-sans font-bold text-body mb-2">{faq.question}</p>
                <p className="font-sans text-body-sm text-text-secondary">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Active Status */}
                <button
                  onClick={() => handleToggleActive(faq.id, faq.is_active)}
                  title={faq.is_active ? "Deactivate" : "Activate"}
                  className={`p-2 rounded transition-colors ${
                    faq.is_active
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  {faq.is_active ? (
                    <Check size={16} />
                  ) : (
                    <X size={16} />
                  )}
                </button>

                {/* Order Controls */}
                {index > 0 && (
                  <button
                    onClick={() => handleReorder(faq.id, "up")}
                    title="Move up"
                    className="p-2 rounded hover:bg-bg-secondary transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                )}

                {index < faqs.length - 1 && (
                  <button
                    onClick={() => handleReorder(faq.id, "down")}
                    title="Move down"
                    className="p-2 rounded hover:bg-bg-secondary transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                )}

                {/* Edit */}
                <button
                  onClick={() => handleEdit(faq)}
                  title="Edit"
                  className="p-2 rounded hover:bg-bg-secondary transition-colors"
                >
                  <Edit2 size={16} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(faq.id)}
                  title="Delete"
                  className="p-2 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {faqs.length === 0 && (
            <div className="text-center py-12 text-text-tertiary">
              <p className="font-mono text-sm uppercase">No FAQs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
