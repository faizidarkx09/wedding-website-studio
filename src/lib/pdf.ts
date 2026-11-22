// Delivery PDF generator — a REAL minimal PDF 1.4 built by hand, with no
// dependency. Byte offsets for the xref table are computed programmatically
// (never hardcoded). All text is ASCII-only so literal PDF strings need no
// font encoding beyond WinAnsi/Helvetica.

export interface DeliveryPdfOptions {
  customerName: string;
  templateName: string;
  editorUrl: string;
  activateUrl: string;
  accessCode: string;
  siteSlug: string;
  publicUrl: string;
}

const PAGE_W = 595; // A4
const PAGE_H = 842;
const MARGIN = 72;
const TEXT_W = PAGE_W - MARGIN * 2;

/** Escape a PDF literal string and strip anything outside printable ASCII. */
function pdfText(raw: string): string {
  return raw
    .replace(/[^\x20-\x7E]/g, "-")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/** Greedy word wrap to roughly maxChars characters per line. */
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

interface Line {
  text: string;
  size: number;
  bold: boolean;
  y: number;
  x?: number;
  color?: [number, number, number];
}

export function deliveryPdf(opts: DeliveryPdfOptions): Buffer {
  const lines: Line[] = [];
  let y = PAGE_H - 72;

  const add = (
    text: string,
    size: number,
    bold: boolean,
    opts2?: { gap?: number; color?: [number, number, number]; x?: number },
  ) => {
    const wrapped = wrap(text, Math.floor(TEXT_W / (size * 0.52)));
    for (const w of wrapped) {
      lines.push({ text: w, size, bold, y, color: opts2?.color, x: opts2?.x });
      y -= size + 5;
    }
    y -= opts2?.gap ?? 4;
  };

  // --- Title block ---
  add("Wedding Website Studio", 24, true, { gap: 0 });
  add("Your Wedding Website", 24, true, { gap: 10 });
  add("Thank you for your purchase! Your wedding website is ready to set up.", 11, false, { gap: 8 });

  // --- Purchase summary ---
  add(`Purchased template: ${opts.templateName}`, 12, true, { gap: 2 });
  add(`Your website address (share this with guests): ${opts.publicUrl}`, 11, false, { gap: 2 });
  add(`Website slug: ${opts.siteSlug}`, 11, false, { gap: 10 });

  // --- Setup instructions ---
  add("Getting started", 14, true, { gap: 4 });
  const steps = [
    "Go to the Activate page below and enter your access code. This unlocks your website.",
    "Open your private editor link to replace the demo names, story, photos and event details with your own. Do not share the editor link with guests.",
    "Check the RSVP settings and set your RSVP deadline before you share the site.",
    "Press Publish when you are happy, then share your public website address (or its QR code) with your guests.",
  ];
  steps.forEach((step, i) => {
    add(`${i + 1}. ${step}`, 11, false, { gap: 2 });
  });
  y -= 6;

  // --- Activate URL (clickable) ---
  add("Step 1 - Activate your website", 14, true, { gap: 4 });
  const activateUrlY = y + 5; // y of the URL text line (baseline offset, see below)
  lines.push({
    text: opts.activateUrl,
    size: 10,
    bold: false,
    y: activateUrlY,
    color: [0.05, 0.25, 0.65],
  });
  y = activateUrlY - 10 - 8;

  // --- Private editor URL (clickable) ---
  add("Your private editor link", 14, true, { gap: 4 });
  const urlY = y + 5; // y of the URL text line (baseline offset, see below)
  lines.push({
    text: opts.editorUrl,
    size: 10,
    bold: false,
    y: urlY,
    color: [0.05, 0.25, 0.65],
  });
  y = urlY - 10 - 8;

  // --- Access code ---
  add("Your access code", 14, true, { gap: 4 });
  lines.push({
    text: opts.accessCode,
    size: 20,
    bold: true,
    y: y + 5,
    x: MARGIN,
  });
  y -= 20 + 14;
  add(
    "Keep this code private. It is the key to your editor - do not post it publicly, do not send it to guests, and do not forward this PDF to anyone who should not edit your website. If the code is ever shared by mistake, contact support and we will reset it.",
    11,
    false,
    { gap: 8 },
  );

  // --- Customisation + publishing ---
  add("Customising and publishing", 14, true, { gap: 4 });
  add(
    "In the editor you can change colours, fonts, photos, your story, events, dress code and gallery. Every change saves automatically. Your site stays private (draft) until you press Publish - only then can guests open your public website address. You can unpublish at any time.",
    11,
    false,
    { gap: 8 },
  );

  // --- Support ---
  add("Need help?", 14, true, { gap: 4 });
  add(
    "Reply to your Etsy order message and include your order details. We are happy to help with setup, publishing and RSVP questions.",
    11,
    false,
    { gap: 8 },
  );

  // --- Footer ---
  add("Wedding Website Studio - Made with love for your big day.", 9, false, {
    gap: 0,
    color: [0.45, 0.45, 0.45],
  });

  // --- Content stream ---
  const streamParts: string[] = ["BT"];
  for (const line of lines) {
    const font = line.bold ? "/F2" : "/F1";
    const x = line.x ?? MARGIN;
    const color = line.color
      ? `${line.color[0]} ${line.color[1]} ${line.color[2]} rg`
      : "0 0 0 rg";
    streamParts.push(
      `${color} ${font} ${line.size} Tf 1 0 0 1 ${x} ${line.y} Tm (${pdfText(line.text)}) Tj`,
    );
  }
  streamParts.push("ET");
  const stream = streamParts.join("\n");
  const streamBytes = Buffer.byteLength(stream, "latin1");

  // Link annotation rectangles over the URL lines (full text width).
  const urlWidth = Math.min(TEXT_W, opts.editorUrl.length * 5.2);
  const annotRect = `[${MARGIN} ${urlY - 3} ${MARGIN + Math.round(urlWidth)} ${urlY + 11}]`;
  const activateUrlWidth = Math.min(TEXT_W, opts.activateUrl.length * 5.2);
  const activateAnnotRect = `[${MARGIN} ${activateUrlY - 3} ${MARGIN + Math.round(activateUrlWidth)} ${activateUrlY + 11}]`;

  // --- Objects (1-based; offsets computed below) ---
  const objects: string[] = [
    // 1: Catalog
    "<< /Type /Catalog /Pages 2 0 R >>",
    // 2: Pages
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    // 3: Page
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R /Annots [7 0 R 8 0 R] >>`,
    // 4: Helvetica
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    // 5: Helvetica-Bold
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    // 6: Content stream
    `<< /Length ${streamBytes} >>\nstream\n${stream}\nendstream`,
    // 7: Link annotation (clickable editor URL)
    `<< /Type /Annot /Subtype /Link /Rect ${annotRect} /Border [0 0 0] /A << /S /URI /URI (${pdfText(opts.editorUrl)}) >> >>`,
    // 8: Link annotation (clickable activate URL)
    `<< /Type /Annot /Subtype /Link /Rect ${activateAnnotRect} /Border [0 0 0] /A << /S /URI /URI (${pdfText(opts.activateUrl)}) >> >>`,
  ];

  // --- Assemble with computed byte offsets ---
  const chunks: Buffer[] = [];
  let offset = 0;
  const offsets: number[] = [0]; // object 0 (free entry)
  const header = Buffer.from("%PDF-1.4\n", "latin1");
  chunks.push(header);
  offset += header.length;

  objects.forEach((body, i) => {
    offsets.push(offset);
    const obj = Buffer.from(`${i + 1} 0 obj\n${body}\nendobj\n`, "latin1");
    chunks.push(obj);
    offset += obj.length;
  });

  const xrefOffset = offset;
  const count = objects.length + 1;
  let xref = `xref\n0 ${count}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  chunks.push(Buffer.from(xref, "latin1"));

  return Buffer.concat(chunks);
}
