-- Wedding Website Studio — seed.sql
-- Safe to re-run: every INSERT uses ON CONFLICT DO NOTHING.
-- Contains the 6 launch themes only (Premium Design System spec v1.0).
-- No demo site, no sample RSVPs, no demo access code — the store starts
-- empty and real sites are created when buyers activate a template code.
-- Metadata is copied from src/lib/templates.ts (incl. each theme's fixed
-- access code, which is public by design — it ships in the Etsy PDF).

-- ---------------------------------------------------------------------------
-- 1. Templates (metadata copied from src/lib/templates.ts)
-- ---------------------------------------------------------------------------
insert into public.templates
  (id, name, tagline, description, price_usd, etsy_listing_id, active,
   palette, font_class, layout, composition, access_code, sections)
values
  ('champagne-elegance', 'Champagne Elegance', 'Quiet luxury · editorial serif',
   'Warm ivory and antique gold, fine-line botanical engraving, thin rules and generous negative space. A European editorial stationery feel — refined, timeless, never gaudy.',
   49, null, true,
   '{"bg": "#F7F3EA", "ink": "#302820", "accent": "#A98A58", "accentSoft": "#F1E9D8"}'::jsonb,
   'font-champagne', 'Editorial single column, framed portrait hero, cream stationery invitation panel, asymmetric story, vertical gold-rule timeline, magazine gallery grid',
   'champagne', 'WWS-CHAMPAGNE-2026',
   array['hero', 'invitation', 'countdown', 'story', 'events', 'details', 'gallery', 'faq', 'rsvp']),
  ('blue-serenity', 'Blue Serenity', 'Coastal calm · pearl & mist blue',
   'Pearl paper, mist blue and deep slate — airy coastal elegance with fine wave lines and a soft open-letter invitation. Modern romantic minimalism, calm on every screen.',
   49, null, true,
   '{"bg": "#F8F8F4", "ink": "#202B33", "accent": "#7893A8", "accentSoft": "#E3EBF0"}'::jsonb,
   'font-blue', 'Wide landscape hero with pale-blue title block, open-letter invitation with side rule, horizontal milestone story, airy stacked itinerary, wide image-led gallery',
   'blue', 'WWS-BLUE-2026',
   array['hero', 'invitation', 'story', 'events', 'countdown', 'details', 'gallery', 'faq', 'rsvp']),
  ('midnight-romance', 'Midnight Romance', 'Dark editorial · burgundy & brass',
   'Charcoal and burgundy with antique brass rules and warm ivory type — candlelit, black-tie drama. A dark editorial spread with an ivory invitation sheet and a brass timeline.',
   59, null, true,
   '{"bg": "#171717", "ink": "#F1E8DA", "accent": "#B08B56", "accentSoft": "#2A2524"}'::jsonb,
   'font-midnight', 'Dark full-screen photo hero with ivory names and burgundy date detail, ivory invitation sheet over charcoal, brass timeline, alternating dark and ivory detail panels, dark gallery',
   'midnight', 'WWS-MIDNIGHT-2026',
   array['hero', 'invitation', 'countdown', 'story', 'events', 'details', 'gallery', 'faq', 'rsvp']),
  ('sage-botanical', 'Sage Botanical', 'Garden wedding · sage & forest',
   'Warm cream, pale sage and forest green with original botanical line illustrations and a garden-path timeline. Organic and understated — a sketchbook, not a farmhouse.',
   49, null, true,
   '{"bg": "#F5F1E7", "ink": "#3E5141", "accent": "#8C9A7A", "accentSoft": "#E6E9DC"}'::jsonb,
   'font-sage', 'Botanical-framed portrait hero, garden invitation with illustrated corner foliage, orderly scrapbook story, garden-path timeline, organic asymmetric gallery',
   'sage', 'WWS-SAGE-2026',
   array['hero', 'invitation', 'story', 'events', 'countdown', 'details', 'gallery', 'faq', 'rsvp']),
  ('mediterranean-sunset', 'Mediterranean Sunset', 'Warm villa · terracotta & olive',
   'Limestone, terracotta and dusty rose with abstract arch shapes and olive-branch illustrations. Sun-washed, joyful and sophisticated — a warm coastal villa, not a travel poster.',
   55, null, true,
   '{"bg": "#F4EDE2", "ink": "#46342C", "accent": "#B9674E", "accentSoft": "#EFE0D2"}'::jsonb,
   'font-mediterranean', 'Arch-framed hero image with bold names, terracotta/ivory split invitation, image-led story sequence, warm terracotta-marker timeline, mixed-size photo wall',
   'mediterranean', 'WWS-MEDITERRANEAN-2026',
   array['hero', 'invitation', 'events', 'story', 'countdown', 'details', 'gallery', 'faq', 'rsvp']),
  ('lavender-dreams', 'Lavender Dreams', 'Soft romantic · lavender & plum',
   'Pearl white and lavender mist with soft plum accents — delicate floral stationery, translucent layered cards and a slim mauve timeline. Poetic, modern, never pastel overload.',
   49, null, true,
   '{"bg": "#FAF8F6", "ink": "#514353", "accent": "#B9A9C9", "accentSoft": "#EFEAF3"}'::jsonb,
   'font-lavender', 'Pearl hero with framed portrait and lavender botanical detail, layered translucent stationery invitation, soft editorial collage story, slim mauve timeline, lightbox gallery grid',
   'lavender', 'WWS-LAVENDER-2026',
   array['hero', 'invitation', 'countdown', 'story', 'events', 'details', 'gallery', 'faq', 'rsvp'])
on conflict (id) do nothing;

-- Template sections (one row per section, in display order).
insert into public.template_sections (template_id, key, title, sort_order) values
  ('champagne-elegance', 'hero', 'Hero', 1), ('champagne-elegance', 'invitation', 'Invitation', 2),
  ('champagne-elegance', 'countdown', 'Countdown', 3), ('champagne-elegance', 'story', 'Our Story', 4),
  ('champagne-elegance', 'events', 'Schedule', 5), ('champagne-elegance', 'details', 'Details', 6),
  ('champagne-elegance', 'gallery', 'Gallery', 7), ('champagne-elegance', 'faq', 'FAQ', 8),
  ('champagne-elegance', 'rsvp', 'RSVP', 9),
  ('blue-serenity', 'hero', 'Hero', 1), ('blue-serenity', 'invitation', 'Invitation', 2),
  ('blue-serenity', 'story', 'Our Story', 3), ('blue-serenity', 'events', 'Schedule', 4),
  ('blue-serenity', 'countdown', 'Countdown', 5), ('blue-serenity', 'details', 'Details', 6),
  ('blue-serenity', 'gallery', 'Gallery', 7), ('blue-serenity', 'faq', 'FAQ', 8),
  ('blue-serenity', 'rsvp', 'RSVP', 9),
  ('midnight-romance', 'hero', 'Hero', 1), ('midnight-romance', 'invitation', 'Invitation', 2),
  ('midnight-romance', 'countdown', 'Countdown', 3), ('midnight-romance', 'story', 'Our Story', 4),
  ('midnight-romance', 'events', 'Schedule', 5), ('midnight-romance', 'details', 'Details', 6),
  ('midnight-romance', 'gallery', 'Gallery', 7), ('midnight-romance', 'faq', 'FAQ', 8),
  ('midnight-romance', 'rsvp', 'RSVP', 9),
  ('sage-botanical', 'hero', 'Hero', 1), ('sage-botanical', 'invitation', 'Invitation', 2),
  ('sage-botanical', 'story', 'Our Story', 3), ('sage-botanical', 'events', 'Schedule', 4),
  ('sage-botanical', 'countdown', 'Countdown', 5), ('sage-botanical', 'details', 'Details', 6),
  ('sage-botanical', 'gallery', 'Gallery', 7), ('sage-botanical', 'faq', 'FAQ', 8),
  ('sage-botanical', 'rsvp', 'RSVP', 9),
  ('mediterranean-sunset', 'hero', 'Hero', 1), ('mediterranean-sunset', 'invitation', 'Invitation', 2),
  ('mediterranean-sunset', 'events', 'Schedule', 3), ('mediterranean-sunset', 'story', 'Our Story', 4),
  ('mediterranean-sunset', 'countdown', 'Countdown', 5), ('mediterranean-sunset', 'details', 'Details', 6),
  ('mediterranean-sunset', 'gallery', 'Gallery', 7), ('mediterranean-sunset', 'faq', 'FAQ', 8),
  ('mediterranean-sunset', 'rsvp', 'RSVP', 9),
  ('lavender-dreams', 'hero', 'Hero', 1), ('lavender-dreams', 'invitation', 'Invitation', 2),
  ('lavender-dreams', 'countdown', 'Countdown', 3), ('lavender-dreams', 'story', 'Our Story', 4),
  ('lavender-dreams', 'events', 'Schedule', 5), ('lavender-dreams', 'details', 'Details', 6),
  ('lavender-dreams', 'gallery', 'Gallery', 7), ('lavender-dreams', 'faq', 'FAQ', 8),
  ('lavender-dreams', 'rsvp', 'RSVP', 9)
on conflict (template_id, key) do nothing;
