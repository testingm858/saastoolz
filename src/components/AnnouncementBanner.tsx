"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

interface Props {
  id: string;
  badge: string;
  title: string;
  message: string | null;
  linkUrl: string | null;
  linkText: string | null;
}

const DISMISS_KEY_PREFIX = "saastoolz_announcement_dismissed_";

// Dismissal is keyed by announcement id, so a newly-published announcement
// always shows again even if the previous one was dismissed. Starts hidden
// and only reveals itself after checking localStorage on mount, so there's
// no flash of a banner the visitor already dismissed on an earlier visit.
export default function AnnouncementBanner({ id, badge, title, message, linkUrl, linkText }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(DISMISS_KEY_PREFIX + id));
    } catch {
      setVisible(true);
    }
  }, [id]);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY_PREFIX + id, "1");
    } catch {
      // storage unavailable — banner just won't stay dismissed across visits
    }
  }

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Sparkles className="w-4 h-4 shrink-0" />
        <div className="min-w-0 flex-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
          <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full shrink-0">{badge}</span>
          <span className="font-semibold truncate">{title}</span>
          {message && <span className="text-white/80 truncate hidden sm:inline">— {message}</span>}
        </div>
        {linkUrl && linkText && (
          <Link href={linkUrl} className="hidden sm:inline text-sm font-semibold underline underline-offset-2 hover:no-underline shrink-0 whitespace-nowrap">
            {linkText} →
          </Link>
        )}
        <button onClick={dismiss} aria-label="Dismiss announcement" className="shrink-0 p-1 rounded-full hover:bg-white/15 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
