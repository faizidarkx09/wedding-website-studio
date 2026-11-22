import { cookies } from "next/headers";
import PasswordGate from "@/components/PasswordGate";
import SiteRenderer, { SiteUnavailable } from "@/components/SiteRenderer";
import { getPublicSite } from "@/lib/store";

/**
 * Cookie set by POST /api/guest-password after a correct password:
 * `wws_guest_<slug>` (httpOnly, 7 days).
 */
function guestCookieName(slug: string): string {
  return `wws_guest_${slug}`;
}

export default async function GuestSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getPublicSite(slug);

  if (!site) {
    return <SiteUnavailable />;
  }

  if (site.settings.passwordEnabled) {
    const cookieStore = await cookies();
    const unlocked = cookieStore.get(guestCookieName(slug));
    if (!unlocked) {
      return <PasswordGate slug={slug} />;
    }
  }

  return <SiteRenderer site={site} envelope />;
}
