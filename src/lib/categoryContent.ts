// ─── Category page depth content ──────────────────────────────────────────────
//
// Hand-authored for the highest-value categories (highest search volume /
// most tools / clearest task-based intent). Categories without an entry here
// still get their existing header + tools grid + a link to any matching
// blog guide — just without the long-form task breakdown.

import type { ToolCategory } from "./tools";
import type { ToolFaq } from "./toolSeo";

export interface TaskGuideItem {
  task: string;
  toolId: string;
}

export interface CategoryContent {
  paragraphs: string[];
  taskGuide: TaskGuideItem[];
  privacyNote: string;
  faqs: ToolFaq[];
}

export const CATEGORY_CONTENT: Partial<Record<ToolCategory, CategoryContent>> = {
  pdf: {
    paragraphs: [
      "PDF is the one format almost every document ends up in eventually — contracts, invoices, scanned forms, reports — which also means it's the format people most often need to *change* before they can actually use it. That usually means one of a handful of jobs: combining several PDFs into one, shrinking a file that's too big to email, pulling a document apart into individual pages, converting it to or from Word, or getting the text out of a scan that's really just a picture.",
      "Each of those is a distinct, purpose-built tool below rather than one do-everything converter, because the right settings for compressing a scanned contract are very different from the right settings for merging two clean digital PDFs. Start from the task you're trying to finish, not the tool name.",
    ],
    taskGuide: [
      { task: "Combine several PDFs into one document", toolId: "pdf-merge" },
      { task: "Shrink a PDF that's too large to email or upload", toolId: "pdf-compress" },
      { task: "Split a PDF into individual pages or ranges", toolId: "pdf-split" },
      { task: "Make a scanned document's text searchable and copyable", toolId: "pdf-ocr" },
      { task: "Turn a PDF into an editable Word document", toolId: "pdf-to-word" },
      { task: "Remove or add password protection", toolId: "pdf-unlock" },
    ],
    privacyNote:
      "Every PDF tool here runs the actual processing on our servers only for the moment it takes to complete the job — files are deleted within 1 hour, never reviewed by a human, and never used for anything beyond the single operation you requested. Nothing requires an account, so there's no persistent record tying a document to your identity.",
    faqs: [
      { q: "Which PDF tool should I use to reduce file size for email?", a: "Compress PDF — set the compression level based on whether you need the text to stay perfectly selectable (low) or the smallest possible file (extreme)." },
      { q: "Can I edit a PDF's actual text directly?", a: "Not in-place — convert it to Word with PDF to Word, edit it there, then convert back to PDF with Word to PDF if you need to redistribute it as a PDF again." },
      { q: "My PDF is a scan — why can't I select the text?", a: "A scanned PDF is really just an image of a page, not real text. Run it through PDF OCR first to extract selectable, searchable text from it." },
      { q: "Is it safe to upload a contract or ID document?", a: "Files are processed securely and deleted from our servers within 1 hour — but for maximum caution with highly sensitive documents, redact anything you don't need processed before uploading." },
    ],
  },
  image: {
    paragraphs: [
      "Most image problems fall into a short list: the file is too big, it's in the wrong format, it's the wrong dimensions, or it's carrying metadata (like GPS location) you didn't mean to share. The tools below are split along exactly those lines rather than bundled into one generic \"image editor,\" because compressing a photo for a website and converting a logo to a transparent PNG call for completely different controls.",
      "A quick rule of thumb: use Image Compressor when the file size is the problem and the format is fine; use Image Converter when the format itself needs to change (say, PNG to WebP for a faster site); and check Image Metadata Viewer before publishing any photo taken on a phone, since it may still contain the exact GPS coordinates of where it was shot.",
    ],
    taskGuide: [
      { task: "Shrink a photo's file size for a faster website", toolId: "image-compress" },
      { task: "Convert between JPG, PNG, WebP and AVIF", toolId: "image-convert" },
      { task: "Resize an image to exact pixel dimensions", toolId: "image-resize" },
      { task: "Strip GPS/EXIF metadata before sharing a photo", toolId: "image-metadata-remove" },
      { task: "Generate a favicon in every required size", toolId: "favicon-generator" },
      { task: "Pick exact HEX/RGB values from an image", toolId: "color-picker" },
    ],
    privacyNote:
      "Image tools here process files on our servers only for the moment it takes to complete the job, then delete them within 1 hour. That matters most for the metadata tools specifically — a photo's EXIF data can include the exact time and GPS location it was taken, which is worth stripping before you post it publicly.",
    faqs: [
      { q: "Which format should I use for a website — JPG, PNG or WebP?", a: "WebP for the best size-to-quality ratio with wide browser support today; JPG for maximum compatibility with photos; PNG only when you specifically need transparency." },
      { q: "Will compressing my image make it blurry?", a: "The compressor shows a live before/after so you can find the point where file size drops significantly with no visible quality loss, rather than guessing." },
      { q: "How do I know if my photo has GPS data attached?", a: "Run it through Image Metadata Viewer first — it shows any embedded GPS coordinates, camera model and timestamp before you decide whether to strip it." },
      { q: "Can I batch-process multiple images at once?", a: "Check each tool's upload area — several, like JPG to PDF, accept multiple files at once; single-image tools are built for precision on one file at a time." },
    ],
  },
  developer: {
    paragraphs: [
      "These are the small, repetitive jobs that come up constantly while building software — formatting a blob of minified JSON so you can actually read it, decoding a JWT to see what's inside without writing a script, generating a UUID, or diffing two versions of a config file. None of them are hard problems, but they're annoying enough to context-switch for, so having them all in one place, working instantly with no install, saves the actual friction.",
      "Everything here runs client-side in your browser — the tools don't send what you paste to a server, which matters when what you're pasting is a real API response, a token, or a connection string from a project you're debugging.",
    ],
    taskGuide: [
      { task: "Format and validate a JSON payload", toolId: "json-formatter" },
      { task: "Decode a JWT to inspect its payload", toolId: "jwt-decoder" },
      { task: "Generate hashes (MD5, SHA-256, etc.)", toolId: "hash-generator" },
      { task: "Test a regular expression against sample text", toolId: "regex-tester" },
      { task: "Compare two versions of text or code", toolId: "diff-checker" },
      { task: "Generate a .gitignore for your stack", toolId: "gitignore-generator" },
    ],
    privacyNote:
      "Formatting, validation, encoding and hashing all run entirely in your browser via JavaScript — nothing you paste in (including API keys, tokens or credentials you're debugging) is ever transmitted to or stored on our servers.",
    faqs: [
      { q: "Is it safe to paste a real API response or token into these tools?", a: "For the formatting/decoding tools (JSON Formatter, JWT Decoder, etc.), processing happens entirely client-side in your browser — nothing is sent to a server. As general practice, still avoid pasting live production secrets into any third-party tool if you can substitute a redacted sample instead." },
      { q: "Can I use these tools in a CI pipeline or script?", a: "These are interactive browser tools for quick manual checks, not an API — for automation, use the equivalent library or CLI in your language of choice." },
      { q: "Why does JWT Decoder show the payload without needing the secret?", a: "A JWT's header and payload are only Base64-encoded, not encrypted, so anyone can read them without the signing secret — the secret is only needed to verify the signature is valid, which is a separate step." },
      { q: "Do these tools support very large files?", a: "Most handle typical development-sized payloads (up to a few megabytes) smoothly; extremely large inputs may render more slowly since everything processes in-browser." },
    ],
  },
  seo: {
    paragraphs: [
      "Technical SEO is mostly a checklist problem: does the page have a title and description, is there a canonical tag pointing at the right URL, does robots.txt allow the pages you want crawled, is there a sitemap listing them, and does structured data mark up what the page actually is. None of that requires guesswork — it requires generating the right tag, in the right format, and putting it in the right place.",
      "The tools below cover that checklist end to end: build the on-page meta tags first, then robots.txt and a sitemap so crawlers can find and are allowed to index your pages, then schema markup so search engines understand what the page represents (an article, a product, an FAQ) well enough to potentially show a rich result for it.",
    ],
    taskGuide: [
      { task: "Generate title, description and social preview tags", toolId: "meta-tag-generator" },
      { task: "Control what search engines are allowed to crawl", toolId: "robots-txt" },
      { task: "Build an XML sitemap for your pages", toolId: "sitemap-generator" },
      { task: "Add JSON-LD structured data for rich results", toolId: "schema-generator" },
      { task: "Check keyword density before publishing", toolId: "keyword-density" },
      { task: "Trace a redirect chain for a broken link", toolId: "redirect-checker" },
    ],
    privacyNote:
      "These tools work on the content and URLs you provide directly — nothing is crawled or stored on our end beyond generating the output you asked for, and the generated tags/files are yours to use on as many sites as you need.",
    faqs: [
      { q: "Do I need all of these tags on every page?", a: "Title and meta description, yes, on every page. Canonical tags matter most when similar content is reachable at multiple URLs. Open Graph and Twitter Card tags matter most for pages you expect to be shared on social media." },
      { q: "What's the difference between robots.txt and a noindex tag?", a: "robots.txt tells crawlers which paths to avoid crawling at all; a noindex meta tag lets a page be crawled but tells search engines not to show it in results. Use noindex, not robots.txt, if a page must stay fully out of search results." },
      { q: "Does adding schema markup guarantee a rich result in Google?", a: "No — correct markup makes a page eligible for a rich result, but whether Google actually shows one depends on their own algorithms and isn't guaranteed." },
      { q: "How do I check that my sitemap and robots.txt are actually live?", a: "Visit yoursite.com/robots.txt and yoursite.com/sitemap.xml directly in a browser after uploading — both should load as plain text/XML with a 200 status, not a 404." },
    ],
  },
};

export const CATEGORY_BLOG_SLUGS: Partial<Record<ToolCategory, string[]>> = {
  pdf: ["complete-guide-to-pdf-tools", "compress-pdf-without-losing-quality"],
  image: ["practical-guide-to-image-tools"],
  developer: ["jwt-tokens-explained"],
  seo: ["technical-seo-checklist"],
  writing: ["strong-passwords-explained", "how-to-create-a-free-professional-invoice-online-no-signup-required"],
  calculator: ["how-loan-emi-works"],
  design: ["color-palette-guide"],
  audio: ["audio-formats-and-watermarking-guide"],
};
