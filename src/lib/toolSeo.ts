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
