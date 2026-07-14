# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## تفضيلات المستخدم (تعليمات دائمة)

- **اللغة**: أجب دائماً باللغة العربية في كل رد نصي، بدون استثناء، وبدون الحاجة لتذكيري بهذا مجدداً.
- **الروابط المباشرة**: عند الحاجة لأي تغيير في لوحة تحكم Netlify أو أي موقع خارجي، أرسل دائماً الرابط المباشر بدلاً من وصف الخطوات.
  - مثال: بدلاً من "اذهب إلى Settings ثم Forms"، أرسل: `app.netlify.com/sites/rihla-jihawi/forms`
- **رسائل الـ commit**: تُكتب بالعربية (انظر سجل git للأمثلة).

## طبيعة المستودع

مستودع واحد يضم عدة مواقع ومشاريع ويب ثابتة (HTML/CSS/JS خالص) باللغة العربية من إعداد ذ. أحمد بوعمود. **لا يوجد نظام بناء، ولا package.json، ولا اختبارات، ولا linter** — التطوير يتم بتعديل ملفات HTML مباشرة. كل الصفحات بالعربية مع `dir="rtl"`.

المشروع الرئيسي في **جذر المستودع**: "رحلة الجهوي الذهبية" — تطبيق PWA لمراجعة مادة الاجتماعيات (الثالثة إعدادي). كامل التطبيق في ملف واحد ضخم `index.html` (~390 ألف حرف، HTML+CSS+JS مدمجة). الملف `index.html.backup` نسخة احتياطية قديمة — لا تعدّله.

## أوامر شائعة

```bash
# معاينة محلية (لا حاجة لأي بناء)
python3 -m http.server 8000

# بناء APK محلياً (يتطلب JDK 17 و Android SDK)
cd android-bacway && ./gradlew assembleDebug
cd android && ./gradlew assembleDebug
```

## النشر (Netlify)

- **النشر تلقائي**: أي push إلى `main` ينشر جذر المستودع على `rihla-jihawi.netlify.app` (ربط مستمر، بدون أمر بناء، publish = ".").
- المجلدات الفرعية التي تحتوي `netlify.toml` خاصاً بها (مثل `green-park-houara/`، `cafe-times-site/`، `mahali/`، `infographie/`، `portfolio-pro/`) تُنشر كمواقع Netlify **منفصلة** لها روابطها الخاصة. لوحة `dashboard.html` تسرد روابط كل المواقع.
- `netlify.toml` الجذري يضبط رؤوس التخزين المؤقت والأمان:
  - `sw.js` و `manifest.json` بلا تخزين مؤقت (تحديث فوري).
  - `assets/*` و `icons/*` تخزين لمدة سنة (immutable).
  - `noor-rim-quran/*` هو الوحيد الذي يُمنح إذن الميكروفون (`Permissions-Policy: microphone=(self)`).
- ملف `_headers` مكمّل لـ `netlify.toml` (خاصة `.well-known/assetlinks.json` الخاص بتطبيق TWA على أندرويد).

## اصطلاحات حرجة

- **Service Worker**: عند أي تعديل على ملفات مخزّنة في الـ cache، **يجب رفع رقم إصدار `CACHE_NAME`** في `sw.js` (مثلاً `rihla-jihawi-gold-v19` → `v20`)، وإلا لن يرى المستخدمون التحديث. نفس القاعدة تنطبق على service workers في المشاريع الفرعية (`alam-noon/service-worker.js`، `khat-zamani/sw.js`...).
- **نماذج Netlify Forms**: `contact.html` يستخدم `data-netlify="true"` مع honeypot باسم `bot-field` وإعادة توجيه إلى `/success.html`. الـ service worker لا يعترض طلبات POST عمداً — حافظ على ذلك.
- **التعليقات**: `comments.html` (تعليقات التلاميذ) و `admin.html` (لوحة الإشراف عليها) يعتمدان على **Supabase** كقاعدة بيانات.
- **النصوص القرآنية** في `noor-rim-quran/` لا تُغيَّر إلا بعد مراجعة بشرية.

## المشاريع الفرعية

| المجلد | الوصف |
|---|---|
| `alam-noon/` | PWA لتعليم الحروف للأطفال: 6 محطات + لوحة والدين + صوتيات مولّدة (له README خاص) |
| `noor-rim-quran/` | تطبيق حفظ القرآن لريم (من حاملي متلازمة داون) — **اقرأ `noor-rim-quran/README_AR.md` قبل أي تعديل**: فيه قواعد تربوية صارمة (المقطع لا يُحتسب آية، السورة لا تكتمل إلا بتسجيل كامل...) |
| `bustan-rim/` | تطبيق بستان ريم (index.html + app.js + style.css) |
| `bacway-center/` | موقع مركز BAC WAY (مصدر أصول تطبيق الأندرويد) |
| `green-park-houara/` | موقع متعدد الصفحات لمنتزه (موقع Netlify مستقل) |
| `cafe-empreinte24/`, `cafe-times-site/` | مواقع مقاهي |
| `ibtidai/`, `kanz-sanawat/`, `khat-zamani/`, `mibyan/`, `mahali/`, `infographie/`, `portfolio-pro/` | تطبيقات/مواقع تعليمية وشخصية صغيرة، كل منها ملف index.html واحد غالباً |
| `android/` | غلاف WebView أندرويد لتطبيق "دفتر النصوص" (Kotlin + Gradle) |
| `android-bacway/` | غلاف WebView أندرويد لموقع BAC WAY |
| `apk/` | ملفات APK جاهزة (تُحدَّث آلياً أو يدوياً) |

## CI (GitHub Actions)

سير عمل وحيد: `.github/workflows/build-bacway-apk.yml` — يعمل عند أي تغيير في `android-bacway/**` أو `bacway-center/**`:
1. ينسخ `bacway-center/index.html` والصور إلى assets التطبيق (أي تعديل على الموقع يصل للتطبيق آلياً).
2. يبني `assembleDebug` بـ JDK 17.
3. يرفع الـ APK كـ artifact **ويعمل commit له** في `apk/bacway-center.apk` على `main` برسالة تحمل `[skip ci]`.

انتبه: لأن الـ workflow يدفع مباشرة إلى `main`، اعمل `git pull` قبل الدفع إذا كان CI قد اشتغل بعد آخر جلب.
