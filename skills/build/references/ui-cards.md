# Product UI in the video

The product is the proof. It appears as HTML you write, not as a pasted screenshot, because HTML
can animate per element (a row lands, a badge flips, a number counts) and stays crisp at any zoom.
Screenshots are your reference for fidelity.

## From screenshot to card

1. Collect the screens the storyboard needs (lucky and grill put them in `assets/screens/`).
2. For each, decide the idea of the screen in one phrase: "a feed of complaints, one is severe",
   "a menu bar popover with balances, one is low", "a modal with a prompt to copy".
3. Rebuild only what carries that idea: the container, 2 to 4 rows or fields, one status element,
   one control the cursor will touch. Drop navigation, filters, footers, secondary buttons.
4. Match the product's real type, radius, spacing, status colors and icon weight. Inside a
   product card, fidelity beats the film's adjectives: a "warm" brief does not round the
   product's 12px corners to 24px. The canvas, headlines and the floating card's outer shadow
   carry the adjectives; the UI inside stays true. Read them from
   the repo (`globals.css`, tailwind config, design tokens, the component source) rather than
   eyeballing the screenshot. Wrong radius or wrong gray is the first thing a founder notices.
5. Use real feature names and real labels for the things the user would recognize; shorten
   everything else. 15 to 30 words per card.

## Chrome

- Web app: a bare card is usually enough. If the brief wants "it is a web app", add a slim browser
  bar (three dots, a pill with the domain) at the top of the card, 48px tall, same radius.
- Mac app: a 12px-radius window with the three traffic lights, a toolbar if the real app has one,
  system font (`-apple-system, "SF Pro", Inter`), native control sizes. For a menu bar app, show
  the status bar strip (the icon among a few neutral ones) and the popover anchored under it with
  a small notch. Keep the popover at real size and let the camera do the zoom.
- Menu bar apps: the status bar strip may run the full width when it is the product's home,
  and it is the one exception to "never full-bleed". For hero crops on the icon, put the strip
  on a desktop slab (a rounded screen-shaped card with the strip at its top, sitting in the
  middle third of the stage) rather than at the stage's top edge: the camera is clamped to the
  stage, so an icon at the edge cannot be centered in a crop.
- Mobile: a 24px-radius phone with a 1px inner border and a status bar; 390px wide at 1x, scaled
  by the camera.
- Notifications: the platform's real shape (macOS: a white rounded rectangle with an app icon on
  the left, title and body; a slide from the top right with `outQuint`).

## Names and data

Use the product's own sample universe: the fictional companies, people, logos and portraits its
site or seed data already carry. Reading them from the repo (`sample-data`, `fixtures`, `demo`,
`seed`, `public/demo-logos`) keeps every asset consistent. If the product has none, invent neutral
names that could be real companies (Halvorsen Logistics, Tanaka Precision Tools), never names from
television or film. Real third-party product and platform names (G2, Slack, Apollo) stay real when
the product actually integrates with them; use their logos only from the repo's own assets.

Numbers should be plausible for the audience and never a claim the brief did not make. A counter
can land on 128 complaints found; it cannot land on "10,000 customers" unless that is true.

## Logos

Prefer SVG from the repo. A PNG logo needs its native size noted and must not be scaled above 1x.
On a dark canvas, invert a single-color logo with `filter: brightness(0) invert(1)`; multi-color
marks need their own dark variant from the brand folder.

## Where the card lives

The card sits on the canvas with the cardstock shadow, centered or on a 55/45 split with the
headline. The camera pushes toward the row the story is about. Full-width rows and long tables
are the fastest way to lose a viewer: three rows and a reason to look at one of them.
