-- Wedding Website Studio — seed.sql
-- DEMO SEED ONLY. Safe to re-run: every INSERT uses ON CONFLICT DO NOTHING.
-- Contains the 5 launch templates, the Sarah & James demo site (published)
-- and 3 sample RSVPs. No real customer data.
--
-- Demo access code for the demo site: WWS-DEMO-2026
-- (only its SHA-256 hash is stored — see access_codes.code_hash).

-- ---------------------------------------------------------------------------
-- 1. Templates (metadata copied from src/lib/templates.ts)
-- ---------------------------------------------------------------------------
insert into public.templates
  (id, name, tagline, description, price_usd, etsy_listing_id, active,
   palette, font_class, layout, sections)
values
  ('the-editorial', 'The Editorial', 'Luxury minimalist',
   'Refined serif typography on ivory, generous white space, thin rules and a single-column editorial flow. For couples who want quiet luxury.',
   49, 'WWS-EDT-001', true,
   '{"bg": "#fdfbf7", "ink": "#1c1917", "accent": "#8a6d3b", "accentSoft": "#f5efe4"}'::jsonb,
   'font-editorial', 'single-column, centred, thin rules, large serif names',
   array['hero', 'countdown', 'story', 'events', 'gallery', 'rsvp']),
  ('the-romance', 'The Romance', 'Floral & soft',
   'Soft blush and rose, delicate floral framing, rounded cards and flowing script-style headings. Romantic, warm and gentle.',
   49, 'WWS-RMN-001', true,
   '{"bg": "#fff7f5", "ink": "#4c2a33", "accent": "#c2707e", "accentSoft": "#fdeef0"}'::jsonb,
   'font-romance', 'rounded cards, floral dividers, story first, gallery as soft grid',
   array['hero', 'story', 'countdown', 'events', 'gallery', 'dress-code', 'rsvp']),
  ('the-modern', 'The Modern', 'Bold contemporary',
   'High-contrast black and white with one bold accent, oversized uppercase type and an asymmetric split layout. Clean, confident, current.',
   59, 'WWS-MDN-001', true,
   '{"bg": "#ffffff", "ink": "#111111", "accent": "#e11d48", "accentSoft": "#f8f8f8"}'::jsonb,
   'font-modern', 'asymmetric split hero, uppercase display type, side-by-side events',
   array['hero', 'events', 'countdown', 'story', 'gallery', 'rsvp']),
  ('the-countryside', 'The Countryside', 'Rustic & boho',
   'Warm natural tones, sage and terracotta, earthy textures and relaxed two-column storytelling. For barn, garden and outdoor weddings.',
   45, 'WWS-CTR-001', true,
   '{"bg": "#f7f3ea", "ink": "#3f3a2e", "accent": "#7d8c5c", "accentSoft": "#ece7d8"}'::jsonb,
   'font-countryside', 'two-column story, earthy cards, gallery first, relaxed spacing',
   array['hero', 'gallery', 'story', 'events', 'countdown', 'dress-code', 'rsvp']),
  ('the-classic', 'The Classic', 'Timeless formal',
   'Navy and gold formality, centred formal composition, engraved-style dividers and traditional order. Elegant in the way weddings have always been.',
   55, 'WWS-CLS-001', true,
   '{"bg": "#fbfaf6", "ink": "#1e2a44", "accent": "#b08d3c", "accentSoft": "#f0ead6"}'::jsonb,
   'font-classic', 'formal centred composition, gold rules, traditional section order',
   array['hero', 'countdown', 'story', 'events', 'venue', 'gallery', 'rsvp'])
on conflict (id) do nothing;

-- Template sections (one row per section, in display order).
insert into public.template_sections (template_id, key, title, sort_order) values
  ('the-editorial', 'hero', 'Hero', 1), ('the-editorial', 'countdown', 'Countdown', 2),
  ('the-editorial', 'story', 'Our Story', 3), ('the-editorial', 'events', 'Events', 4),
  ('the-editorial', 'gallery', 'Gallery', 5), ('the-editorial', 'rsvp', 'RSVP', 6),
  ('the-romance', 'hero', 'Hero', 1), ('the-romance', 'story', 'Our Story', 2),
  ('the-romance', 'countdown', 'Countdown', 3), ('the-romance', 'events', 'Events', 4),
  ('the-romance', 'gallery', 'Gallery', 5), ('the-romance', 'dress-code', 'Dress Code', 6),
  ('the-romance', 'rsvp', 'RSVP', 7),
  ('the-modern', 'hero', 'Hero', 1), ('the-modern', 'events', 'Events', 2),
  ('the-modern', 'countdown', 'Countdown', 3), ('the-modern', 'story', 'Our Story', 4),
  ('the-modern', 'gallery', 'Gallery', 5), ('the-modern', 'rsvp', 'RSVP', 6),
  ('the-countryside', 'hero', 'Hero', 1), ('the-countryside', 'gallery', 'Gallery', 2),
  ('the-countryside', 'story', 'Our Story', 3), ('the-countryside', 'events', 'Events', 4),
  ('the-countryside', 'countdown', 'Countdown', 5), ('the-countryside', 'dress-code', 'Dress Code', 6),
  ('the-countryside', 'rsvp', 'RSVP', 7),
  ('the-classic', 'hero', 'Hero', 1), ('the-classic', 'countdown', 'Countdown', 2),
  ('the-classic', 'story', 'Our Story', 3), ('the-classic', 'events', 'Events', 4),
  ('the-classic', 'venue', 'Venue', 5), ('the-classic', 'gallery', 'Gallery', 6),
  ('the-classic', 'rsvp', 'RSVP', 7)
on conflict (template_id, key) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Demo site: Sarah & James (slug sarah-and-james, published)
--    Fixed UUID so the child rows below can reference it.
-- ---------------------------------------------------------------------------
insert into public.wedding_sites
  (id, slug, template_id, owner_name, owner_email, status,
   wedding_date, timezone, template_snapshot, published_at)
values
  ('11111111-1111-4111-8111-111111111111', 'sarah-and-james', 'the-editorial',
   'Sarah & James', 'demo@example.com', 'published',
   '2027-06-12T19:00:00Z', 'America/New_York',
   '{"id": "the-editorial", "name": "The Editorial", "tagline": "Luxury minimalist", "priceUsd": 49, "etsyListingId": "WWS-EDT-001", "active": true}'::jsonb,
   now())
on conflict (slug) do nothing;

insert into public.site_content
  (site_id, partner_a, partner_b, subtitle, welcome, story, dress_code,
   footer_message, hero_image, venue_name, venue_address, map_link,
   post_wedding_message)
values
  ('11111111-1111-4111-8111-111111111111',
   'Sarah', 'James', 'Together with their families',
   'Welcome to our wedding website! We are so excited to celebrate with the people we love most. Here you will find everything you need — the schedule, the venue, and a place to let us know you are coming.',
   'Sarah and James met on a rainy Tuesday in Brooklyn, over two coffees and one shared umbrella. Five years, three apartments and one very patient dog later, James proposed on the same corner where they first met. This website is their invitation to you: come and be part of the day they have been dreaming about.',
   'Semi-formal. Garden party colours are welcome — please avoid white and ivory.',
   'Thank you for being part of our story. We cannot wait to celebrate with you. — Sarah & James',
   'https://picsum.photos/seed/wedding-hero/1600/1000',
   'The Rosewood Garden', '128 Willow Lane, Hudson Valley, New York',
   'https://maps.google.com/?q=Hudson+Valley+New+York',
   'Just married! Thank you for celebrating with us.')
on conflict (site_id) do nothing;

insert into public.site_designs
  (site_id, primary_color, accent_color, background_color,
   heading_font, body_font, gallery_layout)
values
  ('11111111-1111-4111-8111-111111111111',
   '#1c1917', '#8a6d3b', '#fdfbf7',
   'Georgia, serif', 'system-ui, sans-serif', 'grid')
on conflict (site_id) do nothing;

insert into public.events
  (site_id, name, event_date, event_time, venue, address, description, sort_order)
values
  ('11111111-1111-4111-8111-111111111111', 'The Ceremony', '2027-06-12', '4:00 PM',
   'The Rosewood Garden', '128 Willow Lane, Hudson Valley, NY',
   'The ceremony begins promptly at four. Please arrive by 3:30 PM.', 1),
  ('11111111-1111-4111-8111-111111111111', 'The Reception', '2027-06-12', '6:00 PM',
   'The Rosewood Garden — The Barn', '128 Willow Lane, Hudson Valley, NY',
   'Dinner, dancing and cake under the string lights.', 2),
  ('11111111-1111-4111-8111-111111111111', 'Farewell Brunch', '2027-06-13', '10:00 AM',
   'The Garden Café', '45 Main Street, Hudson Valley, NY',
   'A relaxed goodbye brunch for out-of-town guests.', 3)
on conflict do nothing;

insert into public.media (site_id, url, caption, kind, sort_order) values
  ('11111111-1111-4111-8111-111111111111', 'https://picsum.photos/seed/wedding-1/1200/800', 'The proposal spot', 'image', 1),
  ('11111111-1111-4111-8111-111111111111', 'https://picsum.photos/seed/wedding-2/1200/800', 'Our first trip together', 'image', 2),
  ('11111111-1111-4111-8111-111111111111', 'https://picsum.photos/seed/wedding-3/1200/800', 'Sunday mornings', 'image', 3),
  ('11111111-1111-4111-8111-111111111111', 'https://picsum.photos/seed/wedding-4/1200/800', 'The dog approves', 'image', 4)
on conflict do nothing;

insert into public.rsvp_questions (site_id, label, type, required, sort_order) values
  ('11111111-1111-4111-8111-111111111111',
   'What song should we play to get you dancing?', 'text', false, 1)
on conflict do nothing;

insert into public.site_settings
  (site_id, password_enabled, rsvp_enabled, rsvp_deadline, timezone,
   countdown_enabled, countdown_style, show_story, show_gallery,
   show_events, show_dress_code, show_countdown)
values
  ('11111111-1111-4111-8111-111111111111',
   false, true, '2027-05-15T23:59:00Z', 'America/New_York',
   true, 'classic', true, true, true, true, true)
on conflict (site_id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Demo order + access code (hash only — demo code WWS-DEMO-2026)
-- ---------------------------------------------------------------------------
insert into public.etsy_orders
  (id, etsy_order_id, etsy_listing_id, customer_name, customer_email,
   template_id, status, site_id, delivery_status)
values
  ('22222222-2222-4222-8222-222222222222', 'ETSY-DEMO-1001', 'WWS-EDT-001',
   'Sarah & James', 'demo@example.com', 'the-editorial',
   'delivered', '11111111-1111-4111-8111-111111111111', 'delivered')
on conflict (etsy_order_id) do nothing;

insert into public.access_codes
  (id, order_id, site_id, code_hash, status)
values
  ('33333333-3333-4333-8333-333333333333',
   '22222222-2222-4222-8222-222222222222',
   '11111111-1111-4111-8111-111111111111',
   encode(digest('WWS-DEMO-2026', 'sha256'), 'hex'),
   'active')
on conflict (order_id) do nothing;

update public.etsy_orders
  set access_code_id = '33333333-3333-4333-8333-333333333333'
  where id = '22222222-2222-4222-8222-222222222222'
    and access_code_id is null;

-- ---------------------------------------------------------------------------
-- 4. Sample RSVPs (3) for the demo site
-- ---------------------------------------------------------------------------
insert into public.rsvp_responses
  (site_id, guest_name, email, phone, attending, guest_count, dietary,
   allergies, message, answers, update_token, status)
values
  ('11111111-1111-4111-8111-111111111111', 'Emily Carter', 'emily@example.com', '',
   true, 2, 'Vegetarian', '', 'So excited! See you both there.',
   '{"q-song": "Dancing Queen"}'::jsonb, 'demo-token-emily', 'attending'),
  ('11111111-1111-4111-8111-111111111111', 'Michael Chen', 'michael@example.com', '',
   true, 1, '', 'Peanuts', '', '{}'::jsonb, 'demo-token-michael', 'attending'),
  ('11111111-1111-4111-8111-111111111111', 'Laura Bennett', 'laura@example.com', '',
   false, 0, '', '', 'Sad to miss it — congratulations!',
   '{}'::jsonb, 'demo-token-laura', 'declined')
on conflict (update_token) do nothing;
