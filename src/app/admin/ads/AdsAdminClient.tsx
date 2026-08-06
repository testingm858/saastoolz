"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Slot {
  id: string;
  key: string;
  label: string;
  code: string | null;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

type FormState = { key: string; label: string; code: string; enabled: boolean };

const EMPTY_FORM: FormState = { key: "", label: "", code: "", enabled: false };

// Keys the app actually renders somewhere — everything else just sits in the
// table until a page is wired up to read it.
const WIRED_KEYS = new Set(["tool-page"]);

export default function AdsAdminClient({ initialSlots }: { initialSlots: Slot[] }) {
  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [keyTouched, setKeyTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setForm(EMPTY_FORM);
    setKeyTouched(false);
    setError(null);
    setEditingId("new");
  }

  function startEdit(slot: Slot) {
    setForm({ key: slot.key, label: slot.label, code: slot.code ?? "", enabled: slot.enabled });
    setKeyTouched(true);
    setError(null);
    setEditingId(slot.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  function setLabel(label: string) {
    setForm((f) => ({ ...f, label, key: keyTouched ? f.key : slugify(label) }));
  }

  async function save() {
    if (!form.label.trim()) {
      setError("Label is required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/admin/ads" : `/api/admin/ads/${editingId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: form.key,
          label: form.label,
          code: form.code || null,
          enabled: form.enabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (isNew) {
        setSlots((prev) => [...prev, data.slot]);
      } else {
        setSlots((prev) => prev.map((s) => (s.id === data.slot.id ? data.slot : s)));
      }
      setEditingId(null);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled(slot: Slot) {
    const res = await fetch(`/api/admin/ads/${slot.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !slot.enabled }),
    });
    if (res.ok) {
      const data = await res.json();
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? data.slot : s)));
    }
  }

  async function remove(slot: Slot) {
    if (!confirm(`Delete "${slot.label}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/ads/${slot.id}`, { method: "DELETE" });
    if (res.ok) setSlots((prev) => prev.filter((s) => s.id !== slot.id));
  }

  const isEditing = editingId !== null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Admin
      </Link>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad slots</h1>
          <p className="text-gray-500 text-sm mt-1">{slots.length} slot{slots.length === 1 ? "" : "s"}</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New slot
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-8">
        Paste the raw embed code from AdSense, Adsterra, PropellerAds, or any other network — it&apos;s rendered
        exactly as given (scripts included), not sanitized. Only <code className="font-mono">tool-page</code>{" "}
        currently renders anywhere on the live site; other keys are held here until a page is wired to read them —
        ask and a new placement can be added.
      </p>

      {isEditing ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Label</label>
            <input
              type="text" value={form.label} onChange={(e) => setLabel(e.target.value)}
              placeholder="Tool page — horizontal banner"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Key</label>
            <input
              type="text" value={form.key}
              onChange={(e) => { setKeyTouched(true); setForm((f) => ({ ...f, key: e.target.value })); }}
              placeholder="tool-page"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">Identifies where this code is rendered in the codebase.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Embed code</label>
            <textarea
              value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              rows={10} placeholder="<script>...</script> or <ins class=&quot;adsbygoogle&quot;>...</ins>"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 font-mono leading-relaxed"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))} />
            Enabled (live on the site)
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
      ) : slots.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No ad slots yet — create one to get started.</p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{slot.label}</h3>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                    slot.enabled ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {slot.enabled ? "Enabled" : "Disabled"}
                  </span>
                  {WIRED_KEYS.has(slot.key) ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-violet-50 text-violet-700">Live placement</span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-amber-50 text-amber-700">Not wired yet</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">{slot.key}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleEnabled(slot)}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
                    slot.enabled ? "text-gray-500 hover:bg-gray-50" : "text-violet-600 hover:bg-violet-50"
                  )}
                >
                  {slot.enabled ? "Disable" : "Enable"}
                </button>
                <button onClick={() => startEdit(slot)} title="Edit" className="p-2 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(slot)} title="Delete" className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors">
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
