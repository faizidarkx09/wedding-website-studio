import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";
import SiteRenderer from "@/components/SiteRenderer";
import { verifySession } from "@/lib/auth";
import { getPublicSite } from "@/lib/store";

/**
 * Cookie set by POST /api/guest-password after a correct password:
 * `wws_guest_<slug>` (httpOnly, 7 days). The value is a signed session
 * token (HMAC, bound to this site's id) — verified here, never trusted
 * on mere existence. Old unsigned "1" cookies no longer unlock a site;
 * those guests re-enter the password once.
 */
function guestCookieName(slug: string): string {
  return `wws_guest_${slug}`;
}

/** True when the guest cookie is a valid signed token for this site. */
async function guestUnlocked(slug: string, siteId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get(guestCookieName(slug))?.value);
  return session?.role === "guest" && session.siteId === siteId;
}

export default async function GuestSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getPublicSite(slug);

  if (!site) {
    // Unknown slug (or an unpublished/draft site): a real 404, not a
    // 200 page saying "not available".
    notFound();
  }

  if (site.settings.passwordEnabled) {
    const unlocked = await guestUnlocked(slug, site.id);
    if (!unlocked) {
      return <PasswordGate slug={slug} />;
    }
  }

  return <SiteRenderer site={site} envelope />;
}
