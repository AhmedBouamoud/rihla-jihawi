# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## تفضيلات المستخدم

- **الروابط المباشرة**: عند الحاجة لأي تغيير في لوحة تحكم Netlify أو أي موقع خارجي، أرسل دائماً الرابط المباشر بدلاً من وصف الخطوات.
  - مثال: بدلاً من "اذهب إلى Settings ثم Forms"، أرسل: `app.netlify.com/sites/rihla-jihawi/forms`

---

## Overview

This is a collection of Arabic-language educational PWAs created by teacher Ahmed Bouamoud for Moroccan students. The primary app is "رحلة الجهوي الذهبية" (Golden Jihawi Journey) — an interactive social studies review for 3rd-grade Collège students. The repo also contains several standalone sub-apps and a native Android wrapper.

**Deployed site**: https://rihla-jihawi.netlify.app  
**Netlify dashboard**: app.netlify.com/sites/rihla-jihawi

## No Build System

There is **no npm, no bundler, no framework, no build step**. Every app is a single self-contained HTML file with all CSS and JavaScript inlined. To "develop", open the HTML file in a browser. To deploy, push to `main` and Netlify auto-deploys from the repo root.

There are no `package.json`, no lint configs, no test suites, and no CI pipeline.

## Repository Structure

```
/                         ← Main PWA (رحلة الجهوي الذهبية)
├── index.html            ← Entire main app (641 lines, all inline CSS+JS)
├── sw.js                 ← Service Worker (cache name: rihla-jihawi-gold-v20)
├── manifest.json         ← PWA manifest (RTL, lang: ar-MA)
├── contact.html          ← Contact form (Netlify Forms)
├── comments.html         ← Student comments page
├── dashboard.html        ← Developer project dashboard
├── success.html          ← Form submission success page
├── netlify.toml          ← Netlify headers config
├── _headers              ← Netlify headers (redundant with netlify.toml)
├── assets/               ← Shared images (logo-rihla.png, logo-hanane.jpg)
├── icons/                ← PWA icons (192px, 512px)
│
├── mibyan/               ← رحلة إتقان المبيان (bar/histogram chart tool)
├── khat-zamani/          ← رحلة إتقان الخط الزمني (timeline tool)
├── ibtidai/              ← رحلة السادس (6th primary grade review)
├── kanz-sanawat/         ← كنز السنوات (years memorization game)
├── infographie/          ← Infographic tool
│
├── cafe-empreinte24/     ← Café Empreinte24 website (unrelated client site)
├── cafe-times-site/      ← Café Times website (unrelated client site)
├── portfolio-pro/        ← Developer portfolio (unrelated)
│
├── android/              ← Native Android WebView wrapper app
│   └── app/src/main/
│       ├── kotlin/…/MainActivity.kt
│       └── assets/index.html  ← "دفتر النصوص V7" — different bundled app
└── apk/                  ← Pre-built APK files
```

Each sub-app in its own folder is completely independent: it has its own `index.html`, `manifest.json`, and usually a `sw.js`.

## Architecture of the Main App (`index.html`)

The entire app is one HTML file. Its architecture is purely JavaScript + `localStorage` with no external dependencies other than Google Fonts.

**Key screens/layers (all using `position:fixed` overlays):**

| ID / element | Purpose |
|---|---|
| `#splash` | Welcome/setup screen — collects student name & avatar, stored in `localStorage` |
| `header` (sticky) | HUD showing student name, XP bar, star count, streak |
| `main` | Map view with lesson nodes (road-map style) |
| `.screen` (`.open`) | Lesson detail screen — summary cards + quiz |
| `#celebrate` | Post-lesson celebration overlay with star rating |
| `#portal` | Landing portal / home page shown before the main app |
| `.modal-ov` | Modal overlays (badges, certificate) |
| `#certWrap`, `#certExcWrap` | Printable certificate modals |

**Data persistence** — all stored in `localStorage` under the key pattern `rj_*`:
- Student name, avatar, XP, star counts, streak, completed lessons
- No server-side persistence; data is device-local

**Gamification system**: XP points → level up, star ratings per lesson (0–3 stars), streaks, badges, and a printable completion certificate.

**Lesson content** is defined inline as JavaScript objects/arrays directly in `index.html`. Each lesson has a summary section and a quiz section with multiple-choice questions.

## Service Worker & Caching

`sw.js` uses a cache-first strategy for assets and network-first for navigation.

**Critical**: When modifying any cached file, bump the version in `sw.js`:
```js
const CACHE_NAME = 'rihla-jihawi-gold-v20';  // increment this
```
The cached app shell is listed in `APP_SHELL` at the top of `sw.js`. Add any new pages to this array.

Netlify is configured to serve `sw.js` with `Cache-Control: no-cache` so browsers always fetch the latest worker.

## Android App (`android/`)

A native Kotlin WebView wrapper (`com.ahmedbouamoud.daftar`, minSdk 24, targetSdk 34). It loads `file:///android_asset/index.html` — which is **a different app** ("دفتر النصوص V7", a text-journal/printing tool), not the main rihla-jihawi app.

The `AndroidBridge` JavaScript interface exposes two methods to the webview:
- `AndroidBridge.triggerPrint(mode)` — routes `window.print()` to native Android print
- `AndroidBridge.copyToClipboard(text)` — routes `navigator.clipboard.writeText` to native clipboard

Build the Android app with:
```bash
cd android
./gradlew assembleDebug
```

## Design Conventions

All apps share a consistent visual language:

**Color palette** (CSS custom properties):
```css
--blue: #1A6FA8;   --blue-d: #123F63;  --blue-xd: #0A2238;
--orange: #E8720C; --orange-d: #C25A00;
--gold: #F2B33D;   --gold-d: #D89A1E;
--paper: #FDF8F0;  --ink: #1E2A38;     --muted: #6B7A8C;
--green: #2EB872;  --red: #E25555;
/* Subject colors */
--hist: #D64545;   --geo: #2EB872;     --civ: #2E9BD6;
```

Sub-apps may use slightly different palettes (amber/teal) but the same structural patterns.

**Typography**: Google Fonts — `Cairo` (main app) or `Tajawal` (sub-apps). Always loaded from `fonts.googleapis.com`.

**Layout**: RTL (`dir="rtl"`, `lang="ar"`). Use `inset-inline-start`/`inset-inline-end` for logical properties instead of `left`/`right` when adding new CSS.

**3D button effect**: Buttons use `box-shadow: 0 Npx 0 <darker-color>` with `:active { transform: translateY(Npx); box-shadow: 0 1px 0 ... }` to simulate a press.

**Animations**: Defined at the top of each `<style>` block — `drift`, `fadeUp`, `floatY`, `pop`, `shimmer`, `wiggle`, `bounceIn`, `pulseRing`, etc.

## Netlify Forms

`contact.html` submits to Netlify Forms. The form has `netlify` attribute and `data-netlify="true"`. View submissions at:  
`app.netlify.com/sites/rihla-jihawi/forms`

## PWA Installation & `.well-known/assetlinks.json`

The `.well-known/assetlinks.json` file links the site to a TWA (Trusted Web Activity) Android package `app.netlify.rihla_jihawi.twa`. This enables the PWA to be installed from the Play Store as a TWA without the browser chrome.
