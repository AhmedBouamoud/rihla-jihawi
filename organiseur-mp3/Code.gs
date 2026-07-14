/*******************************************************
 * منظم أغاني السيارة — أتمتة جوجل درايف
 * ذ. أحمد بوعمود — مؤسسة الحنان الخاصة | 2025-2026
 *
 * الفكرة: تضع أي أغنية MP3 في مجلد "Inbox"،
 * والسكريبت يقرأها، يحوّل الاسم إلى حروف لاتينية،
 * وينقلها إلى المجلد المناسب (حسب المطرب أو النوع).
 *******************************************************/

/**************** الإعدادات — عدّل هنا فقط ****************/
const CONFIG = {
  // معرف مجلد الاستقبال (حيث تضع الأغاني الجديدة)
  INBOX_FOLDER_ID: '1gpiYCdIyIc6Kn7_ZLhfNzfyyk4J4o0LK',

  // معرف المجلد الرئيسي المنظم (Car-Music)
  MUSIC_ROOT_FOLDER_ID: '1LfyvVi6sptPwxymjzK6mXUxUukflnlv9',

  // طريقة التقسيم: 'artist' حسب المطرب  |  'genre' حسب النوع
  MODE: 'artist',

  // اسم مجلد الأغاني غير المعروفة
  UNKNOWN_FOLDER: 'Divers'
};

/**************** الدالة الرئيسية ****************/
function organiserInbox() {
  const inbox = DriveApp.getFolderById(CONFIG.INBOX_FOLDER_ID);
  const root = DriveApp.getFolderById(CONFIG.MUSIC_ROOT_FOLDER_ID);
  const files = inbox.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const nomOriginal = file.getName();
    if (!/\.mp3$/i.test(nomOriginal)) continue; // MP3 فقط

    try {
      // 1) قراءة وسوم الأغنية (ID3)
      const tags = lireTags(file.getId()) || {};

      // 2) استخراج المطرب والعنوان (من الوسوم أو من اسم الملف)
      let artiste = nettoyer(transliterer(tags.artist || artisteDepuisNom(nomOriginal)));
      let titre   = nettoyer(transliterer(tags.title  || titreDepuisNom(nomOriginal)));
      let genre   = nettoyer(transliterer(tags.genre || ''));

      if (!artiste) artiste = CONFIG.UNKNOWN_FOLDER;
      if (!titre)   titre = 'Track ' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyyMMdd-HHmmss');

      // 3) اختيار المجلد حسب طريقة التقسيم
      const nomDossier = (CONFIG.MODE === 'genre')
        ? (genre || CONFIG.UNKNOWN_FOLDER)
        : artiste;
      const cible = obtenirOuCreerDossier(root, nomDossier);

      // 4) إعادة التسمية والنقل
      let nouveauNom = eviterDoublon(cible, artiste + ' - ' + titre + '.mp3');
      file.setName(nouveauNom);
      file.moveTo(cible);

      console.log('OK: ' + nomOriginal + '  ->  ' + nomDossier + '/' + nouveauNom);
    } catch (e) {
      console.log('Erreur avec "' + nomOriginal + '": ' + e);
    }
  }
}

/**************** تثبيت المؤقت (شغّلها مرة واحدة) ****************/
function installerDeclencheur() {
  // حذف المؤقتات القديمة لتجنب التكرار
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  // تشغيل تلقائي كل 10 دقائق
  ScriptApp.newTrigger('organiserInbox').timeBased().everyMinutes(10).create();
  console.log('تم التثبيت: السكريبت سيعمل تلقائيًا كل 10 دقائق');
}

/**************** قراءة وسوم ID3 ****************/
function lireTags(fileId) {
  return lireID3v2(fileId) || lireID3v1(fileId);
}

// جلب جزء من الملف فقط (بدون تحميله كاملًا)
function fetchBytes(fileId, range) {
  const url = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media';
  const resp = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken(),
      Range: range
    },
    muteHttpExceptions: true
  });
  const code = resp.getResponseCode();
  if (code !== 200 && code !== 206) return null;
  return resp.getContent();
}

// ID3v2 (في بداية الملف) — الأكثر شيوعًا
function lireID3v2(fileId) {
  const b = fetchBytes(fileId, 'bytes=0-262143');
  if (!b || b.length < 10) return null;
  if (car(b, 0, 3) !== 'ID3') return null;

  const version = b[3] & 255;
  const flags = b[5] & 255;
  const tailleTag = synchsafe(b, 6) + 10;
  let pos = 10;
  if (flags & 0x40) { // تخطي الرأس الممتد إن وجد
    pos += (version === 4 ? synchsafe(b, 10) : uint32(b, 10)) ;
  }

  const tags = {};
  const fin = Math.min(tailleTag, b.length);
  while (pos + 10 <= fin) {
    const id = car(b, pos, 4);
    if (!/^[A-Z0-9]{4}$/.test(id)) break;
    const fsize = (version === 4) ? synchsafe(b, pos + 4) : uint32(b, pos + 4);
    if (fsize <= 0 || pos + 10 + fsize > b.length) break;

    if (id === 'TPE1' || id === 'TIT2' || id === 'TCON') {
      const texte = decoderTexte(b.slice(pos + 10, pos + 10 + fsize));
      if (id === 'TPE1') tags.artist = texte;
      if (id === 'TIT2') tags.title = texte;
      if (id === 'TCON') tags.genre = texte.replace(/^\(\d+\)/, '').trim();
    }
    pos += 10 + fsize;
    if (tags.artist && tags.title && tags.genre) break;
  }
  return (tags.artist || tags.title) ? tags : null;
}

// ID3v1 (آخر 128 بايت) — للملفات القديمة
function lireID3v1(fileId) {
  const b = fetchBytes(fileId, 'bytes=-128');
  if (!b) return null;
  const d = b.slice(-128); // احتياط إذا رجع الملف كاملًا
  if (d.length < 128 || car(d, 0, 3) !== 'TAG') return null;

  const champ = (deb, fin) => {
    let arr = d.slice(deb, fin);
    const z = arr.indexOf(0);
    if (z >= 0) arr = arr.slice(0, z);
    if (arr.length === 0) return '';
    let s = '';
    try { s = Utilities.newBlob(arr).getDataAsString('windows-1256'); }
    catch (e) { s = Utilities.newBlob(arr).getDataAsString('ISO-8859-1'); }
    return s.trim();
  };
  return { title: champ(3, 33), artist: champ(33, 63), genre: '' };
}

// فك ترميز النصوص داخل الوسوم
function decoderTexte(bytes) {
  if (!bytes || bytes.length < 2) return '';
  const enc = bytes[0] & 255;
  let data = bytes.slice(1);
  let charset = 'ISO-8859-1';
  if (enc === 1) {
    const b0 = data[0] & 255, b1 = data[1] & 255;
    if (b0 === 0xFF && b1 === 0xFE) { charset = 'UTF-16LE'; data = data.slice(2); }
    else if (b0 === 0xFE && b1 === 0xFF) { charset = 'UTF-16BE'; data = data.slice(2); }
    else charset = 'UTF-16LE';
  } else if (enc === 2) charset = 'UTF-16BE';
  else if (enc === 3) charset = 'UTF-8';

  let s = '';
  try { s = Utilities.newBlob(data).getDataAsString(charset); }
  catch (e) { try { s = Utilities.newBlob(data).getDataAsString('UTF-8'); } catch (e2) {} }
  return s.replace(/\u0000/g, '').trim();
}

/**************** التحويل من العربية إلى اللاتينية ****************/
function transliterer(s) {
  if (!s) return '';
  // حذف التشكيل
  s = s.replace(/[\u064B-\u065F\u0670]/g, '');
  const map = {
    'ا':'a','أ':'a','إ':'i','آ':'a','ٱ':'a','ب':'b','ت':'t','ث':'th','ج':'j',
    'ح':'h','خ':'kh','د':'d','ذ':'d','ر':'r','ز':'z','س':'s','ش':'ch',
    'ص':'s','ض':'d','ط':'t','ظ':'d','ع':'a','غ':'gh','ف':'f','ق':'q',
    'ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'ou','ي':'i','ى':'a',
    'ة':'a','ء':'','ئ':'i','ؤ':'ou','ﻻ':'la','گ':'g','پ':'p','چ':'tch','ڤ':'v'
  };
  let out = '';
  for (const c of s) out += (map[c] !== undefined ? map[c] : c);
  return out;
}

// تنظيف الاسم ليكون متوافقًا مع راديو السيارة (حروف لاتينية وأرقام فقط)
function nettoyer(s) {
  if (!s) return '';
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // é -> e
  s = s.replace(/[^A-Za-z0-9 \-]/g, ' ');
  s = s.replace(/\s+/g, ' ').trim();
  s = s.toLowerCase().replace(/(^|[\s\-])([a-z])/g, (m, p, c) => p + c.toUpperCase());
  return s.substring(0, 60).trim();
}

/**************** استخراج من اسم الملف (احتياط) ****************/
function artisteDepuisNom(nom) {
  nom = nom.replace(/\.mp3$/i, '');
  const parties = nom.split(/\s*-\s*/);
  return parties.length >= 2 ? parties[0] : '';
}
function titreDepuisNom(nom) {
  nom = nom.replace(/\.mp3$/i, '');
  const parties = nom.split(/\s*-\s*/);
  return parties.length >= 2 ? parties.slice(1).join(' - ') : nom;
}

/**************** أدوات المجلدات ****************/
function obtenirOuCreerDossier(parent, nom) {
  const it = parent.getFoldersByName(nom);
  return it.hasNext() ? it.next() : parent.createFolder(nom);
}
function eviterDoublon(dossier, nom) {
  let final = nom, i = 2;
  while (dossier.getFilesByName(final).hasNext()) {
    final = nom.replace(/\.mp3$/i, '') + ' (' + i + ').mp3';
    i++;
  }
  return final;
}

/**************** أدوات البايتات ****************/
function car(b, deb, n) {
  let s = '';
  for (let i = 0; i < n; i++) s += String.fromCharCode(b[deb + i] & 255);
  return s;
}
function synchsafe(b, i) {
  return ((b[i] & 0x7F) << 21) | ((b[i+1] & 0x7F) << 14) | ((b[i+2] & 0x7F) << 7) | (b[i+3] & 0x7F);
}
function uint32(b, i) {
  return (((b[i] & 255) << 24) | ((b[i+1] & 255) << 16) | ((b[i+2] & 255) << 8) | (b[i+3] & 255)) >>> 0;
}
