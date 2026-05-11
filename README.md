# Aisha4Senate Campaign Website — v2

**Aisha Yesufu · FCT Senate 2027 · Nigeria Democratic Congress (NDC) · #ABetterAbuja**

---

## 🗂️ Structure

```
aisha4senate/
├── index.html              ← Homepage
├── about.html              ← About Aisha
├── agenda.html             ← Seven Pillars
├── contrast.html           ← Their Abuja vs A Better Abuja
├── area-councils.html      ← 6 Area Councils
├── get-involved.html       ← Volunteer form → Airtable
├── media.html              ← Press, videos, gallery, kit
├── events.html             ← 62-ward tracker + town hall request → Airtable
├── faq.html                ← 35 Q&As with live search
├── api/
│   ├── volunteer.js        ← POST /api/volunteer
│   ├── townhall.js         ← POST /api/townhall
│   └── newsletter.js       ← POST /api/newsletter
├── css/styles.css
├── js/main.js
├── images/                 ← All photos go here (see images/README.md)
├── .env.example            ← Copy to .env.local, fill in secrets
├── .gitignore
└── vercel.json
```

---

## 🎨 Brand (NDC Colors)

| Role | Hex |
|---|---|
| Primary — NDC Blue | `#2a2b81` |
| Accent — NDC Orange | `#ed830e` |
| Secondary — NDC Red | `#d32929` |

---

## 🖼️ Images Needed

Put all files in `/images/`. Full guide in `images/README.md`.

| Filename | Where used |
|---|---|
| `aisha-logo.png` | Nav bar — all pages |
| `aisha-hero-bg.jpg` | Homepage full-screen hero |
| `aisha-portrait-main.jpg` | Homepage — beside video |
| `aisha-about-bg.jpg` | About page hero |
| `aishapic1.jpg` … `aishapic12.jpg` | Media gallery |

---

## 🎬 YouTube Video

In `index.html` find and replace `YOUTUBE_VIDEO_ID`:
```html
src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID?rel=0..."
```
Your URL is `youtube.com/watch?v=ABC123` → ID is `ABC123`.

---

## 📁 Media Kit PDFs (Google Drive)

In `media.html` replace each `GDRIVE_ID_XXXXX` placeholder with the real file ID.

**How:** Upload PDF to Drive → Share (Anyone with link) → copy the ID from:
`drive.google.com/file/d/` **`FILE_ID_HERE`** `/view`

---

## 📰 Adding Press Releases

In `media.html` bottom `<script>`, add to the `pressReleases` array:
```js
{
  badge: 'Endorsement',
  date: 'June 2026',
  title: 'Your headline',
  body: `<p>Full HTML content here.</p>`
}
```
Then add a matching card in the HTML with `onclick="openPR(N)"` where N is the index.

---

## 🗄️ Airtable Setup

**1. Create a base with 3 tables named exactly:**
- `Volunteers`
- `Town Hall Requests`
- `Newsletter Subscribers`

**2. Get credentials:**
- PAT: airtable.com → Account → Developer Hub → Personal Access Tokens
  (scopes needed: `data.records:write`, `schema.bases:read`)
- Base ID: open base → Help → API Documentation

**3. Set env variables:**

Local — create `.env.local`:
```
AIRTABLE_PAT=pat_xxxxxxxxxxxx
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

Production — Vercel Dashboard → Project → Settings → Environment Variables.
Add the same two keys there.

---

## 🚀 Deploy

```bash
git add .
git commit -m "v2 updates"
git push
```
Vercel auto-deploys on every push. Remember to add env variables in Vercel dashboard — without them the forms will fail.

---

*DO Take Action · v2 · May 2026*
