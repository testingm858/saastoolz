import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

// Posts store their cover image as a leading markdown image rather than a
// separate DB column — this pulls it out for use as a list-page thumbnail.
export function extractCoverImage(md: string): string | null {
  const match = md.trimStart().match(/^!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1] : null;
}

// Admin-authored content only (gated behind ADMIN_EMAILS), but this still
// renders on a public page — sanitize anyway as defense in depth.
export function renderMarkdown(md: string): string {
  const rawHtml = marked.parse(md, { async: false }) as string;
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "width", "height"],
      a: ["href", "name", "target", "rel"],
    },
  });
}
