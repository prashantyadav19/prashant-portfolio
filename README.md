# Prashant Yadav — Portfolio

A one-page portfolio built with Next.js 15, React 19, TypeScript and Tailwind CSS v4. No database: all the text lives in `content.json`.

## Run it on your computer

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Edit the content

**Every piece of text, link and image path on the site is in `content.json`.** Open it, change the text, save, and the page updates (instantly with `npm run dev`, or on the next push to Vercel). You never need to touch the code.

| Section of `content.json` | What it controls |
|---|---|
| `site` | Your domain (`url`), browser-tab title, Google/LinkedIn preview description, footer line |
| `nav` | Labels in the top menu |
| `profile` | Name, "open to roles" status, photo, email, résumé button, social links (add more to `links`, e.g. Medium or X) |
| `hero` | Opening section: small label, headline, intro paragraph, button text, background image, career timeline |
| `introVideo` | Video section (hidden until `youtubeId` or `mp4` is filled in) |
| `work` | Section heading, the three case studies, the "Earlier projects" cards |
| `experience` | Heading and your roles |
| `skills` | Heading, hint text, and the skill groups |
| `credentials` | Certifications and education |
| `contact` | Heading, text, background image, copy-button labels |

### Rules of thumb

- **Highlighting words in the headline:** wrap them in asterisks, e.g. `"I build *AI search and agents*, and…"`.
- **Optional fields:** leave them as `""` (text) or `[]` (lists) rather than deleting them. Examples: `"end": ""` for your current job, `"pipeline": []` for a case study without a flow diagram, `"backgroundImage": ""` for no background image.
- **Images and files:** put them in the `public/` folder and reference them with a leading slash, e.g. `"/profile.webp"`.
- **Career timeline dates:** `"YYYY-MM"`, e.g. `"2021-10"`. The bar colour is `"span-1"`, `"span-2"` or `"span-3"`.
- **Skills ↔ projects:** a skill shows its blue dot and "used in…" line when its `name` (or a name in its `also` list) matches an entry in a project's `stack`. Keep the spelling identical.
- **Intro video:** upload to YouTube as *Unlisted* and paste the ID (`https://youtu.be/AbC123xyz` → `"AbC123xyz"`), or put an MP4 in `public/` and set `"mp4": "/intro.mp4"`.
- **JSON syntax:** keep the double quotes and commas. If something breaks, paste the file into https://jsonlint.com to find the typo. If you rename or remove a field, `npm run build` names the exact field that's wrong.

### Other things you might change

| What | Where |
|---|---|
| Colors, fonts, type scale | top of `app/globals.css` |
| Section background animations | "Section backgrounds" in `app/globals.css`, `components/SectionBackdrop.tsx` |
| Opening/Work dots animation | `lib/embedding-field.ts` |
| Shared button and card styles | `components/ui.ts` |

## Deploy on Vercel (free)

1. Create a new **public** repository on GitHub, e.g. `portfolio`.
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/prashantyadav19/portfolio.git
   git push -u origin main
   ```
3. Go to https://vercel.com, sign in with GitHub, click **Add New → Project**, pick the repo and click **Deploy**. No settings to change.
4. You get a live URL like `portfolio-xyz.vercel.app`. Every `git push` redeploys automatically.

## Add your own domain

1. Buy a domain (e.g. `prashantyadav.dev` or `prashantyadav.in`) from Cloudflare, Namecheap or GoDaddy.
2. In Vercel: **Project → Settings → Domains → Add**, enter the domain, and copy the DNS records Vercel shows into your registrar's DNS settings.
3. HTTPS is set up automatically within a few minutes.
4. Update `site.url` in `content.json` to the new domain and push, so the sitemap and link previews use it.

## Before you share it

- Replace `public/resume.pdf` with your updated résumé.
- Check every metric in `content.json` is one you're comfortable defending in an interview.
- Add the link to your LinkedIn "Featured" section and your GitHub profile README.

## Styling with Tailwind

- Theme colors are available as utilities: `bg-paper`, `bg-surface`, `text-ink`, `text-muted`, `border-line`, `bg-accent`, `text-accent`, `bg-accent-soft`.
- Type scale: `text-caption`, `text-lede`, `text-h3`, `text-h2`, `text-display`.
- Custom utilities: `wrap` (page container) and `eyebrow` (small uppercase labels).
- Light and dark mode switch automatically from the colour variables, so you don't need `dark:` classes.
- A few effects that need pseudo-elements or masks (career timeline bars, background image overlay, play button) live in `@layer components` in `app/globals.css`.
