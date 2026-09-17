// ─── Per-tool SEO content ──────────────────────────────────────────────────────
//
// Every free tool gets a unique <title>, meta description, short explanation,
// step-by-step usage instructions, and FAQ — sourced from OVERRIDES when a
// tool has hand-written content, falling back to a category-aware generator
// otherwise so every one of the 115 tool pages still gets genuinely
// differentiated (not boilerplate-identical) copy. OVERRIDES covers the
// highest-search-volume tool in each category first.

import type { Tool, ToolCategory } from "./tools";
import { isFileTool } from "./file-tools";

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolSeoContent {
  title: string;
  metaDescription: string;
  intro: string;
  steps: string[];
  faqs: ToolFaq[];
}

// ─── Hand-authored overrides — highest-traffic tool per category+intent ───────

const OVERRIDES: Record<string, ToolSeoContent> = {
  "pdf-merge": {
    title: "Merge PDF Files Online Free, No Signup | SaaSToolz",
    metaDescription:
      "Combine multiple PDF files into one document in seconds. Drag, drop, reorder pages, and download — free, no signup, no watermark.",
    intro:
      "Merge PDF lets you combine two or more PDF files into a single document without installing anything. Upload your files, drag them into the order you want, and download one merged PDF — files are uploaded securely and deleted from our servers within 1 hour.",
    steps: [
      "Upload two or more PDF files using the file picker or by dragging them in.",
      "Drag the thumbnails to put the pages in the order you want the final document to read.",
      "Click \"Merge PDFs\" to combine them into a single file.",
      "Download the merged PDF — it's ready to send or print immediately.",
    ],
    faqs: [
      { q: "Is there a limit to how many PDFs I can merge?", a: "No — merge as many PDF files as you need in one pass. Very large batches may take a few seconds longer to process." },
      { q: "Will merging affect the quality of my PDFs?", a: "No. Pages are combined as-is with no re-compression or re-rendering, so text, images and formatting stay exactly as they were in the originals." },
      { q: "Can I reorder pages before merging?", a: "Yes — drag the file thumbnails into any order before clicking merge. The output follows that exact order." },
      { q: "The merged file is too large to email — what now?", a: "Run it through Compress PDF after merging. Merging combines file sizes, so five large scans merged together can exceed limits none of them hit individually." },
      { q: "What's the difference between merging and organizing?", a: "Merge combines multiple separate files into one; Organize reorders pages within a single file you already have, without adding or removing any." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour — nothing is stored long-term." },
    ],
  },
  "pdf-compress": {
    title: "Compress PDF Online Free — Reduce File Size | SaaSToolz",
    metaDescription:
      "Shrink large PDF files for email or upload limits without losing readability. Choose a compression level, download instantly — free, no signup.",
    intro:
      "Compress PDF reduces file size by optimizing embedded images and removing redundant data, so a PDF that's too large to email or upload becomes small enough to share — while text stays sharp and pages stay legible.",
    steps: [
      "Upload the PDF you want to shrink.",
      "Pick a compression level — lighter for maximum quality, stronger for the smallest possible file.",
      "Click \"Compress PDF\" and let it process.",
      "Download the smaller file and compare the size reduction shown on screen.",
    ],
    faqs: [
      { q: "How much smaller will my PDF get?", a: "It depends on the content — PDFs with large images typically shrink 40–80%, while text-only PDFs are already small and compress less dramatically." },
      { q: "Will compression make my PDF blurry?", a: "Text and vector content stay crisp regardless of the setting. Embedded photos are re-optimized — the higher compression levels trade a small amount of image detail for a much smaller file." },
      { q: "Can I compress a password-protected PDF?", a: "Unlock it first with the Unlock PDF tool, then compress it — encrypted files can't be re-processed directly." },
      { q: "What actually makes a PDF large in the first place?", a: "Embedded images almost always dominate — especially scanned pages saved at high resolution. Embedded fonts and page count matter too, but far less." },
      { q: "Which compression level should I pick?", a: "Recommended for most cases. Use Low if the document must stay perfectly text-selectable and sharp; use Extreme only when you're up against a hard size limit, like a 5MB upload cap." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "pdf-split": {
    title: "Split PDF Online Free — Extract Pages, No Signup | SaaSToolz",
    metaDescription:
      "Split a PDF into a custom page range, equal-sized chunks, or specific page numbers. Free, instant, no signup.",
    intro:
      "Split PDF breaks one PDF into multiple files — pull out a range of pages, cut it into equal-sized chunks, or extract specific page numbers — without installing anything. Files are uploaded securely and deleted from our servers within 1 hour.",
    steps: [
      "Upload the PDF you want to split.",
      "Choose Range (a custom page range or fixed-size chunks) or Pages (every page, or specific page numbers).",
      "Enter the range, chunk size, or page numbers for the mode you picked.",
      "Click \"Split PDF\" and download the result — one PDF for a single range, or a .zip for multiple files.",
    ],
    faqs: [
      { q: "What's the difference between Range and Pages mode?", a: "Range mode pulls out a continuous span of pages, or splits the whole document into equal-sized chunks. Pages mode extracts specific, individually chosen page numbers, or every page as its own file." },
      { q: "Do I get one file back or several?", a: "A single custom range downloads as one PDF; fixed-size chunks, \"extract all,\" and multi-page selections download as a .zip containing multiple PDFs." },
      { q: "Can I select non-consecutive pages?", a: "Yes — in Pages mode, enter comma-separated page numbers and ranges, like 1, 3, 5-8." },
      { q: "Will splitting affect quality or formatting?", a: "No. Pages are extracted as-is with no re-compression or re-rendering, so content looks exactly as it did in the original." },
      { q: "Is there a limit on how many pages I can split?", a: "Free use covers typical document lengths; very large PDFs may take a little longer to process." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "pdf-to-word": {
    title: "Convert PDF to Word Online Free, No Signup | SaaSToolz",
    metaDescription:
      "Turn a PDF into an editable Word (.docx) file while keeping the original layout, fonts and images intact. Free, fast, no signup required.",
    intro:
      "PDF to Word converts a static PDF into an editable .docx file, preserving paragraphs, headings, tables and images as closely as possible so you can pick up editing in Word or Google Docs instead of retyping the whole document.",
    steps: [
      "Upload the PDF you want to convert.",
      "Wait a few seconds while the layout, text and images are extracted.",
      "Preview the result to confirm the formatting carried over correctly.",
      "Download the .docx file and open it in Word or Google Docs.",
    ],
    faqs: [
      { q: "Will the formatting stay exactly the same?", a: "Text, headings, tables and images are preserved closely, but very complex layouts (multi-column magazines, heavy design work) may need minor manual touch-up after conversion — this is a limitation of the PDF/Word formats, not the tool." },
      { q: "Does this work on scanned PDFs?", a: "Scanned PDFs are images, not text — run them through PDF OCR first to make the text extractable, then convert to Word." },
      { q: "What file do I get back?", a: "A standard .docx file compatible with Microsoft Word, Google Docs, and LibreOffice." },
      { q: "Why did I get a blank or image-only Word document?", a: "Your PDF was likely a scan with no real text in it — run PDF OCR on it first to extract actual text, then convert to Word." },
      { q: "Will tables convert correctly?", a: "Simple tables generally convert cleanly into editable Word tables; very complex or nested table layouts may need minor manual adjustment afterward." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "pdf-ocr": {
    title: "PDF OCR Online Free — Scanned PDFs Searchable | SaaSToolz",
    metaDescription:
      "Extract text from scanned PDFs and images in 14 languages. Make old documents searchable and copyable — free, no signup, no installs.",
    intro:
      "PDF OCR (optical character recognition) scans the pixels of a scanned document or image-based PDF and turns them back into real, selectable, searchable text — useful for old scanned contracts, receipts, or books that were never digitized properly.",
    steps: [
      "Upload the scanned PDF you want to make searchable.",
      "Choose the document's language for the most accurate recognition.",
      "Run OCR and wait for the text extraction to finish.",
      "Download the searchable PDF, or copy the extracted plain text directly.",
    ],
    faqs: [
      { q: "How accurate is the text extraction?", a: "Accuracy is very high on clean, well-scanned documents in a supported language, and drops on blurry scans, handwriting, or unusual fonts — OCR works best on typed text." },
      { q: "Which languages are supported?", a: "14 languages are supported — select the correct one before running OCR for the best accuracy, since recognition is language-specific." },
      { q: "Can I edit the text after OCR?", a: "The output is searchable/copyable text, not an editable Word document — use PDF to Word afterward if you need to edit it directly." },
      { q: "Can OCR read handwriting?", a: "Not reliably — OCR is built for typed text. Handwritten documents generally aren't a good fit for automatic text extraction." },
      { q: "Does the scan quality matter?", a: "Yes, significantly — a clean scan at 200–300 DPI gives much better results than a blurry, low-resolution, or skewed one." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "image-compress": {
    title: "Compress Images Online Free — No Quality Loss | SaaSToolz",
    metaDescription:
      "Shrink JPG, PNG and WebP file sizes for faster websites and easier sharing, without visible quality loss. Free, instant, no signup.",
    intro:
      "Image Compressor reduces JPG, PNG, and WebP file sizes by optimizing pixel data and stripping unnecessary metadata — smaller images load faster on websites and are easier to email or upload, without a visible drop in quality at normal viewing sizes.",
    steps: [
      "Upload one or more images (JPG, PNG or WebP).",
      "Adjust the quality slider to balance file size against visual quality.",
      "Preview the before/after file size comparison.",
      "Download the compressed image, ready to use.",
    ],
    faqs: [
      { q: "How much can I shrink an image without losing quality?", a: "Most photos compress 50–80% smaller with no visible difference at normal screen sizes — the slider lets you see the tradeoff in real time before downloading." },
      { q: "Which formats are supported?", a: "JPG, PNG and WebP — for other formats, convert first with the Image Converter, then compress." },
      { q: "Does this work for logos and graphics with text?", a: "Yes, though PNGs with sharp edges and flat colors compress differently than photos — the live preview shows you the actual result before you download." },
      { q: "What's the difference between compressing and resizing?", a: "Compressing changes file size via quality/encoding while keeping the same pixel dimensions; resizing changes the actual width/height. Use Image Resizer if you need smaller dimensions, not just a smaller file." },
      { q: "Is compression lossy or lossless?", a: "It depends on the format and quality setting — the live before/after preview shows you exactly what you'll get before downloading, rather than leaving it to guesswork." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "image-convert": {
    title: "Convert Images Free — JPG, PNG, WebP, AVIF | SaaSToolz",
    metaDescription:
      "Convert images between JPG, PNG, WebP, AVIF and SVG in one click. Free, fast, no signup, no software to install.",
    intro:
      "Image Converter switches an image between JPG, PNG, WebP, AVIF and SVG formats — useful when a website needs a specific format, a design tool won't accept your current one, or you want the smaller file sizes that WebP/AVIF offer over JPG/PNG.",
    steps: [
      "Upload the image you want to convert.",
      "Choose the target format (JPG, PNG, WebP, AVIF or SVG).",
      "Click convert and let it process.",
      "Download the converted file.",
    ],
    faqs: [
      { q: "Which format should I choose?", a: "WebP or AVIF for the smallest file size with modern browser support, JPG for maximum compatibility with photos, PNG when you need transparency, and SVG only for genuinely vector artwork." },
      { q: "Will converting to a smaller format hurt quality?", a: "Converting between lossy formats (like PNG to JPG) can introduce minor compression artifacts — converting to WebP or AVIF at high quality settings is generally safe for photos." },
      { q: "Can I convert a photo to SVG?", a: "No — SVG is a vector format and can't represent a photo's pixel detail. SVG conversion works for genuinely vector source images, not photographs." },
      { q: "What's the difference between lossy and lossless formats?", a: "Lossy formats (JPG, and WebP/AVIF at typical settings) discard some detail to shrink file size; lossless formats (PNG) keep every pixel exactly as-is at a larger file size." },
      { q: "Should I use WebP or AVIF?", a: "Both offer better compression than JPG/PNG at equal quality. AVIF is generally smaller still, but WebP has slightly broader older-browser support — either is a solid modern default." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "qr-generator": {
    title: "QR Code Generator — Free, Instant Download | SaaSToolz",
    metaDescription:
      "Create QR codes for URLs, text, WiFi credentials, and vCard contacts in seconds. Free, downloadable as PNG/SVG, no signup or watermark.",
    intro:
      "QR Code Generator turns a URL, block of text, WiFi network, or contact card into a scannable QR code you can download and print or share digitally — no account, no expiring links, and no watermark on the output.",
    steps: [
      "Choose what you're encoding — URL, plain text, WiFi, or a vCard contact.",
      "Fill in the relevant fields (link, network name/password, contact details, etc.).",
      "Customize the color and size if needed.",
      "Download the QR code as a PNG or SVG file.",
    ],
    faqs: [
      { q: "Do these QR codes expire?", a: "No — the QR code encodes your data directly (or a URL you control), so it works for as long as that content or link stays valid. There's no third-party redirect service involved." },
      { q: "Can I customize the color or add a logo?", a: "You can customize the color; keep enough contrast between foreground and background so scanners can still read it reliably." },
      { q: "What's the difference between PNG and SVG download?", a: "PNG is a fixed-resolution image good for screens and most printing; SVG is a vector file that scales to any size (like a billboard) with no quality loss." },
      { q: "What's the difference between a QR code and a barcode?", a: "A traditional barcode encodes data in one line and holds relatively little (usually just a product number); a QR code encodes data in two dimensions and can hold dramatically more — a full URL, a WiFi password, a whole contact card." },
      { q: "Will the QR code still scan if part of it is damaged or covered by a logo?", a: "Usually yes — QR codes include built-in error correction specifically so they keep working with partial damage or a small logo overlay, as long as it doesn't cover too much of the pattern." },
      { q: "Is my data safe when using this tool?", a: "Yes — WiFi passwords and contact details are sent to our servers only to generate the QR code and are not stored afterward." },
    ],
  },
  "json-formatter": {
    title: "JSON Formatter & Validator Online Free | SaaSToolz",
    metaDescription:
      "Format, validate and beautify JSON instantly with syntax highlighting and clear error messages. Free, browser-based, no signup.",
    intro:
      "JSON Formatter takes minified or messy JSON and reformats it with proper indentation and syntax highlighting, while flagging syntax errors with a clear message pointing at the problem — handy for debugging API responses or config files.",
    steps: [
      "Paste your JSON into the input box.",
      "The formatter validates it automatically and shows an error if the syntax is invalid.",
      "Review the beautified, indented, syntax-highlighted output.",
      "Copy the formatted result to your clipboard.",
    ],
    faqs: [
      { q: "What happens if my JSON is invalid?", a: "The tool highlights the syntax error and tells you roughly where the problem is (a missing comma, unmatched bracket, trailing comma, etc.) so you can fix it quickly." },
      { q: "Can I minify JSON with this tool too?", a: "This tool formats/beautifies; use JSON Minifier if you need the compact, whitespace-free version for production." },
      { q: "Is there a size limit?", a: "Very large JSON payloads (tens of megabytes) may be slower to render, but there's no hard limit for typical API responses or config files." },
      { q: "Does this tool send my JSON anywhere?", a: "Yes — the JSON you paste is sent to our servers to be formatted and validated, and the result is returned to you; we don't store the content itself." },
      { q: "What's the most common JSON syntax error?", a: "A trailing comma after the last item in an object or array — allowed in JavaScript object literals, but not valid JSON. Unquoted keys and single quotes instead of double quotes are close runners-up." },
      { q: "What's the difference between formatting and minifying?", a: "Formatting adds indentation and line breaks for readability; minifying strips all of that out for the smallest possible payload. Use JSON Minifier when you need the compact version." },
    ],
  },
  "password-generator": {
    title: "Strong Password Generator — Free & Secure | SaaSToolz",
    metaDescription:
      "Generate strong, random passwords with custom length and character rules. Free, no signup, and never stored on our servers.",
    intro:
      "Password Generator creates cryptographically random passwords using the character sets you choose (uppercase, lowercase, numbers, symbols) at whatever length you need. Your chosen options are sent to our servers to generate the password, which is returned to you and not logged or stored.",
    steps: [
      "Set your desired password length.",
      "Choose which character types to include — uppercase, lowercase, numbers, symbols.",
      "Click generate to create a new random password.",
      "Copy it to your clipboard and store it in a password manager.",
    ],
    faqs: [
      { q: "How long should my password be?", a: "At least 12–16 characters with a mix of character types for most accounts; longer is better, and length matters more than complexity for resisting brute-force attacks." },
      { q: "Is the generated password sent to your servers?", a: "The password is generated on our servers and sent back to you over an encrypted connection; it isn't logged or stored anywhere." },
      { q: "Should I reuse a generated password across sites?", a: "No — use a unique password per account (ideally stored in a password manager) so a breach on one site can't compromise your other accounts." },
      { q: "Can I exclude ambiguous characters like 0/O or 1/l?", a: "Yes — toggle that option on if you need to type the password manually and want to avoid easily-confused characters." },
      { q: "Is length or complexity more important?", a: "Length matters more. A longer password with fewer character types generally resists brute-force attacks better than a shorter, highly complex one — aim for at least 12–16 characters." },
      { q: "What's a passphrase, and is it a good alternative?", a: "Several random, unrelated words strung together (not a memorable quote or lyric). It can work well if it's genuinely long and random — but a purely random character string is generally stronger for the same length." },
    ],
  },
  "word-counter": {
    title: "Word Counter Online Free — Words & Reading Time | SaaSToolz",
    metaDescription:
      "Count words, characters, sentences and estimated reading time as you type or paste. Free, instant, no signup.",
    intro:
      "Word Counter gives you an instant breakdown of your text — word count, character count (with and without spaces), sentence and paragraph count, and estimated reading time — useful for hitting a word limit or checking how long a piece will take to read.",
    steps: [
      "Paste or type your text into Word Counter.",
      "Click \"Run\" to get the count — or just keep editing and re-run any time.",
      "Review the word, character, sentence and paragraph counts.",
      "Check the estimated reading time shown alongside the counts.",
    ],
    faqs: [
      { q: "Does this tool send my text to a server?", a: "Yes — the text is sent to our servers to compute the counts and the result is returned to you; we don't store the content itself." },
      { q: "Does the character count include spaces?", a: "Both totals are shown — character count with spaces and without — so you can use whichever limit applies to you." },
      { q: "How is reading time calculated?", a: "At roughly 200 words per minute, a common average adult silent-reading speed — treat it as a useful estimate rather than an exact figure." },
      { q: "What counts as a sentence or paragraph?", a: "Sentences are counted by splitting on periods, question marks and exclamation points, so unusual abbreviations can occasionally shift the count by one. Paragraphs are counted by blank lines between blocks of text." },
      { q: "Is there a text length limit?", a: "No hard limit for typical use — very long documents may take a moment longer to process." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "loan-calculator": {
    title: "Loan / EMI Calculator — Free, Instant | SaaSToolz",
    metaDescription:
      "Calculate your monthly EMI, total interest and full amortization schedule for any loan amount, rate and term. Free, instant, no signup.",
    intro:
      "Loan / EMI Calculator works out your fixed monthly payment (EMI), the total interest you'll pay over the life of the loan, and a full month-by-month amortization schedule — enter the loan amount, annual interest rate, and term to see the breakdown.",
    steps: [
      "Enter the loan amount, annual interest rate, and term in months.",
      "The calculator computes your monthly EMI and total interest instantly.",
      "Review the amortization schedule showing principal and interest per payment.",
      "Adjust any value to compare different loan scenarios.",
    ],
    faqs: [
      { q: "Is the Loan / EMI Calculator accurate?", a: "Yes — it uses the standard reducing-balance EMI formula; results are for informational purposes and shouldn't replace advice from your lender or a financial advisor for major decisions." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your loan amount, rate and term are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "What is EMI?", a: "Equated Monthly Installment — the fixed amount you pay each month, combining both principal and interest, that keeps every payment the same size over the loan's term." },
      { q: "Why does the loan term need to be in months?", a: "Interest accrues monthly, so the calculation needs a whole number of months — enter years × 12 if your loan term is given in years." },
      { q: "What's the difference between this and the Mortgage Calculator?", a: "This calculator computes EMI for any general loan from the amount, rate and term directly. The Mortgage Calculator adds a home price and down payment percentage on top, specific to home loans." },
      { q: "Can I use this for any type of loan?", a: "Yes — personal loans, auto loans, student loans, or any fixed-rate installment loan, not just mortgages." },
    ],
  },
  "zakat-calculator": {
    title: "Zakat Calculator — Free, Nisab-Based, No Signup | SaaSToolz",
    metaDescription:
      "Calculate your annual Zakat from cash, gold, investments and business assets against the Nisab threshold. Free, instant, no signup.",
    intro:
      "Zakat Calculator totals your eligible wealth — cash, gold and silver, investments, business assets, and money owed to you — subtracts debts due now, and checks the result against the Nisab threshold you provide to work out whether Zakat is due and how much (2.5% of net zakatable wealth).",
    steps: [
      "Enter your cash, gold/silver value, investments, business assets, and any money owed to you.",
      "Enter debts and short-term liabilities due now, and your local Nisab threshold.",
      "Click \"Calculate Zakat\" to see your net zakatable wealth and whether it meets the Nisab.",
      "If eligible, the Zakat due (2.5% of net wealth) is shown along with the full breakdown.",
    ],
    faqs: [
      { q: "What is the Nisab, and why do I have to enter it myself?", a: "Nisab is the minimum wealth threshold (traditionally 87.48g of gold or 612.36g of silver) below which Zakat isn't due. We don't have a live gold/silver price feed, so rather than guess, this tool asks for your Nisab value in your own currency — look up today's gold or silver price to work it out, or ask your local Islamic center." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "How is Zakat calculated?", a: "2.5% of your net zakatable wealth (eligible assets minus debts due now), but only if that net wealth meets or exceeds the Nisab threshold." },
      { q: "What counts as a zakatable asset?", a: "Commonly: cash and bank balances, gold and silver, business inventory and investments, and money others owe you. Assets for personal use (your home, car, furniture) typically don't count — but rulings vary by school of thought, so check with a scholar for your specific situation." },
      { q: "Is this a religious ruling?", a: "No — it's a standard arithmetic calculation based on the figures you enter. For rulings specific to your madhhab (school of thought) or unusual assets, consult a qualified scholar." },
      { q: "Is my data safe when using this tool?", a: "Yes — your figures are used only to compute the result and aren't stored." },
    ],
  },
  "unit-converter": {
    title: "Unit Converter — Length, Weight, Temp, Volume | SaaSToolz",
    metaDescription:
      "Convert instantly between length, weight, temperature and volume units, right in your browser. Free, no signup, no ads on results.",
    intro:
      "Unit Converter switches a value between units in the same category — length, weight, temperature, or volume — updating instantly as you type, entirely in your browser.",
    steps: [
      "Choose a category: Length, Weight, Temperature, or Volume.",
      "Pick the unit you're converting from and the unit you're converting to.",
      "Type the value you want to convert.",
      "The converted result updates instantly — use the swap button to reverse direction.",
    ],
    faqs: [
      { q: "Does this tool send my numbers to a server?", a: "No — conversion happens entirely in your browser; nothing you enter is transmitted or stored." },
      { q: "How accurate are the conversions?", a: "Standard, widely-used conversion factors are used throughout (e.g. 1 inch = 2.54 cm exactly), so results are precise to the decimal places shown." },
      { q: "Which unit categories are supported?", a: "Length, weight/mass, temperature, and volume — the categories covering the vast majority of everyday and professional conversions." },
      { q: "Why does temperature work differently from the others?", a: "Celsius, Fahrenheit and Kelvin aren't simple multiples of each other (0°C isn't 0°F), so temperature uses proper conversion formulas instead of a single multiplier like the other categories." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "invoice-generator": {
    title: "Free Invoice Generator Online — Instant PDF | SaaSToolz",
    metaDescription:
      "Create a professional invoice in your browser and export it as PDF or PNG in seconds. Free, no signup, no watermark, no account required.",
    intro:
      "Invoice Generator lets you build a professional invoice — fill your details, then export it as a print-ready PDF or PNG, entirely in your browser.",
    steps: [
      "Fill in your company details (name, logo, VAT/tax number, contact info).",
      "Add the customer's details and one or more line items with quantity, price, discount and tax.",
      "Check the live preview and totals on the right update automatically.",
      "Export as PDF or PNG, or print directly.",
    ],
    faqs: [
      { q: "What's the difference between an invoice and a receipt?", a: "An invoice requests payment for goods or services already delivered; a receipt confirms payment was received. You send an invoice before you're paid, and (optionally) a receipt after." },
      { q: "What makes an invoice a \"tax invoice\"?", a: "A tax invoice adds your business's tax/VAT/GST registration number and shows the tax rate and amount separately per line — exact requirements vary by country, so check your local tax authority. This tool's company Tax/VAT Number field and per-item tax percentage cover the common case." },
      { q: "How should I number my invoices?", a: "Use a unique, sequential number for every invoice — never reused, never skipped — in a consistent format like INV-0001 or 2026-001. The tool generates one automatically, but you can overwrite it to match your own numbering sequence." },
      { q: "How long should a business keep its invoices?", a: "Most tax authorities require 5–7 years of financial records, invoices included — check your local requirements, and keep a backup copy (cloud storage or accounting software) rather than relying on a single local file." },
      { q: "Does this tool store my invoices?", a: "Your draft is saved locally in your browser so you don't lose it on refresh; the metadata (company, customer, invoice number) is also logged for our own analytics, but the invoice document itself is generated client-side and never uploaded." },
      { q: "Can I add my own logo and signature?", a: "Yes — add an image URL or upload a file for both your company logo and an authorized signature; they appear on the generated invoice." },
      { q: "What currencies are supported?", a: "Dozens of currencies are supported with the correct symbol shown automatically on totals." },
      { q: "Is there a limit on invoices?", a: "No — generate as many invoices as you need, completely free, with no signup or watermark." },
    ],
  },
  "meta-tag-generator": {
    title: "Meta Tag Generator — Free SEO & Open Graph Tags | SaaSToolz",
    metaDescription:
      "Generate a complete set of title, description, Open Graph and Twitter Card meta tags for any page. Free, copy-paste ready, no signup.",
    intro:
      "Meta Tag Generator builds the full block of HTML `<head>` tags a page needs for SEO and social sharing — title, meta description, canonical, Open Graph, and Twitter Card — from a simple form, so you don't have to remember the exact tag syntax every time.",
    steps: [
      "Enter the page's title, description, and URL.",
      "Fill in the Open Graph image and site name for rich social previews.",
      "Review the generated tags in the live preview.",
      "Copy the full HTML block and paste it into your page's `<head>`.",
    ],
    faqs: [
      { q: "Where do these tags go on my page?", a: "Inside the `<head>` element of your HTML document, before the closing `</head>` tag." },
      { q: "What's the ideal length for a meta description?", a: "Roughly 150–160 characters — long enough to be useful, short enough that Google doesn't truncate it in search results." },
      { q: "Does adding these tags guarantee better rankings?", a: "No single tag guarantees rankings, but accurate, well-written title and description tags directly affect click-through rate from search results, and Open Graph/Twitter tags control how your link looks when shared on social media." },
      { q: "Can I generate tags for multiple pages?", a: "Yes — there's no limit; generate a fresh set for every page on your site." },
      { q: "What's the difference between meta tags and structured data?", a: "Meta tags control basic display (title, description, social preview). Structured data (JSON-LD) tells search engines what the page actually is — an article, product, FAQ — which is what makes rich results possible. Most pages benefit from both." },
      { q: "Why is my canonical tag important?", a: "It tells search engines which URL is the \"real\" one when the same content is reachable at more than one address — pointing it at the wrong URL can tell search engines to ignore the page you're trying to rank." },
    ],
  },
  "robots-txt": {
    title: "Robots.txt Generator — Free, Instant Download | SaaSToolz",
    metaDescription:
      "Build a valid robots.txt file to control which pages search engines can crawl. Free, no signup, ready to upload to your site root.",
    intro:
      "Robots.txt Generator builds a correctly-formatted robots.txt file that tells search engine crawlers which parts of your site to crawl or skip, and points them to your sitemap — no need to memorize the exact syntax rules crawlers expect.",
    steps: [
      "Choose whether to allow or block specific crawlers and paths.",
      "Add your sitemap URL so crawlers can discover it automatically.",
      "Review the generated robots.txt in the preview panel.",
      "Download the file and upload it to your site's root directory (e.g. yoursite.com/robots.txt).",
    ],
    faqs: [
      { q: "Where does robots.txt need to live?", a: "At the root of your domain — e.g. https://yoursite.com/robots.txt — not in a subfolder, or crawlers won't find it." },
      { q: "Does robots.txt stop a page from being indexed?", a: "Not reliably — it stops crawling, but a blocked page can still appear in search results if it's linked from elsewhere. Use a noindex meta tag if you need a page fully out of search results." },
      { q: "Can I block specific bots only?", a: "Yes — target individual user-agents (like a specific AI crawler) while still allowing Googlebot and others." },
      { q: "Should every site have a robots.txt file?", a: "It's not required, but having one — even a permissive one that just points to your sitemap — is standard practice and gives you explicit control instead of relying on crawler defaults." },
      { q: "What's the most common robots.txt mistake?", a: "A stray \"Disallow: /\" that blocks the entire site — often a staging-environment robots.txt accidentally deployed to production. Always check a live site's robots.txt after deploying." },
      { q: "Does robots.txt affect existing indexed pages?", a: "Blocking a page after it's already indexed doesn't remove it from search results by itself — it just stops future crawling. Use a noindex tag (on a page crawlers can still reach) to actually get a page removed." },
    ],
  },
  "sitemap-generator": {
    title: "XML Sitemap Generator — Free, Instant Download | SaaSToolz",
    metaDescription:
      "Generate a valid XML sitemap from a list of URLs for faster, more complete search engine indexing. Free, no signup required.",
    intro:
      "Sitemap Generator turns a list of your page URLs into a valid XML sitemap file — the format search engines use to discover and prioritize your pages — without hand-writing the XML schema yourself.",
    steps: [
      "Paste in the list of URLs you want included, one per line.",
      "Set change frequency and priority if you want to hint at how often pages update.",
      "Review the generated XML in the preview.",
      "Download sitemap.xml and upload it to your site's root, then reference it in robots.txt.",
    ],
    faqs: [
      { q: "Does a sitemap guarantee my pages get indexed?", a: "No — it helps search engines discover pages faster and understand your site structure, but indexing still depends on content quality and crawl budget." },
      { q: "How many URLs can one sitemap hold?", a: "The spec allows up to 50,000 URLs per file; larger sites split into multiple sitemaps referenced by a sitemap index file." },
      { q: "Where should I submit my sitemap?", a: "Reference it in robots.txt and submit it directly in Google Search Console and Bing Webmaster Tools for faster discovery." },
      { q: "Do I need to regenerate it every time I add a page?", a: "Yes, ideally — or use a dynamically-generated sitemap on your site so it always reflects your current pages automatically." },
      { q: "Do changefreq and priority actually matter to Google?", a: "Google has said it mostly ignores both today — lastmod is the field it actually uses as a freshness signal, so keep that one accurate rather than fabricated." },
      { q: "How does a sitemap relate to robots.txt?", a: "They're complementary: robots.txt controls what crawlers are allowed to crawl, while a sitemap tells them what exists and where to find it. Reference your sitemap's URL directly inside robots.txt so both work together." },
    ],
  },
};

// ─── Fallback content for every tool without an override ─────────────────────
//
// isFileTool() (not category) decides which flow a tool gets — several
// categories mix file-upload tools with text/value tools (e.g. "image"
// contains both image-compress, a real upload, and hex-to-rgb, a plain color
// converter with no file involved at all; "writing" contains word-to-html, a
// .docx upload, alongside plain text tools like case-converter). Branching on
// category alone would wrongly tell hex-to-rgb's page that "files are
// processed securely and deleted" when no file is ever involved.

const FILE_STEPS = (name: string): string[] => [
  `Upload the file you want to use with ${name}.`,
  "Adjust any available settings for the result you need.",
  `Run ${name} and wait a moment while it processes.`,
  "Download the resulting file — no watermark, no signup.",
];

const FILE_FAQS = (tool: Tool): ToolFaq[] => [
  { q: `Is ${tool.name} free to use?`, a: "Yes — completely free, with no signup and no watermark on the output." },
  { q: "Is my file safe when I upload it?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
  { q: "Do I need to install any software?", a: "No — everything runs in your browser tab, on any device with a modern browser." },
  { q: "Is there a file size limit?", a: "Free use covers typical file sizes for this kind of task; very large files may take longer to process." },
];

const NON_FILE_STEP_TEMPLATES: Partial<Record<ToolCategory, (name: string) => string[]>> = {
  developer: (name) => [
    `Paste your content into ${name}.`,
    "The tool processes it and shows the result.",
    "Review the output.",
    "Copy the result to your clipboard.",
  ],
  seo: (name) => [
    `Fill in the details ${name} needs (URL, fields, or settings).`,
    "Review the generated output in the live preview.",
    "Adjust anything that needs tweaking.",
    "Copy or download the result and add it to your site.",
  ],
  writing: (name) => [
    `Paste or type your text into ${name}.`,
    "Choose any relevant options.",
    "The result updates instantly.",
    "Copy the output to your clipboard.",
  ],
  calculator: (name) => [
    `Enter your values into ${name}.`,
    "The result calculates instantly as you type.",
    "Adjust inputs to compare different scenarios.",
    "Use the result — no signup, no saved data.",
  ],
  design: (name) => [
    `Adjust the settings in ${name} using the visual controls.`,
    "Watch the live preview update in real time.",
    "Fine-tune until it looks right.",
    "Copy the generated CSS code.",
  ],
};

// Non-file tools in categories without a dedicated template above — e.g. QR
// Code Generator and HEX to RGB both live in the "image" category but take a
// value/text input, not a file — closest in spirit to the "design" flow
// (configure → preview → copy/download).
const GENERIC_GENERATE_STEPS = (name: string): string[] => [
  `Enter the value or text ${name} needs.`,
  "Adjust any available options.",
  "Preview the result instantly.",
  "Copy or download the output.",
];

// Single source of truth for the "does this send my data anywhere"
// question — driven by tool.processing so a tool's own registry entry can
// never disagree with its FAQ answer.
function processingFaq(tool: Tool): ToolFaq {
  return tool.processing === "client"
    ? { q: "Does this tool send my data to a server?", a: "No — it runs entirely in your browser; nothing you enter is transmitted or stored." }
    : { q: "Does this tool send my data to a server?", a: "Yes — your input is sent to our servers to process the request and the result is returned to you; we don't store the content itself." };
}

const NON_FILE_FAQ_BANK: Partial<Record<ToolCategory, (tool: Tool) => ToolFaq[]>> = {
  developer: (tool) => [
    { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    processingFaq(tool),
    { q: "Can I use this for production work?", a: "Yes — it's built for exactly that: quick, reliable formatting and validation during development." },
    { q: "Is there a size limit on what I can paste in?", a: "Very large inputs may render more slowly, but there's no hard limit for typical use cases." },
  ],
  seo: () => [
    { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    { q: "Will using this tool improve my search rankings?", a: "It helps you implement SEO best practices correctly — actual rankings depend on many other factors like content quality and backlinks." },
    { q: "Do I need any technical knowledge to use it?", a: "No — fill in the form fields and copy the generated output; no coding required." },
    { q: "Can I use the output on multiple sites?", a: "Yes — generate fresh output for as many pages or sites as you need." },
  ],
  writing: (tool) => [
    { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    processingFaq(tool),
    { q: "Can I use this for commercial work?", a: "Yes — there are no restrictions on how you use the output." },
    { q: "Is there a text length limit?", a: "Very long input may render more slowly, but there's no hard limit for typical use." },
  ],
  calculator: (tool) => [
    { q: `Is the ${tool.name} accurate?`, a: "Yes — it uses the standard formula for this calculation; results are for informational purposes and shouldn't replace professional advice for major decisions." },
    { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    processingFaq(tool),
    { q: "Can I use this on mobile?", a: "Yes — it works on any modern browser, desktop or mobile." },
  ],
  design: (tool) => [
    { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    { q: "Can I copy the generated CSS directly into my project?", a: "Yes — the output is standard CSS, ready to paste into any stylesheet." },
    { q: "Does the preview match what I'll see in production?", a: "The live preview reflects standard CSS rendering — always verify in your actual target browsers for pixel-perfect results." },
    processingFaq(tool),
  ],
};

const GENERIC_GENERATE_FAQS = (tool: Tool): ToolFaq[] => [
  { q: `Is ${tool.name} free to use?`, a: "Yes — completely free, with no signup required." },
  processingFaq(tool),
  { q: "Can I use the result for commercial projects?", a: "Yes — there are no restrictions on how you use the output." },
  { q: "Is there a limit on how many times I can use this?", a: "No — use it as many times as you need, completely free." },
];

function fallbackTitle(tool: Tool): string {
  // Google truncates titles past ~60 characters — longer tool names (e.g.
  // "Cron Expression Generator") push the full "Online — Free, No Signup"
  // suffix over that limit, so drop "Online" for those rather than let the
  // title get cut off mid-word in search results.
  const full = `${tool.name} Online — Free, No Signup | SaaSToolz`;
  return full.length <= 60 ? full : `${tool.name} — Free, No Signup | SaaSToolz`;
}

function fallbackDescription(tool: Tool): string {
  const fileBased = isFileTool(tool.id);
  const suffix =
    tool.processing === "client"
      ? "100% free, no signup required — everything runs instantly in your browser and nothing you enter is ever uploaded."
      : fileBased
        ? "Free, no signup, no watermark — files are uploaded securely and permanently removed from our servers within 1 hour."
        : "Free, no signup, no usage limits — processed securely and never stored on our servers.";
  return `${tool.description}. ${suffix}`;
}

export function getToolSeo(tool: Tool): ToolSeoContent {
  const override = OVERRIDES[tool.id];
  if (override) return override;

  const fileBased = isFileTool(tool.id);
  const steps = fileBased
    ? FILE_STEPS(tool.name)
    : (NON_FILE_STEP_TEMPLATES[tool.category]?.(tool.name) ?? GENERIC_GENERATE_STEPS(tool.name));
  const faqs = fileBased
    ? FILE_FAQS(tool)
    : (NON_FILE_FAQ_BANK[tool.category]?.(tool) ?? GENERIC_GENERATE_FAQS(tool));
  const introSuffix =
    tool.processing === "client"
      ? "Everything happens instantly in your browser — nothing you enter is sent to a server."
      : fileBased
        ? "Files are uploaded securely and removed from our servers within 1 hour."
        : "Your input is sent to our servers to process the request; we don't store the content itself.";

  return {
    title: fallbackTitle(tool),
    metaDescription: fallbackDescription(tool),
    intro: `${tool.name} lets you ${tool.description.charAt(0).toLowerCase()}${tool.description.slice(1)} — no account needed. ${introSuffix}`,
    steps,
    faqs,
  };
}

// ─── Curated "related tools" overrides ────────────────────────────────────────
//
// The default related-tools list is same-category siblings, which works well
// for most tools but is a poor fit for a few — e.g. invoice-generator sits in
// "writing" alongside case-converter and slug-generator, none of which anyone
// building an invoice actually needs next. A curated list is more genuinely
// useful and passes more relevant internal link equity than a category match.
export const RELATED_TOOL_OVERRIDES: Partial<Record<string, string[]>> = {
  "invoice-generator": ["gst-calculator", "currency-converter", "contract-builder", "word-to-pdf", "pdf-sign"],
  // qr-generator sits in "image" alongside 16 mostly-unrelated tools (photo
  // editors, color converters) — the category default's first-6 slice would
  // miss barcode-generator entirely since it's near the end of that array.
  "qr-generator": ["barcode-generator", "color-picker", "hex-to-rgb", "favicon-generator"],
  // password-generator sits in "writing" alongside case-converter and other
  // plain-text utilities — its actual companions (hash/uuid generators) are
  // in the "developer" category and would never show via a same-category match.
  "password-generator": ["username-generator", "hash-generator", "uuid-generator"],
};
