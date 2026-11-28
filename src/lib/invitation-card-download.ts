import { toPng } from "html-to-image";

/**
 * Render the given invitation-card element to a PNG and trigger a
 * browser download with the given filename.
 *
 * Uses html-to-image at pixelRatio 2 for a crisp, shareable image.
 * document.fonts.ready is awaited first so the template's real loaded
 * fonts (Great Vibes / Cormorant Garamond via next/font) are embedded
 * in the PNG instead of falling back to a system face.
 *
 * Throws a real Error on failure so the caller can show it.
 */
export async function downloadInvitationCard(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  if (!element) {
    throw new Error("Invitation card element is missing.");
  }
  const safeName =
    filename && filename.trim() !== "" ? filename.trim() : "invitation.png";
  try {
    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready;
    }
    const dataUrl = await toPng(element, {
      pixelRatio: 2,
      cacheBust: true,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while rendering the card.";
    throw new Error(`Could not download the invitation card: ${message}`);
  }
}
