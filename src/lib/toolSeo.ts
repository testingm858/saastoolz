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
      { q: "Which compression level should I pick?", a: "Recommended for most cases. Text stays selectable and sharp at every level. Use Lossless if no image may change at all; use Smallest only when you're up against a hard size limit, like a 5MB upload cap." },
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
      "Turn a PDF into an editable Word (.docx) file while keeping the original layout, fonts and images intact. Free, fast, no signup, no watermark on the download.",
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
  "bmi-calculator": {
    title: "BMI Calculator — Free, Metric & Imperial | SaaSToolz",
    metaDescription:
      "Calculate your Body Mass Index in metric or imperial units, with your category and healthy weight range for your height. Free, instant, no signup.",
    intro:
      "BMI Calculator divides your weight by your height squared (metric: kg / m², imperial: 703 × lb / in²) to give your Body Mass Index, your category (underweight, normal, overweight, obese per WHO thresholds), and the healthy weight range for your exact height.",
    steps: [
      "Choose metric (kg, cm) or imperial (lb, inches) units.",
      "Enter your weight and height.",
      "Click \"Calculate BMI\" to see your BMI, category, and healthy weight range.",
      "Switch units any time — the same figures are recalculated instantly.",
    ],
    faqs: [
      { q: "What do the BMI categories mean?", a: "Below 18.5 is underweight, 18.5–24.9 is normal weight, 25–29.9 is overweight, and 30+ is obese, using the WHO's standard adult thresholds." },
      { q: "Is BMI accurate for everyone?", a: "No — it's a quick screening ratio of weight to height, not a measure of body fat or fitness. It doesn't distinguish muscle from fat, so a muscular person can show a higher BMI without excess fat. It also isn't designed for children, who are assessed on age-and-sex growth charts instead." },
      { q: "How is the healthy weight range worked out?", a: "By applying the normal-BMI boundaries (18.5 and 24.9) to your own height, so you get a weight range in kg or lb rather than just a single BMI number." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your weight and height are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this medical advice?", a: "No. This is general information, not medical advice — speak to a doctor or other qualified health professional about your weight or health." },
    ],
  },
  "age-calculator": {
    title: "Age Calculator — Exact Years, Months & Days | SaaSToolz",
    metaDescription:
      "Calculate exact age in years, months and days between two dates, including total days elapsed. Free, instant, no signup.",
    intro:
      "Age Calculator works out the exact time between a birth date and today (or any other date you choose), broken down into years, months and days, plus the total number of days elapsed — correctly handling different month lengths and leap years.",
    steps: [
      "Enter the birth date (or starting date).",
      "Optionally set a different \"as of\" date — defaults to today.",
      "Click \"Calculate Age\" to see the result in years, months and days.",
      "Check the total days elapsed shown alongside the breakdown.",
    ],
    faqs: [
      { q: "How is the months-and-days part calculated?", a: "By counting whole years first, then whole months within the current year, then the remaining days — borrowing a month's worth of days from the previous calendar month when the day-of-month hasn't been reached yet, so the result matches how you'd count age by hand." },
      { q: "Does it account for leap years?", a: "Yes — the calculation uses real calendar dates throughout, so February 29th and variable month lengths are handled automatically rather than assumed to be a fixed number of days." },
      { q: "Can I calculate the age on a future or past date, not just today?", a: "Yes — set the \"as of\" date to any date after the birth date, useful for working out how old someone was (or will be) on a specific event date." },
      { q: "Does this tool send my dates to a server?", a: "Yes — the dates are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "regex-tester": {
    title: "Regex Tester — Live Matches, Groups & Flags | SaaSToolz",
    metaDescription:
      "Test a regular expression against your text and see every match, capture group and index highlighted live. Free, instant, no signup.",
    intro:
      "Regex Tester runs your pattern against a test string and shows every match, its position, and any capture groups — so you can see exactly what a regular expression does before you put it in real code.",
    steps: [
      "Type or paste your regular expression pattern.",
      "Set any flags you need (g, i, m, s, u, y).",
      "Paste the text you want to test it against.",
      "Matches, their positions, and capture groups update as you type.",
    ],
    faqs: [
      { q: "Which regex flags are supported?", a: "g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode) and y (sticky) — the standard JavaScript regex flags." },
      { q: "Why would a pattern time out instead of matching?", a: "Some patterns (nested quantifiers like (a+)+ against certain input) can trigger catastrophic backtracking, where matching time explodes exponentially. Matches are run with a 1-second limit so a runaway pattern fails fast with a clear message instead of hanging." },
      { q: "Does this tool send my pattern and text to a server?", a: "Yes — both are sent to our servers to run the match and the result is returned to you; we don't store them." },
      { q: "Can I test capture groups?", a: "Yes — each match shows its full text, its index in the string, and the text captured by every group in the pattern." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "uuid-generator": {
    title: "UUID Generator — Free, Bulk v4 UUIDs | SaaSToolz",
    metaDescription:
      "Generate cryptographically random v4 UUIDs one at a time or in bulk, up to 1000 at once. Free, instant, no signup.",
    intro:
      "UUID Generator creates version 4 (random) UUIDs using the browser's or server's cryptographic random number generator — the standard way to generate unique identifiers with no coordination needed between systems.",
    steps: [
      "Choose how many UUIDs you need (up to 1000 at once).",
      "Click \"Generate\" to create them instantly.",
      "Copy a single UUID, or copy the whole list at once.",
      "Generate again any time for a fresh, unrelated set.",
    ],
    faqs: [
      { q: "What's a v4 UUID, and why that version?", a: "Version 4 UUIDs are generated from random bits rather than from a timestamp or hardware address (as v1 does), which avoids leaking when or where they were created and is the version almost every modern system expects by default." },
      { q: "How likely is a collision?", a: "Astronomically unlikely — a v4 UUID has 122 random bits, so you'd need to generate billions of UUIDs per second for centuries before a coincidental duplicate became plausible." },
      { q: "Is the randomness actually secure?", a: "Yes — generation uses the platform's cryptographic random number generator (crypto.randomUUID()), not a predictable pseudo-random source." },
      { q: "Does this tool send anything to a server?", a: "Yes — the generation request is sent to our servers and the UUIDs are returned to you; nothing is stored." },
      { q: "Is there a limit on how many I can generate?", a: "Up to 1000 UUIDs per request — generate again as many times as you need." },
    ],
  },
  "audio-watermark": {
    title: "Audio Watermark — Protect Preview Tracks | SaaSToolz",
    metaDescription:
      "Mix a watermark clip into your track at an adjustable volume, so previews stay protected until payment. Free, no signup, outputs MP3.",
    intro:
      "Audio Watermark loops a short watermark clip (a spoken tag or stamped sound) continuously under your main track at a volume you set, producing a single MP3 you can safely send as a preview before a sale or license is confirmed.",
    steps: [
      "Upload your main track and a short watermark clip.",
      "Set the watermark volume relative to the main track (0–100%).",
      "Click \"Add Watermark\" to mix and render the result.",
      "Download the watermarked MP3 and use it for every preview or demo link.",
    ],
    faqs: [
      { q: "What happens if the watermark clip is shorter than the main track?", a: "It loops continuously for the full length of the main track, so the watermark is present throughout, not just once at the start." },
      { q: "What format is the output?", a: "A single MP3 file, regardless of the input formats, so it's easy to share anywhere." },
      { q: "How loud should the watermark be?", a: "Loud enough that the track is unusable without paying for the clean version, but not so loud it drowns out the music a buyer needs to evaluate. Test a few volume levels and listen on more than one device before settling on one." },
      { q: "Does this tool send my audio to a server?", a: "Yes — your files are uploaded securely, processed to mix the watermark in, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the tool itself." },
    ],
  },
  "currency-converter": {
    title: "Currency Converter — 30 Currencies, Daily Rates | SaaSToolz",
    metaDescription:
      "Convert between 30 major currencies using daily European Central Bank reference rates. Free, instant, no signup, no API key needed.",
    intro:
      "Currency Converter converts an amount between any two of 30 major currencies using the European Central Bank's daily reference exchange rates, so the figure you get reflects that day's official rate rather than a marked-up or delayed one.",
    steps: [
      "Enter the amount you want to convert.",
      "Choose the currency you're converting from.",
      "Choose the currency you're converting to.",
      "The converted amount and the exact rate used are shown instantly.",
    ],
    faqs: [
      { q: "Which currencies are supported?", a: "30 major currencies published daily by the European Central Bank, including USD, EUR, GBP, JPY, CAD, AUD, INR and most other widely traded currencies. Smaller or pegged currencies outside the ECB's daily list aren't included." },
      { q: "How current are the exchange rates?", a: "Rates come from the ECB's daily reference rates, updated once per business day — not real-time trading rates, so they're a close but not tick-by-tick match to what a bank or exchange would quote at a given moment." },
      { q: "Is this accurate enough for sending money abroad?", a: "Use it to estimate amounts, not to price an actual transfer — banks and money-transfer services add their own margin on top of the reference rate, so the amount you receive will differ from a pure conversion." },
      { q: "Does this tool send my amount to a server?", a: "Yes — the amount and currencies are sent to our servers to fetch the rate and compute the result; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no API key required." },
    ],
  },
  "hex-to-rgb": {
    title: "HEX to RGB Converter — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert HEX color codes to RGB and HSL values instantly, in your browser. Free, no signup, no ads on results.",
    intro:
      "HEX to RGB converts a hex color code (like #7c3aed) into its RGB values (red, green and blue, each 0–255) and HSL values (hue, saturation, lightness), updating instantly as you type or pick a color.",
    steps: [
      "Type a hex color code, or use the color picker.",
      "The RGB values (0–255 for red, green, blue) appear instantly.",
      "The equivalent HSL values are shown alongside.",
      "Copy whichever format your code or design tool needs.",
    ],
    faqs: [
      { q: "Why do I need both RGB and HSL?", a: "RGB is how screens actually store color, so it's what most code expects. HSL (hue, saturation, lightness) is easier for humans to reason about — for example, lowering lightness darkens a color without changing its hue, which isn't a simple operation in RGB." },
      { q: "Does this tool send my color to a server?", a: "No — the conversion happens entirely in your browser; nothing you enter is transmitted or stored." },
      { q: "Does it support 3-digit hex codes like #fff?", a: "Yes — shorthand 3-digit hex codes are expanded to their full 6-digit equivalent automatically before conversion." },
      { q: "Can I go the other way, from RGB to HEX?", a: "Yes — use RGB to HEX for the reverse conversion." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "webhook-tester": {
    title: "Webhook Tester — Free Temporary Inspection URL | SaaSToolz",
    metaDescription:
      "Get a temporary URL, send it real webhook requests, and inspect the exact headers and body received. Free, no signup, 30-minute sessions.",
    intro:
      "Webhook Tester gives you a temporary, unique URL you can paste into Stripe, GitHub, a payment provider, or anything else that sends webhooks — then shows you the exact method, headers and body of every request that arrives, so you can debug an integration without deploying any code.",
    steps: [
      "Click \"Generate URL\" to get a temporary, unique webhook endpoint.",
      "Paste that URL into the service you're testing (Stripe, GitHub, etc.).",
      "Trigger the event from that service, or send a request yourself.",
      "Watch the request's method, headers and body appear as they arrive.",
    ],
    faqs: [
      { q: "How long does the URL stay active?", a: "30 minutes from when it's generated. Generate a new one any time you need a fresh session." },
      { q: "Is there a limit on the request body size?", a: "Yes — up to 1MB is accepted, and up to 10,000 characters of the body are stored for display; this covers virtually every real-world webhook payload." },
      { q: "Can any service send a request to the URL?", a: "Yes — the URL accepts requests from anywhere with no authentication required, by design, since the whole point is that an external service (which you don't control) can reach it directly. Treat the URL as disposable: don't reuse it beyond the session, and don't rely on it for anything sensitive." },
      { q: "What happens to the captured requests afterward?", a: "They exist only for the 30-minute session and are not kept once it expires." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "mortgage-calculator": {
    title: "Mortgage Calculator — Payment & Amortization | SaaSToolz",
    metaDescription:
      "Calculate your monthly mortgage payment, total interest, and a full amortization schedule from home price, down payment and rate. Free, instant.",
    intro:
      "Mortgage Calculator works out your loan amount from the home price and down payment, then calculates the monthly payment, total interest over the full term, and an amortization schedule showing how much of each payment goes to principal versus interest.",
    steps: [
      "Enter the home price and your down payment percentage.",
      "Enter the annual interest rate and the loan term in years.",
      "Click \"Calculate\" to see your monthly payment and total interest.",
      "Review the amortization schedule to see the principal/interest split over time.",
    ],
    faqs: [
      { q: "How is the loan amount worked out?", a: "Home price minus your down payment (entered as a percentage) — that remaining amount is what the monthly payment and interest are calculated on." },
      { q: "Why does the interest portion shrink over time?", a: "Early payments are mostly interest, charged on the full remaining balance; as the balance shrinks with each payment, less interest accrues and more of the fixed payment goes toward principal. This is normal amortization, not an error." },
      { q: "Does this account for property tax, insurance or HOA fees?", a: "No — this calculates the principal-and-interest payment only, based on the loan amount, rate and term. Add your local tax, insurance and any fees separately for your real total monthly cost." },
      { q: "Can I use this for a loan term in months instead of years?", a: "Enter years — fractional years (like 2.5) are accepted and converted to the nearest whole month internally." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
    ],
  },
  "timezone-calculator": {
    title: "Time Zone Converter — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert a date and time between any two IANA time zones, handling daylight saving automatically. Free, instant, no signup.",
    intro:
      "Time Zone Converter takes a date and time in one time zone and shows the equivalent moment in another, using each zone's official IANA name (like \"America/New_York\" or \"Asia/Tokyo\") so daylight saving transitions are applied automatically and correctly for that specific date.",
    steps: [
      "Enter the date and time you want to convert.",
      "Choose the source time zone.",
      "Choose the destination time zone.",
      "The converted local time in both zones is shown instantly.",
    ],
    faqs: [
      { q: "Why use zone names like \"Europe/London\" instead of GMT/UTC offsets?", a: "A fixed offset (like UTC+1) doesn't know about daylight saving, so it gives the wrong answer for half the year in many regions. A named zone carries its own daylight-saving rules, so the conversion is correct for the specific date you enter, not just a snapshot offset." },
      { q: "Does it handle daylight saving automatically?", a: "Yes — because the conversion uses the full IANA time zone database via the browser and server's built-in date handling, not a fixed offset, transitions are applied correctly based on the date you enter." },
      { q: "What date format should I use?", a: "A standard date-and-time format such as 2026-07-15T14:00:00. If the input isn't a valid date, you'll get a clear error rather than a silently wrong result." },
      { q: "Does this tool send my input to a server?", a: "Yes — the date and zone names are sent to our servers to compute the result and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "redirect-checker": {
    title: "Redirect Checker — Trace the Full Chain | SaaSToolz",
    metaDescription:
      "Follow a URL through every redirect, up to 10 hops, and see each address with its status code and the final destination. Free, instant.",
    intro:
      "Redirect Checker follows a URL through up to 10 redirect hops, showing the status code at every step and the final destination it lands on — so you can confirm a redirect goes straight to the right place instead of chaining through several unnecessary steps.",
    steps: [
      "Enter the URL you want to check.",
      "Click \"Check Redirects\" to follow the chain.",
      "Review each hop's URL and status code in order.",
      "Check the final destination matches what you expect.",
    ],
    faqs: [
      { q: "How many redirects will it follow?", a: "Up to 10 hops. If a chain is still redirecting after 10 steps, that's almost always a sign of a loop or a configuration problem worth fixing on its own." },
      { q: "What's the difference between a 301 and a 302?", a: "A 301 means the move is permanent, and search engines transfer most of the old page's ranking value to the new address. A 302 means temporary, and the original address stays the one search engines index. Use 301 for anything that moved for good." },
      { q: "Why does a redirect chain matter for SEO?", a: "Each extra hop adds load time and a small chance the chain breaks somewhere. The ideal is one redirect straight to the final address — see our guide to canonical URLs, redirects and hreflang for the full picture." },
      { q: "Does this tool send the URL to a server?", a: "Yes — the URL is fetched from our servers to trace the chain; the URL itself isn't stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "bmr-calculator": {
    title: "BMR Calculator — Mifflin-St Jeor Formula | SaaSToolz",
    metaDescription:
      "Calculate your Basal Metabolic Rate — the calories your body burns at rest — using the Mifflin-St Jeor formula. Free, instant, no signup.",
    intro:
      "BMR Calculator estimates your Basal Metabolic Rate, the calories your body burns at complete rest just to keep breathing, circulating blood and maintaining temperature, using the Mifflin-St Jeor formula: 10 × weight(kg) + 6.25 × height(cm) − 5 × age, plus 5 for men or minus 161 for women.",
    steps: [
      "Enter your weight and height.",
      "Enter your age and sex.",
      "Click \"Calculate BMR\" to see your estimated resting calorie burn.",
      "Use the result as the base for the Calorie Calculator if you want your full daily number including activity.",
    ],
    faqs: [
      { q: "What is BMR, exactly?", a: "The calories your body uses just to stay alive at rest — breathing, circulation, maintaining temperature — before any movement or activity is counted. For most people it's the largest share of total daily calorie burn." },
      { q: "Why does the formula need my age and sex?", a: "Resting metabolism naturally declines with age and differs on average between men and women, mainly due to differences in typical muscle mass; the formula's age and sex terms adjust for that." },
      { q: "Is this my full daily calorie burn?", a: "No — BMR is calories at complete rest only. For your estimated total daily burn including activity, use the Calorie Calculator, which applies an activity multiplier on top of this BMR figure." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this medical advice?", a: "No. This is a general estimate, not medical advice — speak to a doctor or registered dietitian about your own calorie or health needs." },
    ],
  },
  "percentage-calculator": {
    title: "Percentage Calculator — 3 Common Calculations | SaaSToolz",
    metaDescription:
      "Find X% of a number, the percentage change between two values, or what percentage one number is of another. Free, instant, no signup.",
    intro:
      "Percentage Calculator covers the three percentage questions people actually need: what is X% of a number, what's the percentage increase or decrease between two values, and what percentage one number is of another — each with its own clear formula so the result is easy to check by hand.",
    steps: [
      "Choose the calculation you need: \"X% of Y\", percentage change, or \"what % is X of Y\".",
      "Enter the two numbers it asks for.",
      "Click \"Calculate\" to see the result instantly.",
      "Switch calculation types any time without re-entering your numbers from scratch.",
    ],
    faqs: [
      { q: "What's the difference between the three calculation types?", a: "\"X% of Y\" answers questions like a tip or discount amount. \"Percentage change\" answers how much a value grew or shrank, always measured against the starting value. \"What percent is X of Y\" answers questions like a test score or budget share." },
      { q: "Why isn't a 25% increase undone by a 25% decrease?", a: "Because each percentage is calculated against a different base — the starting value changes after the first calculation, so the two percentages aren't symmetrical. See our full guide to percentage formulas for worked examples." },
      { q: "Can I calculate a percentage decrease, not just an increase?", a: "Yes — the percentage change calculation returns a negative result automatically when the second value is lower than the first." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — the numbers are sent to our servers to compute the result and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "favicon-generator": {
    title: "Favicon Generator — Free Full Icon Set | SaaSToolz",
    metaDescription:
      "Upload one image and get a complete favicon set (16px to 512px, plus Apple touch icon) as a zip, with the HTML to paste in. Free, instant.",
    intro:
      "Favicon Generator takes one image and produces the full set of icon sizes a modern site needs — 16×16 and 32×32 browser favicons, a 180×180 Apple touch icon, and 192×192 and 512×512 Android/PWA icons — bundled into a zip with the exact HTML tags to paste into your page's head.",
    steps: [
      "Upload a square image (your logo or icon works best).",
      "Click \"Generate\" to create every standard size.",
      "Download the zip containing all five PNG files.",
      "Paste the included HTML snippet into your site's <head>.",
    ],
    faqs: [
      { q: "Which sizes are included?", a: "16×16 and 32×32 (standard browser favicons), 180×180 (Apple touch icon), and 192×192 and 512×512 (Android Chrome and PWA icons) — the sizes covered by every current browser and app manifest." },
      { q: "Why PNG files instead of a single .ico file?", a: "A .ico file is a separate container format bundling multiple resolutions, which isn't what most sites actually need today — every modern browser accepts a plain PNG as a favicon via the HTML tag, so you get simpler, directly-usable files instead." },
      { q: "What image should I upload?", a: "A square image works best, since every output size is cropped to a square. A simple logo or icon reads much better at 16×16 than detailed artwork, which can turn into a blur at the smallest sizes." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, resized into the full set, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "meeting-cost": {
    title: "Meeting Cost Calculator — Free, Instant | SaaSToolz",
    metaDescription:
      "See the real cost of a meeting from attendee count, average salary and duration — often a useful reality check before scheduling one. Free, instant.",
    intro:
      "Meeting Cost Calculator multiplies the number of attendees by their average hourly salary and the meeting's duration to show what a meeting actually costs in salary time — a number that's easy to ignore until you see it.",
    steps: [
      "Enter the number of attendees.",
      "Enter their average hourly salary.",
      "Enter the meeting's duration in minutes.",
      "The total cost and cost per minute are shown instantly.",
    ],
    faqs: [
      { q: "How is the cost calculated?", a: "Attendees × average hourly salary × (duration in minutes ÷ 60) — the straightforward total of everyone's time, valued at their hourly rate, for the length of the meeting." },
      { q: "Where do I get an \"average hourly salary\" figure?", a: "Take the group's average annual salary and divide by roughly 2,080 (standard full-time hours per year) for a reasonable estimate, or use a rate you already track for cost purposes." },
      { q: "Does this include overhead, not just salary?", a: "No — this is a straightforward salary-time calculation only. Benefits, overhead and opportunity cost would push the real figure higher; treat the result as a conservative baseline, not the full cost." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "calorie-calculator": {
    title: "Calorie Calculator — BMR, TDEE & Targets | SaaSToolz",
    metaDescription:
      "Calculate your daily calorie needs from BMR and activity level, with targets for mild and standard weight loss or gain. Free, instant, no signup.",
    intro:
      "Calorie Calculator estimates your Basal Metabolic Rate (Mifflin-St Jeor formula), multiplies it by an activity-level factor to estimate your maintenance calories (your TDEE), and shows targets 250 and 500 calories below or above that for mild or standard weight loss and gain.",
    steps: [
      "Enter your weight, height, age and sex.",
      "Choose your activity level, from sedentary to very active.",
      "Click \"Calculate\" to see your BMR and maintenance calories.",
      "Review the weight-loss and weight-gain targets alongside your maintenance figure.",
    ],
    faqs: [
      { q: "What's the difference between BMR and the calorie number this tool gives me?", a: "BMR is calories burned at complete rest. This tool multiplies that by an activity-level factor (1.2 for sedentary up to 1.9 for very active) to estimate your total daily calories including movement and exercise, often called TDEE." },
      { q: "How should I choose my activity level?", a: "Be honest rather than aspirational — most people overestimate it. \"Sedentary\" means a desk job with little or no exercise; \"light\" means exercising roughly 1–3 days a week. Choosing one level too high will overstate your calorie needs." },
      { q: "What do the weight-loss and weight-gain targets mean?", a: "They're your maintenance calories adjusted by 250 or 500 calories in either direction — a smaller gap for a gradual change, a larger one for a faster change. Very low intakes aren't shown, since cutting too far isn't safe without professional guidance." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this medical or dietary advice?", a: "No. This is a general estimate, not medical or dietary advice — speak to a doctor or registered dietitian before making a significant change to your eating." },
    ],
  },
  "canonical-url": {
    title: "Canonical URL Generator — Free, Instant | SaaSToolz",
    metaDescription:
      "Generate a correct canonical tag from any URL, with the address normalized and ready to paste into your page's head. Free, instant, no signup.",
    intro:
      "Canonical URL Generator normalizes a URL (resolving it to a proper absolute address) and produces the exact <link rel=\"canonical\"> tag to paste into a page's head, so search engines know which version of a page to treat as the real one when several addresses could reach it.",
    steps: [
      "Enter the URL you want to canonicalize.",
      "Click \"Generate\" to normalize it into a proper absolute address.",
      "Copy the ready-to-paste <link rel=\"canonical\"> tag.",
      "Add it inside the <head> of the matching page.",
    ],
    faqs: [
      { q: "Why does a page need a canonical tag at all?", a: "The same page is often reachable through several addresses — with or without www, with a trailing slash, or with tracking parameters attached. Without a canonical tag, search engines can treat these as separate duplicate pages and split ranking signals between them." },
      { q: "Should a page ever point its canonical at a different page?", a: "Usually a page should canonicalize to itself. Pointing it elsewhere is for genuine duplicates, like a printer-friendly version that should defer to the main article." },
      { q: "Is a canonical tag a strict instruction to search engines?", a: "It's treated as a strong hint, not an absolute command — search engines usually follow it, but may choose differently if other signals (like internal links) disagree with it." },
      { q: "Does this tool send the URL to a server?", a: "Yes — the URL is sent to our servers to normalize it and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "cron-generator": {
    title: "Cron Expression Explainer — Free, Instant | SaaSToolz",
    metaDescription:
      "Paste a 5-field cron expression and see exactly what each field means in plain English. Free, instant, no signup.",
    intro:
      "Cron Expression Explainer takes a standard 5-field cron schedule (minute, hour, day of month, month, day of week) and breaks down exactly what each field means in plain English, so you can confirm a schedule does what you intended before it runs unattended on a server.",
    steps: [
      "Paste your cron expression (5 fields, separated by spaces).",
      "Click \"Explain\" to see each field broken down.",
      "Check the plain-English explanation matches the schedule you intended.",
      "Adjust and re-check until it reads the way you expect.",
    ],
    faqs: [
      { q: "What are the 5 fields, in order?", a: "Minute, hour, day of month, month, and day of week — in that order. Each can be a specific value, a range, a list, a step (like */5), or an asterisk meaning \"every\"." },
      { q: "What if my expression has 6 fields instead of 5?", a: "Some schedulers (like Quartz) add a seconds field at the start, which isn't standard cron. This tool expects the standard 5-field format; drop the extra field before pasting it in." },
      { q: "Why does a schedule sometimes run on both a day-of-month AND a day-of-week match?", a: "Standard cron treats day-of-month and day-of-week as an \"or\" when both are set to something other than *, which surprises people expecting \"and\". See our full guide to cron expressions for worked examples of this exact trap." },
      { q: "Does this tool send my expression to a server?", a: "Yes — it's sent to our servers to parse and explain, and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "word-to-html": {
    title: "Word to HTML Converter — Free, Clean Output | SaaSToolz",
    metaDescription:
      "Convert a .docx Word document into clean, pasteable HTML in seconds. Free, no signup, no watermark on the output.",
    intro:
      "Word to HTML converts a modern .docx Word document into clean HTML you can paste straight into a CMS, email template or web page — preserving headings, lists, links and basic formatting without the bloated markup Word itself produces when you \"Save as HTML\".",
    steps: [
      "Upload your .docx Word document.",
      "Click \"Convert\" to generate the HTML.",
      "Review the output in the preview.",
      "Copy or download the clean HTML.",
    ],
    faqs: [
      { q: "Does this work with the old .doc format?", a: "No — only the modern .docx format (the zip-and-XML based format every version of Word since 2007 saves by default) is supported. If you have an old .doc file, open and re-save it as .docx in Word first." },
      { q: "Is the output safe to paste directly onto my site?", a: "Links are checked before being included — only safe schemes (https, mailto, tel, in-page anchors, relative paths) are kept, and anything else is neutralized, which protects against a document carrying a hidden malicious link through to your page." },
      { q: "Will complex formatting like tables and images convert perfectly?", a: "Common formatting — headings, lists, bold/italic, links, basic tables — converts cleanly. Very complex layouts, embedded objects, or unusual Word-specific formatting may need manual cleanup afterward." },
      { q: "Does this tool send my document to a server?", a: "Yes — your file is uploaded securely, converted, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "css-formatter": {
    title: "CSS Formatter — Free, Instant Beautifier | SaaSToolz",
    metaDescription:
      "Format messy or minified CSS into clean, properly indented, readable code in seconds. Free, instant, no signup.",
    intro:
      "CSS Formatter takes compressed or inconsistently-formatted CSS and rewrites it with consistent indentation and line breaks — one rule, one declaration, one brace per line — so it's actually readable and easy to edit, without changing a single style rule.",
    steps: [
      "Paste your CSS, minified or messy.",
      "Click \"Format\" to beautify it instantly.",
      "Review the cleanly indented result.",
      "Copy the formatted CSS.",
    ],
    faqs: [
      { q: "Does formatting change how the CSS behaves?", a: "No — only whitespace, indentation and line breaks change. Every selector, property and value stays exactly as it was, so the formatted file renders identically to the original." },
      { q: "What's the opposite of this tool?", a: "CSS Minifier strips whitespace and comments to shrink a file for production. Use that once you're done editing and ready to ship the smallest possible file." },
      { q: "Can I format CSS with comments in it?", a: "Yes — comments are preserved in the formatted output, unlike minifying, which strips them." },
      { q: "Does this tool send my CSS to a server?", a: "Yes — it's sent to our servers to format and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "gradient-generator": {
    title: "CSS Gradient Generator — Free, Instant Code | SaaSToolz",
    metaDescription:
      "Build a linear or radial CSS gradient visually and copy the ready-to-use code. Free, instant, no signup.",
    intro:
      "Gradient Generator lets you pick colors and a direction, then shows a live preview alongside the exact CSS code — linear-gradient or radial-gradient — ready to paste straight into your stylesheet.",
    steps: [
      "Choose your gradient colors.",
      "Set the direction or shape (linear or radial).",
      "Preview the gradient update live as you adjust it.",
      "Copy the generated CSS code.",
    ],
    faqs: [
      { q: "What's the difference between linear and radial gradients?", a: "A linear gradient transitions colors in a straight line across a chosen angle. A radial gradient transitions outward from a center point in a circle or ellipse. Pick based on the shape you want the color transition to follow." },
      { q: "Can I use more than two colors?", a: "Yes — add as many color stops as you need, each with its own position along the gradient, for a multi-color transition." },
      { q: "Will the generated CSS work in every browser?", a: "The standard linear-gradient() and radial-gradient() syntax is supported by every current major browser, so the code works without needing vendor prefixes." },
      { q: "Does this tool send anything to a server?", a: "No — the gradient is built and rendered entirely in your browser; nothing you choose is transmitted or stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "jwt-decoder": {
    title: "JWT Decoder — Free, Instant Header & Payload | SaaSToolz",
    metaDescription:
      "Paste a JWT and instantly see its decoded header, payload and expiry status. Free, instant, no signup — nothing is verified or stored.",
    intro:
      "JWT Decoder splits a JSON Web Token into its three parts, decodes the header and payload from Base64 into readable JSON, and checks the token's exp claim against the current time to tell you plainly whether it's expired.",
    steps: [
      "Paste your JWT (the full header.payload.signature string).",
      "The decoded header and payload appear instantly as readable JSON.",
      "Check the expiry status, shown clearly if the token has an exp claim.",
      "Copy any part you need for debugging.",
    ],
    faqs: [
      { q: "Does this verify the token's signature?", a: "No — this only decodes the header and payload, which is possible for anyone since JWTs are Base64-encoded, not encrypted. It does not check whether the signature is valid, since that requires the issuer's secret or public key, which this tool never asks for." },
      { q: "How is \"expired\" determined?", a: "If the payload has an exp claim (a Unix timestamp), it's compared against the current time. A token with no exp claim is reported as not expired, since there's nothing to check it against." },
      { q: "Is it safe to paste a real token from my application here?", a: "Treat any JWT as sensitive, since its payload is fully readable to anyone who has it. For production tokens, prefer decoding ones from a test or staging environment where possible." },
      { q: "Does this tool send my token to a server?", a: "Yes — the token is sent to our servers to decode and the result is returned to you; it isn't stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "roi-calculator": {
    title: "ROI Calculator — Free, Instant Return % | SaaSToolz",
    metaDescription:
      "Calculate return on investment from your gain and cost, as a percentage and a net profit figure. Free, instant, no signup.",
    intro:
      "ROI Calculator takes what you gained from an investment and what it cost, then returns both the net profit and the return on investment as a percentage — (gain − cost) ÷ cost × 100 — so you can compare the result across different investments on equal footing.",
    steps: [
      "Enter the total gain (what the investment returned).",
      "Enter the cost (what you put in).",
      "Click \"Calculate\" to see your net profit and ROI percentage.",
      "Compare the ROI figure against other investments or opportunities.",
    ],
    faqs: [
      { q: "What's the actual formula?", a: "Net profit is gain minus cost. ROI percentage is that net profit divided by the cost, multiplied by 100 — so a 1,000 cost that returns 1,300 gives a net profit of 300 and an ROI of 30%." },
      { q: "Does this account for the time the investment took?", a: "No — this is a simple ROI figure, not an annualized return. A 30% ROI over one month and a 30% ROI over five years are very different outcomes in practice, so factor in the time period yourself when comparing options." },
      { q: "Can ROI be negative?", a: "Yes — if the gain is less than the cost, both the net profit and ROI percentage come back negative, showing a loss rather than a return." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "image-rotate": {
    title: "Rotate Image Online — Free, Any Angle | SaaSToolz",
    metaDescription:
      "Rotate an image by any angle, not just 90-degree steps, directly in your browser. Free, instant, no signup, no watermark.",
    intro:
      "Rotate Image turns an image by the exact angle you specify, not just fixed 90-degree steps — useful for straightening a tilted phone photo of a document as well as standard quarter-turn rotations.",
    steps: [
      "Upload the image you want to rotate.",
      "Enter the rotation angle in degrees.",
      "Click \"Rotate\" to process it.",
      "Download the rotated image.",
    ],
    faqs: [
      { q: "Can I rotate by an angle other than 90, 180 or 270 degrees?", a: "Yes — any angle is accepted, which is what makes this different from a simple quarter-turn rotate button. A small angle like 3 or 5 degrees is exactly what you need to straighten a slightly tilted scan or photo." },
      { q: "What happens to the corners when I rotate at an odd angle?", a: "Rotating at an angle that isn't a multiple of 90 degrees changes the image's bounding box, so the output canvas expands to fit the whole rotated image rather than cropping any of it off." },
      { q: "Does rotating affect image quality?", a: "The image is re-encoded after rotating, at a quality that keeps it visually close to the original. For large quality-sensitive rotations, start from the highest-resolution source you have." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, rotated, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "gst-calculator": {
    title: "GST / VAT Calculator — Add or Remove Tax | SaaSToolz",
    metaDescription:
      "Add GST or VAT to a price, or work the tax back out of a tax-inclusive total, at any rate. Free, instant, no signup.",
    intro:
      "GST / VAT Calculator works in both directions: add tax to a net price (price × (1 + rate)) to get the tax-inclusive total, or take a tax-inclusive total and work backward (total ÷ (1 + rate)) to find the original net amount and the tax within it.",
    steps: [
      "Enter the amount.",
      "Enter the tax rate as a percentage.",
      "Choose whether the amount is tax-exclusive (add tax) or tax-inclusive (remove tax).",
      "The base amount, tax, and total are shown instantly.",
    ],
    faqs: [
      { q: "Why can't I just subtract the tax rate from a tax-inclusive total?", a: "Because the tax was calculated on the smaller net amount, not the larger total — subtracting a straight percentage of the total always gives the wrong base. Dividing by (1 + rate) is the correct way to reverse it. See our full guide to adding and removing VAT or GST for worked examples of exactly this mistake." },
      { q: "What's the difference between \"exclusive\" and \"inclusive\" mode?", a: "Exclusive means your entered amount doesn't yet include tax, and the tool adds it. Inclusive means your amount already includes tax, and the tool extracts the tax and base amount from within it." },
      { q: "Does this work for any tax rate, not just one country's?", a: "Yes — enter whatever rate applies to you (5%, 15%, 20%, or any other), since the calculation is pure math and isn't tied to a specific country's rate." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tax advice?", a: "No. This is a general calculator, not tax advice — check your local tax authority's rules for your specific situation." },
    ],
  },
  "http-header-checker": {
    title: "HTTP Header Checker — Free, Instant | SaaSToolz",
    metaDescription:
      "Fetch any public URL and see its exact status code and response headers. Free, instant, no signup.",
    intro:
      "HTTP Header Checker sends a real request to a URL you give it and shows the exact status code and every response header that came back — useful for confirming caching, security or redirect headers are actually set the way you expect, without opening developer tools yourself.",
    steps: [
      "Enter the URL you want to inspect.",
      "Click \"Check Headers\" to fetch it.",
      "Review the status code returned.",
      "Scan the full list of response headers.",
    ],
    faqs: [
      { q: "Can I check any URL, including internal or private addresses?", a: "No — only public, routable addresses are allowed. Private and internal IP ranges are rejected before any request is made, which prevents this tool from being used to probe internal network addresses." },
      { q: "What headers are commonly worth checking?", a: "content-encoding (confirms compression is working), cache-control (confirms caching behavior), and security headers like strict-transport-security — all directly visible in the results here." },
      { q: "What's the difference between this and the Redirect Checker?", a: "This shows one request's full headers. Redirect Checker follows a chain of redirects and reports the status at each hop plus the final destination — use that when a URL might not go straight to its target." },
      { q: "Does this tool send the URL to a server?", a: "Yes — the request is made from our servers, which is what lets it check headers that a browser's own CORS restrictions would otherwise hide." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "html-encode": {
    title: "HTML Encoder/Decoder — Free, Instant | SaaSToolz",
    metaDescription:
      "Encode special characters to HTML entities, or decode entities back to plain text, instantly in your browser. Free, no signup.",
    intro:
      "HTML Encoder/Decoder converts the five characters that have special meaning in HTML (&, <, >, \" and ') into their safe entity form, or reverses the process to turn entities like &amp; back into plain text.",
    steps: [
      "Paste your text.",
      "Choose Encode (plain text to entities) or Decode (entities to plain text).",
      "The converted result appears instantly.",
      "Copy the result for wherever you need it.",
    ],
    faqs: [
      { q: "Why would I need to encode these characters?", a: "If a literal < or & ends up inside HTML content without encoding, a browser can misread it as the start of a tag or entity, breaking the page or, in the worst case, enabling injected content. Encoding makes the characters display safely as text." },
      { q: "Which characters does this convert?", a: "The five with HTML significance: & becomes &amp;, < becomes &lt;, > becomes &gt;, \" becomes &quot;, and ' becomes &#39;." },
      { q: "When would I need to decode instead?", a: "When you've received HTML-encoded text (for example, from an API or a CMS export) and need the actual readable characters back, such as turning &amp; back into &." },
      { q: "Does this tool send my text to a server?", a: "No — the conversion happens entirely in your browser; nothing you enter is transmitted or stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "yaml-formatter": {
    title: "YAML Formatter & Validator — Free, Instant | SaaSToolz",
    metaDescription:
      "Format YAML with consistent indentation and check it's valid in one step. Free, instant, no signup.",
    intro:
      "YAML Formatter cleans up indentation and spacing in a YAML document and checks it parses correctly — catching the indentation mistakes that are YAML's most common source of broken config files, since unlike JSON, YAML's structure is defined entirely by whitespace.",
    steps: [
      "Paste your YAML content.",
      "Click \"Format\" to clean up indentation and spacing.",
      "Check the validation result confirms it parses correctly.",
      "Copy the formatted YAML.",
    ],
    faqs: [
      { q: "Why is YAML so sensitive to indentation?", a: "Unlike JSON, which uses braces and brackets to show structure, YAML relies entirely on indentation level to show nesting — a single misplaced space changes what a document means, or breaks it outright. Consistent formatting is what prevents this." },
      { q: "What does validation actually check?", a: "Whether the document parses as valid YAML at all — not whether it matches a specific schema your particular tool (like Docker Compose or GitHub Actions) expects. A file can be valid YAML and still be wrong for its intended use." },
      { q: "Can tabs be used for indentation in YAML?", a: "No — the YAML specification doesn't allow tab characters for indentation, only spaces. A file with tabs will fail to parse, which this tool will flag as invalid." },
      { q: "Does this tool send my content to a server?", a: "Yes — it's sent to our servers to format and validate, and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "pdf-sign": {
    title: "PDF Signer — Free Signature Stamp | SaaSToolz",
    metaDescription:
      "Stamp a typed signature onto any page of a PDF in seconds. Free, no signup — a visual signature, not a certified digital one.",
    intro:
      "PDF Signer stamps your typed name onto a PDF in a cursive-style font, placed in the bottom-right corner of the page you choose (the last page by default) — a quick way to sign an informal document without printing, signing by hand, and scanning it back in.",
    steps: [
      "Upload your PDF.",
      "Type your signature text.",
      "Choose which page to sign (defaults to the last page).",
      "Download the signed PDF.",
    ],
    faqs: [
      { q: "Is this a legally binding digital signature?", a: "No — this stamps a visual signature (your typed name, styled like a signature) onto the page. It doesn't use a digital certificate and can't prove who signed or whether the document was altered afterward, unlike a certified e-signature service. For contracts or anything needing legal verification, check what your jurisdiction and the other party actually require." },
      { q: "Where does the signature appear on the page?", a: "In the bottom-right corner of whichever page you choose, which defaults to the last page of the document — the conventional place for a signature line." },
      { q: "Can I sign more than one page?", a: "Each run signs one chosen page. For a document needing signatures on multiple pages, run the tool again on the already-signed output, selecting a different page each time." },
      { q: "Does this tool send my document to a server?", a: "Yes — your file is uploaded securely, stamped, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark added beyond your own signature text." },
    ],
  },
  "audio-converter": {
    title: "Audio Converter — MP3, WAV, OGG, FLAC | SaaSToolz",
    metaDescription:
      "Convert audio between MP3, WAV, OGG and FLAC in either direction. Free, instant, no signup, no watermark.",
    intro:
      "Audio Converter switches an audio file between MP3, WAV, OGG and FLAC in either direction, so you can go from a large lossless WAV master down to a shareable MP3, or from a lossy format up to WAV when another tool specifically requires it.",
    steps: [
      "Upload your audio file.",
      "Choose the format you want to convert to.",
      "Click \"Convert\" to process it.",
      "Download the converted file.",
    ],
    faqs: [
      { q: "Which formats are supported?", a: "MP3, WAV, OGG and FLAC — convert between any of the four in either direction." },
      { q: "Will converting a lossy file to a lossless one improve its quality?", a: "No — converting, say, an MP3 to WAV makes a larger file but can't restore detail the MP3 already discarded. For the best result, always convert from the highest-quality source you actually have. See our guide to audio formats for when to use each one." },
      { q: "Does the converted file keep the same length and content?", a: "Yes — conversion changes the format and encoding only; the audio content and duration stay the same." },
      { q: "Does this tool send my audio to a server?", a: "Yes — your file is uploaded securely, converted, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "image-resize": {
    title: "Image Resizer — Free, 5 Fit Modes | SaaSToolz",
    metaDescription:
      "Resize an image to exact dimensions with 5 fit modes — crop, fit within, stretch, or shrink/grow only. Free, instant, no signup.",
    intro:
      "Image Resizer changes an image to exact dimensions you specify, with 5 fit modes controlling exactly how it adapts: crop to fill, fit within without cropping, stretch to match, or constrain to only shrink or only grow from the original size.",
    steps: [
      "Upload your image.",
      "Enter the target width and/or height.",
      "Choose a fit mode (cover, contain, fill, inside, or outside).",
      "Download the resized image.",
    ],
    faqs: [
      { q: "What's the difference between the fit modes?", a: "Cover crops the image to completely fill the target size. Contain fits the whole image inside the target without cropping, which may leave empty space. Fill stretches the image to match exactly, which can distort it. Inside only shrinks an oversized image, never enlarging it. Outside only grows an undersized image, never shrinking it." },
      { q: "Which fit mode should I use for a profile photo or thumbnail?", a: "Cover is usually right for a fixed-size thumbnail or avatar, since it fills the frame completely without any distortion or empty space." },
      { q: "Will resizing up make a small image sharper?", a: "No — enlarging an image can only interpolate existing pixels, not add real detail, so a small source image will look soft when scaled up. Start from the highest-resolution original you have." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, resized, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "grid-generator": {
    title: "CSS Grid Generator — Free, Instant Code | SaaSToolz",
    metaDescription:
      "Build a CSS grid layout visually and copy the ready-to-use grid-template code. Free, instant, no signup.",
    intro:
      "CSS Grid Generator lets you set the number of columns and rows (or custom column/row sizes) and a gap, then outputs the exact grid-template-columns, grid-template-rows and gap CSS ready to paste into your stylesheet.",
    steps: [
      "Set the number of columns and rows, or enter custom sizes for each.",
      "Set the gap between grid items.",
      "Preview the layout update as you adjust it.",
      "Copy the generated CSS.",
    ],
    faqs: [
      { q: "What do the default columns and rows look like in the CSS?", a: "By default each column and row gets an equal fraction of the available space, written as repeat(n, 1fr) — so three equal columns becomes repeat(3, 1fr)." },
      { q: "Can I set custom column widths instead of equal ones?", a: "Yes — enter your own track sizes (like 200px 1fr 2fr) instead of using the equal-column default, for layouts where columns shouldn't all be the same width." },
      { q: "Do I need to add anything else to make this work?", a: "Just apply display: grid (included in the generated code) to the container, and the grid-template and gap properties handle the layout — no extra markup is required beyond normal HTML elements inside the container." },
      { q: "Does this tool send anything to a server?", a: "No — the CSS is generated entirely in your browser; nothing you enter is transmitted or stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "js-beautifier": {
    title: "JS Beautifier — Free, Instant JavaScript Formatter | SaaSToolz",
    metaDescription:
      "Paste minified or messy JavaScript and get readable, properly indented code back instantly. Free, no signup.",
    intro:
      "JS Beautifier reformats JavaScript by tracking brace and bracket depth and inserting consistent 2-space indentation and line breaks after every statement, turning a single minified line (or inconsistently formatted code) into something readable.",
    steps: [
      "Paste your JavaScript code.",
      "Click \"Beautify\" to reformat it.",
      "Review the indented, line-broken result.",
      "Copy the formatted code.",
    ],
    faqs: [
      { q: "Does this rename variables or change the code's logic?", a: "No — only whitespace, indentation and line breaks change. The code runs exactly the same before and after; nothing about its behavior, variable names, or logic is touched." },
      { q: "Will this work on heavily minified code with no spaces at all?", a: "Yes — formatting is based on tracking braces, brackets and semicolons, not on existing whitespace, so it reconstructs structure even from a single densely packed line." },
      { q: "Does it respect strings so braces inside them aren't miscounted?", a: "Yes — the beautifier tracks whether it's inside a quoted string (including backtick template literals) and leaves everything inside untouched, so a brace or semicolon character inside a string won't throw off the indentation." },
      { q: "Does this tool send my code to a server?", a: "Yes — it's sent to our servers to format and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "flexbox-generator": {
    title: "CSS Flexbox Generator — Free, Instant Code | SaaSToolz",
    metaDescription:
      "Build a flexbox layout visually and copy the ready-to-use flex-direction, justify-content and align-items CSS. Free, instant, no signup.",
    intro:
      "CSS Flexbox Generator lets you set direction, justification, alignment, wrapping and gap, then outputs the exact display: flex rule and its related properties ready to paste into your stylesheet — no need to memorize which property controls which axis.",
    steps: [
      "Choose a flex direction (row, column, or reversed).",
      "Set justify-content and align-items to position items.",
      "Choose whether items wrap, and set the gap between them.",
      "Copy the generated CSS.",
    ],
    faqs: [
      { q: "What's the difference between justify-content and align-items?", a: "justify-content positions items along the main axis (horizontally for a row, vertically for a column), while align-items positions them along the cross axis (the opposite direction). Switching direction swaps which one controls which visual axis." },
      { q: "Why would I use row-reverse or column-reverse instead of changing my HTML order?", a: "Reversing the direction flips the visual order without touching your markup, which keeps the DOM order (important for accessibility and tab order) separate from the visual order." },
      { q: "Do I need anything besides this CSS to make the layout work?", a: "Just apply display: flex (included in the generated code) to the container; its direct children become flex items automatically with no extra markup needed." },
      { q: "Does this tool send anything to a server?", a: "No — the CSS is generated entirely in your browser; nothing you enter is transmitted or stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "mrr-calculator": {
    title: "SaaS MRR / ARR Calculator — Free, Instant | SaaSToolz",
    metaDescription:
      "Calculate Monthly and Annual Recurring Revenue from your customer plans, plus net new MRR from churn and new business. Free, instant, no signup.",
    intro:
      "SaaS MRR Calculator sums each plan's price times its customer count to get your Monthly Recurring Revenue, multiplies by 12 for Annual Recurring Revenue, and nets your new MRR against churned MRR to show whether you're growing or shrinking month over month.",
    steps: [
      "Enter each pricing plan's price and customer count.",
      "Enter MRR churned this month, if any.",
      "Enter new MRR added this month, if any.",
      "MRR, ARR, and net new MRR are calculated instantly.",
    ],
    faqs: [
      { q: "How is ARR calculated from MRR?", a: "Simply MRR × 12 — it assumes current MRR holds steady for a year, which is the standard convention, not a growth forecast." },
      { q: "What does \"net new MRR\" tell me?", a: "New MRR added this month minus MRR lost to churn. A positive number means you grew; a negative number means churn outpaced new business, even if your total MRR still looks healthy." },
      { q: "Can I enter more than one pricing plan?", a: "Yes — add a row for each plan tier with its price and customer count, and the calculator sums all of them into your total MRR." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "jwt-encoder": {
    title: "JWT Encoder — Free, Instant HS256 Signing | SaaSToolz",
    metaDescription:
      "Build and sign a JWT from your own payload and secret using HS256. Free, instant, no signup.",
    intro:
      "JWT Encoder takes the JSON payload and secret you provide, adds an iat (issued-at) claim automatically and an exp (expiry) claim if you set one, then signs the token with HMAC-SHA256 using the Web Crypto API — producing a real, working JWT you can use for testing.",
    steps: [
      "Enter your payload as a JSON object.",
      "Enter the secret to sign with.",
      "Optionally set an expiry time.",
      "Copy the signed JWT.",
    ],
    faqs: [
      { q: "What signing algorithm does this use?", a: "HS256 (HMAC with SHA-256) — a symmetric algorithm where the same secret is used to sign and later verify the token. It's the most common default for simple JWT setups." },
      { q: "What gets added to my payload automatically?", a: "An iat claim (issued-at, the current Unix timestamp) is always added. If you set an expiry, an exp claim is added too, calculated as the current time plus however many seconds you specify." },
      { q: "Is the secret I enter stored anywhere?", a: "No — it's used only to compute the signature for this one request and isn't stored. Still, use a test secret rather than a real production signing key, since it is transmitted to generate the token." },
      { q: "Does this tool send my payload and secret to a server?", a: "Yes — they're sent to our servers to sign the token and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "pregnancy-calculator": {
    title: "Pregnancy Due Date Calculator — Free, Instant | SaaSToolz",
    metaDescription:
      "Estimate your due date, current week, and trimester from your last period date. Free, instant, no signup.",
    intro:
      "Pregnancy Calculator uses the standard 280-day (40-week) estimate from your last menstrual period to calculate your due date, then works out exactly how many weeks and days pregnant you are today and which trimester that falls into.",
    steps: [
      "Enter the first day of your last menstrual period.",
      "Your estimated due date appears instantly.",
      "See how many weeks and days pregnant you are today.",
      "See which trimester you're currently in.",
    ],
    faqs: [
      { q: "Why 280 days specifically?", a: "280 days (40 weeks) from the last menstrual period is the standard clinical convention for estimating a due date, even though actual ovulation and conception happen roughly two weeks into that window." },
      { q: "How are the trimesters defined here?", a: "Weeks 1 through 12 are the first trimester, weeks 13 through 26 are the second, and week 27 onward is the third — the commonly used breakdown, though exact boundaries can vary slightly by source." },
      { q: "Is this a substitute for a doctor's estimate?", a: "No — this is a quick estimate based on a standard formula. Your doctor's estimate, especially one based on an ultrasound, is more accurate for your specific pregnancy." },
      { q: "Does this tool send my date to a server?", a: "Yes — the date is sent to our servers to compute the result and the result is returned to you; we don't store it." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "image-crop": {
    title: "Crop Image — Free, Instant, Exact Pixels | SaaSToolz",
    metaDescription:
      "Crop an image to an exact rectangle by pixel coordinates. Free, instant, no signup, no watermark.",
    intro:
      "Crop Image cuts out a precise rectangular region from your image using the exact left, top, width and height pixel values you specify, in whatever format the image was already in.",
    steps: [
      "Upload your image.",
      "Enter the left and top position of the crop area.",
      "Enter the width and height of the crop area.",
      "Download the cropped image.",
    ],
    faqs: [
      { q: "How do I know which pixel coordinates to use?", a: "Left and top set where the crop box starts, measured from the image's top-left corner; width and height set how big the box is from there. Check your image's dimensions first so the box stays within bounds." },
      { q: "What happens if I set width or height to 0?", a: "It's rejected with a clear error — a 0-pixel crop isn't a valid image region, so this tool checks for it upfront rather than letting it fail with a confusing error." },
      { q: "Does cropping change the image format?", a: "No — the cropped output keeps the same format as your original (JPEG stays JPEG, PNG stays PNG, and so on)." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, cropped, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "sql-formatter": {
    title: "SQL Formatter — Free, Instant | SaaSToolz",
    metaDescription:
      "Paste a dense SQL query and get it reformatted with each clause on its own line. Free, instant, no signup.",
    intro:
      "SQL Formatter recognizes major SQL keywords — SELECT, FROM, WHERE, JOIN variants, GROUP BY, ORDER BY, and more — and puts each one on its own line, turning a single dense query into a readable, clause-by-clause layout.",
    steps: [
      "Paste your SQL query.",
      "Click \"Format\" to reformat it.",
      "Review each clause now on its own line.",
      "Copy the formatted SQL.",
    ],
    faqs: [
      { q: "Which keywords does this recognize?", a: "The major clause-starting keywords — SELECT, FROM, WHERE, GROUP BY, ORDER BY, HAVING, LIMIT, INSERT INTO, VALUES, UPDATE, SET, DELETE FROM, the JOIN variants, ON, AND, OR, and UNION — each gets placed on its own new line." },
      { q: "Does this validate that my SQL is syntactically correct?", a: "No — it reformats layout based on recognized keywords, but it doesn't parse or validate the query against any particular database's SQL dialect." },
      { q: "Will this work with any SQL dialect (MySQL, Postgres, etc.)?", a: "Yes, for standard clause keywords common across dialects — formatting is based on keyword recognition, not on dialect-specific syntax, so it works the same regardless of which database you're targeting." },
      { q: "Does this tool send my query to a server?", a: "Yes — it's sent to our servers to format and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "image-metadata-remove": {
    title: "Remove Image Metadata — Free, Strip EXIF & GPS | SaaSToolz",
    metaDescription:
      "Strip EXIF, GPS location and other hidden metadata from a photo in seconds. Free, instant, no signup.",
    intro:
      "Remove Image Metadata re-encodes your photo without copying over its EXIF, GPS or ICC color-profile metadata — stripping out details like the camera model, capture settings, and precise location that are normally embedded invisibly in the file.",
    steps: [
      "Upload your image.",
      "Click \"Remove Metadata\" to re-encode it clean.",
      "Download the stripped image.",
      "The photo itself looks identical — only the hidden metadata is gone.",
    ],
    faqs: [
      { q: "Why would a photo need this?", a: "Many phones embed GPS coordinates and camera details directly in photo files. Sharing a photo online without stripping this can unintentionally reveal where and when it was taken." },
      { q: "Does this change how the image looks?", a: "No — only the invisible metadata is removed. The visible pixels, dimensions and format stay exactly the same." },
      { q: "What kind of metadata gets removed?", a: "EXIF data (camera model, settings, capture date), GPS coordinates if present, and the embedded ICC color profile — all dropped by default when the image is re-encoded." },
      { q: "Does this tool send my photo to a server?", a: "Yes — your image is uploaded securely, stripped, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "json-minifier": {
    title: "JSON Minifier — Free, Instant | SaaSToolz",
    metaDescription:
      "Strip whitespace from JSON to shrink its size, with validation to catch broken syntax first. Free, instant, no signup.",
    intro:
      "JSON Minifier parses your JSON and re-serializes it with no extra whitespace — removing every indentation space and line break that formatted JSON carries, while confirming along the way that the structure is actually valid.",
    steps: [
      "Paste your JSON.",
      "Click \"Minify\" to parse and compact it.",
      "If the JSON is invalid, the exact parse error is shown.",
      "Copy the minified result.",
    ],
    faqs: [
      { q: "Does minifying change the data itself?", a: "No — only whitespace is removed. The JSON is parsed into real data first, so the keys, values, and structure are identical; only formatting is stripped." },
      { q: "What happens if my JSON has a syntax error?", a: "Minifying requires successfully parsing the JSON first, so invalid input fails with the exact parse error message rather than producing a corrupted result." },
      { q: "When is minified JSON actually useful?", a: "Mainly for reducing payload size in things like API responses, config files, or embedded data — whitespace adds up in large JSON documents even though it's invisible to the data itself." },
      { q: "Does this tool send my JSON to a server?", a: "Yes — it's sent to our servers to parse and minify, and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "hash-generator": {
    title: "Hash Generator — MD5, SHA-1, SHA-256, SHA-384, SHA-512 | SaaSToolz",
    metaDescription:
      "Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text, all at once. Free, instant, no signup.",
    intro:
      "Hash Generator computes five different hash digests of your text in one pass — MD5 and SHA-1 (older, faster, not collision-resistant), plus SHA-256, SHA-384 and SHA-512 via the Web Crypto API — so you can compare or use whichever algorithm you need without re-entering your text.",
    steps: [
      "Paste the text you want to hash.",
      "Click \"Generate\" to compute all five hashes at once.",
      "Each algorithm's digest appears as a hex string.",
      "Copy whichever hash you need.",
    ],
    faqs: [
      { q: "Which hash algorithm should I use?", a: "SHA-256 is the common modern default for most use cases. MD5 and SHA-1 are still widely used for checksums and legacy compatibility, but both are considered cryptographically broken for security purposes like password storage." },
      { q: "Is the same text guaranteed to always produce the same hash?", a: "Yes — hashing is deterministic, so identical input always produces an identical digest for a given algorithm, with no randomness involved." },
      { q: "Can a hash be reversed back into the original text?", a: "No — hashing is one-way by design. These algorithms are meant for verifying that data matches (like a checksum), not for recovering the original input." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to compute the hashes and the results are returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "twitter-card": {
    title: "Twitter Card Generator — Free, Instant Meta Tags | SaaSToolz",
    metaDescription:
      "Generate the meta tags that control how your link previews on X/Twitter. Free, instant, no signup.",
    intro:
      "Twitter Card Generator builds the twitter:card meta tags — card type, title, description, image, site and creator handles — that control how a link to your page previews when shared on X/Twitter, ready to paste into your page's head.",
    steps: [
      "Choose a card type (summary, large image, app, or player).",
      "Enter your title, description and image URL.",
      "Optionally add your site and creator @handles.",
      "Copy the generated meta tags into your page's head.",
    ],
    faqs: [
      { q: "What's the difference between \"summary\" and \"summary_large_image\"?", a: "summary shows a small square thumbnail next to the text, while summary_large_image shows a full-width image above it — the large-image variant is generally better for visual content." },
      { q: "Do I still need Open Graph tags if I add Twitter Card tags?", a: "Yes — Twitter Card tags only control the preview on X/Twitter specifically. Other platforms (Facebook, LinkedIn, Slack, etc.) read Open Graph tags, so most sites use both. Our Open Graph Generator produces those." },
      { q: "What happens if I don't fill in every field?", a: "Only the fields you provide are included as meta tags — card type is always set, but title, description, image, site and creator are each added only when you've entered a value." },
      { q: "Does this tool send my inputs to a server?", a: "Yes — they're sent to our servers to build the tags and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "lorem-ipsum": {
    title: "Lorem Ipsum Generator — Free, Instant Placeholder Text | SaaSToolz",
    metaDescription:
      "Generate classic Lorem Ipsum placeholder text by words, sentences, or paragraphs. Free, instant, no signup.",
    intro:
      "Lorem Ipsum Generator produces placeholder text using the classic Lorem Ipsum vocabulary, cycling through its words to build exactly the number of words, sentences, or paragraphs you ask for.",
    steps: [
      "Choose a unit: words, sentences, or paragraphs.",
      "Enter how many you need.",
      "Click \"Generate\" to produce the text instantly.",
      "Copy the result for your mockup or layout.",
    ],
    faqs: [
      { q: "Is there a limit to how much text I can generate?", a: "Yes — up to 10,000 words, 1,000 sentences, or 200 paragraphs per request, a limit set well beyond any real placeholder-text need to keep responses reasonably sized." },
      { q: "Is the text random or always the same?", a: "The word sequence itself cycles through the same classic Lorem Ipsum vocabulary in a fixed order, while sentence and paragraph lengths vary slightly each time you generate." },
      { q: "What is Lorem Ipsum actually used for?", a: "It's standard placeholder text for mockups and layouts, used specifically because its Latin-like words don't resemble real language, which keeps designers and readers from being distracted by the actual words while judging layout and typography." },
      { q: "Does this tool send anything to a server?", a: "Yes — the request is sent to our servers to generate the text and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "remove-spaces": {
    title: "Remove Extra Spaces — Free, Instant Text Cleanup | SaaSToolz",
    metaDescription:
      "Collapse repeated spaces and tabs down to one, trim each line, and drop blank lines. Free, instant, no signup.",
    intro:
      "Remove Extra Spaces cleans up messy whitespace line by line — collapsing any run of spaces or tabs down to a single space, trimming leading and trailing whitespace from each line, and removing blank lines entirely.",
    steps: [
      "Paste your text.",
      "Click \"Clean\" to process it.",
      "Review the cleaned-up result with normalized spacing.",
      "Copy the result.",
    ],
    faqs: [
      { q: "Does this remove blank lines too, or just extra spaces within a line?", a: "Both — every line with repeated spaces or tabs gets collapsed to single spaces and trimmed, and any line that ends up empty is dropped from the output entirely." },
      { q: "Will this affect line breaks I want to keep?", a: "Line breaks between non-empty lines are preserved — only the whitespace within each line and fully blank lines are affected." },
      { q: "What's a common reason to need this?", a: "Text copied from a PDF, email, or formatted document often carries inconsistent spacing and stray blank lines; this normalizes it before you paste it somewhere that expects clean text." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to clean up and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "profit-calculator": {
    title: "Profit Margin Calculator — Free, Instant | SaaSToolz",
    metaDescription:
      "Calculate profit, margin percentage, and markup percentage from your revenue and cost. Free, instant, no signup.",
    intro:
      "Profit Margin Calculator takes your revenue and cost and returns three numbers that are easy to confuse but mean different things: the raw profit, the margin (profit as a percentage of revenue), and the markup (profit as a percentage of cost).",
    steps: [
      "Enter your revenue.",
      "Enter your cost.",
      "Profit, margin percentage, and markup percentage are calculated instantly.",
      "Use margin or markup depending on which framing you need.",
    ],
    faqs: [
      { q: "What's the actual difference between margin and markup?", a: "Margin divides profit by revenue (what percentage of what you sold for is profit); markup divides profit by cost (how much you added on top of cost). The same numbers produce two different percentages, and mixing them up is a common pricing mistake." },
      { q: "Why does markup show as blank or unavailable sometimes?", a: "Markup is profit divided by cost, so if cost is 0 there's nothing to divide by — markup isn't shown in that case, though profit and margin still calculate normally." },
      { q: "Can revenue or cost be negative?", a: "No — revenue must be a positive number and cost can't be negative, since both represent real amounts of money in a sale." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "markdown-convert": {
    title: "Markdown to HTML Converter — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert Markdown to clean, safe HTML covering headers, bold/italic, links, inline code and lists. Free, instant, no signup.",
    intro:
      "Markdown Converter turns Markdown into HTML, covering the most common syntax — headers, bold and italic, inline code, links, and lists — with every link href checked against a safe-scheme allowlist so malicious link targets can't inject unexpected HTML attributes.",
    steps: [
      "Paste your Markdown text.",
      "Click \"Convert\" to generate HTML.",
      "Review the rendered HTML output.",
      "Copy the HTML for wherever you need it.",
    ],
    faqs: [
      { q: "Does this support the full Markdown / CommonMark spec?", a: "No — it covers the common subset: headers, bold/italic, inline code, links, and lists. Advanced features like tables, footnotes, or nested blockquotes aren't supported." },
      { q: "Is the output HTML safe to insert into a page?", a: "Yes — text content is HTML-escaped and link targets are checked against an allowlist of safe URL schemes (http, https, mailto, tel, and relative paths), so a malicious link value can't break out of the href attribute or inject a dangerous scheme." },
      { q: "What happens to a link with an unsafe target?", a: "Its href is replaced with # rather than being dropped or passed through, so the link still renders safely but doesn't point anywhere unexpected." },
      { q: "Does this tool send my Markdown to a server?", a: "Yes — it's sent to our servers to convert and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "base64-encoder": {
    title: "Base64 Encoder/Decoder — Free, Instant | SaaSToolz",
    metaDescription:
      "Encode text to Base64 or decode Base64 back to text, with validation that catches malformed input. Free, instant, no signup.",
    intro:
      "Base64 Encoder/Decoder converts text to and from Base64. Decoding checks that your input actually looks like valid Base64 (correct character set, correct padding) before attempting to decode it, rather than silently returning garbage for non-Base64 input.",
    steps: [
      "Paste your text or Base64 string.",
      "Choose Encode (text to Base64) or Decode (Base64 to text).",
      "The converted result appears instantly.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What happens if I try to decode something that isn't valid Base64?", a: "It's flagged as invalid rather than decoded into meaningless bytes — the input is checked against the Base64 character set and padding rules first, so a plain sentence won't silently turn into garbage output." },
      { q: "Is Base64 encryption?", a: "No — Base64 is just a reversible encoding, not encryption. Anyone can decode it back to the original text instantly; it provides no security or confidentiality." },
      { q: "What's a common use for Base64 encoding?", a: "Representing binary or arbitrary data as plain ASCII text — for example, embedding small images directly in CSS or HTML, or safely transmitting data through systems that only handle text." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to encode or decode and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "pdf-unlock": {
    title: "Unlock PDF — Remove Password Protection | SaaSToolz",
    metaDescription:
      "Remove password protection from a PDF once you've verified the password. Free, no signup.",
    intro:
      "Unlock PDF removes a PDF's password protection and permission restrictions — but only after verifying the correct password, even for files that are readable without a password but still have an owner password restricting printing, copying or editing.",
    steps: [
      "Upload your protected PDF.",
      "Enter the password that protects it.",
      "The password is verified before anything is removed.",
      "Download the unlocked PDF.",
    ],
    faqs: [
      { q: "Can this remove a password I don't know?", a: "No — a correct password is always required and verified before any protection is removed, even for a PDF you can already open freely. This isn't a password-cracking tool; it requires proof you're authorized to remove the protection." },
      { q: "What if the PDF opens without a password but I still can't print or copy from it?", a: "That's an owner-password restriction — the file is freely readable, but editing, printing, or copying permissions are locked by a separate owner password, which this tool still requires before lifting those restrictions." },
      { q: "What happens if I enter the wrong password?", a: "You get a clear \"Incorrect password\" error — nothing is removed, and the file isn't touched." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, processed, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "color-picker": {
    title: "Image Color Picker — Free, Exact Pixel RGB | SaaSToolz",
    metaDescription:
      "Click any pixel in an uploaded image to read its exact RGB color value. Free, instant, no signup.",
    intro:
      "Color Picker reads the exact RGB value of a single pixel at the coordinates you specify in an uploaded image — useful for grabbing an exact color from a screenshot, photo, or design mockup.",
    steps: [
      "Upload your image.",
      "Click (or specify coordinates for) the pixel you want to sample.",
      "The exact RGB value for that pixel is shown instantly.",
      "Copy the color value for use elsewhere.",
    ],
    faqs: [
      { q: "Does it sample an average color from an area, or one exact pixel?", a: "One exact pixel at the coordinates given — not an average or blend of surrounding pixels, so you get the precise value at that single point." },
      { q: "What happens if I pick a point outside the image?", a: "It's rejected with a clear error stating the image's actual dimensions, rather than returning an incorrect or default color." },
      { q: "Does this account for the image's transparency?", a: "The image is processed with an alpha channel internally to read pixel data consistently, but the result returned is the RGB color value itself." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, processed, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "json-viewer": {
    title: "JSON Viewer — Free, Instant Tree View | SaaSToolz",
    metaDescription:
      "Paste JSON and explore it as a collapsible, readable tree. Free, instant, runs entirely in your browser.",
    intro:
      "JSON Viewer parses your JSON and renders it as an interactive, collapsible tree, making it easy to explore deeply nested objects and arrays without scrolling through a wall of raw text.",
    steps: [
      "Paste your JSON into the input box.",
      "The parsed structure renders instantly as a tree.",
      "Expand or collapse any object or array branch.",
      "Fix the error shown if your JSON doesn't parse.",
    ],
    faqs: [
      { q: "Does this tool send my JSON to a server?", a: "No — parsing and rendering happen entirely in your browser using JSON.parse; nothing you paste is ever transmitted or stored." },
      { q: "What happens if my JSON is invalid?", a: "The exact parse error message is shown instead of a tree, so you can see precisely what's wrong rather than getting a generic failure." },
      { q: "How is this different from the JSON Formatter?", a: "Formatter outputs reformatted text you copy elsewhere; Viewer renders an interactive, expandable/collapsible tree for exploring structure in place, which is better for large or deeply nested JSON." },
      { q: "Is there a size limit on the JSON I can view?", a: "There's no artificial limit, though extremely large JSON documents may be slower to render as a tree since everything happens in your browser." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "diff-checker": {
    title: "Diff Checker — Free, Instant Text Comparison | SaaSToolz",
    metaDescription:
      "Compare two blocks of text line by line and see exactly what was added, removed, or unchanged. Free, instant, no signup.",
    intro:
      "Diff Checker compares two texts line by line using a real longest-common-subsequence algorithm — the same family of algorithm behind most code diff tools — to find the smallest set of additions and removals that explains the difference, rather than a naive line-by-line mismatch.",
    steps: [
      "Paste your original text on one side.",
      "Paste the changed text on the other side.",
      "Click \"Compare\" to see the diff.",
      "Review lines marked as same, added, or removed.",
    ],
    faqs: [
      { q: "Does this compare word by word or line by line?", a: "Line by line — each line is treated as a unit, so a single-character change inside a line still marks the whole line as changed." },
      { q: "Why does it find a different diff than I expected?", a: "The algorithm finds the longest common subsequence between both texts, which gives the minimal set of changes — but when lines could align in more than one valid way, it may pick a different (still correct) alignment than you'd choose by eye." },
      { q: "What do \"added\" and \"removed\" mean exactly?", a: "\"Removed\" marks a line present in the first text but not the second; \"added\" marks a line present in the second but not the first. Lines present in both, in the same relative order, are marked \"same\"." },
      { q: "Does this tool send my text to a server?", a: "Yes — both texts are sent to our servers to compute the diff and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "pdf-protect": {
    title: "Protect PDF — Add Password Encryption | SaaSToolz",
    metaDescription:
      "Encrypt a PDF with a password using real AES-256 encryption. Free, no signup.",
    intro:
      "Protect PDF encrypts your file with real AES-256 encryption, requiring the password you set to open it afterward — this isn't a cosmetic lock, it's the same standard PDF security handler professional tools use.",
    steps: [
      "Upload your PDF.",
      "Enter the password you want to protect it with.",
      "The PDF is encrypted with AES-256.",
      "Download the password-protected PDF.",
    ],
    faqs: [
      { q: "What encryption does this actually use?", a: "AES-256, applied through the PDF's standard security handler — the same mechanism used by professional PDF software, not a superficial lock that other tools can bypass." },
      { q: "Can I use a password that contains a comma?", a: "No — a comma in the password is rejected upfront, since it would otherwise corrupt the encryption options and could permanently lock the file with no way to recover it, even with the correct password." },
      { q: "Can I protect a PDF that's already password-protected?", a: "No — protecting an already-encrypted PDF is rejected with a clear error; unlock it first if you want to apply a new password." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, encrypted, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "pdf-remove-pages": {
    title: "Remove PDF Pages — Free, Instant | SaaSToolz",
    metaDescription:
      "Delete specific pages from a PDF and download the result. Free, instant, no signup.",
    intro:
      "Remove PDF Pages lets you specify which page numbers to delete from a PDF, then rebuilds the document with every other page intact and in its original order.",
    steps: [
      "Upload your PDF.",
      "Specify which page numbers to remove.",
      "The remaining pages are rebuilt into a new PDF.",
      "Download the result.",
    ],
    faqs: [
      { q: "Does removing pages affect the content or quality of the remaining pages?", a: "No — the remaining pages are copied through unchanged; only the specified pages are dropped from the document." },
      { q: "Can I remove multiple non-sequential pages at once?", a: "Yes — specify any combination of page numbers and they're all removed in a single pass, with the remaining pages kept in their original order." },
      { q: "What happens if I try to remove every page?", a: "A PDF needs at least one page, so removing all of them is rejected rather than producing an empty, invalid file." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, processed, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "pdf-extract-pages": {
    title: "Extract PDF Pages — Free, Instant | SaaSToolz",
    metaDescription:
      "Pull specific pages out of a PDF into a new standalone document. Free, instant, no signup.",
    intro:
      "Extract PDF Pages pulls just the pages you specify out of a larger PDF and saves them as a new, standalone document — the opposite operation from Remove PDF Pages, which keeps everything except the pages you name.",
    steps: [
      "Upload your PDF.",
      "Specify which page numbers to extract.",
      "The selected pages are copied into a new document.",
      "Download the extracted PDF.",
    ],
    faqs: [
      { q: "Does the extracted PDF keep the original page order?", a: "Yes — extracted pages appear in the same relative order as in the source document, regardless of the order you list the page numbers." },
      { q: "Will extracting pages affect their quality or formatting?", a: "No — pages are copied through exactly as they appear in the original; nothing about their content is altered." },
      { q: "What's the difference between this and Remove PDF Pages?", a: "This keeps only the pages you specify and discards the rest; Remove PDF Pages does the opposite, discarding the pages you specify and keeping everything else." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, processed, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "image-metadata": {
    title: "Image Metadata Viewer — Free, Instant EXIF Reader | SaaSToolz",
    metaDescription:
      "See an image's format, dimensions, color space, and other embedded metadata at a glance. Free, instant, no signup.",
    intro:
      "Image Metadata Viewer reads and displays the technical metadata embedded in your image — format, width and height, color space, channel count, alpha transparency, EXIF orientation, and DPI density — without altering the file itself.",
    steps: [
      "Upload your image.",
      "Its embedded metadata is read and displayed instantly.",
      "Review format, dimensions, color space, and other details.",
      "No download is needed — this only reads and displays, nothing is modified.",
    ],
    faqs: [
      { q: "Does this tool modify my image?", a: "No — it only reads and displays the existing metadata; the file itself is never altered or re-saved." },
      { q: "What's the \"orientation\" value I sometimes see?", a: "It's the EXIF orientation flag many cameras and phones embed to indicate how the image should be rotated for correct viewing, separate from the actual pixel dimensions stored in the file." },
      { q: "If I want to remove this metadata instead of just viewing it, what do I use?", a: "Remove Image Metadata strips EXIF, GPS, and color-profile data by re-encoding the image clean — use that once you've reviewed what's there with this tool." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, read, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "htaccess-generator": {
    title: ".htaccess Generator — Free, Instant | SaaSToolz",
    metaDescription:
      "Generate .htaccess rules for forcing HTTPS, www redirects, custom redirects, basic auth, and custom error pages. Free, instant, no signup.",
    intro:
      ".htaccess Generator builds Apache .htaccess rules from the options you choose — forcing HTTPS, adding or removing a www prefix, custom redirects, HTTP basic auth, and custom error pages — ready to drop into your site's root directory.",
    steps: [
      "Choose which rules you need (force HTTPS, www redirect, etc.).",
      "Fill in any specifics, like custom redirect paths or error page URLs.",
      "Click \"Generate\" to build the rules.",
      "Copy the result into your .htaccess file.",
    ],
    faqs: [
      { q: "Does this only work on Apache servers?", a: "Yes — .htaccess is an Apache-specific configuration mechanism. If you're on Nginx or another server, you'll need equivalent rules in that server's own config format instead." },
      { q: "Can I combine multiple rules, like forcing HTTPS and adding www at the same time?", a: "Yes — select as many options as you need and they're all included together in the generated file." },
      { q: "What's the difference between adding and removing the www prefix?", a: "Adding www redirects bare-domain requests to the www version; removing does the opposite, redirecting www requests to the bare domain. Pick whichever one matches your canonical domain." },
      { q: "Does this tool send my settings to a server?", a: "Yes — they're sent to our servers to build the rules and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "ip-lookup": {
    title: "IP Address Lookup — Free, Instant Geolocation | SaaSToolz",
    metaDescription:
      "Look up an IP address's country, city, ISP, and approximate location. Free, instant, no signup.",
    intro:
      "IP Address Lookup resolves a public IP address to its approximate geolocation — country, city, region, coordinates, timezone, ISP and ASN — using a dedicated geolocation service, rejecting private or reserved addresses since they have no public location to look up.",
    steps: [
      "Enter the IP address you want to look up.",
      "Click \"Lookup\" to resolve it.",
      "Review the country, city, ISP, and other details returned.",
      "Leave it blank to look up your own public IP instead.",
    ],
    faqs: [
      { q: "Why does a private IP like 192.168.1.1 fail?", a: "Private and reserved IP ranges aren't publicly routable, so there's no real-world location to resolve — these are rejected upfront with a clear error instead of returning a misleading or blank result." },
      { q: "How accurate is the location?", a: "IP geolocation is generally accurate to the city or region level, not an exact street address — it reflects where the ISP has registered the IP block, not necessarily the device's precise physical location." },
      { q: "What does the \"isProxy\" field mean?", a: "It flags whether the IP is known to belong to a proxy, VPN, or similar relay service, which can mean the detected location differs from the actual user's location." },
      { q: "Does this tool send the IP to a server?", a: "Yes — it's sent to our servers, which query a geolocation service and return the result to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "fuel-calculator": {
    title: "Fuel Cost Calculator — Free, Instant | SaaSToolz",
    metaDescription:
      "Calculate fuel needed and total cost for a trip from distance, fuel efficiency, and price per liter. Free, instant, no signup.",
    intro:
      "Fuel Cost Calculator divides your trip distance by your vehicle's fuel efficiency to get liters needed, multiplies by the price per liter for total cost, and also shows the cost per kilometer — useful for comparing trips or vehicles.",
    steps: [
      "Enter the distance of your trip in kilometers.",
      "Enter your vehicle's fuel efficiency in km per liter.",
      "Enter the price per liter of fuel.",
      "Liters needed, total cost, and cost per km are calculated instantly.",
    ],
    faqs: [
      { q: "What units does this use?", a: "Kilometers for distance, kilometers per liter for fuel efficiency, and price per liter for fuel cost — metric units throughout." },
      { q: "What if my car's efficiency is given in miles per gallon?", a: "Convert to km per liter first (roughly: mpg × 0.4251 ≈ km/L), since this calculator expects metric fuel efficiency." },
      { q: "What's the \"cost per km\" figure useful for?", a: "It lets you compare trips of different lengths, or different vehicles, on a consistent per-distance basis rather than just comparing total trip costs." },
      { q: "Does this tool send my numbers to a server?", a: "Yes — your figures are sent to our servers to compute the result and the result is returned to you; we don't store the values." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "url-encoder": {
    title: "URL Encoder/Decoder — Free, Instant | SaaSToolz",
    metaDescription:
      "Encode text for safe use in a URL, or decode a percent-encoded URL back to readable text. Free, instant, no signup.",
    intro:
      "URL Encoder/Decoder percent-encodes text for safe inclusion in a URL, with two modes — a lighter encoding that leaves URL structure characters like / and : alone, and a full encoding that escapes virtually everything, meant for a single query parameter value rather than a whole URL.",
    steps: [
      "Paste your text or URL.",
      "Choose Encode or Decode.",
      "If encoding, choose full encoding or standard encoding.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What's the difference between the two encoding modes?", a: "Standard encoding (encodeURI) leaves characters like / : and ? alone since they're structural parts of a URL, while full encoding (encodeURIComponent) escapes those too — use full encoding for a single value going into a query parameter, not for an entire URL." },
      { q: "What happens if I try to decode text that isn't properly percent-encoded?", a: "It's handled gracefully — if standard decoding fails, a fallback decoding is tried, and if both fail, a clear error is returned rather than a cryptic exception." },
      { q: "Why would a URL need encoding at all?", a: "Characters like spaces, &, and # have special meaning in a URL or would break it outright; percent-encoding represents them safely so the URL remains valid." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to encode or decode and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "resume-builder": {
    title: "Resume Builder — Free, Instant PDF Export | SaaSToolz",
    metaDescription:
      "Build a professional resume from your details and export it as a clean PDF. Free, no signup.",
    intro:
      "Resume Builder takes your name, title, summary, work experience, education, and skills and lays them out into a clean, professionally formatted PDF resume, ready to download and send.",
    steps: [
      "Enter your name, title, and professional summary.",
      "Add your work experience with company, dates, and bullet points.",
      "Add your education and skills.",
      "Download your resume as a PDF.",
    ],
    faqs: [
      { q: "Can I add multiple jobs and schools?", a: "Yes — add as many experience entries and education entries as you need, each with its own title, dates, and details." },
      { q: "Does this use a single fixed template?", a: "Yes — the layout follows a clean, standard resume format focused on readability rather than offering multiple visual templates to choose from." },
      { q: "What should the bullet points under each job look like?", a: "Short, specific accomplishment statements work best — the PDF lays out whatever bullet points you provide under each job exactly as entered." },
      { q: "Does this tool send my resume details to a server?", a: "Yes — your information is sent to our servers to generate the PDF and the result is returned to you; we don't store it." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "pdf-organize": {
    title: "PDF Organizer — Reorder Pages | SaaSToolz",
    metaDescription:
      "Drag and reorder the pages of a PDF, then download the reorganized file. Free, instant, no signup.",
    intro:
      "PDF Organizer lets you set a new page order for your PDF — specify exactly which page should go where, and the document is rebuilt with pages arranged in that new sequence.",
    steps: [
      "Upload your PDF.",
      "Drag pages into the order you want.",
      "Click \"Organize\" to rebuild the PDF in that order.",
      "Download the reorganized PDF.",
    ],
    faqs: [
      { q: "Does reordering affect the content of individual pages?", a: "No — each page is copied through exactly as it was; only the sequence the pages appear in changes." },
      { q: "Can I duplicate a page by including it twice in the new order?", a: "That depends on what order you specify — the rebuild follows whatever page sequence you provide, so repeating a page number in the order would include it more than once." },
      { q: "What's the difference between this and Remove PDF Pages?", a: "This keeps every page but changes their order; Remove PDF Pages keeps the order but drops specific pages entirely. Use Organize to rearrange, Remove to delete." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, reordered, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "html-minifier": {
    title: "HTML Minifier — Free, Instant | SaaSToolz",
    metaDescription:
      "Strip comments and collapse whitespace from HTML to shrink its size. Free, instant, no signup.",
    intro:
      "HTML Minifier removes HTML comments and collapses whitespace between tags, shrinking the file size of your markup without changing how it renders in a browser.",
    steps: [
      "Paste your HTML.",
      "Click \"Minify\" to strip comments and whitespace.",
      "Review the compacted result.",
      "Copy the minified HTML.",
    ],
    faqs: [
      { q: "Does this change how the page looks when rendered?", a: "No — browsers already collapse most whitespace between tags when rendering, so removing it from the source doesn't change the visible layout; only comments and extra whitespace in the source file are removed." },
      { q: "Will this remove whitespace I actually need, like inside a <pre> block?", a: "Whitespace is collapsed primarily between tags; if your markup depends on specific whitespace being preserved inside content (like in <pre> or textarea), check the output carefully before using it." },
      { q: "Why minify HTML at all?", a: "Smaller file size means slightly faster page loads, especially noticeable on templates with lots of comments or heavily indented markup." },
      { q: "Does this tool send my HTML to a server?", a: "Yes — it's sent to our servers to minify and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "schema-generator": {
    title: "Schema Generator — Free JSON-LD for Rich Results | SaaSToolz",
    metaDescription:
      "Generate JSON-LD structured data for any schema.org type to help search engines show rich results. Free, instant, no signup.",
    intro:
      "Schema Generator builds a JSON-LD structured data block — the format Google and other search engines read to show rich results — by wrapping your chosen schema.org type and data fields in the required @context and @type structure.",
    steps: [
      "Choose a schema.org type (Product, Article, FAQPage, etc.).",
      "Enter the data fields relevant to that type.",
      "Click \"Generate\" to build the JSON-LD.",
      "Paste the result into a <script type=\"application/ld+json\"> tag in your page.",
    ],
    faqs: [
      { q: "Does this validate that I've included the right fields for my schema type?", a: "No — it wraps whatever fields you provide in the correct @context/@type JSON-LD structure, but doesn't check against schema.org's full field requirements for each type. Test the output with Google's Rich Results Test before relying on it." },
      { q: "What type does it use if I don't pick one?", a: "WebPage is the default type if none is specified." },
      { q: "Where does this JSON-LD actually go on my page?", a: "Inside a <script type=\"application/ld+json\"> tag, typically in your page's <head> — search engines read it without it affecting anything visible on the page." },
      { q: "Does this tool send my data to a server?", a: "Yes — it's sent to our servers to build the JSON-LD and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "xml-formatter": {
    title: "XML Formatter — Free, Instant | SaaSToolz",
    metaDescription:
      "Paste dense or minified XML and get it reformatted with proper nesting and indentation. Free, instant, no signup.",
    intro:
      "XML Formatter reformats XML by tracking which tags are opening, closing, or self-closing, and indenting each line according to its nesting depth — turning a single dense line into a readable, properly nested document.",
    steps: [
      "Paste your XML.",
      "Click \"Format\" to reformat it.",
      "Review the indented, nested output.",
      "Copy the formatted XML.",
    ],
    faqs: [
      { q: "Does this validate that my XML is well-formed?", a: "It reformats based on recognizing opening, closing and self-closing tags, but it doesn't perform full schema or DTD validation — badly malformed XML may format oddly rather than throwing a specific error." },
      { q: "Does this handle self-closing tags and XML declarations correctly?", a: "Yes — tags like <tag/> and the <?xml ...?> declaration are recognized as self-closing and don't trigger an indent increase for following lines." },
      { q: "Will this work on XHTML or other XML-based formats?", a: "Yes — the same tag-tracking logic applies to any well-formed XML-style markup, including XHTML." },
      { q: "Does this tool send my XML to a server?", a: "Yes — it's sent to our servers to format and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "markdown-preview": {
    title: "Markdown Preview — Free, Live Rendering | SaaSToolz",
    metaDescription:
      "Write Markdown and see it rendered live as formatted output. Free, instant, no signup.",
    intro:
      "Markdown Preview renders your Markdown as formatted output in real time, covering the common syntax — headers, bold and italic, inline code, links and lists — so you can check how your writing will actually look before publishing it.",
    steps: [
      "Type or paste your Markdown.",
      "The rendered preview updates as you type.",
      "Check headers, formatting, links, and lists render as expected.",
      "Copy your Markdown once you're happy with how it looks.",
    ],
    faqs: [
      { q: "How is this different from the Markdown Converter?", a: "Both use the same conversion engine, but Markdown Converter gives you the raw HTML to copy and use elsewhere, while Markdown Preview shows the rendered, formatted result directly so you can proofread how it'll actually look." },
      { q: "Does this support the full CommonMark spec?", a: "No — it covers the common subset: headers, bold/italic, inline code, links, and lists. Tables, footnotes, and some other advanced syntax aren't rendered." },
      { q: "Are links in my Markdown safe to click in the preview?", a: "Yes — link targets are checked against a safe-scheme allowlist (http, https, mailto, tel, relative paths) before rendering, so an unsafe link value is replaced rather than passed through." },
      { q: "Does this tool send my Markdown to a server?", a: "Yes — it's sent to our servers to render and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "remove-duplicates": {
    title: "Remove Duplicate Lines — Free, Instant | SaaSToolz",
    metaDescription:
      "Strip exact duplicate lines from a list, keeping the first occurrence of each. Free, instant, no signup.",
    intro:
      "Remove Duplicate Lines scans your text line by line and keeps only the first occurrence of each exact line, dropping every repeat while preserving the original order — and tells you exactly how many lines were removed.",
    steps: [
      "Paste your list or text.",
      "Click \"Remove Duplicates\" to process it.",
      "See how many duplicate lines were removed.",
      "Copy the deduplicated result.",
    ],
    faqs: [
      { q: "Does this consider lines with different casing as duplicates?", a: "No — matching is exact, so \"Apple\" and \"apple\" are treated as different lines. Normalize casing first if you want those treated as duplicates too." },
      { q: "Does the order of my list change?", a: "No — the first occurrence of each line stays in its original position; only later repeats are removed." },
      { q: "What about lines with extra trailing whitespace?", a: "Matching is exact character-for-character, so a line with trailing whitespace is treated as different from the same line without it — clean up whitespace first if that's not what you want." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to process and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "contract-builder": {
    title: "Contract Builder — Free NDA & Freelance Agreement | SaaSToolz",
    metaDescription:
      "Generate a Mutual NDA or Freelance Services Agreement from your details. Free, instant — educational starting point, not legal advice.",
    intro:
      "Contract Builder fills in one of two common contract templates — a Mutual Non-Disclosure Agreement or a Freelance Services Agreement — with the party names, dates, and terms you provide, as an educational starting point rather than a substitute for legal review.",
    steps: [
      "Choose NDA or Freelance Services Agreement.",
      "Enter both parties' names and the relevant dates.",
      "Fill in agreement-specific details (purpose and term for NDA; scope, fee and payment terms for freelance).",
      "Download or copy the generated contract text.",
    ],
    faqs: [
      { q: "Is this legally binding or reviewed by a lawyer?", a: "No — this fills a standard template as an educational starting point, not legal advice. Have an actual contract reviewed by a lawyer before relying on it for anything with real stakes." },
      { q: "What's the default term for the NDA if I don't specify one?", a: "24 months, unless you set a different term length." },
      { q: "What happens if I don't specify a jurisdiction?", a: "The governing law clause is left as a placeholder ([jurisdiction]) for you to fill in — it doesn't default to any specific country or state." },
      { q: "Does this tool send my contract details to a server?", a: "Yes — they're sent to our servers to build the contract text and the result is returned to you; we don't store it." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "word-to-pdf": {
    title: "Word to PDF — Free, Instant Conversion | SaaSToolz",
    metaDescription:
      "Convert a .docx file to PDF, preserving headings, paragraphs, lists, tables, and text formatting. Free, no signup.",
    intro:
      "Word to PDF extracts your .docx document's structure — headings, paragraphs, list items, table rows, with bold and italic runs preserved — and lays it out onto PDF pages, aiming for text fidelity rather than a pixel-exact copy of the original layout.",
    steps: [
      "Upload your .docx file.",
      "The document's structure is extracted and converted.",
      "Pages are laid out automatically to fit the content.",
      "Download the converted PDF.",
    ],
    faqs: [
      { q: "Will my PDF look pixel-identical to the original Word document?", a: "No — this is a best-effort text-fidelity conversion, not a page-accurate renderer. Headings, paragraphs, lists, tables, and bold/italic formatting carry over, but images, complex table styling, and custom fonts or colors from the source document aren't reproduced." },
      { q: "Does it support older .doc files, or only .docx?", a: "It's built for .docx (the modern Word format). Older .doc files aren't supported — save as .docx first if needed." },
      { q: "What happens to images in my Word document?", a: "They aren't reproduced in the converted PDF — this conversion focuses on text and document structure." },
      { q: "Does this tool send my document to a server?", a: "Yes — your file is uploaded securely, converted, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "pdf-watermark": {
    title: "Add Watermark to PDF — Free, Instant | SaaSToolz",
    metaDescription:
      "Stamp a diagonal text watermark across every page of a PDF, with adjustable opacity. Free, no signup.",
    intro:
      "Add Watermark stamps your text diagonally across the center of every page in a PDF, in bold gray type at 45 degrees — the classic watermark look — with an opacity you can adjust so it's subtle or prominent.",
    steps: [
      "Upload your PDF.",
      "Enter the watermark text.",
      "Adjust the opacity if needed.",
      "Download the watermarked PDF.",
    ],
    faqs: [
      { q: "Does the watermark appear on every page?", a: "Yes — it's stamped once per page, applied to the entire document, not just the first or last page." },
      { q: "Can I control how visible the watermark is?", a: "Yes — opacity ranges from 0.05 (very subtle) to 1 (fully opaque), with 0.25 as the default." },
      { q: "What if my watermark text uses characters outside basic English, like CJK or Arabic?", a: "Unsupported characters are automatically replaced rather than breaking the whole document, since the underlying font only supports a Western character set — stick to standard Latin characters for guaranteed results." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, watermarked, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no extra watermark added beyond the one you requested." },
    ],
  },
  "image-to-base64": {
    title: "Image to Base64 — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert an image to a Base64 data URL you can embed directly in CSS or HTML. Free, instant, no signup.",
    intro:
      "Image to Base64 encodes your image's raw bytes into a Base64 string and wraps it as a ready-to-use data: URL, which you can embed directly in CSS, HTML, or anywhere else a URL is expected instead of a separate image file.",
    steps: [
      "Upload your image.",
      "The Base64 data URL is generated instantly.",
      "Copy either the full data URL or just the raw Base64 string.",
      "Paste it directly into your CSS or HTML.",
    ],
    faqs: [
      { q: "What's a data URL actually useful for?", a: "Embedding a small image directly inside CSS or HTML without a separate file request — useful for icons, small logos, or inline SVGs where an extra network request isn't worth it." },
      { q: "Does Base64 encoding make the image smaller?", a: "No — Base64 encoding actually makes the data about 33% larger than the original binary, since it's trading file size for being safely representable as plain text." },
      { q: "Is this a good idea for large images?", a: "Generally no — the size increase and the fact that the browser can't cache an embedded data URL separately from the page make this best suited for small images, not full photos." },
      { q: "Does this tool send my image to a server?", a: "Yes — your image is uploaded securely, encoded, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "base64-to-image": {
    title: "Base64 to Image — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert a Base64 string or data URL back into a downloadable image file. Free, instant, no signup.",
    intro:
      "Base64 to Image decodes a Base64 string or data URL back into real image bytes, verifying the decoded data actually matches a known image file signature (PNG, JPEG, GIF, WebP, or SVG) before handing it back — not just checking that the text looks like Base64.",
    steps: [
      "Paste your Base64 string or data URL.",
      "Click \"Convert\" to decode it.",
      "The tool verifies the decoded bytes are a real image.",
      "Download the resulting image file.",
    ],
    faqs: [
      { q: "What happens if I paste text that isn't actually an image?", a: "It's rejected — the decoded bytes are checked against real image file signatures, so text that happens to look like valid Base64 (such as an English sentence) won't silently produce a corrupt \"image\" file." },
      { q: "Do I need to paste the full data:image/png;base64,... prefix, or just the Base64 part?", a: "Either works — if there's no data: prefix, it defaults to treating the content as PNG." },
      { q: "Which image formats does this recognize?", a: "PNG, JPEG, GIF, WebP, and SVG — each identified by its real file signature, not just its claimed MIME type." },
      { q: "Does this tool send my data to a server?", a: "Yes — it's sent to our servers to decode and verify, and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "username-generator": {
    title: "Username Generator — Free, Instant | SaaSToolz",
    metaDescription:
      "Generate random adjective-noun username ideas, with or without a number suffix. Free, instant, no signup.",
    intro:
      "Username Generator combines a random adjective and noun into a camelCase username, optionally appending a random 3-digit number for extra uniqueness, and can produce up to 50 at once.",
    steps: [
      "Choose how many usernames you want (up to 50).",
      "Choose whether to include a number suffix.",
      "Click \"Generate\" to produce the list instantly.",
      "Pick whichever username you like, or regenerate for more options.",
    ],
    faqs: [
      { q: "Will two usernames ever repeat in the same batch?", a: "It's possible, since each one is chosen independently at random — there's no uniqueness check across the batch you request." },
      { q: "What's the difference between the two styles?", a: "\"word\" style gives just the adjective-noun combination (like CleverFalcon); \"wordnumber\" style appends a random 3-digit number (like CleverFalcon482) for a username that's more likely to be available on sign-up forms." },
      { q: "What's the maximum number I can generate at once?", a: "50 per request — a limit set to keep results manageable rather than a technical constraint." },
      { q: "Does this tool send anything to a server?", a: "Yes — the request is sent to our servers to generate the usernames and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "color-palette": {
    title: "Color Palette Generator — Free, Instant | SaaSToolz",
    metaDescription:
      "Generate a coordinated color palette from a single base HEX color. Free, instant, no signup.",
    intro:
      "Color Palette Generator takes one base HEX color and builds a coordinated palette by varying its lightness while keeping the same hue and saturation — producing lighter and darker shades that stay visually related to your original color.",
    steps: [
      "Enter a base color as a HEX value.",
      "Click \"Generate\" to build the palette.",
      "Review the set of related shades produced.",
      "Copy any HEX value you want to use.",
    ],
    faqs: [
      { q: "Does this generate complementary or contrasting colors?", a: "No — it generates a monochromatic palette, meaning every color shares the same hue and saturation as your base color, just at different lightness levels. For contrasting colors, you'd pick a different hue manually." },
      { q: "What format does the base color need to be in?", a: "A valid HEX value, either 3 or 6 digits (like #7c3aed or #7ca), with or without the # symbol." },
      { q: "Why would I want a monochromatic palette instead of varied colors?", a: "Monochromatic palettes are a common, safe choice for UI design since every shade naturally works together — useful for things like button states, backgrounds, or borders that need to feel related to a primary brand color." },
      { q: "Does this tool send my color to a server?", a: "Yes — it's sent to our servers to compute the palette and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "rgb-to-hex": {
    title: "RGB to HEX Converter — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert RGB color values to their HEX equivalent instantly. Free, no signup.",
    intro:
      "RGB to HEX converts red, green and blue values (0-255 each) into their 6-digit HEX equivalent, validating that each channel is actually a valid number in range before converting.",
    steps: [
      "Enter the red, green, and blue values (0-255 each).",
      "Click \"Convert\" to get the HEX value.",
      "Copy the resulting HEX color code.",
    ],
    faqs: [
      { q: "What happens if I enter a value above 255 or below 0?", a: "It's rejected with a clear error naming which channel is out of range, since RGB channels are only valid between 0 and 255." },
      { q: "Does this round decimal RGB values?", a: "Yes — each channel is rounded to the nearest whole number before being converted to its two-digit HEX representation." },
      { q: "Is HEX just another way of writing the same color as RGB?", a: "Yes — HEX and RGB represent exactly the same color space, just in different notations; converting between them loses no information." },
      { q: "Does this tool send my values to a server?", a: "Yes — they're sent to our servers to compute the result and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "json-to-csv": {
    title: "JSON to CSV Converter — Free, Instant | SaaSToolz",
    metaDescription:
      "Convert a JSON array of objects into a CSV file, with headers built from every key present. Free, instant, no signup.",
    intro:
      "JSON to CSV converts a JSON array of objects into CSV, building its header row from the union of every key found across all objects — so even if some rows are missing a field others have, every column still gets created.",
    steps: [
      "Paste your JSON array of objects.",
      "Click \"Convert\" to generate CSV.",
      "Review the CSV output with headers from every key.",
      "Copy or download the CSV result.",
    ],
    faqs: [
      { q: "What format does my JSON need to be in?", a: "A non-empty array of plain objects, like [{\"name\": \"Alice\", \"age\": 30}, ...] — an array of primitives, a single object, or an empty array will all be rejected with a clear error." },
      { q: "What happens if some objects are missing a field that others have?", a: "The missing field just shows up blank in that row's cell — the header row is built from every key found across all objects, not just the first one." },
      { q: "Does the column order matter in my source JSON?", a: "No — columns are built from the union of all keys found, in the order they're first encountered across the array, not based on any particular object's key order alone." },
      { q: "Does this tool send my JSON to a server?", a: "Yes — it's sent to our servers to convert and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "pdf-page-numbers": {
    title: "Add Page Numbers to PDF — Free, Instant | SaaSToolz",
    metaDescription:
      "Stamp page numbers onto every page of a PDF, choosing the start number and position. Free, no signup.",
    intro:
      "Add Page Numbers stamps a number onto every page of your PDF, letting you choose which number to start counting from and where it appears — bottom-left, bottom-center, or bottom-right.",
    steps: [
      "Upload your PDF.",
      "Choose a starting number (defaults to 1).",
      "Choose a position: bottom-left, center, or right.",
      "Download the numbered PDF.",
    ],
    faqs: [
      { q: "Can I start numbering from something other than 1?", a: "Yes — set any starting number, useful for documents that continue numbering from a previous section or cover page that isn't included in this file." },
      { q: "Will page numbers be added to every page, including the first?", a: "Yes — every page in the document gets a number stamped on it, starting from whatever number you chose." },
      { q: "Can I change the position after generating?", a: "Not on the same file — run the tool again with a different position choice if you want to change where the numbers appear." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, numbered, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "gitignore-generator": {
    title: ".gitignore Generator — Free, Instant | SaaSToolz",
    metaDescription:
      "Build a .gitignore file by combining templates for Node, Python, Java, Go, Rust, macOS, Windows, and more. Free, instant, no signup.",
    intro:
      ".gitignore Generator builds a .gitignore file by combining ready-made templates for common stacks and platforms — Node, Python, Java, Go, Rust, macOS, Windows, JetBrains, and VS Code — into one file with clearly labeled sections.",
    steps: [
      "Select the stacks and platforms you're using (e.g. node, macos).",
      "Click \"Generate\" to build the combined .gitignore.",
      "Review each section, labeled by stack.",
      "Copy the result into your project's .gitignore file.",
    ],
    faqs: [
      { q: "Can I combine multiple stacks, like Node and macOS, in one file?", a: "Yes — select as many as apply and each one gets its own labeled section in the combined output." },
      { q: "Which stacks are supported?", a: "node, python, java, go, rust, macos, windows, jetbrains, and vscode — covering the most common languages, operating systems, and IDEs." },
      { q: "What happens if I request a stack that isn't supported?", a: "You get a clear error listing exactly which stacks are available, rather than a silent fallback or an incomplete file." },
      { q: "Does this tool send my selections to a server?", a: "Yes — they're sent to our servers to build the file and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "slug-generator": {
    title: "Slug Generator — Free, Instant URL Slugs | SaaSToolz",
    metaDescription:
      "Convert any text into a clean, URL-safe slug. Free, instant, no signup.",
    intro:
      "Slug Generator converts text into a clean, URL-safe slug — lowercasing it, stripping accented characters down to their plain letters, removing anything that isn't a letter, number, space or dash, and collapsing everything into single hyphens.",
    steps: [
      "Enter your title or text.",
      "The URL-safe slug is generated instantly.",
      "Copy the slug for your URL.",
    ],
    faqs: [
      { q: "What happens to accented characters, like é or ñ?", a: "They're normalized down to their plain-letter equivalent (é becomes e, ñ becomes n) rather than being stripped out entirely or left as broken characters in the URL." },
      { q: "Does this allow underscores or other special characters?", a: "No — only lowercase letters, numbers, and hyphens remain in the output; everything else, including underscores, punctuation, and symbols, is removed." },
      { q: "What happens with multiple spaces or existing dashes in my text?", a: "They're all collapsed into single hyphens, so \"Hello   World -- Test\" becomes a single clean slug like hello-world-test." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to generate the slug and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "svg-blob-generator": {
    title: "SVG Blob Generator — Free, Instant Organic Shapes | SaaSToolz",
    metaDescription:
      "Generate random organic blob shapes as SVG, with reproducible results via a seed value. Free, instant, no signup.",
    intro:
      "SVG Blob Generator creates an organic, rounded blob shape by placing points at randomized distances around a circle and connecting them with smooth curves — the same seed value always reproduces the exact same shape, so you can save a seed you like and recreate it later.",
    steps: [
      "Set the size, complexity, and color.",
      "Optionally set a seed for a reproducible shape.",
      "Click \"Generate\" to produce the blob.",
      "Copy the SVG code or regenerate for a new shape.",
    ],
    faqs: [
      { q: "Will I get a different blob every time I generate?", a: "Yes, unless you set a specific seed value — with no seed, a random one is chosen each time; with the same seed, you'll get the exact same shape every time." },
      { q: "What does \"complexity\" control?", a: "The number of points used to build the blob's outline, from 3 to 12 — fewer points make a more angular shape, more points make a smoother, more organic-looking blob." },
      { q: "What's a good use for these blobs?", a: "Decorative background shapes, section dividers, or organic accents behind images — common in modern web design for breaking up rigid rectangular layouts." },
      { q: "Does this tool send anything to a server?", a: "Yes — the request is sent to our servers to generate the SVG and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "case-converter": {
    title: "Case Converter — Free, 9 Case Styles | SaaSToolz",
    metaDescription:
      "Convert text between UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, kebab-case and CONSTANT_CASE. Free, instant, no signup.",
    intro:
      "Case Converter transforms your text into any of nine common case styles — uppercase, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE — covering both everyday writing styles and the naming conventions used in code.",
    steps: [
      "Paste your text.",
      "Choose the case style you need.",
      "The converted result appears instantly.",
      "Copy the result.",
    ],
    faqs: [
      { q: "What's the difference between camelCase and PascalCase?", a: "camelCase starts with a lowercase letter (myVariableName), while PascalCase capitalizes every word including the first (MyVariableName) — the choice usually depends on your programming language's naming conventions." },
      { q: "What's CONSTANT_CASE used for?", a: "It's the common convention for constants in many programming languages — all uppercase with underscores between words, like MAX_RETRY_COUNT." },
      { q: "Does snake_case or kebab-case strip special characters?", a: "Yes — both lowercase the text, replace spaces with underscores or hyphens respectively, and strip out anything that isn't a letter, number, or the appropriate separator." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to convert and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "box-shadow": {
    title: "CSS Box Shadow Generator — Free, Instant Code | SaaSToolz",
    metaDescription:
      "Build a CSS box-shadow visually by setting offset, blur, spread, color, and inset. Free, instant, no signup.",
    intro:
      "CSS Box Shadow Generator builds the box-shadow property from the values you set — horizontal and vertical offset, blur radius, spread, color, and whether the shadow sits inside or outside the element — so you don't have to memorize the property's argument order.",
    steps: [
      "Set the horizontal and vertical offset.",
      "Set the blur and spread amounts.",
      "Choose a color and whether the shadow is inset.",
      "Copy the generated box-shadow CSS.",
    ],
    faqs: [
      { q: "What's the difference between blur and spread?", a: "Blur softens and extends the shadow's edges outward in every direction equally; spread grows or shrinks the shadow's base size before blur is applied, letting you make a sharper, larger-footprint shadow." },
      { q: "What does \"inset\" do?", a: "It flips the shadow to render inside the element's border instead of outside it, producing a pressed-in or recessed look instead of a shadow that appears to float behind the element." },
      { q: "Can I use this for a subtle shadow instead of a dramatic one?", a: "Yes — small offset and blur values with a low-opacity color (like rgba(0,0,0,0.1)) produce the subtle shadows common in modern card and button UI." },
      { q: "Does this tool send my settings to a server?", a: "Yes — they're sent to our servers to build the CSS and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "button-generator": {
    title: "CSS Button Generator — Free, Instant Code | SaaSToolz",
    metaDescription:
      "Build a styled CSS button with background, hover state, padding, radius and font size. Free, instant, no signup.",
    intro:
      "CSS Button Generator builds a complete button style — background color, text color, a hover background with a smooth color transition, padding, border radius, and font size — ready to paste as a .btn class.",
    steps: [
      "Set the background and text color.",
      "Set the hover background color.",
      "Adjust padding, border radius, and font size.",
      "Copy the generated CSS.",
    ],
    faqs: [
      { q: "Does the hover effect work automatically, or do I need extra JavaScript?", a: "No JavaScript needed — the hover state is a plain CSS :hover rule with a background-color transition, so it works as soon as you apply the generated class." },
      { q: "Can I use this class name on any element, not just a <button>?", a: "Yes — it's just a CSS class (.btn) targeting background, padding, and other visual properties, so it'll style any element you apply it to, though a real <button> or <a> is the semantically correct choice." },
      { q: "What transition speed does the hover use?", a: "0.2 seconds with an ease timing function — fast enough to feel responsive without being abrupt." },
      { q: "Does this tool send my settings to a server?", a: "Yes — they're sent to our servers to build the CSS and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "sort-text": {
    title: "Alphabetical Sort — Free, Instant Line Sorting | SaaSToolz",
    metaDescription:
      "Sort lines of text alphabetically, ascending or descending, with optional case sensitivity. Free, instant, no signup.",
    intro:
      "Alphabetical Sort arranges your lines of text in order, letting you choose ascending or descending direction and whether the comparison is case-sensitive — blank lines are dropped from the result.",
    steps: [
      "Paste your list, one item per line.",
      "Choose ascending or descending order.",
      "Choose whether sorting is case-sensitive.",
      "Copy the sorted result.",
    ],
    faqs: [
      { q: "What happens with case sensitivity off vs on?", a: "With it off (the default), \"Apple\" and \"apple\" sort together regardless of case. With it on, uppercase and lowercase letters sort by their actual character codes, which can place all-uppercase words before lowercase ones." },
      { q: "Are blank lines kept in the sorted output?", a: "No — blank lines are filtered out before sorting, so your result contains only the actual content lines." },
      { q: "Does this sort numbers numerically or alphabetically?", a: "Alphabetically as text, so \"10\" sorts before \"2\" (since \"1\" comes before \"2\" character by character) — this isn't a numeric sort." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to sort and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "animation-generator": {
    title: "CSS Animation Generator — Free, Instant Keyframes | SaaSToolz",
    metaDescription:
      "Generate CSS @keyframes animations — fade, slide, bounce, spin, or pulse — with custom duration and easing. Free, instant, no signup.",
    intro:
      "CSS Animation Generator builds a complete @keyframes block plus the animation shorthand property for six common effects — fade, slide-up, slide-in, bounce, spin, and pulse — with your chosen duration, easing, and repeat count.",
    steps: [
      "Choose an animation type (fade, slide, bounce, spin, or pulse).",
      "Set the duration, easing, and how many times it repeats.",
      "Copy the generated @keyframes and animation CSS.",
      "Apply the animation name to your element's class.",
    ],
    faqs: [
      { q: "What's the difference between slide-up and slide-in?", a: "slide-up animates the element moving upward into place (translateY), while slide-in moves it in from the left (translateX) — pick based on which direction fits your layout." },
      { q: "What does the iteration count control?", a: "How many times the animation plays — set it to a number for a fixed count, or \"infinite\" for an animation that loops forever, like the spin or pulse effects commonly used for loading indicators." },
      { q: "Do I need to write any JavaScript to use this?", a: "No — it's pure CSS. Paste the generated @keyframes block into your stylesheet and apply the animation property to whichever element you want animated." },
      { q: "Does this tool send my settings to a server?", a: "Yes — they're sent to our servers to build the CSS and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "pdf-metadata": {
    title: "PDF Metadata Editor — Free, Instant | SaaSToolz",
    metaDescription:
      "View and edit a PDF's title, author, subject, and keywords. Free, no signup.",
    intro:
      "PDF Metadata Editor reads a PDF's embedded metadata — title, author, subject, keywords, creator, producer, and creation/modification dates — and lets you edit the title, author, subject, and keywords fields and save the changes back into the file.",
    steps: [
      "Upload your PDF.",
      "Review its current metadata fields.",
      "Edit the title, author, subject, or keywords.",
      "Download the PDF with updated metadata.",
    ],
    faqs: [
      { q: "Can I edit every metadata field, or just some?", a: "You can edit title, author, subject, and keywords. Creator, producer, and the creation/modification dates are shown for reference but reflect how the PDF was originally made, so they aren't editable through this tool." },
      { q: "How should I enter multiple keywords?", a: "As a comma-separated list — each one is trimmed and stored as a separate keyword in the PDF's metadata." },
      { q: "Does editing metadata change the PDF's visible content?", a: "No — metadata is invisible information about the document, separate from the pages themselves; editing it doesn't touch any visible content." },
      { q: "Does this tool send my PDF to a server?", a: "Yes — your file is uploaded securely, edited, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "reverse-text": {
    title: "Reverse Text — Free, Instant | SaaSToolz",
    metaDescription:
      "Reverse text by character, word, or line, with correct handling of emoji and other multi-byte characters. Free, instant, no signup.",
    intro:
      "Reverse Text flips your text in one of three modes — character by character, word order, or line order — correctly handling emoji and other characters that take up more than one UTF-16 code unit, so they don't get corrupted into broken symbols.",
    steps: [
      "Paste your text.",
      "Choose a reverse mode: characters, words, or lines.",
      "The reversed result appears instantly.",
      "Copy the result.",
    ],
    faqs: [
      { q: "Will reversing break emoji or other special characters?", a: "No — reversal is done by Unicode code point, not raw UTF-16 units, so multi-byte characters like emoji stay intact as whole characters instead of being split and corrupted." },
      { q: "What's the difference between \"words\" and \"characters\" mode?", a: "Character mode reverses every individual character (\"hello\" becomes \"olleh\"); word mode keeps each word intact but reverses their order (\"hello world\" becomes \"world hello\")." },
      { q: "What does \"lines\" mode do with a multi-line block of text?", a: "It reverses the order of entire lines — the last line becomes the first, and so on — while leaving the content of each line unchanged." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to reverse and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "svg-converter": {
    title: "SVG Converter — Free, Instant Rasterization | SaaSToolz",
    metaDescription:
      "Convert an SVG vector file into a PNG, JPEG, or other raster image at high quality. Free, no signup.",
    intro:
      "SVG Converter rasterizes a vector SVG file into a standard raster format like PNG or JPEG, rendering at 300 DPI for crisp results, with an optional width to resize the output.",
    steps: [
      "Upload your SVG file.",
      "Choose your target format (PNG, JPEG, etc.).",
      "Optionally set an output width.",
      "Download the converted raster image.",
    ],
    faqs: [
      { q: "Why would I need to convert SVG to a raster format at all?", a: "Many platforms and tools (certain social media uploads, some older software, email clients) don't support SVG and need a standard raster image like PNG or JPEG instead." },
      { q: "Will the converted image look sharp, or pixelated?", a: "Rendering happens at 300 DPI, which produces crisp, print-quality results rather than a low-resolution rasterization." },
      { q: "What if I need a specific pixel width?", a: "Set the width option and the SVG is rendered at that exact size, scaling proportionally." },
      { q: "Does this tool send my file to a server?", a: "Yes — your file is uploaded securely, converted, and deleted from our servers within 1 hour." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "og-generator": {
    title: "Open Graph Generator — Free, Instant Meta Tags | SaaSToolz",
    metaDescription:
      "Generate Open Graph meta tags, with matching Twitter Card tags included automatically. Free, instant, no signup.",
    intro:
      "Open Graph Generator builds the og: meta tags that control how your link previews on Facebook, LinkedIn, Slack, and other platforms that read Open Graph data — and automatically includes matching twitter:card tags too, so one tool covers both.",
    steps: [
      "Enter your title, description, image, and page URL.",
      "Optionally set the content type and site name.",
      "Click \"Generate\" to build the tags.",
      "Copy the result into your page's <head>.",
    ],
    faqs: [
      { q: "Does this also handle Twitter/X previews, or do I need a separate tool?", a: "This one tool covers both — it automatically adds matching twitter:card, twitter:title, twitter:description and twitter:image tags alongside the Open Graph tags, using the summary_large_image card type." },
      { q: "What does the \"type\" field control?", a: "It sets og:type, which tells platforms what kind of content the page is (website, article, product, etc.) — it defaults to \"website\" if you don't set anything." },
      { q: "What happens if I leave a field blank?", a: "Only the fields you fill in are included in the output — there's no placeholder or default text inserted for empty fields." },
      { q: "Does this tool send my inputs to a server?", a: "Yes — they're sent to our servers to build the tags and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "hreflang-generator": {
    title: "Hreflang Generator — Free, Instant | SaaSToolz",
    metaDescription:
      "Generate hreflang tags to tell search engines which language or region version of a page to show. Free, instant, no signup.",
    intro:
      "Hreflang Generator builds the hreflang link tags that tell search engines which language- or region-specific version of your page to serve to which visitors, including an optional x-default fallback for visitors who don't match any listed language.",
    steps: [
      "Add each language/region version with its language code and URL.",
      "Optionally set a default URL for unmatched visitors.",
      "Click \"Generate\" to build the tags.",
      "Copy the result into each page's <head>.",
    ],
    faqs: [
      { q: "What does the x-default tag do?", a: "It's the fallback version shown to visitors whose language or region doesn't match any of the specific hreflang entries you've listed — useful for a language-selector page or a generic international version." },
      { q: "Do I need to add this tag to every language version of my page, or just one?", a: "Every version should include the same set of hreflang tags (including pointing to itself), which is how search engines understand the full set of alternates for that content." },
      { q: "What format should the language code be in?", a: "Standard language codes like en, en-US, or fr-CA — the format Google's hreflang implementation expects." },
      { q: "Does this tool send my inputs to a server?", a: "Yes — they're sent to our servers to build the tags and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "keyword-density": {
    title: "Keyword Density Checker — Free, Instant | SaaSToolz",
    metaDescription:
      "Analyze text to find your top keywords and their density percentage, with an optional target keyword check. Free, instant, no signup.",
    intro:
      "Keyword Density Checker counts every word in your text (ignoring short words of two characters or fewer) and reports the top 15 most frequent words with their density percentage, plus the specific density of a target keyword if you name one.",
    steps: [
      "Paste your text (an article, page copy, etc.).",
      "Optionally enter a target keyword to check specifically.",
      "Click \"Analyze\" to see the results.",
      "Review the top keywords and their density percentages.",
    ],
    faqs: [
      { q: "How is density calculated?", a: "A word's count divided by the total word count, as a percentage — so a word appearing 5 times in a 500-word text has a 1% density." },
      { q: "Why are short words like \"a\" or \"to\" excluded?", a: "Words of two characters or fewer are filtered out before counting, since common short function words would otherwise dominate the results without being meaningful for SEO purposes." },
      { q: "Is there an ideal keyword density to aim for?", a: "There's no single correct number — modern SEO generally favors natural, readable writing over hitting a specific density target, since search engines have moved well past simple keyword-counting algorithms." },
      { q: "Does this tool send my text to a server?", a: "Yes — it's sent to our servers to analyze and the result is returned to you; nothing is stored." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
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
  "html-formatter": {
    title: "HTML Formatter & Beautifier Online Free | SaaSToolz",
    metaDescription:
      "Beautify minified or messy HTML with proper indentation in one click. Free, browser-based HTML formatter with no signup and no size limit for typical pages.",
    intro:
      "HTML Formatter takes minified, compressed, or inconsistently indented HTML and reformats it with clean, readable indentation — useful for debugging a page's structure, reviewing someone else's markup, or making a minified file editable again.",
    steps: [
      "Paste your HTML into the input box.",
      "The formatter reformats it instantly with consistent indentation.",
      "Review the beautified output.",
      "Copy the formatted HTML to your clipboard.",
    ],
    faqs: [
      { q: "Will formatting change how my HTML renders?", a: "No — only whitespace and indentation change. Tags, attributes and content stay exactly as they were, so rendered output is identical." },
      { q: "Can I use this to shrink HTML for production instead?", a: "That's the opposite operation — use HTML Minifier to strip whitespace and comments for a smaller production file." },
      { q: "Does this tool send my HTML anywhere?", a: "Yes — the HTML you paste is sent to our servers to be formatted and the result is returned to you; we don't store the content itself." },
      { q: "Is there a size limit?", a: "No hard limit for typical pages — very large HTML documents may take a moment longer to render." },
      { q: "Does it fix broken or invalid HTML?", a: "It reformats whatever you paste, but doesn't validate or repair malformed markup — check unclosed tags separately if the source looks broken." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "css-minifier": {
    title: "CSS Minifier Online — Free, Instant, No Signup | SaaSToolz",
    metaDescription:
      "Shrink CSS files for production by stripping whitespace, comments and redundant semicolons. Free CSS minifier, instant results, no signup required.",
    intro:
      "CSS Minifier strips whitespace, comments, and redundant characters from a stylesheet to produce the smallest possible file for production — the same rules, just packed tighter, with no change in how the page renders.",
    steps: [
      "Paste your CSS into the input box.",
      "The minifier compresses it instantly, removing whitespace and comments.",
      "Compare the before/after size shown on screen.",
      "Copy the minified CSS to your clipboard.",
    ],
    faqs: [
      { q: "Will minifying change how my page looks?", a: "No — minifying only removes whitespace, comments and redundant characters. Every rule and selector still applies exactly as before." },
      { q: "How much smaller will my CSS get?", a: "It varies with how much whitespace and repetition the original has, but stylesheets with a lot of utility classes often shrink 20–30% from minification alone." },
      { q: "Do I need this if I already use a build tool?", a: "No — Vite, webpack and similar bundlers already minify CSS in production builds. This tool is for a standalone stylesheet served without a build step." },
      { q: "Can I reverse it and get readable CSS back?", a: "Yes — use CSS Formatter to re-indent a minified stylesheet for editing." },
      { q: "Does this tool send my CSS anywhere?", a: "Yes — the CSS you paste is sent to our servers to be minified and the result is returned to you; we don't store the content itself." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "js-minifier": {
    title: "JS Minifier Online — Free JavaScript Minifier | SaaSToolz",
    metaDescription:
      "Minify JavaScript for production: strip whitespace and comments, shorten variable names, and remove unreachable code. Free, instant, no signup.",
    intro:
      "JS Minifier compresses a JavaScript file by removing whitespace and comments, shortening local variable names, and stripping code the parser can prove is unreachable — useful for a standalone script or vendored file that isn't already running through a build pipeline.",
    steps: [
      "Paste your JavaScript into the input box.",
      "The minifier compresses it instantly.",
      "Compare the before/after size shown on screen.",
      "Copy the minified code to your clipboard.",
    ],
    faqs: [
      { q: "Will minifying break my JavaScript?", a: "No — the minifier only performs transformations that preserve behavior exactly: renaming local variables, stripping whitespace/comments, and removing genuinely unreachable code." },
      { q: "Do I need this if I use Next.js, Vite or webpack?", a: "No — production builds from those tools already minify JavaScript automatically. This tool is for a standalone script outside a build pipeline." },
      { q: "Does minifying bundle multiple files together?", a: "No — that's a separate job (bundling) handled by build tools like webpack or esbuild. This minifies one file at a time." },
      { q: "Can I get readable code back from a minified file?", a: "Only partially — a beautifier can re-indent it, but original variable names are gone for good once minified. Use JS Beautifier for readable formatting of what remains." },
      { q: "Does this tool send my code anywhere?", a: "Yes — the JavaScript you paste is sent to our servers to be minified and the result is returned to you; we don't store the content itself." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no usage limits for casual use." },
    ],
  },
  "csv-to-json": {
    title: "CSV to JSON Converter — Free, Instant, No Signup | SaaSToolz",
    metaDescription:
      "Convert CSV rows to a JSON array in one click — headers become keys automatically. Free CSV to JSON converter, no signup, works with pasted data or files.",
    intro:
      "CSV to JSON converts spreadsheet-style CSV data into a JSON array of objects, using the header row as each object's keys — handy for feeding a spreadsheet export into an API, a script, or a NoSQL database.",
    steps: [
      "Paste your CSV data, or upload a .csv file.",
      "The converter uses the first row as keys and builds a JSON array automatically.",
      "Review the generated JSON output.",
      "Copy the result or download it as a .json file.",
    ],
    faqs: [
      { q: "What if my CSV doesn't have a header row?", a: "The converter expects the first row to be column headers, which become each object's keys — add a header row first if your data doesn't have one." },
      { q: "Does it handle commas inside quoted fields?", a: "Yes — standard CSV quoting (commas or line breaks inside double-quoted fields) is parsed correctly, not just naive comma-splitting." },
      { q: "Can I convert the other direction too?", a: "Yes — use JSON to CSV to flatten a JSON array of objects back into spreadsheet rows." },
      { q: "Is there a row limit?", a: "No hard limit for typical exports; very large CSV files may take a little longer to process." },
      { q: "Does this tool send my data anywhere?", a: "Yes — the CSV you provide is sent to our servers to be converted and the result is returned to you; we don't store the content itself." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup required." },
    ],
  },
  "barcode-generator": {
    title: "Barcode Generator — EAN-13, Code 128, UPC | SaaSToolz",
    metaDescription:
      "Generate scannable barcodes in EAN-13, Code 128, UPC and other common formats. Free barcode generator, downloadable as PNG or SVG, no signup or watermark.",
    intro:
      "Barcode Generator creates a scannable barcode from a number or text value in the format you choose — EAN-13, Code 128, UPC and others — ready to download and use on packaging, inventory labels, or internal tracking.",
    steps: [
      "Choose the barcode format you need — EAN-13, Code 128, UPC or another supported type.",
      "Enter the value you want encoded.",
      "Preview the generated barcode.",
      "Download it as a PNG or SVG file.",
    ],
    faqs: [
      { q: "Which barcode format should I use?", a: "EAN-13 and UPC are standard for retail products; Code 128 is more flexible and commonly used for internal inventory or shipping labels. Check what your scanner or retailer requires before picking one." },
      { q: "Do EAN-13 and UPC codes need to be officially registered?", a: "For retail sale, yes — EAN/UPC prefixes are issued by GS1. This tool generates a valid barcode image from any number you provide, but doesn't register or issue new product codes." },
      { q: "What's the difference between the PNG and SVG download?", a: "PNG is a fixed-resolution image suitable for screens and most printing; SVG is a vector file that scales to any size — useful for large-format labels — with no quality loss." },
      { q: "Will the barcode still scan if printed small?", a: "Scannability depends on print resolution and the scanner used — test a sample print at your intended size before running a full batch." },
      { q: "What's the difference between a barcode and a QR code?", a: "A barcode encodes data in a single line and holds relatively little, usually just a product number. A QR code encodes data in two dimensions and can hold dramatically more, like a full URL or contact card." },
      { q: "Is this tool free to use?", a: "Yes — completely free, with no signup and no watermark on the output." },
    ],
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Converter — Free, No Watermark | SaaSToolz",
    metaDescription:
      "Convert one or more JPG images into a single PDF, in the order you choose. Free JPG to PDF converter, no signup, no watermark, files deleted within an hour.",
    intro:
      "JPG to PDF combines one or more JPG images into a single PDF document — upload photos, scanned pages, or screenshots, arrange them in order, and download one PDF instead of separate image files.",
    steps: [
      "Upload one or more JPG images using the file picker or by dragging them in.",
      "Drag the thumbnails to set the page order for the final PDF.",
      "Click \"Convert to PDF\" to combine them.",
      "Download the resulting PDF — ready to send or print immediately.",
    ],
    faqs: [
      { q: "Can I convert multiple images into one PDF?", a: "Yes — upload as many JPGs as you need and they're combined into a single multi-page PDF in the order you arrange them." },
      { q: "Will converting reduce image quality?", a: "No — images are embedded in the PDF as-is, with no re-compression, so they look exactly as sharp as the originals." },
      { q: "The resulting PDF is too large to email — what now?", a: "Run it through Compress PDF afterward. Photos, especially from a phone camera, add up quickly across multiple pages." },
      { q: "Can I make a scanned document searchable after converting?", a: "Yes — a JPG-to-PDF conversion is still just an image. Run the result through PDF OCR afterward to make the text searchable and copyable." },
      { q: "How do I go the other direction?", a: "Use PDF to JPG to extract individual images from an existing PDF." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "pdf-to-jpg": {
    title: "PDF to JPG Converter — Free, High-Quality | SaaSToolz",
    metaDescription:
      "Convert PDF pages into high-quality JPG images, one file per page. Free PDF to JPG converter, no signup, no watermark, downloaded instantly as a .zip.",
    intro:
      "PDF to JPG converts every page of a PDF into a separate high-quality JPG image — useful for dropping a page into a slide deck, a design tool, or anywhere else that needs an image instead of a PDF.",
    steps: [
      "Upload the PDF you want to convert.",
      "Choose the pages to convert — all pages, or a specific range.",
      "Click \"Convert to JPG\" and let it process.",
      "Download the images individually or as a .zip file.",
    ],
    faqs: [
      { q: "Do I get one image per page?", a: "Yes — each PDF page is converted into its own separate JPG image, packaged as a .zip when there's more than one." },
      { q: "Can I convert just specific pages?", a: "Yes — choose a specific page range instead of converting the whole document." },
      { q: "How is image quality determined?", a: "Pages are rendered at a resolution suited for screen use and standard printing; very high-DPI print work may benefit from working with the original PDF directly." },
      { q: "Can I go the other direction, from images to PDF?", a: "Yes — use JPG to PDF to combine images back into a single PDF document." },
      { q: "Will this work on a password-protected PDF?", a: "Unlock it first with the Unlock PDF tool, then convert — encrypted files can't be processed directly." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
    ],
  },
  "pdf-rotate": {
    title: "Rotate PDF Online Free — 90, 180, 270 Degrees | SaaSToolz",
    metaDescription:
      "Fix sideways or upside-down PDF pages by rotating them 90, 180 or 270 degrees. Free PDF rotator, no signup, rotate all pages or just the ones you choose.",
    intro:
      "Rotate PDF fixes pages that were scanned or saved sideways or upside-down — rotate the whole document or just specific pages by 90, 180, or 270 degrees, without re-uploading or re-scanning anything.",
    steps: [
      "Upload the PDF with pages that need rotating.",
      "Select which pages to rotate — all of them, or specific ones.",
      "Choose the rotation angle: 90, 180 or 270 degrees.",
      "Download the corrected PDF.",
    ],
    faqs: [
      { q: "Can I rotate just one page instead of the whole document?", a: "Yes — select specific pages to rotate while leaving the rest of the document untouched." },
      { q: "Will rotating affect the PDF's text or image quality?", a: "No — pages are rotated as-is with no re-compression or re-rendering, so content looks exactly as it did before, just correctly oriented." },
      { q: "Why do scanned PDFs end up sideways in the first place?", a: "Most often the original paper was fed into the scanner in landscape orientation, or a phone camera photo was taken sideways before being saved as a PDF." },
      { q: "Can I rotate different pages by different amounts?", a: "Yes — select each page's rotation individually if different pages need different corrections." },
      { q: "Is there a limit on how many pages I can rotate?", a: "Free use covers typical document lengths; very large PDFs may take a little longer to process." },
      { q: "Is my data safe when using this tool?", a: "Yes. Files are processed securely and deleted from our servers within 1 hour." },
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

// Google shows roughly 155–160 characters of a meta description; the full
// suffix pushes longer tool descriptions past that, so fall back to a
// shorter wording of the same claim when needed.
const MAX_META_DESCRIPTION = 160;

function fallbackDescription(tool: Tool): string {
  const fileBased = isFileTool(tool.id);
  const [long, short] =
    tool.processing === "client"
      ? [
          "100% free, no signup required — everything runs instantly in your browser and nothing you enter is ever uploaded.",
          "Free, no signup — runs in your browser and nothing you enter is uploaded.",
        ]
      : fileBased
        ? [
            "Free, no signup, no watermark — files are uploaded securely and permanently removed from our servers within 1 hour.",
            "Free, no signup, no watermark — files are deleted from our servers within 1 hour.",
          ]
        : [
            "Free, no signup, no usage limits — processed securely and never stored on our servers.",
            "Free, no signup, no limits — never stored on our servers.",
          ];
  const full = `${tool.description}. ${long}`;
  return full.length <= MAX_META_DESCRIPTION ? full : `${tool.description}. ${short}`;
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
