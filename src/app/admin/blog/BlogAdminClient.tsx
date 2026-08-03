"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { slugify } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type FormState = { title: string; slug: string; excerpt: string; content: string; published: boolean };

const EMPTY_FORM: FormState = { title: "", slug: "", excerpt: "", content: "", published: false };

export default function BlogAdminClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setError(null);
    setEditingId("new");
  }

  function startEdit(post: Post) {
    setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt ?? "", content: post.content, published: post.published });
    setSlugTouched(true);
    setError(null);
    setEditingId(post.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  function setTitle(title: string) {
    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
  }

  async function save() {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/admin/blog" : `/api/admin/blog/${editingId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          content: form.content,
          published: form.published,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      if (isNew) {
        setPosts((prev) => [data.post, ...prev]);
      } else {
        setPosts((prev) => prev.map((p) => (p.id === data.post.id ? data.post : p)));
      }
      setEditingId(null);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(post: Post) {
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === post.id ? data.post : p)));
    }
  }

  async function remove(post: Post) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== post.id));
  }

  const isEditing = editingId !== null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Admin
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            className="flex items-center gap-1.5 bg-violet-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> New post
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Title</label>
            <input
              type="text" value={form.title} onChange={(e) => setTitle(e.target.value)}
              placeholder="How to compress a PDF without losing quality"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Slug</label>
            <input
              type="text" value={form.slug}
              onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })); }}
              placeholder="how-to-compress-a-pdf"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">/blog/{form.slug || "..."}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Excerpt (optional)</label>
            <input
              type="text" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Shown on the blog list page"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Content (Markdown)</label>
            <textarea
              value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={16} placeholder="# Heading&#10;&#10;Write your post in Markdown..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-400 font-mono leading-relaxed"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
            Published (visible on /blog)
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
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No posts yet — create your first one.</p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{post.title}</h3>
                  <span className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                    post.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  )}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">/blog/{post.slug}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => togglePublish(post)} title={post.published ? "Unpublish" : "Publish"} className="p-2 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-gray-50 transition-colors">
                  {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => startEdit(post)} title="Edit" className="p-2 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => remove(post)} title="Delete" className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50 transition-colors">
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
