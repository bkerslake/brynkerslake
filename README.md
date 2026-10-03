# Bryn Kerslake

A static personal website built with HTML and one small stylesheet. All page
content lives in `public/`; the site uses no framework, browser JavaScript, or
external dependencies.

- `public/index.html`: Home, bio, navigation, and social links.
- `public/work.html`: Work history.
- `public/readings.html`: Reading list.
- `public/styles.css`: Shared styling.

## Local preview

With Node.js installed, run `npm run dev` and open <http://localhost:3000>.
The preview supports the same `/work` and `/readings` URLs as Vercel. Refresh
the browser after editing a file. Use `npm run dev -- --port 3001` to choose
another port.

## Build and Vercel

`npm run build` copies the five website files into `dist/`. To preview this
output, run `npm start`.

`vercel.json` selects Vercel's static hosting preset, runs the build, and serves
only `dist/`. Clean URLs preserve `/work` and `/readings`. The configuration
overrides the former Next.js preset, so the existing Vercel project can host
the site. Interview materials and development scripts are excluded from the
build output. Building and previewing locally do not deploy the site.
