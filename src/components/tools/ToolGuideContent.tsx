// Generic renderer for long-form, tool-specific supporting content (see
// src/lib/toolGuides.ts for the actual per-tool text). One component instead
// of a bespoke one per tool — but the *content* itself is still hand-written
// per tool, not templated filler; this only standardizes the layout.

import type { ReactNode } from "react";
import type { ToolGuide, GuideListItem } from "@/lib/toolGuides";

// Tiny inline "**bold**" parser so guide content can be authored as plain
// strings (in toolGuides.ts) without reaching for dangerouslySetInnerHTML.
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function ListItems({ items, ordered }: { items: GuideListItem[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`${ordered ? "list-decimal" : "list-disc"} pl-5 space-y-1.5`}>
      {items.map((item, i) => (
        <li key={i}>{renderInline(item)}</li>
      ))}
    </Tag>
  );
}

function Section({ section }: { section: ToolGuide["sections"][number] }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">
        {section.paragraphs?.map((p, i) => <p key={i}>{renderInline(p)}</p>)}
        {section.list && <ListItems items={section.list.items} ordered={section.list.ordered} />}
        {section.table && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  {section.table.headers.map((h, i) => (
                    <th key={i} className={`py-2 ${i < section.table!.headers.length - 1 ? "pr-4" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, i) => (
                  <tr key={i} className={i < section.table!.rows.length - 1 ? "border-b border-gray-50" : ""}>
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2 ${j === 0 ? "font-medium text-gray-700 pr-4" : j < row.length - 1 ? "pr-4" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ToolGuideContent({ guide }: { guide: ToolGuide }) {
  return (
    <div className="mt-16 border-t border-gray-100 pt-10 max-w-3xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{guide.heading}</h2>
      {guide.sections.map((section, i) => (
        <Section key={i} section={section} />
      ))}
    </div>
  );
}
