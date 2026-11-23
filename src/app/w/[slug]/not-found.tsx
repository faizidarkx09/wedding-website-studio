import { SiteUnavailable } from "@/components/SiteRenderer";

/** Rendered for unknown /w/<slug> addresses (see page.tsx notFound()). */
export default function WeddingSiteNotFound() {
  return <SiteUnavailable />;
}
