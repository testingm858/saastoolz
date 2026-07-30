"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { CATEGORY_META } from "@/lib/tools";

const TOOL_CATS = ["pdf", "image", "audio", "developer", "seo", "writing", "calculator", "design"];

const LEGAL_LINKS = [
  { label: "About",            href: "/about"  },
  { label: "Blog",             href: "/blog"   },
  { label: "Privacy Policy",   href: "/privacy"},
  { label: "Terms of Service", href: "/terms"  },
  { label: "Contact",          href: "/contact"},
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg shrink-0">
            <Image src="/logo.jpeg" alt="SaaSToolz" width={24} height={24} className="w-6 h-6 rounded-lg object-cover" />
            SaaSToolz
          </Link>

          <div className="flex flex-wrap items-center gap-1.5">
            {TOOL_CATS.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat}`}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors"
              >
                <span>{CATEGORY_META[cat]?.icon}</span>
                {CATEGORY_META[cat]?.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors shrink-0 self-start md:self-auto"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            Back to top
          </button>
        </div>

        <div className="border-t border-gray-800 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs">© 2026 SaaSToolz. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
