// Server-only QR code helpers.
// The `qrcode` package is dynamically imported inside each function so it
// never lands in a client bundle. QR codes encode the PUBLIC guest URL
// only — never an editor, activation or admin URL.

interface QrCodeModule {
  toString(text: string, options: Record<string, unknown>): Promise<string>;
  toBuffer(text: string, options: Record<string, unknown>): Promise<Buffer>;
}

async function loadQrCode(): Promise<QrCodeModule> {
  // qrcode ships no types and @types/qrcode is not installed; the
  // @ts-expect-error suppresses the missing-declaration error and the
  // result is cast to the minimal interface above.
  const mod = (await import("qrcode")) as unknown as QrCodeModule;
  return mod;
}

/** Optional styling for a QR code. When omitted, the call behaves exactly
 *  as the original single-arg version: errorCorrectionLevel "M", black
 *  modules on white. */
export interface QrStyle {
  dark?: string;
  light?: string;
  errorCorrectionLevel?: "M" | "H";
}

/** SVG QR code for the given (public) URL. */
export async function qrSvg(url: string, style?: QrStyle): Promise<string> {
  const QRCode = await loadQrCode();
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: style?.errorCorrectionLevel ?? "M",
    margin: 2,
    width: 512,
    ...(style?.dark || style?.light
      ? { color: { dark: style.dark ?? "#000000", light: style.light ?? "#FFFFFF" } }
      : {}),
  });
}

/** PNG QR code for the given (public) URL. */
export async function qrPng(url: string, style?: QrStyle): Promise<Buffer> {
  const QRCode = await loadQrCode();
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: style?.errorCorrectionLevel ?? "M",
    margin: 2,
    width: 512,
    ...(style?.dark || style?.light
      ? { color: { dark: style.dark ?? "#000000", light: style.light ?? "#FFFFFF" } }
      : {}),
  });
}

// ---------------------------------------------------------------------------
// Themed QR colours.
//
// RULE (exact): light is always "#FFFFFF" — guaranteed contrast against any
// dark module colour and prints cleanly on white/ivory paper. Dark is the
// template accent, UNLESS the accent is too light to read on white:
// relative luminance (WCAG sRGB, linearised) >= 0.6. In that case dark
// falls back to the template ink if the ink is dark (luminance < 0.6),
// otherwise to "#24221F". Themed codes always use errorCorrectionLevel
// "H" (styling costs some module contrast, so the extra redundancy keeps
// the code scannable); unthemed codes keep "M" exactly as before.
// ---------------------------------------------------------------------------

/** WCAG relative luminance of a #RRGGBB (or #RGB) hex colour, 0..1. */
export function hexLuminance(hex: string): number {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const linear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Resolve the dark/light module colours for a template palette, applying
 *  the themed-QR rule above. Always returns errorCorrectionLevel "H". */
export function themedQrStyle(palette: {
  accent: string;
  ink: string;
}): Required<Pick<QrStyle, "dark" | "light" | "errorCorrectionLevel">> {
  const LIGHT_THRESHOLD = 0.6;
  let dark = palette.accent;
  if (hexLuminance(dark) >= LIGHT_THRESHOLD) {
    dark =
      hexLuminance(palette.ink) < LIGHT_THRESHOLD ? palette.ink : "#24221F";
  }
  return { dark, light: "#FFFFFF", errorCorrectionLevel: "H" };
}
