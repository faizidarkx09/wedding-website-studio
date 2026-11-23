import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";
import RsvpForm from "@/components/RsvpForm";
import EternelRsvpForm from "@/components/eternel/EternelRsvpForm";
import BlossomRsvpForm from "@/components/blossom/BlossomRsvpForm";
import SacredGardenRsvpForm from "@/components/sacred-garden/SacredGardenRsvpForm";
import DolceVitaRsvpForm from "@/components/dolce-vita/DolceVitaRsvpForm";
import { verifySession } from "@/lib/auth";
import { getPublicSite } from "@/lib/store";

export default async function RsvpPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const token = Array.isArray(search.token) ? search.token[0] : search.token;
  const site = await getPublicSite(slug);

  if (!site) {
    // Unknown slug (or an unpublished/draft site): a real 404.
    notFound();
  }

  // Password-protected sites gate the RSVP form exactly like the site
  // itself: the guest cookie must be a valid signed token for this site.
  if (site.settings.passwordEnabled) {
    const cookieStore = await cookies();
    const session = verifySession(cookieStore.get(`wws_guest_${slug}`)?.value);
    const unlocked = session?.role === "guest" && session.siteId === site.id;
    if (!unlocked) {
      return <PasswordGate slug={slug} />;
    }
  }

  const deadline = site.settings.rsvpDeadline ? new Date(site.settings.rsvpDeadline) : null;
  const deadlinePassed = deadline !== null && deadline.getTime() < Date.now();

  if (!site.settings.rsvpEnabled || deadlinePassed) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-stone-900 sm:text-4xl">
          RSVP is now closed
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-stone-600">
          {deadlinePassed
            ? `The RSVP deadline has passed${deadline ? ` (it was ${deadline.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })})` : ""}.`
            : "The couple are no longer taking RSVPs for this wedding."}{" "}
          If you already responded, your response is saved — you do not need to do anything,
          and nothing you sent has been lost.
        </p>
        <Link
          href={`/w/${site.slug}`}
          className="mt-8 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Back to the wedding website
        </Link>
      </main>
    );
  }

  const isEternel = site.templateSnapshot.composition === "eternel";
  const isBlossom = site.templateSnapshot.composition === "blossom";
  const isSacred = site.templateSnapshot.composition === "sacred-garden";
  const isDolce = site.templateSnapshot.composition === "dolce-vita";
  const isFancy = isEternel || isBlossom || isSacred || isDolce;
  const fancyBg = isDolce ? "#FFFDFB" : isSacred ? "#F9F0E0" : isBlossom ? "#FAF6EF" : "#F8F5EF";
  const fancyInk = isDolce ? "#3A3A3A" : isSacred ? "#6C513F" : isBlossom ? "#3E2A20" : "#302821";
  const fancyAccent = isDolce ? "#64A0BD" : isSacred ? "#A67D2B" : isBlossom ? "#B08D57" : "#B49A70";
  const fancyFont = isDolce ? "font-dolce font-medium" : isSacred ? "font-sacred font-medium" : isBlossom ? "font-blossom font-medium" : "font-eternel font-medium";

  return (
    <main
      className="min-h-full w-full px-5 py-12 sm:py-16"
      style={
        isFancy
          ? { backgroundColor: fancyBg, color: fancyInk, fontFamily: isDolce ? "var(--font-rufina), Georgia, serif" : isSacred ? "var(--font-cormorant), Georgia, serif" : "var(--font-manrope), sans-serif" }
          : { backgroundColor: "#fdfbf7", color: "#1c1917" }
      }
    >
      <div className="mx-auto mb-8 max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: isFancy ? fancyAccent : "#b45309" }}>
          {site.content.partnerA} &amp; {site.content.partnerB}
        </p>
        <h1
          className={`mt-3 text-3xl sm:text-4xl ${isFancy ? fancyFont : "font-bold"}`}
        >
          RSVP
        </h1>
        <p className="mt-3 leading-relaxed" style={{ color: isFancy ? `${fancyInk}CC` : "#57534e" }}>
          Please reply for yourself and your party
          {site.settings.rsvpDeadline
            ? ` by ${new Date(site.settings.rsvpDeadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
            : ""}
          .
        </p>
      </div>
      {isEternel ? (
        <EternelRsvpForm site={site} token={token} />
      ) : isBlossom ? (
        <BlossomRsvpForm site={site} token={token} />
      ) : isSacred ? (
        <SacredGardenRsvpForm site={site} token={token} />
      ) : isDolce ? (
        <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl bg-white shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
          <DolceVitaRsvpForm site={site} token={token} />
        </div>
      ) : (
        <RsvpForm site={site} token={token} />
      )}
      <p className="mt-8 text-center">
        <Link href={`/w/${site.slug}`} className="text-sm font-medium hover:opacity-70" style={{ color: isFancy ? fancyAccent : "#78716c" }}>
          ← Back to the wedding website
        </Link>
      </p>
    </main>
  );
}
