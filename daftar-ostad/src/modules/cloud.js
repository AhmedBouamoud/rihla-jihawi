import { state, KEYS } from '../state.js';

const GOOGLE_CLIENT_ID_KEY = 'daftar_google_client_id';
const DRIVE_BACKUP_FILENAME = 'daftar_ostad_v5_backup.json';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';

let googleTokenClient = null;
let googleAccessToken = null;

function loadGoogleClientId(){ return localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || '' }

function setCloudStatus(text){
  const el = document.getElementById('cloudBackupStatus');
  if(el) el.textContent = text;
}

export function initCloudBackup(){
  const input = document.getElementById('googleClientId');
  if(input) input.value = loadGoogleClientId();
}

export function saveGoogleClientId(){
  const input = document.getElementById('googleClientId');
  if(input) localStorage.setItem(GOOGLE_CLIENT_ID_KEY, input.value.trim());
}

function loadGisScript(){
  return new Promise((resolve, reject) => {
    if(window.google && window.google.accounts && window.google.accounts.oauth2){ resolve(); return }
    const timer = setTimeout(() => reject(new Error('تعذر الاتصال بخدمات Google. تحقق من اتصال الإنترنت وحاول مجدداً.')), 8000);
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => { clearTimeout(timer); resolve() };
    script.onerror = () => { clearTimeout(timer); reject(new Error('تعذر تحميل خدمة تسجيل الدخول من Google. تحقق من اتصال الإنترنت.')) };
    document.head.appendChild(script);
  });
}

function getGoogleAccessToken(){
  return loadGisScript().then(() => new Promise((resolve, reject) => {
    const clientId = loadGoogleClientId();
    if(!clientId){ reject(new Error('أدخل Google Client ID أولاً.')); return }
    try{
      googleTokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: DRIVE_SCOPE,
        callback: (resp) => {
          if(resp.error){ reject(new Error(resp.error)); return }
          googleAccessToken = resp.access_token;
          resolve(googleAccessToken);
        }
      });
      googleTokenClient.requestAccessToken({ prompt: googleAccessToken ? '' : 'consent' });
    }catch(e){ reject(e) }
  }));
}

async function findExistingDriveBackup(accessToken){
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name='${DRIVE_BACKUP_FILENAME}'&fields=files(id,name)`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if(!res.ok) throw new Error('تعذر البحث عن النسخة الاحتياطية السابقة.');
  const data = await res.json();
  return (data.files && data.files[0]) || null;
}

async function uploadBackupToGoogleDrive(accessToken, appStateJson, existingFileId){
  const fileContent = JSON.stringify(appStateJson);
  const fileBlob = new Blob([fileContent], { type: 'application/json' });

  const metadata = existingFileId
    ? { name: DRIVE_BACKUP_FILENAME, mimeType: 'application/json' }
    : { name: DRIVE_BACKUP_FILENAME, mimeType: 'application/json', parents: ['appDataFolder'] };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', fileBlob);

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const response = await fetch(url, {
    method: existingFileId ? 'PATCH' : 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData
  });

  if(!response.ok) throw new Error('فشل رفع الملف إلى Google Drive.');
  return await response.json();
}

export async function backupToGoogleDrive(){
  setCloudStatus('جارٍ الاتصال بـ Google...');
  try{
    const token = await getGoogleAccessToken();
    const payload = {
      meta:     JSON.parse(localStorage.getItem(KEYS.LM) || '{}'),
      data:     state.data,
      holidays: JSON.parse(localStorage.getItem(KEYS.LH) || '{}'),
      docs:     state.docs
    };
    setCloudStatus('جارٍ رفع النسخة الاحتياطية...');
    const existing = await findExistingDriveBackup(token);
    await uploadBackupToGoogleDrive(token, payload, existing && existing.id);
    setCloudStatus('تم حفظ النسخة الاحتياطية السحابية بنجاح ✅');
  }catch(e){
    console.error('Drive Backup Error:', e);
    setCloudStatus('تعذر الحفظ السحابي: ' + (e && e.message ? e.message : 'خطأ غير معروف'));
  }
}

export async function restoreFromGoogleDrive(){
  if(!confirm('سيتم استبدال البيانات الحالية بأحدث نسخة سحابية. هل تريد المتابعة؟')) return;
  setCloudStatus('جارٍ الاتصال بـ Google...');
  try{
    const token = await getGoogleAccessToken();
    setCloudStatus('جارٍ البحث عن النسخة الاحتياطية...');
    const existing = await findExistingDriveBackup(token);
    if(!existing){ setCloudStatus('لا توجد نسخة احتياطية سحابية بعد.'); return }
    setCloudStatus('جارٍ تنزيل البيانات...');
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${existing.id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if(!res.ok) throw new Error('تعذر تنزيل النسخة الاحتياطية.');
    const payload = await res.json();
    if(payload.data)     localStorage.setItem(KEYS.LS, JSON.stringify(payload.data));
    if(payload.meta)     localStorage.setItem(KEYS.LM, JSON.stringify(payload.meta));
    if(payload.holidays) localStorage.setItem(KEYS.LH, JSON.stringify(payload.holidays));
    if(payload.docs)     localStorage.setItem(KEYS.LD, JSON.stringify(payload.docs));
    setCloudStatus('تم الاسترجاع بنجاح، جارٍ التحديث...');
    setTimeout(() => location.reload(), 600);
  }catch(e){
    console.error('Drive Restore Error:', e);
    setCloudStatus('تعذر الاسترجاع السحابي: ' + (e && e.message ? e.message : 'خطأ غير معروف'));
  }
}
