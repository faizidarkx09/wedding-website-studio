// Per-template delivery PDF generator — a REAL minimal PDF 1.4 built by
// hand, with no dependency. Byte offsets for the xref table are computed
// programmatically (never hardcoded). All text is ASCII-only so literal PDF
// strings need no font encoding beyond WinAnsi/Helvetica.
//
// One static PDF per template: the seller uploads it once to the Etsy
// listing as the digital download file. Every buyer of that template gets
// the SAME PDF and the SAME access code (TemplateMeta.accessCode).
// The PDF contains only template-level information — no per-buyer editor
// link or public site URL, because the buyer's site does not exist yet
// when the PDF is made. Activating the code creates the buyer's own site.

export interface TemplateDeliveryPdfOptions {
  templateName: string;
  /** The link the buyer opens to start: the activate page. */
  activateUrl: string;
  /** The template's preview page, so the buyer can see the design. */
  templateUrl: string;
  /** The template's fixed access code (e.g. WWS-XXXX-2026). */
  accessCode: string;
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

interface LinkSpot {
  y: number;
  url: string;
  /** The text actually drawn on this line (one wrapped chunk of url). */
  text: string;
}

export function templateDeliveryPdf(opts: TemplateDeliveryPdfOptions): Buffer {
  const lines: Line[] = [];
  const links: LinkSpot[] = [];
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

  /** A labelled clickable URL line; records its position for a link annotation.
   * Long URLs wrap across lines (hard-split every maxChars characters —
   * URLs have no spaces for the word wrapper to split on) so a long
   * activate/template URL cannot run off the right edge of the A4 page.
   * Each wrapped chunk gets its own link annotation for the same URL. */
  const addUrl = (url: string) => {
    const maxChars = Math.max(10, Math.floor(TEXT_W / (10 * 0.52)));
    const chunks: string[] = [];
    for (let i = 0; i < url.length; i += maxChars) {
      chunks.push(url.slice(i, i + maxChars));
    }
    let lineY = y + 5;
    for (const chunk of chunks) {
      lines.push({
        text: chunk,
        size: 10,
        bold: false,
        y: lineY,
        color: [0.05, 0.25, 0.65],
      });
      links.push({ y: lineY, url, text: chunk });
      lineY -= 15;
    }
    y = lineY - 3;
  };

  // --- Title block ---
  add("Wedding Website Studio", 24, true, { gap: 0 });
  add("Your Wedding Website", 24, true, { gap: 10 });
  add("Thank you for your purchase! Your wedding website is ready to set up.", 11, false, { gap: 8 });

  // --- Purchase summary ---
  add(`Purchased template: ${opts.templateName}`, 12, true, { gap: 10 });

  // --- The template link: activate page (main link) ---
  add("Step 1 - Open your template link", 14, true, { gap: 4 });
  add("This is the link for your template. Open it and enter the access code from this PDF.", 11, false, { gap: 2 });
  addUrl(opts.activateUrl);

  // --- Template preview link ---
  add("See your template", 14, true, { gap: 4 });
  add("A preview of the design you bought, with placeholder content.", 11, false, { gap: 2 });
  addUrl(opts.templateUrl);

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
    "Every buyer of this template gets this same code. When you activate it, a brand-new private website is created just for you - your changes never touch another buyer's site. Keep the code for your own use; do not send it to your guests.",
    11,
    false,
    { gap: 8 },
  );

  // --- Setup instructions ---
  add("Getting started", 14, true, { gap: 4 });
  const steps = [
    "Open the template link above (the Activate page).",
    "Enter the access code from this PDF.",
    "Enter your names - your new website is created from them, just for you.",
    "Replace the placeholder names, story, photos and event details with your own.",
    "Check the RSVP settings and set your RSVP deadline, then press Publish.",
    "Share your website link (or its QR code) with your guests.",
  ];
  steps.forEach((step, i) => {
    add(`${i + 1}. ${step}`, 11, false, { gap: 2 });
  });
  y -= 6;

  // --- Customisation + publishing ---
  add("Customising and publishing", 14, true, { gap: 4 });
  add(
    "In the editor you can change colours, fonts, photos, your story, events, dress code and gallery. Every change saves automatically. Your site stays private (draft) until you press Publish - only then can guests open your website address. You can unpublish at any time.",
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

  // Link annotation objects: one per recorded URL line (7, 8, ...).
  const annotObjects = links.map((link) => {
    const width = Math.min(TEXT_W, link.text.length * 5.2);
    const rect = `[${MARGIN} ${link.y - 3} ${MARGIN + Math.round(width)} ${link.y + 11}]`;
    return `<< /Type /Annot /Subtype /Link /Rect ${rect} /Border [0 0 0] /A << /S /URI /URI (${pdfText(link.url)}) >> >>`;
  });
  const annotRefs = annotObjects.map((_, i) => `${7 + i} 0 R`).join(" ");

  // --- Objects (1-based; offsets computed below) ---
  const objects: string[] = [
    // 1: Catalog
    "<< /Type /Catalog /Pages 2 0 R >>",
    // 2: Pages
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    // 3: Page
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R /Annots [${annotRefs}] >>`,
    // 4: Helvetica
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    // 5: Helvetica-Bold
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    // 6: Content stream
    `<< /Length ${streamBytes} >>\nstream\n${stream}\nendstream`,
    // 7+: Link annotations (clickable URLs)
    ...annotObjects,
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
