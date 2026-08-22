"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  badge: string;
  title: string;
  message: string | null;
  linkUrl: string | null;
  linkText: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

type FormState = { badge: string; title: string; message: string; linkUrl: string; linkText: string; enabled: boolean };

const EMPTY_FORM: FormState = { badge: "UPDATE", title: "", message: "", linkUrl: "", linkText: "", enabled: true };

export default function AnnouncementsAdminClient({ initialAnnouncements }: { initialAnnouncements: Announcement[] }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only the most recently created *enabled* row is actually shown on the
  // homepage — surfaced here so admins can tell "enabled" apart from "live".
  const liveId = announcements.find((a) => a.enabled)?.id ?? null;

  function startNew() {
    setForm(EMPTY_FORM);
    setError(null);
    setEditingId("new");
  }

  function startEdit(a: Announcement) {
    setForm({ badge: a.badge, title: a.title, message: a.message ?? "", linkUrl: a.linkUrl ?? "", linkText: a.linkText ?? "", enabled: a.enabled });
    setError(null);
    setEditingId(a.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function save() {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/admin/announcements" : `/api/admin/announcements/${editingId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          badge: form.badge || "UPDATE",
          title: form.title,
          message: form.message || null,
          linkUrl: form.linkUrl || null,
          linkText: form.linkText || null,
          enabled: form.enabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (isNew) {
        setAnnouncements((prev) => [data.announcement, ...prev]);
      } else {
        setAnnouncements((prev) => prev.map((a) => (a.id === data.announcement.id ? data.announcement : a)));
      }
      setEditingId(null);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(a: Announcement) {
    const res = await fetch(`/api/admin/announcements/${a.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !a.enabled }),
    });
    if (res.ok) {
      const data = await res.json();
      setAnnouncements((prev) => prev.map((x) => (x.id === a.id ? data.announcement : x)));
    }
  }

  async function remove(a: Announcement) {
    if (!confirm(`Delete "${a.title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/announcements/${a.id}`, { method: "DELETE" });
    if (res.ok) setAnnouncements((prev) => prev.filter((x) => x.id !== a.id));
  }

  const isEditing = editingId !== null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Admin
      </Link>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500 text-sm mt-1">{announcements.length} notice{announcements.length === 1 ? "" : "s"}</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New announcement
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-8">
        Shown as a dismissible banner on the homepage — e.g. &quot;Invoice Generator just got a major upgrade&quot;.
        Only the single most recent <strong>enabled</strong> notice is ever displayed; older ones can stay here,
        disabled, as a simple history.
      </p>

      {isEditing ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Badge</label>
            <input
              value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
              placeholder="UPDATE, NEW, UPGRADE..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Title</label>
            <input
              value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Invoice Generator just got a major upgrade"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Message (optional)</label>
            <textarea
              value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              rows={2} placeholder="Live templates, instant PDF export, and more."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Link URL (optional)</label>
              <input
                value={form.linkUrl} onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                placeholder="/tools/invoice-generator"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Link text (optional)</label>
              <input
                value={form.linkText} onChange={(e) => setForm((f) => ({ ...f, linkText: e.target.value }))}
                placeholder="Try it now"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} />
            Enabled
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={save} disabled={saving}
              className="bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-violet-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancelEdit} className="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No announcements yet — create one to get started.</p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
          {announcements.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-violet-50 text-violet-700">{a.badge}</span>
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{a.title}</h3>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                    a.enabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {a.enabled ? "Enabled" : "Disabled"}
                  </span>
                  {a.id === liveId && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-amber-50 text-amber-700">Live on homepage</span>
                  )}
                </div>
                {a.message && <p className="text-xs text-gray-400 mt-0.5 truncate">{a.message}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleEnabled(a)}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
                    a.enabled ? "text-gray-500 hover:bg-gray-50" : "text-violet-600 hover:bg-violet-50"
                  )}
                >
                  {a.enabled ? "Disable" : "Enable"}
                </button>
                <button onClick={() => startEdit(a)} title="Edit" className="p-2 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(a)} title="Delete" className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
