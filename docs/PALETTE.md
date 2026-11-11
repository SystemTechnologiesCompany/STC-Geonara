# Botanical palette trial

Applied 9 November 2026 from the user's supplied palette reference.

| Color | Base value | Role |
| --- | --- | --- |
| Lilac Mist | #E5E5E7 | Light background, dark-theme foreground |
| Black Mesa | #1E2310 | Light-theme foreground and hero, supporting olive accents |
| Turtle Skin | #3A4222 | Olive surfaces and primary controls |
| Tangled Vines | #CAC39A | Sand accents and dark-theme primary controls |
| Mayfly | #656840 | Muted olive accents |
| Guacamole | #999B6B | Sage accents, borders, and highlights |

`palette.css` loads after `styles.css` and contains the palette treatment for both themes. The translucent floating navbar, mobile avatar menu, and existing layouts are retained. The animated terrain lines use matching sage and sand in `terrain.js`; the browser theme color is synchronized in `app.js`. The official STC logo and geological timescale colors remain intact.

The original structural stylesheet is preserved. The palette layer makes visual refinements easy to review independently of layout and behavior.

After visual feedback, dark mode uses a neutral charcoal canvas (#151918) with layered charcoal surfaces, a quieter forest-charcoal hero, and olive/sand accents. This avoids a yellow-olive cast across the whole page. Light mode retains the botanical palette.

The user's gold reference adds restrained antique (#99732E), soft (#C7A45B), champagne (#E6CEA0), and pearl (#F0E4C6) accents. These appear on primary buttons, the hero's italic highlight, active navigation, tool-card arrows, and selected catalogue controls. Broad surfaces stay neutral; scientific interval colors retain their meaning. Metallic finishes use static gradients and inset highlights, without continuous shimmer animation.
