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

/** SVG QR code for the given (public) URL. */
export async function qrSvg(url: string): Promise<string> {
  const QRCode = await loadQrCode();
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
  });
}

/** PNG QR code for the given (public) URL. */
export async function qrPng(url: string): Promise<Buffer> {
  const QRCode = await loadQrCode();
  return QRCode.toBuffer(url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 512,
  });
}
