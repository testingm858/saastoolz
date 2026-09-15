// ─── Long-form supporting content for tool pages ──────────────────────────────
//
// Hand-authored, tool-specific content — what the underlying concept is, when
// you actually need it, and the practical/technical context around it — so a
// tool page gives Google (and readers) more than "enter details → click
// button → download." Rendered via <ToolGuideContent> in
// src/app/tools/[toolId]/page.tsx for whichever tool has an entry here.
// The first 12 entries (the highest-traffic tool per category) get the full
// 5–6 section treatment matching their OVERRIDES in toolSeo.ts; the rest get
// a more concise but still genuinely tool-specific 2–3 section guide.

export type GuideListItem = string; // may contain "**bold**" spans

export interface GuideSection {
  title: string;
  paragraphs?: string[];
  list?: { ordered?: boolean; items: GuideListItem[] };
  table?: { headers: string[]; rows: string[][] };
}

export interface ToolGuide {
  heading: string;
  sections: GuideSection[];
}

export const TOOL_GUIDES: Partial<Record<string, ToolGuide>> = {
  "pdf-merge": {
    heading: "Everything you need to know about merging PDFs",
    sections: [
      {
        title: "What does merging a PDF actually do?",
        paragraphs: [
          "Merging combines two or more separate PDF files into a single document, in the page order you choose. Nothing about the content changes — pages are copied byte-for-byte into the new file, so text, images, and formatting stay exactly as they were in the originals.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Compiling an application** — a cover letter, resume, and references arrive as three separate PDFs but need to go out as one.",
            "**Combining scanned pages** — a multi-page contract scanned as individual page files needs to become one document.",
            "**Assembling a report** — sections written by different people, each exported to PDF separately, need to become a single deliverable.",
          ],
        },
      },
      {
        title: "Merging vs. other PDF chores",
        table: {
          headers: ["Task", "What it does"],
          rows: [
            ["Merge", "Combines multiple files into one"],
            ["Split", "Breaks one file into multiple"],
            ["Organize", "Reorders pages within one file, without adding or removing any"],
          ],
        },
      },
      {
        title: "Getting the order right",
        paragraphs: [
          "The output follows exactly the order you arrange the files in before merging — there's no automatic sorting by filename or date. If you're combining scans of a physical document, double-check the page order (and orientation) before merging rather than after, since fixing it afterward means either re-merging or reaching for the Organize tool.",
        ],
      },
      {
        title: "After merging: keep an eye on file size",
        paragraphs: [
          "Combining several PDFs adds their file sizes together, so a merge of five already-large scanned documents can end up too big to email even though none of the originals were individually. If that happens, run the result through Compress PDF afterward — merge first, then compress, so you're only compressing once instead of five separate times.",
        ],
      },
    ],
  },

  "pdf-compress": {
    heading: "Everything you need to know about compressing PDFs",
    sections: [
      {
        title: "What does \"compressing\" a PDF actually change?",
        paragraphs: [
          "A PDF's file size is almost always dominated by its embedded images, not its text — a page of plain text is a few kilobytes, but a single high-resolution scanned page can be several megabytes on its own. Compression works mainly by re-encoding those embedded images at a lower resolution or quality, which is why a scanned document typically shrinks far more than a text-only PDF exported from Word.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Email attachment limits** — most providers cap attachments around 20–25MB.",
            "**Application/portal upload limits** — government and HR portals often cap uploads at 5–10MB.",
            "**Storage and bandwidth** — smaller files download faster and take up less space when archived.",
          ],
        },
      },
      {
        title: "Choosing a compression level",
        table: {
          headers: ["Level", "Best for"],
          rows: [
            ["Low", "Documents that must stay perfectly text-selectable and sharp"],
            ["Recommended", "Most cases — strong size reduction with high visual quality"],
            ["Extreme", "When file size matters more than visual fidelity (e.g. a hard 5MB upload cap)"],
          ],
        },
      },
      {
        title: "What actually determines a PDF's size",
        list: {
          items: [
            "**Embedded images** — by far the biggest factor, especially scanned pages saved at high DPI.",
            "**Embedded fonts** — a document using many custom fonts carries their full font data.",
            "**Number of pages** — obviously scales file size, but far less than image resolution does.",
          ],
        },
      },
      {
        title: "Keeping files small from the start",
        paragraphs: [
          "If you're the one creating the original document (not just compressing someone else's), scanning at 150–200 DPI instead of 300+ for anything that isn't a photograph avoids the problem entirely — most scanning apps default higher than necessary for a document that's only going to be read on a screen.",
        ],
      },
    ],
  },

  "pdf-to-word": {
    heading: "Everything you need to know about converting PDF to Word",
    sections: [
      {
        title: "What does PDF to Word conversion do?",
        paragraphs: [
          "A PDF is designed to look identical everywhere — it's not built to be edited. Converting to Word (.docx) extracts the text, layout structure, tables and images from the PDF and rebuilds them as an editable document, so you can revise content instead of retyping it from scratch.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Updating an old document** you only have as a final PDF — a contract template, an old resume, a form.",
            "**Reusing content** from a PDF report into a new Word document without retyping it.",
            "**Collaborative editing** — a PDF can't be commented on and revised the way a Word doc can in Google Docs or Word's track changes.",
          ],
        },
      },
      {
        title: "What carries over well — and what doesn't",
        paragraphs: [
          "Straightforward documents — reports, letters, contracts, resumes with standard formatting — convert cleanly, with paragraphs, headings, and simple tables preserved. Complex layouts (multi-column magazine-style pages, heavy graphic design, overlapping text boxes) often need minor manual touch-up afterward, since Word's layout model isn't identical to a PDF's fixed positioning. This is a limitation of the two formats being fundamentally different, not something any converter fully solves.",
        ],
      },
      {
        title: "The one thing this tool doesn't do: read scanned text",
        paragraphs: [
          "PDF to Word extracts text that already exists as text in the PDF. If your PDF is a scanned image of a document — meaning you can't select or search its text in the first place — converting it to Word directly will produce a blank or image-only result. Run it through **PDF OCR** first to extract the actual text, and convert to Word after.",
        ],
      },
    ],
  },

  "pdf-ocr": {
    heading: "Everything you need to know about PDF OCR",
    sections: [
      {
        title: "What is OCR?",
        paragraphs: [
          "OCR (optical character recognition) analyzes the pixels of a scanned page and recognizes which shapes are which letters, turning a picture of text back into actual, selectable text. A scanned PDF — even one that looks completely normal on screen — is really just an image as far as your computer is concerned: you can't select it, search it with Ctrl+F, or copy a sentence out of it, until OCR has run on it.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Digitizing paper archives** — old contracts, receipts, or books that only exist as scans.",
            "**Making a scanned form searchable** — finding one clause in a 50-page scanned agreement without reading every page.",
            "**Preparing a scan for PDF to Word** — OCR has to run first, or there's no real text to convert.",
          ],
        },
      },
      {
        title: "How accurate is OCR, really?",
        paragraphs: [
          "Accuracy is very high on clean, well-lit scans of typed text in a supported language — often close to perfect. It drops noticeably on blurry or skewed scans, handwriting (which OCR generally can't read reliably at all), unusual fonts, and documents scanned at low resolution. Selecting the correct document language before running OCR matters more than most people expect — recognition is language-specific, and picking the wrong one will produce garbled results even on a perfectly clean scan.",
        ],
      },
      {
        title: "OCR vs. PDF to Word — a common mix-up",
        table: {
          headers: ["", "What it does"],
          rows: [
            ["PDF OCR", "Makes an existing scanned PDF's text selectable and searchable — output is still a PDF"],
            ["PDF to Word", "Converts a PDF (that already has real text) into an editable .docx file"],
          ],
        },
      },
      {
        title: "Getting the best results",
        list: {
          items: [
            "Scan at a reasonable resolution (200–300 DPI) — too low loses detail OCR needs, too high just adds file size without helping accuracy.",
            "Straighten skewed scans before running OCR where possible — a tilted page reduces recognition accuracy.",
            "Select the correct language — this is the single most common cause of poor OCR results on an otherwise clean scan.",
          ],
        },
      },
    ],
  },

  "image-compress": {
    heading: "Everything you need to know about compressing images",
    sections: [
      {
        title: "What does image compression actually do?",
        paragraphs: [
          "Compression reduces a photo's file size by simplifying the pixel data it's stored with — either by discarding detail the human eye barely notices (lossy compression, used by JPG and most web-optimized formats) or by re-encoding the data more efficiently with no quality loss at all (lossless, used by PNG). For photographs specifically, a well-tuned lossy compression can cut file size 50–80% with no visible difference at normal viewing sizes.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Website performance** — large uncompressed images are one of the most common causes of a slow-loading page.",
            "**Email attachments** — a handful of full-resolution phone photos can easily exceed attachment limits.",
            "**Storage** — compressing a large photo library saves meaningful space with no visible tradeoff.",
          ],
        },
      },
      {
        title: "Compression vs. resizing vs. converting — not the same thing",
        table: {
          headers: ["Tool", "What it changes"],
          rows: [
            ["Image Compressor", "File size, via quality/encoding — dimensions stay the same"],
            ["Image Resizer", "Pixel dimensions (width/height) — quality setting unchanged"],
            ["Image Converter", "File format (JPG, PNG, WebP, etc.) — may also change compression method"],
          ],
        },
      },
      {
        title: "How far can you compress before it looks bad?",
        paragraphs: [
          "There's no single right answer — it depends on the image and how it'll be viewed. A photo destined for a small thumbnail tolerates far more compression than the same photo displayed full-screen. That's why a live before/after preview (rather than a fixed setting) is the right way to compress: you can see the actual tradeoff and stop right before quality visibly drops, instead of guessing at a percentage.",
        ],
      },
    ],
  },

  "image-convert": {
    heading: "Everything you need to know about image formats",
    sections: [
      {
        title: "Why does the format even matter?",
        paragraphs: [
          "Different image formats trade off file size, quality, and features (like transparency) differently — using the wrong one for the job means either a needlessly large file or a missing feature you actually needed, like a transparent background.",
        ],
      },
      {
        title: "Which format should you actually use?",
        table: {
          headers: ["Format", "Best for"],
          rows: [
            ["JPG", "Photos where maximum compatibility matters — no transparency support"],
            ["PNG", "Graphics/logos needing transparency, or when you need lossless quality"],
            ["WebP", "The best size-to-quality ratio for the web today, with wide browser support"],
            ["AVIF", "Even smaller than WebP at equal quality, on newer browsers"],
            ["SVG", "Genuinely vector artwork (logos, icons, illustrations) — not photographs"],
          ],
        },
      },
      {
        title: "Lossy vs. lossless, in plain terms",
        paragraphs: [
          "A lossy format (JPG, and WebP/AVIF at typical settings) discards some image detail to shrink the file — fine for photos, where the human eye doesn't notice. A lossless format (PNG, and WebP/AVIF at their lossless setting) keeps every pixel exactly as-is, at the cost of a larger file — necessary for graphics with sharp edges and flat colors, like logos and screenshots with text, where lossy compression introduces visible artifacts around edges.",
        ],
      },
      {
        title: "A common mistake to avoid",
        paragraphs: [
          "Converting a photograph to SVG doesn't work the way people sometimes expect — SVG is a vector format built to describe shapes mathematically (a circle, a path, a line), not to store the pixel-by-pixel detail a photo needs. SVG conversion only makes sense for artwork that's genuinely vector-based to begin with, like an icon or logo.",
        ],
      },
    ],
  },

  "qr-generator": {
    heading: "Everything you need to know about QR codes",
    sections: [
      {
        title: "What is a QR code?",
        paragraphs: [
          "A QR (Quick Response) code is a two-dimensional barcode that encodes data directly into its pattern of black and white squares — a phone's camera reads the pattern and decodes it instantly, without needing to look anything up in a database. That's an important distinction: a QR code you generate here isn't a link to some third-party redirect service that could expire — it's the data itself, encoded directly.",
        ],
      },
      {
        title: "Types of QR codes and when to use each",
        table: {
          headers: ["Type", "Use case"],
          rows: [
            ["URL", "Linking to a website, menu, or landing page"],
            ["Plain text", "Sharing a short message, address, or note"],
            ["WiFi", "Letting guests join a network without typing a password"],
            ["vCard", "Sharing a contact card that saves directly to a phone"],
          ],
        },
      },
      {
        title: "How QR codes stay readable even when damaged",
        paragraphs: [
          "QR codes include built-in error correction, meaning they can still scan correctly even if part of the code is smudged, torn, or has a logo placed over the center — the format was designed for exactly this kind of real-world wear. That's also why QR codes tolerate a logo overlay reasonably well, as long as it doesn't cover too much of the pattern.",
        ],
      },
      {
        title: "Getting a QR code that actually scans reliably",
        list: {
          items: [
            "Keep strong contrast between the foreground and background color — low-contrast codes fail to scan.",
            "Don't shrink it too far — a QR code needs enough physical size for a camera to resolve its pattern, especially at a distance (a code on a poster needs to be bigger than one in a business card).",
            "Test it with an actual phone camera before printing or publishing at scale.",
          ],
        },
      },
      {
        title: "QR codes vs. barcodes",
        paragraphs: [
          "A traditional barcode (like the one on a product) encodes data in a single line and typically holds far less information — usually just a numeric product code. A QR code encodes data in two dimensions, holding dramatically more data (a full URL, a WiFi password, a contact card) in a similar amount of space. Use **Barcode Generator** instead for something that specifically needs to be a standard product barcode (EAN-13, UPC, Code 128).",
        ],
      },
    ],
  },

  "json-formatter": {
    heading: "Everything you need to know about JSON formatting",
    sections: [
      {
        title: "What is JSON?",
        paragraphs: [
          "JSON (JavaScript Object Notation) is the format almost every modern API, config file, and web service uses to structure data — nested objects and arrays of key-value pairs, written as plain text. It's designed to be easy for programs to parse, which unfortunately makes it uncomfortable for humans to read once it's minified into one long line, which is exactly the state most JSON arrives in from an API response or a build tool.",
        ],
      },
      {
        title: "Why format (beautify) JSON at all?",
        paragraphs: [
          "A formatter reindents that single-line JSON with proper line breaks, indentation and syntax highlighting so you can actually see the structure — which field is nested inside which, where an array starts and ends — instead of scanning a wall of unbroken text for a missing comma.",
        ],
      },
      {
        title: "Common JSON syntax errors this catches",
        list: {
          items: [
            "**Trailing commas** — a comma after the last item in an object or array, which JSON (unlike JavaScript) doesn't allow.",
            "**Unquoted keys** — JSON requires every key to be in double quotes, unlike JavaScript object literals.",
            "**Single quotes instead of double quotes** — JSON strings must use double quotes, not single.",
            "**Mismatched brackets/braces** — a `{` without its closing `}`, or vice versa.",
          ],
        },
      },
      {
        title: "Formatting vs. minifying vs. validating",
        table: {
          headers: ["Tool", "What it does"],
          rows: [
            ["JSON Formatter", "Adds readable indentation and highlighting to valid JSON"],
            ["JSON Minifier", "Strips all whitespace for the smallest possible payload"],
            ["JSON Viewer", "Renders JSON as a collapsible, explorable tree structure"],
          ],
        },
      },
      {
        title: "Where this comes up in practice",
        paragraphs: [
          "Debugging an API response that arrived as one unreadable line, reviewing a config file before committing it, or checking that a payload you're about to send is actually valid JSON before it fails silently somewhere downstream — all common, everyday reasons to reach for a formatter rather than eyeballing raw JSON in a terminal.",
        ],
      },
    ],
  },

  "password-generator": {
    heading: "Everything you need to know about strong passwords",
    sections: [
      {
        title: "What actually makes a password strong?",
        paragraphs: [
          "Strength comes primarily from **length and randomness**, not from a clever pattern only you'd think of. A password's resistance to a brute-force attack grows exponentially with each additional character — a longer password with fewer character types can be stronger than a shorter one stuffed with symbols, because raw length matters more than complexity once you're past a reasonable minimum.",
        ],
      },
      {
        title: "Common password mistakes",
        list: {
          items: [
            "**Reusing the same password** across multiple accounts — one breached site then compromises every other account using it.",
            "**Predictable substitutions** — swapping \"a\" for \"@\" or adding \"123!\" at the end is well known to password-cracking tools and adds far less strength than people assume.",
            "**Personal information** — names, birthdates, and pet names are among the first things attackers try.",
            "**Short passwords, even complex ones** — an 8-character password with symbols is weaker than a 16-character password without them.",
          ],
        },
      },
      {
        title: "How long should a password actually be?",
        table: {
          headers: ["Length", "General guidance"],
          rows: [
            ["Under 12 characters", "Vulnerable to modern brute-force attacks regardless of complexity"],
            ["12–16 characters", "A reasonable minimum for most accounts today"],
            ["16+ characters", "Strongly recommended for anything sensitive (email, banking, password manager master password)"],
          ],
        },
      },
      {
        title: "Why you need a password manager, not memory",
        paragraphs: [
          "Using a unique, random password for every account is only realistic with a password manager doing the remembering — trying to memorize dozens of truly random strings leads people back to reuse or predictable patterns. Generate a password here, save it directly into your password manager, and let it autofill from then on.",
        ],
      },
      {
        title: "Passwords vs. passphrases",
        paragraphs: [
          "A passphrase (several random unrelated words strung together, like \"correct horse battery staple\") is a legitimate alternative to a random character string, and can be easier to type on a device without a password manager — but it needs to be genuinely long (several words) and genuinely random, not a memorable quote or lyric, which defeats the purpose entirely.",
        ],
      },
    ],
  },

  "meta-tag-generator": {
    heading: "Everything you need to know about meta tags",
    sections: [
      {
        title: "What are meta tags?",
        paragraphs: [
          "Meta tags are small pieces of information placed in a page's `<head>` that describe the page to search engines and social platforms — they're invisible to a visitor reading the page, but they control how that page appears in a Google search result or when someone shares the link on social media.",
        ],
      },
      {
        title: "Which meta tags actually matter for SEO",
        table: {
          headers: ["Tag", "What it controls"],
          rows: [
            ["Title", "The clickable headline shown in search results and browser tabs"],
            ["Meta description", "The summary text shown under the title in search results"],
            ["Canonical", "Which URL search engines should treat as the \"real\" one, if the content is reachable at more than one address"],
            ["Open Graph / Twitter Card", "How the link looks when shared on social media (image, title, description)"],
          ],
        },
      },
      {
        title: "Meta tags vs. structured data — different jobs",
        paragraphs: [
          "Meta tags describe the page for basic display purposes (title, description, social preview). Structured data (JSON-LD, generated by **Schema Generator**) goes further, telling search engines what the page actually *is* in a machine-readable way — a recipe, a product, an FAQ, an article — which is what makes a search engine eligible to show a rich result (star ratings, an FAQ dropdown) instead of a plain blue link. Most pages benefit from both.",
        ],
      },
      {
        title: "Common meta tag mistakes",
        list: {
          items: [
            "**Missing or duplicate meta descriptions** across pages — each page should have its own, specific to that page's content.",
            "**Titles that are too long** and get truncated in search results (roughly 50–60 characters is the safe zone).",
            "**Forgetting Open Graph tags entirely** — without them, a shared link often falls back to an ugly, generic preview.",
            "**A canonical tag pointing at the wrong URL** — this actively tells search engines to ignore the page you're trying to rank.",
          ],
        },
      },
    ],
  },

  "robots-txt": {
    heading: "Everything you need to know about robots.txt",
    sections: [
      {
        title: "What is robots.txt?",
        paragraphs: [
          "robots.txt is a plain text file at the root of a domain (yoursite.com/robots.txt) that tells search engine crawlers which parts of the site they're allowed to crawl. It's a voluntary instruction, honored by well-behaved crawlers like Googlebot, not an access control mechanism — it can't stop anyone from actually visiting a URL.",
        ],
      },
      {
        title: "What robots.txt can — and can't — do",
        paragraphs: [
          "This is the single most common misunderstanding: **robots.txt does not reliably keep a page out of search results.** It stops crawling, but a page that's blocked from crawling can still appear in search results (usually with no description) if other sites link to it — because Google already knows the URL exists, it just can't read its content. If you need a page fully excluded from search results, use a `noindex` meta tag on the page itself instead, which requires the page to be crawlable so the crawler can actually see that instruction.",
        ],
      },
      {
        title: "The directives, explained",
        table: {
          headers: ["Directive", "What it does"],
          rows: [
            ["User-agent", "Which crawler the following rules apply to (`*` means all)"],
            ["Disallow", "A path the crawler shouldn't crawl"],
            ["Allow", "An exception to a broader Disallow rule"],
            ["Sitemap", "Points crawlers to your XML sitemap's location"],
          ],
        },
      },
      {
        title: "robots.txt vs. noindex vs. sitemap",
        table: {
          headers: ["", "Purpose"],
          rows: [
            ["robots.txt", "Controls what gets crawled"],
            ["noindex meta tag", "Controls what gets shown in search results (page must still be crawlable)"],
            ["Sitemap", "Helps crawlers discover and prioritize pages faster"],
          ],
        },
      },
      {
        title: "A mistake that can accidentally de-index a whole site",
        paragraphs: [
          "A stray `Disallow: /` (blocking the entire site) is a surprisingly common accident — often left over from a staging environment's robots.txt that got deployed to production by mistake. Always check a live site's robots.txt after deployment, not just once during setup.",
        ],
      },
    ],
  },

  "sitemap-generator": {
    heading: "Everything you need to know about XML sitemaps",
    sections: [
      {
        title: "What is an XML sitemap?",
        paragraphs: [
          "An XML sitemap is a structured file listing a site's pages, so search engines can discover them efficiently rather than relying purely on following links from page to page. It's especially useful for large sites, new sites with few external links pointing in yet, and pages that aren't well-connected through internal navigation.",
        ],
      },
      {
        title: "What a sitemap does — and doesn't — guarantee",
        paragraphs: [
          "A sitemap helps search engines **discover** pages faster and understand the site's structure — it does not guarantee those pages get **indexed** or rank well. Indexing still depends on content quality, crawl budget, and whether the page is actually worth showing in search results. Think of it as making pages easier to find, not a fast-track to ranking.",
        ],
      },
      {
        title: "What each field actually influences",
        table: {
          headers: ["Field", "Google's actual usage"],
          rows: [
            ["lastmod", "Used as a genuine freshness signal — keep it accurate, don't fake it"],
            ["changefreq", "Google has said it's mostly ignored today"],
            ["priority", "Also mostly ignored — relative priority within your own site, not compared across sites"],
          ],
        },
      },
      {
        title: "Sitemap vs. robots.txt — complementary, not competing",
        paragraphs: [
          "robots.txt controls what crawlers are *allowed* to crawl; a sitemap tells them what exists and where to find it. Reference your sitemap's URL directly in robots.txt (`Sitemap: https://yoursite.com/sitemap.xml`) so both work together — a crawler that respects robots.txt will also pick up the sitemap reference from the same file.",
        ],
      },
      {
        title: "After generating: submit it",
        paragraphs: [
          "Generating the file is only half the job — submit it directly in Google Search Console and Bing Webmaster Tools for faster discovery, in addition to referencing it in robots.txt. A sitemap that's valid but never submitted anywhere still works, just more slowly, since crawlers eventually find it via robots.txt on their own schedule.",
        ],
      },
    ],
  },

  // ─── PDF ─────────────────────────────────────────────────────────────────

  "pdf-split": {
    heading: "Everything you need to know about splitting PDFs",
    sections: [
      {
        title: "What does splitting a PDF do?",
        paragraphs: [
          "Splitting breaks one PDF into multiple separate files — either every page as its own file, or specific page ranges you define. The content of each page is copied exactly as-is; nothing is re-rendered or re-compressed in the process.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Pulling one chapter or section** out of a large report or book to share on its own.",
            "**Separating a scanned batch** — a scanner that saved 50 pages as one file, when you actually needed 10 separate documents.",
            "**Sending only part of a document** without exposing the rest of it.",
          ],
        },
      },
      {
        title: "Split vs. extract vs. remove pages",
        table: {
          headers: ["Tool", "What it does"],
          rows: [
            ["Split PDF", "Breaks one file into several output files"],
            ["Extract PDF Pages", "Pulls specific pages into one new file, leaving the original untouched"],
            ["Remove PDF Pages", "Deletes specific pages, keeping the rest as one file"],
          ],
        },
      },
    ],
  },

  "word-to-pdf": {
    heading: "Everything you need to know about converting Word to PDF",
    sections: [
      {
        title: "Why convert to PDF at all?",
        paragraphs: [
          "A Word document looks different depending on the software, fonts, and screen it's opened on — a PDF locks the layout down so it looks identical everywhere, which is exactly what you want once a document is finished and ready to send, rather than still being edited.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Sending a finished document** — a contract, invoice, or report that shouldn't be edited further by the recipient.",
            "**Submitting to a portal** that requires PDF specifically (many application and government portals do).",
            "**Preserving exact formatting** across different computers, since a PDF won't reflow if the recipient doesn't have the same fonts installed.",
          ],
        },
      },
      {
        title: "Going back the other way",
        paragraphs: [
          "If you later need to edit content that only exists as a PDF, **PDF to Word** does the reverse conversion — extracting the text and layout back into an editable .docx file.",
        ],
      },
    ],
  },

  "pdf-to-jpg": {
    heading: "Everything you need to know about converting PDF to JPG",
    sections: [
      {
        title: "What does this actually produce?",
        paragraphs: [
          "Each page of the PDF is rendered as its own JPG image — useful when you need a page as a picture rather than a document, since a JPG can be dropped straight into a slide deck, a design tool, or a social post in a way a PDF file usually can't.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Pulling a diagram or chart** out of a report to use as a standalone image.",
            "**Sharing a document preview** somewhere that only accepts images, not file attachments.",
            "**Multi-page PDFs** convert to one JPG per page — download them together as a .zip when converting more than one page.",
          ],
        },
      },
      {
        title: "Going the other direction",
        paragraphs: [
          "If you're starting from images instead — say, a stack of scanned photos or screenshots — **JPG to PDF** combines them into a single shareable document instead.",
        ],
      },
    ],
  },

  "jpg-to-pdf": {
    heading: "Everything you need to know about converting JPG to PDF",
    sections: [
      {
        title: "What does this actually produce?",
        paragraphs: [
          "Each image you upload becomes one page of a single PDF document, in the order you arrange them — a straightforward way to turn a stack of photos, scans, or screenshots into one shareable file instead of several loose images.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Submitting scanned photos of a document** (an ID, a signed form) as a single PDF instead of several separate image files.",
            "**Compiling a photo set** into one document for printing or archiving.",
            "**Meeting a portal's requirement** for a PDF upload when all you have are images.",
          ],
        },
      },
      {
        title: "Order matters",
        paragraphs: [
          "The output follows the exact order you arrange the images in before converting — check the sequence before downloading, since fixing page order afterward means either re-converting or using **PDF Organizer** on the result.",
        ],
      },
    ],
  },

  "pdf-rotate": {
    heading: "Everything you need to know about rotating PDF pages",
    sections: [
      {
        title: "Why does a PDF end up sideways in the first place?",
        paragraphs: [
          "This almost always comes from scanning — a page fed into a scanner the wrong way up, or a document originally created in landscape and scanned as portrait. The content itself is fine; it's just displayed at the wrong angle.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Fixing a sideways or upside-down scan** without re-scanning the original.",
            "**Correcting individual pages** in an otherwise correctly-oriented document, if only some pages were scanned the wrong way.",
          ],
        },
      },
      {
        title: "A quick note on angles",
        paragraphs: [
          "Rotation is applied per the angle you choose — 90° clockwise, 180° (upside down), or 90° counter-clockwise — and doesn't affect the actual page content, only how it's displayed and printed.",
        ],
      },
    ],
  },

  "pdf-unlock": {
    heading: "Everything you need to know about unlocking PDFs",
    sections: [
      {
        title: "What does \"unlocking\" a PDF actually mean?",
        paragraphs: [
          "PDFs can carry two different kinds of protection: an **open password** (required just to view the file at all) and **restrictions** (the file opens freely, but printing, copying, or editing is disabled — set with a separate owner password). This tool is for documents you own and whose password you know — enter it and we remove whichever protection it unlocks. We don't remove protection from a file without its correct password.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Removing a password you no longer need** on your own document, for easier day-to-day access.",
            "**Lifting print/copy restrictions** you set yourself on a file you have the rights to use freely.",
          ],
        },
      },
      {
        title: "Going the other direction",
        paragraphs: [
          "If you need to *add* protection instead — say, before sending a sensitive document — **Protect PDF** adds a password the recipient will need to open the file.",
        ],
      },
    ],
  },

  "pdf-protect": {
    heading: "Everything you need to know about password-protecting PDFs",
    sections: [
      {
        title: "What does password protection actually do?",
        paragraphs: [
          "Adding a password encrypts the PDF so it can't be opened at all without that password — appropriate when a document contains sensitive information (financial details, personal records, contracts) and you want to be sure only the intended recipient can read it, even if the file itself ends up somewhere it shouldn't.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Sending sensitive documents by email**, where the transport itself isn't guaranteed secure.",
            "**Sharing financial or personal records** that shouldn't be readable if the file is forwarded or misplaced.",
          ],
        },
      },
      {
        title: "Share the password separately",
        paragraphs: [
          "Send the password through a different channel than the file itself (a text message rather than the same email) — encrypting a file and then attaching the password in the same message defeats the purpose if that email is intercepted or forwarded as a whole.",
        ],
      },
    ],
  },

  "pdf-watermark": {
    heading: "Everything you need to know about PDF watermarks",
    sections: [
      {
        title: "What is a watermark for?",
        paragraphs: [
          "A watermark stamps text or an image across every page of a document — commonly used to mark a document as a draft, assert copyright or confidentiality, or brand a document with a logo before it's distributed.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Marking a document \"DRAFT\" or \"CONFIDENTIAL\"** before it's shared for review.",
            "**Branding a document** with a company logo before sending it externally.",
            "**Deterring unauthorized redistribution** of a document by making its source visibly traceable.",
          ],
        },
      },
      {
        title: "Keep it readable",
        paragraphs: [
          "A watermark set too dark or too large can make the underlying content hard to read — a lower opacity, diagonal placement is the common convention specifically because it stays visible without interfering with the actual text.",
        ],
      },
    ],
  },

  "pdf-page-numbers": {
    heading: "Everything you need to know about adding page numbers to PDFs",
    sections: [
      {
        title: "Why add page numbers after the fact?",
        paragraphs: [
          "Documents assembled from multiple sources — merged PDFs, scanned pages, or exports from software that doesn't number pages — often need numbering added afterward rather than relying on numbering baked into the original content.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Printed documents** that need page references for physical handling or citation.",
            "**Legal or contractual documents** where page numbers matter for referencing specific clauses.",
            "**Merged documents** where the original files had inconsistent or no numbering.",
          ],
        },
      },
      {
        title: "Starting number and position",
        paragraphs: [
          "You can start numbering from any number (useful if this document is a continuation of another) and choose where the number sits on the page — bottom center is the most common convention for readability.",
        ],
      },
    ],
  },

  "pdf-remove-pages": {
    heading: "Everything you need to know about removing PDF pages",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Deletes the specific pages you choose from a PDF, keeping everything else as a single document with the remaining pages renumbered in sequence.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Removing a blank or irrelevant page** a scanner picked up by mistake.",
            "**Cutting a section** you don't want to distribute, without needing to keep it as a separate file.",
          ],
        },
      },
      {
        title: "Remove vs. extract — opposite jobs",
        paragraphs: [
          "Remove Pages keeps everything *except* the pages you specify; **Extract PDF Pages** does the opposite — pulling out *only* the pages you specify into a new file, leaving the original untouched. Use whichever matches what you actually want to keep.",
        ],
      },
    ],
  },

  "pdf-extract-pages": {
    heading: "Everything you need to know about extracting PDF pages",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Pulls the specific pages you choose out of a PDF and saves them as a new, separate file — the original document is left completely untouched.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Sharing one section** of a large document without sending the whole thing.",
            "**Pulling a signed page** out of a longer contract for a standalone record.",
            "**Isolating a chapter** from a book or report for separate distribution.",
          ],
        },
      },
      {
        title: "Extract vs. remove — opposite jobs",
        paragraphs: [
          "Extract keeps *only* the pages you specify as a new file; **Remove PDF Pages** does the opposite — deleting the pages you specify and keeping everything else. Pick whichever matches what you actually want in the final result.",
        ],
      },
    ],
  },

  "pdf-metadata": {
    heading: "Everything you need to know about PDF metadata",
    sections: [
      {
        title: "What is PDF metadata?",
        paragraphs: [
          "Metadata is the information about a document that isn't part of its visible content — title, author, subject, and keywords, stored in the file itself and shown in a file's \"Properties\" panel or picked up by search tools and document management systems.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Correcting an inaccurate author or title** left over from the software that originally created the file.",
            "**Adding keywords** so a document is easier to find in a search-based document management system.",
            "**Removing identifying information** before sharing a document externally.",
          ],
        },
      },
      {
        title: "This doesn't touch the visible content",
        paragraphs: [
          "Editing metadata changes only this behind-the-scenes information — the actual pages, text, and formatting a reader sees remain completely unaffected.",
        ],
      },
    ],
  },

  "pdf-sign": {
    heading: "Everything you need to know about signing PDFs",
    sections: [
      {
        title: "What does adding a signature actually do?",
        paragraphs: [
          "This places a signature (typed or drawn) directly onto a page of the PDF, at the position you choose — a straightforward way to sign a document without printing, physically signing, and re-scanning it.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Signing a contract or agreement** sent to you as a PDF, without a printer on hand.",
            "**Approving a document quickly** where a full digital-signature platform would be overkill.",
          ],
        },
      },
      {
        title: "A note on what kind of \"signature\" this is",
        paragraphs: [
          "This adds a visual signature to the document — appropriate for everyday approvals and low-stakes agreements. For documents requiring a legally certified digital signature (with cryptographic verification and an audit trail), check whether your specific use case requires a dedicated e-signature platform instead.",
        ],
      },
    ],
  },

  "pdf-organize": {
    heading: "Everything you need to know about organizing PDF pages",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Lets you visually drag pages into a new order within a single PDF — no pages are added or removed, just rearranged, which makes this the right tool when the *sequence* is wrong rather than the *content*.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Fixing page order** after a merge or scan put pages in the wrong sequence.",
            "**Restructuring a document** — moving an appendix, reordering chapters — without touching the content itself.",
          ],
        },
      },
      {
        title: "Organize vs. merge vs. split",
        table: {
          headers: ["Tool", "What it changes"],
          rows: [
            ["Organize", "Page order within one file"],
            ["Merge", "Combines multiple files into one"],
            ["Split", "Breaks one file into several"],
          ],
        },
      },
    ],
  },

  // ─── Image ───────────────────────────────────────────────────────────────

  "image-resize": {
    heading: "Everything you need to know about resizing images",
    sections: [
      {
        title: "What does resizing actually change?",
        paragraphs: [
          "Resizing changes an image's pixel dimensions — its width and height — without necessarily changing its format or compression. This is different from compressing, which shrinks file size at the same dimensions by adjusting quality instead.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Meeting an exact size requirement** — a profile photo, a banner ad, a platform's upload spec.",
            "**Reducing file size by shrinking dimensions** for images that don't need to be shown at full resolution.",
            "**Preparing consistent thumbnails** across a set of images.",
          ],
        },
      },
      {
        title: "Understanding the \"fit\" options",
        table: {
          headers: ["Fit mode", "What it does"],
          rows: [
            ["Cover", "Fills the target size exactly, cropping any excess"],
            ["Contain", "Fits entirely within the target size, may add empty space"],
            ["Fill", "Stretches to the exact target size, may distort proportions"],
            ["Inside / Outside", "Shrinks or grows only, preserving the original aspect ratio"],
          ],
        },
      },
    ],
  },

  "image-crop": {
    heading: "Everything you need to know about cropping images",
    sections: [
      {
        title: "What does cropping do?",
        paragraphs: [
          "Cropping cuts an image down to a smaller rectangular region you define — removing everything outside that area permanently, rather than resizing or scaling the existing content.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Removing unwanted background** or edges from a photo.",
            "**Matching a specific aspect ratio** required by a platform (square for a profile photo, 16:9 for a thumbnail).",
            "**Focusing attention** on the relevant part of a wider photo.",
          ],
        },
      },
      {
        title: "Crop vs. resize — different jobs",
        paragraphs: [
          "Cropping removes part of the image; **Image Resizer** changes the dimensions of the whole image without cutting anything out. If you need both — a specific area at a specific size — crop first, then resize the result.",
        ],
      },
    ],
  },

  "image-rotate": {
    heading: "Everything you need to know about rotating images",
    sections: [
      {
        title: "Why does a photo end up sideways?",
        paragraphs: [
          "This is usually a camera orientation issue — a phone photo taken sideways sometimes displays correctly on the device that took it (thanks to orientation metadata) but sideways everywhere else, especially after the metadata is stripped or ignored by another platform.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Fixing a sideways or upside-down photo** before uploading it somewhere that ignores orientation metadata.",
            "**Straightening a scanned image** that went into the scanner at an angle.",
          ],
        },
      },
    ],
  },

  "svg-converter": {
    heading: "Everything you need to know about converting SVG files",
    sections: [
      {
        title: "Why convert an SVG to a raster format?",
        paragraphs: [
          "SVG is a vector format, understood by browsers and design tools but not by every platform — converting it to PNG, JPG, or WebP produces a fixed-resolution raster image that works anywhere an image is accepted, at the cost of losing the ability to scale infinitely without quality loss.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**A platform that doesn't accept SVG uploads** (many social platforms and older systems don't).",
            "**Embedding a logo or icon** somewhere that expects a standard image format.",
            "**Generating a specific pixel size** from a vector source for a favicon or app icon.",
          ],
        },
      },
      {
        title: "Choosing an output size",
        paragraphs: [
          "Since SVG has no fixed resolution, you choose the pixel width for the converted output — pick a size at least as large as the biggest place you'll display it, since (unlike the original SVG) the raster result won't scale up without losing quality.",
        ],
      },
    ],
  },

  "favicon-generator": {
    heading: "Everything you need to know about favicons",
    sections: [
      {
        title: "What is a favicon?",
        paragraphs: [
          "A favicon is the small icon shown in a browser tab, bookmark list, and (on mobile) when a site is added to a home screen. It needs to exist in several different sizes to look sharp across all those contexts, from a 16×16 tab icon up to a 512×512 app icon.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Launching a new website** — a missing favicon shows a generic blank-page icon in browser tabs.",
            "**Preparing for a home-screen icon** on mobile, which needs a larger, dedicated size.",
          ],
        },
      },
      {
        title: "Start with a square, simple image",
        paragraphs: [
          "A favicon is shown very small, so a simple, high-contrast square logo works far better than a detailed image — fine text or intricate detail disappears entirely at 16×16 pixels.",
        ],
      },
    ],
  },

  "image-to-base64": {
    heading: "Everything you need to know about Base64-encoding images",
    sections: [
      {
        title: "What does this actually do?",
        paragraphs: [
          "Base64 encoding turns an image's binary data into a plain text string that can be embedded directly inside HTML, CSS, or JSON — instead of linking to a separate image file, the image data itself lives inline in the code.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Embedding a small icon directly in CSS** as a `data:` URL, avoiding an extra network request.",
            "**Sending an image inside a JSON payload** to an API that expects text, not binary files.",
            "**Avoiding broken image links** in an email template, where inline images are more reliable than linked ones.",
          ],
        },
      },
      {
        title: "One tradeoff worth knowing",
        paragraphs: [
          "A Base64-encoded image is roughly 33% larger than the original binary file — fine for small icons, but not a good substitute for normal image hosting on larger photos, where the size increase and lack of caching outweigh the convenience.",
        ],
      },
    ],
  },

  "base64-to-image": {
    heading: "Everything you need to know about decoding Base64 to images",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Takes a Base64-encoded string — the kind embedded in HTML, CSS, or a JSON API response — and decodes it back into a normal, downloadable image file.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Extracting an image from an API response** that returned it as a Base64 string instead of a file.",
            "**Recovering an image embedded in code** (a `data:` URL in CSS or HTML) as an actual file you can open or share.",
          ],
        },
      },
      {
        title: "The reverse tool",
        paragraphs: [
          "If you're starting from an image file and need the Base64 string instead, **Image to Base64** does the opposite conversion.",
        ],
      },
    ],
  },

  "color-picker": {
    heading: "Everything you need to know about picking colors from images",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Samples the exact color at a specific pixel coordinate in an uploaded image and returns it as HEX, RGB, and HSL values — useful when you need to match a color from a photo, logo, or screenshot precisely, rather than eyeballing it.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Matching a brand color** from a logo image when you don't have the original design file.",
            "**Recreating a color scheme** from a photo or screenshot for a design project.",
            "**Getting an exact value** instead of guessing at a close-enough color.",
          ],
        },
      },
      {
        title: "Once you have the value",
        paragraphs: [
          "Use **HEX to RGB** or **RGB to HEX** to convert the sampled color between formats for whatever tool or codebase you're working in.",
        ],
      },
    ],
  },

  "hex-to-rgb": {
    heading: "Everything you need to know about HEX and RGB color codes",
    sections: [
      {
        title: "What's the difference between HEX and RGB?",
        paragraphs: [
          "Both describe the exact same color — they're just different notations. HEX (like `#7c3aed`) packs red, green, and blue values into a six-digit code; RGB (like `rgb(124, 58, 237)`) writes them out as three separate numbers from 0–255. Which one you need depends entirely on what you're writing code for — some contexts expect one format specifically.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Converting a design tool's color value** into the format your CSS or codebase expects.",
            "**Working with a color picked from an image** (via Color Picker) that came back in a format you need to convert.",
          ],
        },
      },
      {
        title: "Going the other direction",
        paragraphs: [
          "Need to convert RGB back to HEX instead? **RGB to HEX** does the reverse.",
        ],
      },
    ],
  },

  "rgb-to-hex": {
    heading: "Everything you need to know about RGB and HEX color codes",
    sections: [
      {
        title: "What's the difference between RGB and HEX?",
        paragraphs: [
          "Both describe the exact same color in different notations. RGB (like `rgb(124, 58, 237)`) writes out red, green, and blue as three separate 0–255 numbers; HEX (like `#7c3aed`) packs the same three values into a compact six-digit code. Which one you need depends on what you're writing code for.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Converting a color from a design spec or codebase** that uses RGB into the HEX format CSS most commonly uses.",
            "**Standardizing color values** across a project that mixes both notations.",
          ],
        },
      },
      {
        title: "Going the other direction",
        paragraphs: [
          "Need to convert HEX back to RGB instead? **HEX to RGB** does the reverse.",
        ],
      },
    ],
  },

  "image-metadata": {
    heading: "Everything you need to know about image metadata (EXIF)",
    sections: [
      {
        title: "What is EXIF metadata?",
        paragraphs: [
          "Most photos — especially from phones and digital cameras — carry hidden EXIF metadata: camera model, exposure settings, timestamp, and often the exact GPS coordinates of where the photo was taken. None of this is visible when you look at the image; it's embedded in the file itself.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Checking what a photo reveals** before sharing it publicly — GPS data in particular can expose a home address.",
            "**Verifying when and how a photo was taken**, for organizing an archive or checking authenticity.",
          ],
        },
      },
      {
        title: "Found something you don't want to share?",
        paragraphs: [
          "**Remove Image Metadata** strips this information out entirely, producing a copy of the image with no embedded EXIF data.",
        ],
      },
    ],
  },

  "image-metadata-remove": {
    heading: "Everything you need to know about removing image metadata",
    sections: [
      {
        title: "Why strip metadata before sharing a photo?",
        paragraphs: [
          "A photo's EXIF metadata can include the exact GPS coordinates of where it was taken, the camera model, and a timestamp — information most people don't intend to share publicly when they post a photo, but which stays embedded in the file unless it's explicitly removed.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Posting a photo publicly** without revealing where it was taken.",
            "**Sharing images professionally** where camera/device metadata isn't relevant to include.",
            "**General privacy hygiene** before uploading personal photos anywhere.",
          ],
        },
      },
      {
        title: "Check first, if you're curious",
        paragraphs: [
          "**Image Metadata Viewer** shows exactly what's embedded in a photo before you decide to strip it — useful if you want to see what you're actually removing.",
        ],
      },
    ],
  },

  "barcode-generator": {
    heading: "Everything you need to know about barcodes",
    sections: [
      {
        title: "What is a barcode?",
        paragraphs: [
          "A barcode encodes data — almost always a numeric product code — as a pattern of parallel lines of varying widths, readable by a laser or camera scanner. Unlike a QR code, a traditional barcode is one-dimensional and holds relatively little data, which is exactly enough for its main job: identifying a product.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Labeling products for retail** with a standard EAN-13 or UPC code.",
            "**Internal inventory tracking** using Code 128 or another format your warehouse system reads.",
          ],
        },
      },
      {
        title: "Barcode vs. QR code",
        paragraphs: [
          "A barcode holds a small amount of data (typically just a product number) in one dimension; a **QR code** holds dramatically more data (a full URL, WiFi credentials, a contact card) in two dimensions. Use a barcode specifically when you need a standard retail/inventory format like EAN-13, UPC, or Code 128 — use **QR Code Generator** for anything else.",
        ],
      },
    ],
  },

  // ─── Audio ───────────────────────────────────────────────────────────────

  "audio-converter": {
    heading: "Everything you need to know about audio formats",
    sections: [
      {
        title: "Why do audio formats even differ?",
        paragraphs: [
          "Audio formats trade off file size, quality, and compatibility differently. MP3 is universally supported and small but lossy (some audio detail is discarded); WAV is uncompressed and lossless but large; FLAC is lossless *and* compressed, a middle ground popular with audiophiles; OGG is an open, efficient lossy format used mainly in specific software and games.",
        ],
      },
      {
        title: "Which format should you use?",
        table: {
          headers: ["Format", "Best for"],
          rows: [
            ["MP3", "General use — maximum compatibility, small files"],
            ["WAV", "Editing/production work, where quality loss at each step compounds"],
            ["FLAC", "Archiving music losslessly at a smaller size than WAV"],
            ["OGG", "Software or games that specifically expect it"],
          ],
        },
      },
    ],
  },

  "audio-watermark": {
    heading: "Everything you need to know about audio watermarking",
    sections: [
      {
        title: "What does watermarking audio actually do?",
        paragraphs: [
          "This mixes a short audio clip — a spoken tag, a tone, a brand mention — into your main track at a set volume, so preview or demo versions of your audio carry an audible mark that discourages unauthorized use of the full-quality file.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Sharing preview tracks** with clients before a purchase or licensing agreement is finalized.",
            "**Protecting sample packs or stock audio** from being used before it's actually licensed.",
          ],
        },
      },
      {
        title: "Getting the volume right",
        paragraphs: [
          "Set the watermark volume high enough to be clearly audible throughout the track (defeating its purpose if it's too quiet), but not so loud it makes the preview unpleasant to actually listen to — somewhere in the middle is the usual target.",
        ],
      },
    ],
  },

  // ─── Design ──────────────────────────────────────────────────────────────

  "color-palette": {
    heading: "Everything you need to know about color palettes",
    sections: [
      {
        title: "What makes a color palette \"work\"?",
        paragraphs: [
          "A good palette isn't a random set of colors you like — it's built around relationships: a primary color, one or two accents that complement it, and enough neutral tones (grays, off-whites) to give the design room to breathe. Generating a palette from a single base color keeps those relationships mathematically consistent instead of guessing.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Starting a new design or brand** without existing color guidelines.",
            "**Finding colors that complement an existing brand color** for a new section or campaign.",
            "**Breaking out of a color rut** when everything you pick manually starts looking the same.",
          ],
        },
      },
      {
        title: "Once you have a palette",
        paragraphs: [
          "Grab exact values with **HEX to RGB** for whatever format your CSS or design tool needs, and use **Gradient Generator** to build smooth transitions between two of your chosen colors.",
        ],
      },
    ],
  },

  "gradient-generator": {
    heading: "Everything you need to know about CSS gradients",
    sections: [
      {
        title: "What is a CSS gradient?",
        paragraphs: [
          "A gradient blends two or more colors smoothly across an element's background, without needing an image file — defined entirely in CSS, so it scales perfectly at any size and loads instantly.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Backgrounds and hero sections** that need visual depth without a heavy image file.",
            "**Buttons and cards** with a subtle color transition instead of a flat fill.",
            "**Overlays on top of photos**, to improve text readability without a solid block of color.",
          ],
        },
      },
      {
        title: "Linear vs. radial",
        paragraphs: [
          "A linear gradient blends colors along a straight line at an angle you choose; a radial gradient blends outward from a center point. Linear is the far more common default for backgrounds and buttons; radial suits spotlight or glow-style effects.",
        ],
      },
    ],
  },

  "box-shadow": {
    heading: "Everything you need to know about CSS box shadows",
    sections: [
      {
        title: "What does box-shadow actually control?",
        paragraphs: [
          "A CSS box-shadow adds a shadow effect around an element's edges, controlled by horizontal/vertical offset, blur radius, spread, and color — the combination that gives an element the appearance of floating above the page, or being pressed into it.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Cards and modals** that need visual separation from the background.",
            "**Buttons** with a subtle depth effect on hover or press.",
            "**Focus states** for accessibility, drawing the eye to the active element.",
          ],
        },
      },
      {
        title: "Subtlety usually wins",
        paragraphs: [
          "A large, dark shadow reads as heavy-handed in most modern interfaces — a small offset with a soft blur and low opacity is the far more common look in current design systems.",
        ],
      },
    ],
  },

  "button-generator": {
    heading: "Everything you need to know about CSS buttons",
    sections: [
      {
        title: "Why not just wing it by hand?",
        paragraphs: [
          "A polished button is more than a background color — padding, border-radius, hover/active states, and sometimes a shadow all need to work together consistently. Designing it visually and exporting the CSS is faster and more consistent than adjusting raw values by trial and error.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Prototyping a design system's button styles** before committing to code.",
            "**Getting a hover/active state that feels right** without guessing at CSS values repeatedly.",
          ],
        },
      },
      {
        title: "Don't forget the states",
        paragraphs: [
          "A button that only looks good in its default state is incomplete — hover, active (pressed), and disabled states all matter for a button that feels responsive to use, not just good in a static screenshot.",
        ],
      },
    ],
  },

  "animation-generator": {
    heading: "Everything you need to know about CSS animations",
    sections: [
      {
        title: "What is a CSS @keyframe animation?",
        paragraphs: [
          "@keyframes define how an element's styles change over the course of an animation — its position, opacity, size, or rotation at different points in time — letting the browser handle the smooth transition between those points without any JavaScript.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Loading spinners and skeleton states**, giving visual feedback while content loads.",
            "**Attention-drawing micro-interactions** — a subtle pulse, bounce, or fade on an important element.",
            "**Page transition effects** as content enters or leaves the viewport.",
          ],
        },
      },
      {
        title: "Less is usually more",
        paragraphs: [
          "Fast, subtle animations (a couple hundred milliseconds) generally feel more polished than long, elaborate ones — an animation that draws attention to itself rather than to the content it's supporting has usually gone too far.",
        ],
      },
    ],
  },

  "grid-generator": {
    heading: "Everything you need to know about CSS Grid",
    sections: [
      {
        title: "What is CSS Grid for?",
        paragraphs: [
          "CSS Grid lays out elements in rows and columns simultaneously — the right tool when a layout needs true two-dimensional structure (a photo gallery, a dashboard, a page layout with a header/sidebar/content area), as opposed to a single row or column of items.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Page layouts** with a header, sidebar, and main content area.",
            "**Image or card galleries** that need consistent rows and columns.",
            "**Dashboard layouts** with multiple independent panels.",
          ],
        },
      },
      {
        title: "Grid vs. Flexbox",
        paragraphs: [
          "Grid handles two-dimensional layouts (rows *and* columns together); **Flexbox Generator** handles one-dimensional layouts (a single row or column that needs to distribute space among its items). Many real layouts use both — Grid for the overall page structure, Flexbox for aligning items within one section of it.",
        ],
      },
    ],
  },

  "flexbox-generator": {
    heading: "Everything you need to know about Flexbox",
    sections: [
      {
        title: "What is Flexbox for?",
        paragraphs: [
          "Flexbox arranges items along a single row or column and distributes space between them — the right tool for aligning a navbar's links, centering content, or spacing out a row of buttons, where CSS Grid's two-dimensional layout would be more than you need.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Navigation bars**, spacing links evenly or pushing some to one side.",
            "**Centering content** vertically and horizontally without the old hacks that used to require.",
            "**Equal-width columns** that need to resize proportionally with the container.",
          ],
        },
      },
      {
        title: "Flexbox vs. Grid",
        paragraphs: [
          "Flexbox handles one-dimensional layouts (a single row or column); **Grid Generator** handles two-dimensional layouts (rows *and* columns together). If you're laying out an entire page structure, Grid is usually the better starting point; for aligning items within one section, Flexbox is usually simpler.",
        ],
      },
    ],
  },

  "svg-blob-generator": {
    heading: "Everything you need to know about SVG blob shapes",
    sections: [
      {
        title: "What is an SVG blob?",
        paragraphs: [
          "A blob is an organic, irregular shape — the soft, rounded background shapes common in modern web design, generated as scalable vector art rather than a fixed-size image, so it stays crisp at any size and loads instantly.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Decorative background shapes** behind hero sections or feature cards.",
            "**Softening a rigid, boxy layout** with an organic visual accent.",
            "**Avatar or image frames** with a non-standard, blob-shaped mask.",
          ],
        },
      },
      {
        title: "Randomize until one looks right",
        paragraphs: [
          "There's no \"correct\" blob shape — generating a few random variations and picking the one that fits your layout is the normal workflow, since the appeal is in the organic irregularity itself.",
        ],
      },
    ],
  },

  // ─── SEO ─────────────────────────────────────────────────────────────────

  "og-generator": {
    heading: "Everything you need to know about Open Graph tags",
    sections: [
      {
        title: "What are Open Graph tags?",
        paragraphs: [
          "Open Graph tags are meta tags (originally created by Facebook, now used across most social platforms) that control how a link looks when it's shared — the preview image, title, and description shown in the post, instead of whatever a platform guesses by scraping the page.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Every page you expect to be shared on social media** — without these tags, shares often show a broken or irrelevant preview.",
            "**Controlling the exact preview image**, rather than letting a platform pick the first image it finds on the page.",
          ],
        },
      },
      {
        title: "OG tags vs. Twitter Card tags",
        paragraphs: [
          "Most platforms (Facebook, LinkedIn, WhatsApp) read Open Graph tags directly; X/Twitter has its own separate **Twitter Card** tags, which fall back to Open Graph values if present but support a few Twitter-specific options — most sites include both.",
        ],
      },
    ],
  },

  "twitter-card": {
    heading: "Everything you need to know about Twitter Card tags",
    sections: [
      {
        title: "What is a Twitter Card?",
        paragraphs: [
          "A Twitter Card is the rich preview (image, title, description) X/Twitter shows when a link is posted, controlled by a specific set of meta tags separate from — but similar to — Open Graph tags used by other platforms.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Any page likely to be shared on X/Twitter**, to control exactly what preview shows up.",
            "**Choosing between a summary card** (small thumbnail) **and a large-image card**, depending on how visual the content is.",
          ],
        },
      },
      {
        title: "Twitter Card vs. Open Graph",
        paragraphs: [
          "X/Twitter will fall back to your **Open Graph** tags if dedicated Twitter Card tags aren't present, but adding both gives you explicit control over each platform's preview independently rather than relying on a fallback.",
        ],
      },
    ],
  },

  "canonical-url": {
    heading: "Everything you need to know about canonical URLs",
    sections: [
      {
        title: "What does a canonical tag do?",
        paragraphs: [
          "A canonical tag tells search engines which URL is the \"real\" one to index, when the same or very similar content is reachable at more than one address — common with URL parameters, http vs. https, www vs. non-www, or duplicate content across categories.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Product pages reachable via multiple URLs** (different filter/sort parameters showing the same items).",
            "**Content syndicated elsewhere**, pointing back to the original as the canonical source.",
            "**Preventing duplicate-content dilution** across near-identical pages.",
          ],
        },
      },
      {
        title: "Get it right — a wrong canonical actively hurts",
        paragraphs: [
          "A canonical tag pointing at the wrong URL tells search engines to ignore the page you're trying to rank in favor of a different one — double-check it points at the actual intended page, not a stale or unrelated URL left over from a template.",
        ],
      },
    ],
  },

  "schema-generator": {
    heading: "Everything you need to know about schema markup",
    sections: [
      {
        title: "What is schema markup?",
        paragraphs: [
          "Schema markup (usually written as JSON-LD) is structured data that tells search engines what a page actually *is* — an article, a product, a recipe, an FAQ — in a machine-readable format, which is what makes a search engine eligible to show a rich result (star ratings, an FAQ dropdown, a recipe card) instead of a plain blue link.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Product pages**, to potentially show price and rating directly in search results.",
            "**FAQ sections**, to potentially show an expandable Q&A directly in results.",
            "**Articles and recipes**, which have their own dedicated rich-result formats.",
          ],
        },
      },
      {
        title: "Eligible, not guaranteed",
        paragraphs: [
          "Correct schema markup makes a page *eligible* for a rich result — it doesn't guarantee Google will actually show one. It's also important the markup accurately reflects the page's visible content; marking up an FAQ that isn't actually shown on the page violates Google's guidelines.",
        ],
      },
    ],
  },

  "hreflang-generator": {
    heading: "Everything you need to know about hreflang tags",
    sections: [
      {
        title: "What does hreflang do?",
        paragraphs: [
          "hreflang tags tell search engines which language and regional version of a page to show to which searchers — so a French visitor gets pointed to your French page and a US visitor to your English one, instead of search engines guessing (or showing the wrong version to the wrong audience).",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Any site with multiple language versions** of the same content.",
            "**Regional variants of the same language** — US vs. UK English, for example, with different spelling or pricing.",
          ],
        },
      },
      {
        title: "Every version needs to reference every version",
        paragraphs: [
          "Each language variant's hreflang tags need to list all the other variants, including itself — a common mistake is only linking one direction, which search engines may not honor correctly.",
        ],
      },
    ],
  },

  "http-header-checker": {
    heading: "Everything you need to know about HTTP headers",
    sections: [
      {
        title: "What are HTTP headers?",
        paragraphs: [
          "HTTP headers are metadata sent alongside a page's actual content — status codes, caching rules, security policies, server information — invisible in the browser itself but important for debugging performance, security, and SEO issues.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Debugging unexpected caching behavior** — a page not updating after a deploy is often a caching header issue.",
            "**Checking security headers** are actually being sent (HSTS, Content-Security-Policy, etc.).",
            "**Confirming a redirect or status code** is what you expect it to be.",
          ],
        },
      },
      {
        title: "Related check: redirects specifically",
        paragraphs: [
          "If the specific thing you're debugging is a redirect chain rather than headers generally, **Redirect Checker** traces the full hop-by-hop path a URL takes.",
        ],
      },
    ],
  },

  "redirect-checker": {
    heading: "Everything you need to know about redirect chains",
    sections: [
      {
        title: "What is a redirect chain?",
        paragraphs: [
          "When a URL redirects to another URL, which redirects to yet another, that's a redirect chain — each hop adds latency, and a long chain can confuse both users and search engines about which URL is actually the final destination.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Auditing old links** after a site migration to make sure they resolve correctly, not through a long chain.",
            "**Debugging a slow-loading page** that might be hopping through multiple redirects before landing.",
            "**Verifying a 301 vs. 302 redirect** is actually the type you intended (301 for permanent, 302 for temporary).",
          ],
        },
      },
      {
        title: "Why chains matter for SEO",
        paragraphs: [
          "Each redirect hop dilutes link equity slightly and adds load time — a direct A→B redirect is always preferable to A→B→C→D, which is worth cleaning up whenever it's found.",
        ],
      },
    ],
  },

  "keyword-density": {
    heading: "Everything you need to know about keyword density",
    sections: [
      {
        title: "What is keyword density, really?",
        paragraphs: [
          "Keyword density is simply how often a word or phrase appears relative to the total word count of a page. It was a much bigger ranking factor in early search engines than it is today — modern search engines focus far more on topical relevance and natural language than on hitting a specific keyword percentage.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Sanity-checking a draft** isn't accidentally over-repeating a phrase to the point of reading unnaturally (keyword stuffing).",
            "**Spotting an underused target keyword** that should probably appear a bit more given the topic.",
          ],
        },
      },
      {
        title: "There's no magic percentage",
        paragraphs: [
          "Don't chase a specific keyword density target — write naturally for the reader first, and use this as a sanity check rather than a goal to hit. Modern search engines penalize obvious keyword stuffing more than they reward density.",
        ],
      },
    ],
  },

  "word-counter": {
    heading: "Everything you need to know about word counting",
    sections: [
      {
        title: "What does this actually measure?",
        paragraphs: [
          "Beyond a simple word count, this also tracks characters, sentences, and estimated reading time — useful context whether you're hitting a strict word limit or just gauging how long a piece will take someone to read.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Meeting a word count requirement** — an essay, a job application, a content brief.",
            "**Estimating reading time** for a blog post or article before publishing.",
            "**Checking a meta description or title length** against character limits (see Meta Tag Generator's guidance on that).",
          ],
        },
      },
    ],
  },

  "html-encode": {
    heading: "Everything you need to know about HTML entity encoding",
    sections: [
      {
        title: "What does HTML encoding solve?",
        paragraphs: [
          "Certain characters (`<`, `>`, `&`, quotes) have special meaning in HTML — typing them directly into content can break the page's markup or, worse, accidentally introduce a security vulnerability. Encoding converts them into safe entity codes (`&lt;`, `&amp;`, etc.) that display correctly without being interpreted as markup.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Displaying code snippets or markup examples** on a web page without them being rendered as actual HTML.",
            "**Safely inserting user-generated content** that might contain special characters.",
          ],
        },
      },
      {
        title: "Decoding works the other way",
        paragraphs: [
          "This tool also decodes — turning entity codes back into their original characters — useful when you've received HTML-encoded text and need to read or process the real content.",
        ],
      },
    ],
  },

  // ─── Writing ─────────────────────────────────────────────────────────────

  "case-converter": {
    heading: "Everything you need to know about text case conversion",
    sections: [
      {
        title: "What does this actually do?",
        paragraphs: [
          "Converts text between UPPERCASE, lowercase, Title Case, camelCase, and other casing conventions — a small but surprisingly common need whenever text needs to match a specific style convention it wasn't originally written in.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Matching a coding convention** — camelCase for JavaScript variables, snake_case for Python.",
            "**Fixing text pasted from somewhere with the wrong casing** — a heading in all caps that needs to become Title Case.",
            "**Formatting a list consistently** after combining text from multiple sources.",
          ],
        },
      },
    ],
  },

  "remove-duplicates": {
    heading: "Everything you need to know about removing duplicate lines",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Scans a block of text line by line and removes any exact duplicates, keeping only the first occurrence of each — a quick fix for lists that have accumulated repeats from being combined or edited over time.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Cleaning a combined list** — merging two spreadsheets' worth of email addresses or names that overlap.",
            "**Deduplicating a list of URLs or keywords** before further processing.",
          ],
        },
      },
    ],
  },

  "remove-spaces": {
    heading: "Everything you need to know about cleaning up whitespace",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Strips extra spaces, tabs, and blank lines from text — common after copying content from a PDF or another application, which often introduces inconsistent whitespace that's tedious to clean up by hand.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Cleaning text copied from a PDF**, which often adds irregular spacing.",
            "**Tidying up code or data** before importing it somewhere that's sensitive to extra whitespace.",
          ],
        },
      },
    ],
  },

  "sort-text": {
    heading: "Everything you need to know about sorting text alphabetically",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Sorts the lines of a block of text alphabetically, A–Z or Z–A — a quick way to organize a list without opening a spreadsheet just for a sort operation.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Alphabetizing a list of names** for a directory or reference document.",
            "**Organizing keywords or tags** for easier scanning.",
          ],
        },
      },
    ],
  },

  "reverse-text": {
    heading: "Everything you need to know about reversing text",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Reverses text, word order, or line order — flipping the character sequence of a string, the order of words in a sentence, or the order of lines in a list, depending on what you need.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Checking a palindrome** or working with reversed-text puzzles.",
            "**Reversing line order** in a log file or list that's sorted the wrong way for what you need.",
          ],
        },
      },
    ],
  },

  "username-generator": {
    heading: "Everything you need to know about generating usernames",
    sections: [
      {
        title: "What makes a good generated username?",
        paragraphs: [
          "A good username is available (not already taken on the platform you need it for), memorable enough to be usable, and — depending on the context — doesn't reveal identifying personal information the way a real name or birth year often does.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Signing up for a new account** quickly without agonizing over a name.",
            "**Creating a pseudonymous identity** for privacy on a platform where you don't want to use your real name.",
            "**Generating test accounts** for development or QA work.",
          ],
        },
      },
    ],
  },

  "slug-generator": {
    heading: "Everything you need to know about URL slugs",
    sections: [
      {
        title: "What is a URL slug?",
        paragraphs: [
          "A slug is the URL-friendly version of a title or phrase — lowercase, hyphens instead of spaces, no special characters — the part of a URL that comes after the domain, like `/how-to-compress-a-pdf` for a blog post titled \"How to Compress a PDF.\"",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Publishing a blog post or page** and needing a clean, readable URL instead of one with spaces or special characters.",
            "**Standardizing URLs** across a site that's had inconsistent slug formatting.",
          ],
        },
      },
      {
        title: "Why slugs matter for SEO",
        paragraphs: [
          "A clean, descriptive slug is both more readable for humans sharing a link and a minor positive signal for search engines, compared to a URL full of encoded spaces or random IDs.",
        ],
      },
    ],
  },

  "word-to-html": {
    heading: "Everything you need to know about converting Word to HTML",
    sections: [
      {
        title: "What does this actually do?",
        paragraphs: [
          "Converts a Word document's content into clean HTML markup — extracting headings, paragraphs, lists, and formatting into web-ready tags, instead of the bloated, editor-specific markup Word itself produces when you try to paste content directly.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Publishing Word-authored content to a website or CMS** without carrying over Word's messy inline styles.",
            "**Reusing a document's content in an email template or blog post** that expects standard HTML.",
          ],
        },
      },
      {
        title: "Why not just copy-paste from Word?",
        paragraphs: [
          "Pasting directly from Word into most web editors drags along a huge amount of hidden, editor-specific markup — converting first produces much cleaner, more predictable HTML.",
        ],
      },
    ],
  },

  "resume-builder": {
    heading: "Everything you need to know about building a resume",
    sections: [
      {
        title: "What makes a resume effective?",
        paragraphs: [
          "A resume that gets read (by a human or an applicant tracking system) is scannable — clear section headings, consistent formatting, and specific, quantified achievements rather than vague responsibility descriptions. Structure matters as much as content.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Applying for a job** and needing a clean, professional layout without formatting fights in Word.",
            "**Updating an outdated resume** with current formatting conventions.",
          ],
        },
      },
      {
        title: "One tip that consistently helps",
        paragraphs: [
          "Quantify achievements where possible — \"increased signups 30%\" reads far stronger than \"responsible for marketing,\" and gives an interviewer something concrete to ask about.",
        ],
      },
    ],
  },

  "contract-builder": {
    heading: "Everything you need to know about contract templates",
    sections: [
      {
        title: "What this tool actually provides",
        paragraphs: [
          "A starting template for common agreement types (NDAs, freelance contracts, and similar) with the standard clauses those documents typically include — a faster starting point than writing one from scratch, not a substitute for legal review on anything high-stakes.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Starting a freelance engagement** and needing a basic agreement quickly.",
            "**Sharing confidential information** and needing an NDA in place first.",
          ],
        },
      },
      {
        title: "A necessary caveat",
        paragraphs: [
          "Contract law varies by jurisdiction and situation — treat a generated template as a starting draft, and have an actual lawyer review anything involving significant money, IP, or legal risk before it's signed.",
        ],
      },
    ],
  },

  // ─── Calculators ─────────────────────────────────────────────────────────

  "bmi-calculator": {
    heading: "Everything you need to know about BMI",
    sections: [
      {
        title: "What is BMI?",
        paragraphs: [
          "Body Mass Index is weight divided by height squared — a quick, widely-used screening number that places you into a general category (underweight, normal, overweight, obese) based on population statistics.",
        ],
      },
      {
        title: "What BMI doesn't account for",
        paragraphs: [
          "BMI doesn't distinguish muscle from fat, so a very muscular person can show a \"high\" BMI despite low body fat, and it doesn't account for age, sex, or body composition. It's a useful general screening tool, not a diagnosis — talk to a healthcare provider for a fuller picture of your health, especially if your result surprises you.",
        ],
      },
    ],
  },

  "age-calculator": {
    heading: "Everything you need to know about calculating exact age",
    sections: [
      {
        title: "What does this actually calculate?",
        paragraphs: [
          "Calculates the precise time elapsed between a birth date and today (or any target date) — down to the exact years, months, and days, accounting correctly for varying month lengths and leap years, which manual date math easily gets wrong.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Verifying eligibility** for something with a precise age requirement.",
            "**Calculating age as of a specific past or future date**, not just today.",
          ],
        },
      },
    ],
  },

  "loan-calculator": {
    heading: "Everything you need to know about loan and EMI calculations",
    sections: [
      {
        title: "What does an EMI calculation actually show?",
        paragraphs: [
          "EMI (Equated Monthly Installment) is the fixed monthly payment on a loan, calculated from the principal, interest rate, and term — this calculator also breaks out the total interest you'll pay over the life of the loan, which is often far larger than people expect on longer terms.",
        ],
      },
      {
        title: "Why the interest rate matters more than it looks like it should",
        paragraphs: [
          "A small difference in interest rate compounds significantly over a multi-year loan term — comparing the total interest figure (not just the monthly payment) across different rate or term scenarios usually reveals a bigger gap than the headline rate difference suggests.",
        ],
      },
      {
        title: "Related calculation",
        paragraphs: [
          "For a home loan specifically, **Mortgage Calculator** covers the same math with mortgage-specific context.",
        ],
      },
    ],
  },

  "mortgage-calculator": {
    heading: "Everything you need to know about mortgage calculations",
    sections: [
      {
        title: "What does this calculate?",
        paragraphs: [
          "Estimates your monthly mortgage payment and total interest paid over the loan's life, based on the home price, down payment, interest rate, and term — the core numbers behind deciding what you can actually afford.",
        ],
      },
      {
        title: "What this doesn't include",
        paragraphs: [
          "This covers principal and interest — actual monthly housing costs typically also include property tax, homeowners insurance, and sometimes mortgage insurance or HOA fees, which can add a meaningful amount on top of the base payment shown here.",
        ],
      },
      {
        title: "A general loan calculation",
        paragraphs: [
          "For loan math outside the mortgage context specifically, **Loan / EMI Calculator** covers the same underlying formula.",
        ],
      },
    ],
  },

  "gst-calculator": {
    heading: "Everything you need to know about GST and VAT calculations",
    sections: [
      {
        title: "Inclusive vs. exclusive — the distinction that trips people up",
        paragraphs: [
          "A tax-inclusive price already has GST/VAT built into the total; a tax-exclusive price has it added on top. Getting this backwards is the single most common mistake — always check which direction you actually need before reading the result.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Pricing a product or service**, deciding whether to quote inclusive or exclusive of tax.",
            "**Reverse-calculating the tax amount** from a total price that already includes it.",
          ],
        },
      },
      {
        title: "Rates vary — check your local requirement",
        paragraphs: [
          "GST/VAT rates and rules differ significantly by country and sometimes by product category — this calculator handles the math once you know your applicable rate, not the rate itself.",
        ],
      },
    ],
  },

  "profit-calculator": {
    heading: "Everything you need to know about profit margin",
    sections: [
      {
        title: "Margin vs. markup — a common mix-up",
        paragraphs: [
          "Margin is profit as a percentage of the *selling price*; markup is profit as a percentage of the *cost*. The same numbers produce different percentages depending on which one you calculate — a 50% markup is not the same as a 50% margin, which trips up pricing decisions more often than you'd expect.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Setting a price** that hits a target margin, working backward from cost.",
            "**Comparing profitability** across products with different cost structures.",
          ],
        },
      },
    ],
  },

  "percentage-calculator": {
    heading: "Everything you need to know about percentage calculations",
    sections: [
      {
        title: "The three percentage questions people actually ask",
        list: {
          items: [
            "**What is X% of Y?** — e.g., what's 15% of $80.",
            "**X is what percent of Y?** — e.g., 12 out of 80 is what percent.",
            "**Percentage increase/decrease** — e.g., a price that went from $80 to $92, what's the percent change.",
          ],
        },
      },
      {
        title: "Why this comes up so often",
        paragraphs: [
          "Discounts, tips, tax, growth rates, and grade calculations all reduce to one of the three questions above — having a quick calculator for all three avoids re-deriving the formula each time.",
        ],
      },
    ],
  },

  "currency-converter": {
    heading: "Everything you need to know about currency conversion",
    sections: [
      {
        title: "What rates does this use?",
        paragraphs: [
          "Converts between major currencies using daily reference exchange rates from the European Central Bank — the same kind of reference rate financial institutions use as a baseline, updated once a day rather than fluctuating tick-by-tick like live trading rates.",
        ],
      },
      {
        title: "A note on real-world exchange rates",
        paragraphs: [
          "The rate you get here is a reference midpoint — an actual bank, card network, or currency exchange will apply their own margin on top, so the amount you actually receive or pay when exchanging money in practice will differ slightly from this calculation.",
        ],
      },
    ],
  },

  "timezone-calculator": {
    heading: "Everything you need to know about time zone conversion",
    sections: [
      {
        title: "Why this is trickier than it looks",
        paragraphs: [
          "Time zone offsets aren't fixed — daylight saving time shifts many (not all) regions by an hour for part of the year, and not every country observes it, or observes it on the same dates. A conversion that's correct in July can be wrong in January for the same two cities.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Scheduling a meeting** across time zones without a manual offset error.",
            "**Coordinating with a remote team or client** in a different region.",
          ],
        },
      },
    ],
  },

  "pregnancy-calculator": {
    heading: "Everything you need to know about pregnancy due date calculations",
    sections: [
      {
        title: "How a due date is typically estimated",
        paragraphs: [
          "The most common method estimates a due date as 40 weeks from the first day of the last menstrual period — a standard convention used as a starting estimate, not a guarantee, since only a small percentage of births happen exactly on the calculated date.",
        ],
      },
      {
        title: "An important note",
        paragraphs: [
          "This tool provides a general estimate for informational purposes — it isn't a substitute for guidance from a doctor or midwife, who can refine timing using an ultrasound and your specific medical history.",
        ],
      },
    ],
  },

  "calorie-calculator": {
    heading: "Everything you need to know about daily calorie needs",
    sections: [
      {
        title: "How daily calorie needs are estimated",
        paragraphs: [
          "This starts from your Basal Metabolic Rate (the energy your body uses at complete rest) and adjusts it based on your activity level, since someone doing manual labor or intense exercise burns significantly more than someone with a sedentary desk job at the exact same age, weight, and height.",
        ],
      },
      {
        title: "An important note",
        paragraphs: [
          "This gives a general estimate based on standard formulas — individual metabolism varies, and anyone with specific health or weight-management goals should treat this as a starting reference point, not medical guidance.",
        ],
      },
      {
        title: "Related calculation",
        paragraphs: [
          "For just the base metabolic number this builds on, **BMR Calculator** covers that specifically.",
        ],
      },
    ],
  },

  "bmr-calculator": {
    heading: "Everything you need to know about BMR",
    sections: [
      {
        title: "What is BMR?",
        paragraphs: [
          "Basal Metabolic Rate is the number of calories your body burns at complete rest just to maintain basic functions — breathing, circulation, cell repair — before accounting for any activity at all.",
        ],
      },
      {
        title: "An important note",
        paragraphs: [
          "BMR is estimated from standard formulas based on age, sex, height, and weight — actual metabolism varies by individual, so treat this as a reference point rather than a precise measurement.",
        ],
      },
      {
        title: "Related calculation",
        paragraphs: [
          "To see your estimated *total* daily calorie need (BMR adjusted for activity level), use **Calorie Calculator**.",
        ],
      },
    ],
  },

  "fuel-calculator": {
    heading: "Everything you need to know about fuel cost calculations",
    sections: [
      {
        title: "What does this calculate?",
        paragraphs: [
          "Estimates the total fuel cost and consumption for a trip, based on distance, your vehicle's fuel efficiency, and the current fuel price — useful for budgeting a road trip or comparing the running cost of different vehicles.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Budgeting a road trip** before you leave.",
            "**Comparing running costs** between two vehicles with different fuel efficiency.",
          ],
        },
      },
    ],
  },

  "roi-calculator": {
    heading: "Everything you need to know about ROI",
    sections: [
      {
        title: "What does ROI actually measure?",
        paragraphs: [
          "Return on Investment expresses the profit from an investment as a percentage of what it cost — a standardized way to compare the profitability of different projects or campaigns, even when their absolute cost and return numbers are very different in scale.",
        ],
      },
      {
        title: "What ROI doesn't tell you",
        paragraphs: [
          "ROI alone doesn't account for *when* the return happened — a 20% return over one month is very different from a 20% return over three years, even though the ROI figure looks identical. Factor in the time period when comparing two ROI figures.",
        ],
      },
    ],
  },

  "mrr-calculator": {
    heading: "Everything you need to know about SaaS MRR",
    sections: [
      {
        title: "What is MRR?",
        paragraphs: [
          "Monthly Recurring Revenue normalizes all your subscription revenue — monthly, annual, or otherwise billed — into a consistent monthly figure, which is the standard way SaaS businesses track predictable revenue and growth over time.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Tracking growth month over month** in a way that's comparable regardless of billing cycle mix.",
            "**Reporting to investors or stakeholders**, who typically expect MRR/ARR as the standard SaaS metric.",
          ],
        },
      },
      {
        title: "MRR vs. ARR",
        paragraphs: [
          "ARR (Annual Recurring Revenue) is simply MRR × 12 — the same underlying number expressed on an annual basis, more commonly used for larger contracts or higher-level reporting.",
        ],
      },
    ],
  },

  "meeting-cost": {
    heading: "Everything you need to know about meeting cost calculations",
    sections: [
      {
        title: "What does this actually calculate?",
        paragraphs: [
          "Multiplies the number of attendees, their approximate salaries, and the meeting's duration to estimate its real cost in paid time — a number that's easy to underestimate when a meeting \"only\" takes an hour but involves eight people.",
        ],
      },
      {
        title: "Why this number is worth knowing",
        paragraphs: [
          "A recurring weekly meeting with a dozen attendees can cost more over a year than people expect once salary time is actually totaled up — a useful gut-check before defaulting to \"let's just get everyone in a room.\"",
        ],
      },
    ],
  },

  // ─── Developer ───────────────────────────────────────────────────────────

  "json-minifier": {
    heading: "Everything you need to know about minifying JSON",
    sections: [
      {
        title: "What does minifying do?",
        paragraphs: [
          "Strips every unnecessary character — indentation, line breaks, extra spaces — from JSON, leaving the smallest possible valid representation of the same data. The content is identical; only the whitespace is gone.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Reducing payload size** for an API response or config file shipped to production.",
            "**Preparing JSON for embedding** somewhere space matters, like a URL query parameter.",
          ],
        },
      },
      {
        title: "Minifying vs. formatting",
        paragraphs: [
          "This is the opposite of **JSON Formatter**, which adds indentation back in for readability. Use minify for production/transport, format for reading and debugging.",
        ],
      },
    ],
  },

  "json-viewer": {
    heading: "Everything you need to know about exploring JSON as a tree",
    sections: [
      {
        title: "What does this do differently from a formatter?",
        paragraphs: [
          "Instead of printing indented text, this renders JSON as a collapsible tree — expand and collapse individual objects and arrays, which makes navigating a deeply nested API response far easier than scrolling through hundreds of lines of flat text.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Exploring a large, deeply-nested API response** without scrolling through everything at once.",
            "**Finding a specific field** buried several levels deep in a complex object.",
          ],
        },
      },
    ],
  },

  "xml-formatter": {
    heading: "Everything you need to know about formatting XML",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Reindents minified or single-line XML with proper nesting and line breaks, and validates that it's well-formed — flagging unclosed tags or structural errors that are hard to spot in unformatted markup.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Reading a config file or API response** delivered as compressed, single-line XML.",
            "**Debugging a malformed XML document** before it's parsed by code that will fail on invalid structure.",
          ],
        },
      },
    ],
  },

  "yaml-formatter": {
    heading: "Everything you need to know about formatting YAML",
    sections: [
      {
        title: "Why YAML formatting matters more than most formats",
        paragraphs: [
          "YAML uses indentation itself to define structure — unlike JSON's brackets, a single misplaced space can silently change what a YAML file means, or break it outright. A formatter/linter catches these indentation issues before they cause a confusing failure in whatever's consuming the file (commonly CI/CD configs, Kubernetes manifests, or Docker Compose files).",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Validating a CI/CD pipeline config** before pushing it, since a YAML indentation error often fails silently or confusingly.",
            "**Cleaning up inconsistent indentation** in a config file edited by multiple people.",
          ],
        },
      },
    ],
  },

  "csv-to-json": {
    heading: "Everything you need to know about converting CSV to JSON",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Converts spreadsheet-style CSV rows and columns into a JSON array of objects, using the header row as each object's field names — the standard shape most APIs and JavaScript code expect data in.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Feeding spreadsheet data into an API or script** that expects JSON, not CSV.",
            "**Prototyping with real data** exported from a spreadsheet tool.",
          ],
        },
      },
      {
        title: "Going the other direction",
        paragraphs: [
          "If you're starting from JSON and need a spreadsheet-friendly format instead, **JSON to CSV** does the reverse.",
        ],
      },
    ],
  },

  "json-to-csv": {
    heading: "Everything you need to know about converting JSON to CSV",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Converts a JSON array of objects into CSV rows and columns, using each object's fields as column headers — the format spreadsheets, and most non-technical stakeholders, actually expect to work with.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Exporting API data to a spreadsheet** for someone who doesn't work directly with JSON.",
            "**Preparing data for import** into a tool that only accepts CSV.",
          ],
        },
      },
      {
        title: "A note on nested data",
        paragraphs: [
          "CSV is fundamentally flat (rows and columns) — deeply nested JSON objects or arrays within a field don't have a clean CSV equivalent, so conversion works best on relatively flat JSON structures.",
        ],
      },
    ],
  },

  "sql-formatter": {
    heading: "Everything you need to know about formatting SQL",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Reformats a SQL query with consistent indentation, capitalization, and line breaks around clauses (SELECT, FROM, WHERE, JOIN) — turning a dense one-line query into something you can actually scan and understand at a glance.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Reviewing a query pulled from logs or a query builder**, which often comes out as one dense line.",
            "**Cleaning up a query before sharing it** in documentation or a code review.",
          ],
        },
      },
    ],
  },

  "html-formatter": {
    heading: "Everything you need to know about formatting HTML",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Reindents HTML markup with consistent nesting and line breaks, making the document's actual structure visible — which element is inside which — instead of a wall of tags with no visual hierarchy.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Reading minified HTML** pulled from a live page's source.",
            "**Cleaning up markup** exported from a design tool or CMS before further editing.",
          ],
        },
      },
    ],
  },

  "css-formatter": {
    heading: "Everything you need to know about formatting CSS",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Reindents minified or inconsistently-formatted CSS with one property per line and consistent spacing — making a stylesheet actually readable and diffable, instead of a dense block of rules on a handful of lines.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Reading a minified stylesheet** pulled from a production site.",
            "**Standardizing formatting** across a CSS file edited by multiple people with different styles.",
          ],
        },
      },
    ],
  },

  "js-beautifier": {
    heading: "Everything you need to know about beautifying JavaScript",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Reformats minified or poorly-indented JavaScript with consistent spacing, indentation, and line breaks — turning code that's technically valid but visually unreadable back into something you can actually follow and debug.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Reading minified production JavaScript** to debug an issue in a live site.",
            "**Reviewing code pulled from an obfuscated or bundled source** before you can understand what it does.",
          ],
        },
      },
    ],
  },

  "js-minifier": {
    heading: "Everything you need to know about minifying JavaScript",
    sections: [
      {
        title: "What does minifying actually do?",
        paragraphs: [
          "Strips whitespace and comments, and often shortens variable names, to produce the smallest functionally-identical version of the code — smaller files download and parse faster, which matters directly for page load performance.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Shipping production JavaScript** where every kilobyte affects load time.",
            "**Quick one-off minification** without setting up a full build pipeline.",
          ],
        },
      },
      {
        title: "For everyday development, don't minify",
        paragraphs: [
          "Minified code is much harder to debug — keep it readable during development and minify only the final production build, ideally through your actual build tool rather than manually.",
        ],
      },
    ],
  },

  "css-minifier": {
    heading: "Everything you need to know about minifying CSS",
    sections: [
      {
        title: "What does minifying do?",
        paragraphs: [
          "Strips whitespace, comments, and unnecessary characters from a stylesheet, producing the smallest functionally-identical file — a direct, if modest, page-load performance win since browsers download CSS before rendering.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Shipping production CSS** without a full build pipeline already handling it.",
            "**Quick size comparisons** before and after minification.",
          ],
        },
      },
    ],
  },

  "html-minifier": {
    heading: "Everything you need to know about minifying HTML",
    sections: [
      {
        title: "What does minifying do?",
        paragraphs: [
          "Strips unnecessary whitespace and comments from HTML, reducing the size of the initial document a browser downloads — a smaller effect than minifying JS/CSS typically, but still a small, real improvement for page load.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Shipping a static HTML page** without a build tool already minifying it.",
            "**Reducing bandwidth** for a high-traffic static page.",
          ],
        },
      },
    ],
  },

  "markdown-preview": {
    heading: "Everything you need to know about previewing Markdown",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Renders Markdown as formatted HTML in real time as you type — so you can see exactly how headings, lists, links, and code blocks will actually look before publishing, rather than mentally parsing raw Markdown syntax.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Writing documentation or a README** and checking formatting before committing it.",
            "**Drafting content for a platform that renders Markdown**, to catch formatting mistakes early.",
          ],
        },
      },
    ],
  },

  "markdown-convert": {
    heading: "Everything you need to know about converting Markdown",
    sections: [
      {
        title: "What does this do?",
        paragraphs: [
          "Converts Markdown into HTML, PDF, or plain text — Markdown is great for writing, but the platform you're publishing to often needs one of these other formats instead.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Publishing Markdown-authored content** somewhere that requires HTML.",
            "**Producing a shareable PDF** from documentation written in Markdown.",
            "**Stripping formatting entirely** down to plain text for a context that can't render Markdown.",
          ],
        },
      },
    ],
  },

  "regex-tester": {
    heading: "Everything you need to know about testing regular expressions",
    sections: [
      {
        title: "Why test a regex before using it in code?",
        paragraphs: [
          "A regular expression that looks right can still fail on edge cases — an unescaped special character, a greedy quantifier matching more than intended, or a pattern that works on your one test string but breaks on a slightly different real one. Testing against multiple sample inputs live, before it's buried in code, catches this early.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Building a validation pattern** (email, phone number, custom format) and confirming it matches what it should — and rejects what it shouldn't.",
            "**Debugging why a regex isn't matching** as expected in existing code.",
            "**Understanding a regex someone else wrote**, by testing it against your own sample inputs.",
          ],
        },
      },
    ],
  },

  "uuid-generator": {
    heading: "Everything you need to know about UUIDs",
    sections: [
      {
        title: "What is a UUID?",
        paragraphs: [
          "A UUID (Universally Unique Identifier) is a 128-bit value, conventionally written as a string like `550e8400-e29b-41d4-a716-446655440000`, designed so that generating one independently on different machines produces an effectively-guaranteed-unique value — no central coordination or database lookup required.",
        ],
      },
      {
        title: "v1 vs. v4 — which should you use?",
        table: {
          headers: ["Version", "How it's generated"],
          rows: [
            ["v1", "Based on timestamp and (historically) network address — can leak generation time/machine"],
            ["v4", "Fully random — the standard default choice for most applications today"],
          ],
        },
      },
      {
        title: "When you actually need this",
        paragraphs: [
          "Database primary keys, session identifiers, and idempotency keys are the most common uses — anywhere you need a unique ID without a database round-trip to check for collisions.",
        ],
      },
    ],
  },

  "hash-generator": {
    heading: "Everything you need to know about hashing",
    sections: [
      {
        title: "What is a hash, and what is it for?",
        paragraphs: [
          "A hash function takes any input and produces a fixed-length string — the same input always produces the same hash, but you can't reverse a hash back into the original input. That one-way property is exactly what makes hashes useful for verifying data integrity or storing passwords without keeping the actual password.",
        ],
      },
      {
        title: "Which algorithm should you use?",
        table: {
          headers: ["Algorithm", "Guidance"],
          rows: [
            ["MD5", "Broken for security use — fine only for quick non-security checksums"],
            ["SHA-1", "Also considered weak for security purposes today"],
            ["SHA-256", "The current standard choice for most integrity/security needs"],
            ["SHA-512", "Similar to SHA-256 with a longer output, used where that's specifically required"],
          ],
        },
      },
      {
        title: "A note on passwords specifically",
        paragraphs: [
          "Never hash passwords with a plain hash function like these for storage — proper password storage uses a dedicated, deliberately slow algorithm (bcrypt, Argon2, scrypt) designed to resist brute-force attacks, which general-purpose hash functions are not.",
        ],
      },
    ],
  },

  "jwt-decoder": {
    heading: "Everything you need to know about JWTs",
    sections: [
      {
        title: "What's actually inside a JWT?",
        paragraphs: [
          "A JWT (JSON Web Token) has three parts separated by dots: a header, a payload, and a signature. The header and payload are just Base64-encoded JSON — readable by anyone, not encrypted — while the signature is what actually proves the token wasn't tampered with, verifiable only with the secret key that created it.",
        ],
      },
      {
        title: "Why decoding doesn't need the secret",
        paragraphs: [
          "Since the header and payload are only encoded (not encrypted), decoding and reading them requires no secret at all — the secret is only needed to *verify* the signature is valid, which is a separate step this tool doesn't perform.",
        ],
      },
      {
        title: "A security note",
        paragraphs: [
          "Never paste a JWT containing real, live session data from a production system into any third-party tool — decode test tokens or redact sensitive claims first, since the *contents* are fully readable by anyone who has the token string.",
        ],
      },
    ],
  },

  "jwt-encoder": {
    heading: "Everything you need to know about creating JWTs",
    sections: [
      {
        title: "What does encoding a JWT involve?",
        paragraphs: [
          "Building a JWT means assembling a header and payload, then signing the combination with a secret key — that signature is what lets a server later verify the token wasn't altered after it was issued.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Testing an API that requires a JWT**, without spinning up your actual auth service.",
            "**Understanding how a specific token was constructed**, by building one yourself with known values.",
          ],
        },
      },
      {
        title: "A security note",
        paragraphs: [
          "Never use a real production signing secret in a third-party tool — use a throwaway test secret, since anyone with the actual signing secret can forge valid tokens for your real system.",
        ],
      },
    ],
  },

  "base64-encoder": {
    heading: "Everything you need to know about Base64 encoding",
    sections: [
      {
        title: "What is Base64, and why does it exist?",
        paragraphs: [
          "Base64 converts binary or text data into a plain ASCII string using only letters, numbers, and a couple of symbols — a format that survives being passed through systems (like older email protocols, or JSON) that expect plain text and might otherwise corrupt raw binary data.",
        ],
      },
      {
        title: "A common misunderstanding",
        paragraphs: [
          "Base64 is encoding, not encryption — anyone can decode it instantly with no key or password required. Don't use it to protect sensitive information; use it purely for safe transport through text-only systems.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Embedding binary data in JSON or a URL**, which can't safely carry raw binary.",
            "**Decoding a Base64 string** you've received to see what it actually contains.",
          ],
        },
      },
    ],
  },

  "url-encoder": {
    heading: "Everything you need to know about URL encoding",
    sections: [
      {
        title: "Why does URL encoding exist?",
        paragraphs: [
          "URLs can only safely contain a limited set of characters — spaces, symbols, and non-ASCII characters need to be encoded as `%`-prefixed codes (a space becomes `%20`) so the URL remains valid and unambiguous wherever it's used.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Building a URL with a query parameter** that contains spaces or special characters.",
            "**Decoding a URL** to see what a percent-encoded parameter actually says.",
          ],
        },
      },
    ],
  },

  "lorem-ipsum": {
    heading: "Everything you need to know about Lorem Ipsum placeholder text",
    sections: [
      {
        title: "Why use meaningless placeholder text at all?",
        paragraphs: [
          "Lorem Ipsum's scrambled Latin looks like natural text at a glance — filling a layout with real-looking paragraph and word lengths, without a reviewer getting distracted reading (or judging) placeholder content as if it were the actual copy.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Mocking up a design or layout** before real content is ready.",
            "**Testing how a template handles varying text lengths** — headlines, short paragraphs, long paragraphs.",
          ],
        },
      },
    ],
  },

  "diff-checker": {
    heading: "Everything you need to know about comparing text with a diff",
    sections: [
      {
        title: "What does a diff actually show?",
        paragraphs: [
          "A diff compares two versions of text and highlights exactly what changed — additions, deletions, and modifications — instead of you having to read both versions side by side and spot the differences manually.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Comparing two drafts** of a document to see what actually changed between them.",
            "**Reviewing a config file change** before applying it, to spot unintended edits.",
            "**Checking two code snippets** for subtle differences that are easy to miss by eye.",
          ],
        },
      },
    ],
  },

  "cron-generator": {
    heading: "Everything you need to know about cron expressions",
    sections: [
      {
        title: "What is a cron expression?",
        paragraphs: [
          "A cron expression is a compact string (like `0 9 * * 1-5`) that defines a recurring schedule — five or six fields representing minute, hour, day, month, and weekday — used by schedulers across nearly every server and CI/CD platform to trigger recurring jobs.",
        ],
      },
      {
        title: "Why a visual builder helps",
        paragraphs: [
          "The field order and syntax (asterisks, ranges, step values) are easy to get subtly wrong by hand — a wrong cron expression might run hourly when you meant daily, silently, until someone notices. Building it visually and reading back the plain-English explanation catches that before it ships.",
        ],
      },
    ],
  },

  "gitignore-generator": {
    heading: "Everything you need to know about .gitignore files",
    sections: [
      {
        title: "What does .gitignore actually do?",
        paragraphs: [
          "A .gitignore file tells Git which files and folders to never track — build output, dependency folders like node_modules, local environment files, editor-specific settings — so they don't get accidentally committed to the repository.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Starting a new project**, before your first commit accidentally includes build artifacts or secrets.",
            "**Adding a new tool or framework** to an existing project that needs its own ignore patterns.",
          ],
        },
      },
      {
        title: "A word of caution",
        paragraphs: [
          "A .gitignore file only stops *new* untracked files from being added — it doesn't remove or hide files already committed to the repository's history. If a secret was already committed, adding it to .gitignore afterward doesn't retroactively remove it.",
        ],
      },
    ],
  },

  "ip-lookup": {
    heading: "Everything you need to know about IP address lookups",
    sections: [
      {
        title: "What does an IP lookup actually tell you?",
        paragraphs: [
          "Looks up the approximate geographic location (country, region, sometimes city) and network/ISP information associated with an IP address — based on public registration databases, not a precise real-time location.",
        ],
      },
      {
        title: "How accurate is this, really?",
        paragraphs: [
          "IP-based geolocation is approximate — it's generally reliable at the country level, less so at the city level, and can be noticeably wrong for mobile networks or VPN/proxy traffic, which route through infrastructure that may be far from the actual user.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Investigating suspicious traffic** in server logs.",
            "**Debugging a geolocation-based feature** that isn't behaving as expected for a specific IP.",
          ],
        },
      },
    ],
  },

  "webhook-tester": {
    heading: "Everything you need to know about testing webhooks",
    sections: [
      {
        title: "What does this actually do?",
        paragraphs: [
          "Generates a temporary, unique URL you can register as a webhook endpoint — then shows you exactly what gets sent to it (headers, body, timing) in real time, without needing to deploy your own server just to inspect incoming webhook payloads.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Debugging a third-party integration** (Stripe, GitHub, a payment provider) to see exactly what payload it actually sends.",
            "**Testing a webhook consumer** during development, before your real endpoint is deployed.",
          ],
        },
      },
    ],
  },

  "htaccess-generator": {
    heading: "Everything you need to know about .htaccess files",
    sections: [
      {
        title: "What is .htaccess for?",
        paragraphs: [
          "A .htaccess file lets an Apache web server apply configuration — redirects, password protection, custom error pages, caching rules — on a per-directory basis, without needing access to the server's main configuration file.",
        ],
      },
      {
        title: "When you actually need this",
        list: {
          items: [
            "**Setting up redirects** (e.g. forcing https, or www to non-www) on Apache hosting.",
            "**Password-protecting a directory** without building application-level authentication.",
            "**Custom error pages** for 404s or other status codes.",
          ],
        },
      },
      {
        title: "This only applies to Apache",
        paragraphs: [
          "If your site runs on Nginx, Vercel, or another non-Apache platform, .htaccess rules simply won't be read at all — the equivalent configuration lives elsewhere (an nginx.conf, a vercel.json, etc.) for those platforms.",
        ],
      },
    ],
  },
};
