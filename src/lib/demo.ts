// Demo-site builder for template previews.
// Takes the Sarah & James demo content from the seed and re-skins it with
// the given template (snapshot, palette, design colours). Demo only —
// clearly labelled DEMO wherever it is shown.

import { buildSeed } from "./seed";
import type { TemplateMeta, WeddingSite } from "./types";

export function demoSiteForTemplate(template: TemplateMeta): WeddingSite {
  const demo = buildSeed().sites[0];
  return {
    ...demo,
    id: `site-preview-${template.id}`,
    slug: `preview-${template.id}`,
    templateId: template.id,
    templateSnapshot: { ...template },
    ownerName: "Sarah & James (Demo)",
    status: "published",
    design: {
      ...demo.design,
      primary: template.palette.ink,
      accent: template.palette.accent,
      background: template.palette.bg,
    },
  };
}
