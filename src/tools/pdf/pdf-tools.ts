// PDF manipulation — built on pdf-lib (pure JS, already a project dependency).
//
// pdf-lib can rewrite PDF structure (pages, metadata, simple drawing) but
// cannot rasterize pages to images, extract/reconstruct text, OCR scanned
// text, decrypt/encrypt PDFs, or recompress embedded images. Those live
// elsewhere: pdf-to-jpg in pdf-to-image.ts (pdfjs-dist + @napi-rs/canvas),
// pdf-to-word in pdf-to-word.ts (pdfjs-dist text extraction + docx),
// pdf-protect/pdf-unlock in pdf-protect.ts (mupdf — pdf-lib has no
// encryption support at all), and pdf-ocr in pdf-ocr.ts (pdf-to-image.ts's
// rasterizer + tesseract.js).

import { PDFDocument, PDFName, PDFNumber, PDFArray, PDFBool, PDFDict, PDFRawStream, decodePDFRawStream, StandardFonts, rgb, degrees } from "pdf-lib";
import * as mupdf from "mupdf";
import sharp, { type Sharp } from "sharp";
import { sanitizeForFont } from "./pdf-font-utils";

function assertPageNumbers(nums: number[], total: number, label = "page") {
  if (!Array.isArray(nums) || nums.length === 0) throw new Error(`Provide at least one ${label} number`);
  for (const n of nums) {
    if (!Number.isInteger(n) || n < 1 || n > total) {
      throw new Error(`${label} ${n} is out of range — this PDF has ${total} pages`);
    }
  }
}

export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  if (buffers.length < 2) throw new Error("Provide at least 2 PDF files to merge");
  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  return merged.save();
}

export async function rotatePdf(buffer: ArrayBuffer, angle: number): Promise<Uint8Array> {
  const normalized = ((angle % 360) + 360) % 360;
  if (![0, 90, 180, 270].includes(normalized)) throw new Error("angle must be 0, 90, 180, or 270");
  const doc = await PDFDocument.load(buffer);
  doc.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + normalized) % 360)));
  return doc.save();
}

export async function addWatermark(buffer: ArrayBuffer, rawText: string, opacity = 0.25): Promise<Uint8Array> {
  if (!rawText) throw new Error("text is required");
  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  // pdf-lib's StandardFonts only support WinAnsi encoding — see
  // pdf-font-utils.ts. Without this, any non-WinAnsi character in the
  // watermark text (CJK, Arabic, emoji) throws and takes down the whole
  // document.
  const text = sanitizeForFont(rawText, font);
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const size = 48;
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity: Math.min(Math.max(opacity, 0.05), 1),
      rotate: degrees(45),
    });
  });
  return doc.save();
}

export async function addPageNumbers(
  buffer: ArrayBuffer,
  opts: { startAt?: number; position?: "bottom-center" | "bottom-left" | "bottom-right" } = {}
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const startAt = opts.startAt ?? 1;
  const position = opts.position ?? "bottom-center";
  doc.getPages().forEach((page, i) => {
    const { width } = page.getSize();
    const text = String(i + startAt);
    const textWidth = font.widthOfTextAtSize(text, 11);
    const x = position === "bottom-left" ? 36 : position === "bottom-right" ? width - 36 - textWidth : width / 2 - textWidth / 2;
    page.drawText(text, { x, y: 24, size: 11, font, color: rgb(0.2, 0.2, 0.2) });
  });
  return doc.save();
}

export async function removePages(buffer: ArrayBuffer, pageNumbers: number[]): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer);
  const total = doc.getPageCount();
  assertPageNumbers(pageNumbers, total);
  if (pageNumbers.length >= total) throw new Error("Cannot remove every page from the document");
  const indices = Array.from(new Set(pageNumbers.map((n) => n - 1))).sort((a, b) => b - a);
  for (const idx of indices) doc.removePage(idx);
  return doc.save();
}

export async function extractPages(buffer: ArrayBuffer, pageNumbers: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer);
  const total = src.getPageCount();
  assertPageNumbers(pageNumbers, total);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, pageNumbers.map((n) => n - 1));
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

// Splits into consecutive chunks of `chunkSize` pages each — e.g. a 10-page
// doc with chunkSize 3 becomes [1-3], [4-6], [7-9], [10-10].
export async function splitPdfIntoChunks(
  buffer: ArrayBuffer,
  chunkSize: number
): Promise<{ bytes: Uint8Array; from: number; to: number }[]> {
  const src = await PDFDocument.load(buffer);
  const total = src.getPageCount();
  const size = Math.max(1, Math.floor(chunkSize));
  const parts: { bytes: Uint8Array; from: number; to: number }[] = [];
  for (let from = 1; from <= total; from += size) {
    const to = Math.min(from + size - 1, total);
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i));
    pages.forEach((p) => out.addPage(p));
    parts.push({ bytes: await out.save(), from, to });
  }
  return parts;
}

// Splits every page of the document into its own single-page PDF.
export async function splitPdfEveryPage(buffer: ArrayBuffer): Promise<Uint8Array[]> {
  const src = await PDFDocument.load(buffer);
  const total = src.getPageCount();
  const outputs: Uint8Array[] = [];
  for (let i = 0; i < total; i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [i]);
    out.addPage(page);
    outputs.push(await out.save());
  }
  return outputs;
}

export async function reorderPages(buffer: ArrayBuffer, order: number[]): Promise<Uint8Array> {
  const src = await PDFDocument.load(buffer);
  const total = src.getPageCount();
  if (order.length !== total || new Set(order).size !== total) {
    throw new Error(`order must list all ${total} pages exactly once`);
  }
  assertPageNumbers(order, total);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, order.map((n) => n - 1));
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export interface PdfMetadata {
  title: string | null;
  author: string | null;
  subject: string | null;
  keywords: string | null;
  creator: string | null;
  producer: string | null;
  creationDate: string | null;
  modificationDate: string | null;
  pageCount: number;
}

export async function readMetadata(buffer: ArrayBuffer): Promise<PdfMetadata> {
  const doc = await PDFDocument.load(buffer);
  return {
    title: doc.getTitle() ?? null,
    author: doc.getAuthor() ?? null,
    subject: doc.getSubject() ?? null,
    keywords: doc.getKeywords() ?? null,
    creator: doc.getCreator() ?? null,
    producer: doc.getProducer() ?? null,
    creationDate: doc.getCreationDate()?.toISOString() ?? null,
    modificationDate: doc.getModificationDate()?.toISOString() ?? null,
    pageCount: doc.getPageCount(),
  };
}

export async function writeMetadata(
  buffer: ArrayBuffer,
  meta: { title?: string; author?: string; subject?: string; keywords?: string }
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer);
  if (meta.title !== undefined) doc.setTitle(meta.title);
  if (meta.author !== undefined) doc.setAuthor(meta.author);
  if (meta.subject !== undefined) doc.setSubject(meta.subject);
  if (meta.keywords !== undefined) doc.setKeywords(meta.keywords.split(",").map((k) => k.trim()).filter(Boolean));
  return doc.save();
}

export type PdfCompressionLevel = "low" | "recommended" | "extreme";

// Compression never rasterizes pages: text, fonts and vector artwork are left
// exactly as they are, so text stays selectable and sharp at any zoom. Only
// the embedded images are re-encoded (that is where nearly all the weight in
// a large PDF lives), and a lossless structural pass (dedupe, garbage-collect,
// Flate-compress streams) runs on top.
//   low          - lossless only: no pixel of any image changes.
//   recommended  - photos re-encoded at JPEG q82 (visually identical at normal
//                  viewing); only images wider than 3200px are scaled down
//                  (over 350 DPI on a full A4 page, beyond what print shows).
//   extreme      - q65 and a 1800px cap (about 215 DPI on A4): smaller, with
//                  some softening on close inspection, still fully legible.
const IMAGE_PRESETS: Record<Exclude<PdfCompressionLevel, "low">, { quality: number; maxDim: number; flateQuality: number }> = {
  recommended: { quality: 82, maxDim: 3200, flateQuality: 88 },
  extreme: { quality: 65, maxDim: 1800, flateQuality: 72 },
};

// An image has to shrink by at least this much to be worth replacing; this
// stops pointless re-encodes of already-optimized JPEGs (generation loss for
// no gain).
const MIN_JPEG_SAVING = 0.9;
const MIN_FLATE_SAVING = 0.6;
const MIN_FLATE_BYTES = 100 * 1024;

function nameOf(obj: unknown): string | null {
  return obj instanceof PDFName ? obj.toString() : null;
}

function singleFilter(dict: PDFDict): string | null {
  const f = dict.get(PDFName.of("Filter"));
  if (f instanceof PDFName) return f.toString();
  if (f instanceof PDFArray && f.size() === 1) return nameOf(f.get(0));
  return null;
}

// Photographic images have many distinct colors; flat graphics, screenshots
// and line art do not, and converting those to JPEG would smear their edges.
function looksPhotographic(raw: Uint8Array, channels: number): boolean {
  const seen = new Set<number>();
  const pixelCount = raw.length / channels;
  const step = Math.max(1, Math.floor(pixelCount / 20000));
  for (let p = 0; p < pixelCount; p += step) {
    const i = p * channels;
    const key = channels === 3 ? ((raw[i] >> 3) << 10) | ((raw[i + 1] >> 3) << 5) | (raw[i + 2] >> 3) : raw[i] >> 2;
    seen.add(key);
    if (seen.size > 1500) return true;
  }
  return false;
}

async function recompressEmbeddedImages(
  buffer: ArrayBuffer,
  p: { quality: number; maxDim: number; flateQuality: number }
): Promise<{ bytes: Uint8Array; replaced: number }> {
  const doc = await PDFDocument.load(buffer, { updateMetadata: false });
  const ctx = doc.context;
  let replaced = 0;

  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;
    const dict = obj.dict;
    if (nameOf(dict.get(PDFName.of("Subtype"))) !== "/Image") continue;

    // Skip anything where re-encoding could change meaning: stencil masks,
    // color-key masks, custom decode arrays, non-8-bit data.
    const imageMask = dict.get(PDFName.of("ImageMask"));
    if (imageMask instanceof PDFBool && imageMask.asBoolean()) continue;
    if (dict.has(PDFName.of("Mask")) || dict.has(PDFName.of("Decode"))) continue;
    const bpc = dict.get(PDFName.of("BitsPerComponent"));
    if (!(bpc instanceof PDFNumber) || bpc.asNumber() !== 8) continue;
    const w = dict.get(PDFName.of("Width"));
    const h = dict.get(PDFName.of("Height"));
    if (!(w instanceof PDFNumber) || !(h instanceof PDFNumber)) continue;
    const width = w.asNumber();
    const height = h.asNumber();

    const cs = nameOf(dict.get(PDFName.of("ColorSpace")));
    const channels = cs === "/DeviceRGB" ? 3 : cs === "/DeviceGray" ? 1 : 0;
    const filter = singleFilter(dict);

    try {
      let pipeline: Sharp;
      let originalBytes: number;
      let minSaving: number;
      let quality: number;

      if (filter === "/DCTDecode") {
        const raw = Buffer.from(obj.contents);
        const meta = await sharp(raw).metadata();
        // CMYK JPEGs, embedded ICC profiles and non-8-bit data are left
        // alone: re-encoding them would shift colors.
        if (!meta.channels || meta.channels === 4 || meta.channels === 2 || meta.icc || meta.depth !== "uchar") continue;
        if (channels !== 0 && meta.channels !== channels) continue;
        originalBytes = raw.length;
        minSaving = MIN_JPEG_SAVING;
        quality = p.quality;
        pipeline = sharp(raw);
      } else if (filter === "/FlateDecode" && channels > 0 && obj.contents.length >= MIN_FLATE_BYTES) {
        const pixels = decodePDFRawStream(obj).decode();
        if (pixels.length !== width * height * channels) continue;
        if (!looksPhotographic(pixels, channels)) continue;
        originalBytes = obj.contents.length;
        minSaving = MIN_FLATE_SAVING;
        quality = p.flateQuality;
        pipeline = sharp(Buffer.from(pixels), { raw: { width, height, channels: channels as 1 | 3 } });
      } else {
        continue;
      }

      let outW = width;
      let outH = height;
      if (Math.max(width, height) > p.maxDim) {
        const k = p.maxDim / Math.max(width, height);
        outW = Math.max(1, Math.round(width * k));
        outH = Math.max(1, Math.round(height * k));
        pipeline = pipeline.resize(outW, outH, { kernel: "lanczos3", fit: "fill" });
      }
      const out = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
      if (out.length >= originalBytes * minSaving) continue;

      const newDict = dict.clone(ctx);
      newDict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
      newDict.delete(PDFName.of("DecodeParms"));
      newDict.set(PDFName.of("Width"), PDFNumber.of(outW));
      newDict.set(PDFName.of("Height"), PDFNumber.of(outH));
      ctx.assign(ref, PDFRawStream.of(newDict, out));
      replaced++;
    } catch {
      // Any image we cannot confidently re-encode is left untouched.
    }
  }

  return { bytes: await doc.save({ useObjectStreams: true }), replaced };
}

// Lossless structural pass: merges duplicate objects, drops unreferenced ones
// and Flate-compresses any stream that was stored uncompressed.
function structuralOptimize(bytes: Uint8Array): Uint8Array | null {
  try {
    const pdf = mupdf.Document.openDocument(Buffer.from(bytes), "application/pdf").asPDF();
    if (!pdf || pdf.needsPassword()) return null;
    return new Uint8Array(pdf.saveToBuffer("garbage=deduplicate,compress=yes,compress-fonts=yes").asUint8Array());
  } catch {
    return null;
  }
}

export async function compressPdf(
  buffer: ArrayBuffer,
  level: PdfCompressionLevel = "recommended"
): Promise<{ bytes: Uint8Array; originalSize: number; newSize: number; note: string }> {
  const originalSize = buffer.byteLength;
  const original = new Uint8Array(buffer);

  let working: Uint8Array;
  let imagesReplaced = 0;
  if (level !== "low") {
    const r = await recompressEmbeddedImages(buffer, IMAGE_PRESETS[level]);
    working = r.bytes;
    imagesReplaced = r.replaced;
  } else {
    working = await (await PDFDocument.load(buffer, { updateMetadata: false })).save({ useObjectStreams: true });
  }

  const candidates: Uint8Array[] = [working];
  const structural = structuralOptimize(working);
  if (structural) candidates.push(structural);
  const originalStructural = structuralOptimize(original);
  if (originalStructural && level === "low") candidates.push(originalStructural);
  const best = candidates.reduce((a, b) => (b.byteLength < a.byteLength ? b : a));

  // Never hand back something larger than what the user uploaded.
  if (best.byteLength >= originalSize) {
    return {
      bytes: original,
      originalSize,
      newSize: originalSize,
      note: "This PDF is already tightly compressed, so it was returned unchanged rather than risk a larger or lower-quality file.",
    };
  }

  const note =
    level === "low"
      ? "Lossless compression: nothing visible was changed. Text, images and layout are identical; only the file structure was tidied."
      : imagesReplaced > 0
        ? `Compressed ${imagesReplaced} embedded image${imagesReplaced === 1 ? "" : "s"}. Text and vector graphics were not touched, so text stays selectable and sharp.`
        : "No large images to re-encode. The file structure was optimized losslessly, and text and graphics are unchanged.";

  return { bytes: best, originalSize, newSize: best.byteLength, note };
}

export async function imagesToPdf(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  if (buffers.length === 0) throw new Error("Provide at least one image");
  const doc = await PDFDocument.create();
  for (const buf of buffers) {
    let img;
    try {
      img = await doc.embedJpg(buf);
    } catch {
      img = await doc.embedPng(buf);
    }
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return doc.save();
}

export async function stampSignature(buffer: ArrayBuffer, rawSignatureText: string, page?: number): Promise<Uint8Array> {
  if (!rawSignatureText) throw new Error("signatureText is required");
  const doc = await PDFDocument.load(buffer);
  const font = await doc.embedFont(StandardFonts.HelveticaOblique);
  // See addWatermark's comment above — same WinAnsi-only encoding limit.
  const signatureText = sanitizeForFont(rawSignatureText, font);
  const pages = doc.getPages();
  const pageIndex = (page ?? pages.length) - 1;
  if (pageIndex < 0 || pageIndex >= pages.length) throw new Error(`page must be between 1 and ${pages.length}`);
  const target = pages[pageIndex];
  const { width } = target.getSize();
  const size = 22;
  const textWidth = font.widthOfTextAtSize(signatureText, size);
  target.drawText(signatureText, { x: width - 48 - textWidth, y: 48, size, font, color: rgb(0.15, 0.15, 0.5) });
  target.drawLine({
    start: { x: width - 48 - textWidth, y: 44 },
    end: { x: width - 48, y: 44 },
    thickness: 1,
    color: rgb(0.15, 0.15, 0.5),
  });
  return doc.save();
}
