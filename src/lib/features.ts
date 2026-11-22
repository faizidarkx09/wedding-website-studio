// Feature catalogue for the /features pages. Every "try it" link points at a
// real route in this app (template preview, activate, editor, dashboard or
// the QR API) — never an anchor-only jump and never an invented
// external URL. There is no demo site: "try it" links go to a template
// preview or to activation, where a buyer creates their own site.

export interface FeatureLink {
  href: string;
  label: string;
}

export interface Feature {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  whatItIs: string;
  howItWorks: string[];
  whoSeesIt: string;
  tryIt: FeatureLink[];
}

export const FEATURES: Feature[] = [
  {
    slug: "countdown",
    title: "Countdown",
    tagline: "Days, hours and minutes until the big day",
    intro:
      "A live countdown to your wedding date, right on your site. It ticks down in your wedding's timezone and stops at zero with a warm message once the day has arrived.",
    whatItIs:
      "The countdown reads your wedding date and timezone from your site settings and shows the remaining days, hours, minutes and seconds. You can switch its style in the editor, and after the wedding it shows your post-wedding message instead of counting up.",
    howItWorks: [
      "Set your wedding date and timezone in the editor.",
      "Turn the countdown on or off, and pick a style.",
      "Guests see it update live on your published site — no refresh needed.",
      "When the wedding day arrives, the countdown stops at zero.",
    ],
    whoSeesIt:
      "Everyone who visits your site. Guests see the excitement build; the couple control it from the editor.",
    tryIt: [
      { href: "/templates", label: "Browse templates" },
      { href: "/activate", label: "Activate a template to see it on your own site" },
    ],
  },
  {
    slug: "rsvp",
    title: "RSVP",
    tagline: "Guests reply online — and can update their answer",
    intro:
      "An online RSVP form on your site. Guests say whether they are coming, how many people are in their party, and leave a message. Each guest gets a private link to change their reply later.",
    whatItIs:
      "The RSVP form collects the guest's name, email, attending yes/no, number of guests, and an optional message. You set an RSVP deadline in your site's timezone — after it passes, the form closes automatically and guests see a clear message. Replies already sent are never lost.",
    howItWorks: [
      "Guests open your site link and tap RSVP.",
      "They fill in their name, email and party size, then submit.",
      "After replying, each guest gets a private update link.",
      "Using that link replaces their earlier response — no duplicates.",
      "You watch the guest list and totals update on your dashboard.",
    ],
    whoSeesIt:
      "Your guests use the form. Only you see the full guest list, on the dashboard.",
    tryIt: [
      { href: "/activate", label: "Activate a template to try the RSVP form on your own site" },
      { href: "/dashboard", label: "See RSVPs on the dashboard" },
    ],
  },
  {
    slug: "gallery",
    title: "Photo gallery",
    tagline: "Your favourite moments, in your design",
    intro:
      "A photo gallery on your site, laid out to match your template — a soft grid, a bold editorial row, or a relaxed countryside collage.",
    whatItIs:
      "Upload your photos in the editor and add a caption to each one. The gallery is part of your published site, so guests can browse your engagement photos and memories before the day.",
    howItWorks: [
      "Upload photos from the editor.",
      "Add an optional caption to each photo.",
      "Publish — the gallery appears in your template's own layout.",
      "Remove or reorder photos any time; the site updates on the next publish.",
    ],
    whoSeesIt:
      "Everyone who visits your site. You choose exactly which photos are shown.",
    tryIt: [
      { href: "/templates", label: "Browse templates" },
      { href: "/activate", label: "Activate a template to see it on your own site" },
    ],
  },
  {
    slug: "events",
    title: "Events & schedule",
    tagline: "Ceremony, reception and everything in between",
    intro:
      "A schedule of everything happening across your wedding weekend — each event with its date, time, venue and address, so no guest is ever lost.",
    whatItIs:
      "Add as many events as you need: ceremony, reception, rehearsal dinner, brunch, after-party. Each event has a name, date, time, venue, address and an optional description. Your venue and a map link can be shown alongside.",
    howItWorks: [
      "Add each event in the editor with its date, time and venue.",
      "Guests see the full schedule on your site, in your template's style.",
      "A map link takes guests straight to the venue.",
      "Change a time or venue and re-publish — guests always see the latest plan.",
    ],
    whoSeesIt:
      "Your guests, on the published site. You edit the schedule in the editor.",
    tryIt: [
      { href: "/templates", label: "Browse templates" },
      { href: "/activate", label: "Activate a template to see it on your own site" },
    ],
  },
  {
    slug: "qr-code",
    title: "QR code",
    tagline: "Print it on the invitation — guests land straight on your site",
    intro:
      "A QR code for your site's public link, as a PNG or SVG. Print it on your invitations and guests scan it with their phone camera to open your site.",
    whatItIs:
      "The QR code encodes only your site's public guest URL — never your editor, activation or admin pages. Download it as a PNG for print or an SVG for crisp scaling, in black and white so it scans reliably.",
    howItWorks: [
      "Publish your site.",
      "Download its QR code as PNG or SVG from your dashboard.",
      "Print it on your invitations, table cards or welcome signs.",
      "Guests scan it and land straight on your wedding website.",
    ],
    whoSeesIt:
      "Anyone holding your invitation. The code itself opens only your public site.",
    tryIt: [
      { href: "/dashboard", label: "Download your site's QR code from the dashboard" },
      { href: "/activate", label: "Activate a template to create your own site first" },
    ],
  },
  {
    slug: "guest-list",
    title: "Guest list",
    tagline: "Every reply in one place — with totals, not guesswork",
    intro:
      "Your dashboard guest list: every RSVP, who is coming, who declined, and how many people are attending in total. Search, sort and export it to a spreadsheet.",
    whatItIs:
      "As guests RSVP, their replies appear on your dashboard with attending/declined status and party size. The totals count people, not just replies — so you know exactly how many seats and plates you need. You can search by name, sort the list, delete a reply, and export everything as a CSV file for your planner or venue.",
    howItWorks: [
      "Guests RSVP from your site link.",
      "Replies appear on your dashboard automatically.",
      "Totals show responses, attending guests and declined guests separately.",
      "Search or sort the list, and export it as CSV whenever you need it.",
    ],
    whoSeesIt:
      "Only you, on your dashboard. Guests never see each other's replies.",
    tryIt: [
      { href: "/dashboard", label: "Open the dashboard guest list" },
      { href: "/activate", label: "Activate a template to try the RSVP form on your own site" },
    ],
  },
  {
    slug: "password-protection",
    title: "Guest password",
    tagline: "Keep your site for invited guests only",
    intro:
      "Protect your site with a password from your invitation, so only guests who have it can see your photos, venue and schedule.",
    whatItIs:
      "Set a guest password in the editor or dashboard. Visitors must enter it before they can see your site at all. The password is stored as a hash, never in plain text, and wrong guesses are rate-limited. Remove it any time to open the site to anyone with the link.",
    howItWorks: [
      "Set a guest password in the editor or dashboard.",
      "Share the password with your invitations.",
      "Guests enter it once to unlock your site.",
      "Change or remove the password whenever you like.",
    ],
    whoSeesIt:
      "Guests see a password screen before anything else. You manage the password from the editor or dashboard.",
    tryIt: [
      { href: "/editor", label: "Set a guest password in the editor" },
      { href: "/dashboard", label: "Manage it from the dashboard" },
    ],
  },
  {
    slug: "design",
    title: "Design & templates",
    tagline: "Different designs — each with its own layout, type and mood",
    intro:
      "Templates with genuinely different layouts, typography and palettes — not just a colour swap. Pick the one that feels like you, then make it yours.",
    whatItIs:
      "Each template has its own section order, fonts and colours. When you buy one, its design is snapshotted to your site, so later changes to the shop template never alter your published site. You can still change your own colours and fonts in the editor.",
    howItWorks: [
      "Browse the templates and open a live preview of each.",
      "Buy your favourite on Etsy and get your access code.",
      "Activate the code and customise your names, story and photos.",
      "Publish — your design is locked to your site from then on.",
    ],
    whoSeesIt:
      "Guests see your finished design. You pick and customise it in the editor.",
    tryIt: [
      { href: "/templates", label: "Browse templates" },
      { href: "/activate", label: "Activate a template code" },
    ],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}
