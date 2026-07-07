const STORAGE_KEY = 'talborjt_state_v1';
const SESSION_KEY = 'talborjt_session';

const I18N = {
  ar: {
    appName: 'وكالتي Talborjt',
    loginSetupHint: 'لا توجد كلمة مرور بعد، اختر كلمة مرور لحماية بياناتك',
    password: 'كلمة المرور',
    passwordConfirm: 'تأكيد كلمة المرور',
    login: 'دخول',
    dashboard: 'لوحة التحكم',
    newEntry: 'إدخال عملية',
    reviewTable: 'جدول المراجعة',
    weeks: 'الأسابيع',
    printables: 'المطبوعات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    logout: 'خروج',
    latestOperations: 'آخر العمليات',
    operationType: 'نوع العملية',
    typeInvoice: 'فاتورة MDJS',
    typeExpense: 'مصروف',
    typeAdvance: 'تسبيق',
    typeCorrection: 'تصحيح',
    date: 'التاريخ',
    invoiceNumber: 'رقم الفاتورة',
    supplier: 'المورد أو الشركة',
    montantPrincipal: 'الأصل',
    montantPaid: 'المؤدى للشركات',
    commission: 'العمولة',
    tvaOptional: 'TVA اختيارية',
    tvaAmount: 'مبلغ TVA',
    expenseType: 'نوع المصروف',
    montantExpense: 'مبلغ المصروف',
    beneficiary: 'المستفيد',
    montantAdvance: 'مبلغ التسبيق',
    correctionAmount: 'مبلغ التصحيح',
    note: 'ملاحظة',
    status: 'الحالة',
    statusReview: 'قيد المراجعة',
    statusValidated: 'معتمد',
    save: 'حفظ',
    search: 'بحث...',
    allTypes: 'كل الأنواع',
    allStatuses: 'كل الحالات',
    sortDateDesc: 'الأحدث أولاً',
    sortDateAsc: 'الأقدم أولاً',
    amount: 'المبلغ',
    actions: 'إجراءات',
    newWeek: 'أسبوع جديد',
    compareWeeks: 'مقارنة أسبوعين',
    compare: 'قارن',
    printCollecte: 'مطبوع ملء معطيات الأسبوع',
    printInvoice: 'مطبوع فاتورة MDJS',
    printAdvance: 'مطبوع التسبيق',
    printExpense: 'مطبوع المصروف',
    printVerification: 'مطبوع المراجعة النهائية',
    printSummary: 'مطبوع الملخص الأسبوعي',
    reportWeekly: 'تقرير أسبوعي',
    reportMonthly: 'تقرير شهري',
    reportGlobal: 'تقرير شامل',
    reportCompare: 'مقارنة أسبوعين',
    print: 'طباعة',
    exportCsv: 'تصدير CSV',
    agencyName: 'اسم الوكالة',
    userPercent: 'النسبة الافتراضية للمستخدم',
    currency: 'العملة',
    defaultLang: 'اللغة الافتراضية',
    tvaSettingLabel: 'تفعيل خصم TVA من العمولة',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    backup: 'النسخ الاحتياطي',
    backupExport: 'حفظ نسخة احتياطية',
    backupImport: 'استيراد نسخة احتياطية',
    dangerZone: 'منطقة الخطر',
    deleteAllData: 'حذف كل البيانات',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    weekName: 'تسمية الأسبوع',
    weekStart: 'من تاريخ',
    weekEnd: 'إلى تاريخ',
    totalCommission: 'مجموع العمولات',
    userShare: 'نصيب المستخدم',
    agencyShare: 'نصيب الوكالة',
    expensesLabel: 'المصاريف',
    advancesLabel: 'التسبيقات',
    finalNet: 'الصافي النهائي',
    weekOpen: 'مفتوح',
    weekClosed: 'مغلق',
    openWeek: 'فتح',
    renameWeek: 'إعادة تسمية',
    closeWeek: 'إغلاق',
    reopenWeek: 'إعادة فتح',
    deleteWeek: 'حذف',
    editTx: 'تعديل',
    deleteTx: 'حذف',
    noData: 'لا توجد بيانات بعد',
    noWeeks: 'لا توجد أسابيع بعد، أنشئ أسبوعاً جديداً للبدء',
    confirmDeleteWeek: 'هل أنت متأكد من حذف هذا الأسبوع؟ سيتم حذف كل عملياته نهائياً.',
    confirmCloseWeek: 'هل تريد إغلاق هذا الأسبوع؟',
    confirmReopenWeek: 'هل تريد إعادة فتح هذا الأسبوع؟',
    confirmDeleteTx: 'هل أنت متأكد من حذف هذه العملية؟',
    confirmDeleteAll: 'سيتم حذف كل البيانات نهائياً ولا يمكن التراجع، هل أنت متأكد؟',
    restoreWarning: 'سيتم استبدال كل بياناتك الحالية بالنسخة المستوردة، هل تريد المتابعة؟',
    wrongPassword: 'كلمة المرور غير صحيحة',
    passwordMismatch: 'كلمتا المرور غير متطابقتين',
    passwordTooShort: 'كلمة المرور قصيرة جداً (4 أحرف على الأقل)',
    currentPasswordWrong: 'كلمة المرور الحالية غير صحيحة',
    passwordChanged: 'تم تغيير كلمة المرور بنجاح',
    settingsSaved: 'تم حفظ الإعدادات',
    activeWeek: 'الأسبوع النشط',
    weekCreated: 'تم إنشاء الأسبوع وتفعيله',
    weekOpened: 'تم فتح الأسبوع وتفعيله للإدخال',
    selectWeekFirst: 'اختر أو أنشئ أسبوعاً أولاً',
    txSaved: 'تم حفظ العملية',
    langButtonLabel: 'Français',
    agencyLabel: 'اسم الوكالة',
    period: 'الفترة',
    printDate: 'تاريخ الطباعة',
    signName: 'الاسم والتوقيع',
    declaration: 'أصرح أن المعطيات أعلاه صحيحة.',
    additionalNotes: 'ملاحظات إضافية',
    sendDate: 'تاريخ الإرسال',
    weekOf: 'الأسبوع من',
    to: 'إلى',
    beneficiaryLabel: 'المستفيد',
    expenseTypeLabel: 'نوع المصروف',
    society: 'الشركة',
    verificationTitle: 'مطبوع المراجعة النهائية',
    summaryTitle: 'مطبوع الملخص الأسبوعي',
    operationsList: 'لائحة العمليات',
    notesLabel: 'ملاحظات',
    comparisonResult: 'نتيجة المقارنة',
    difference: 'الفرق',
    from: 'من',
    tvaNoteReport: 'TVA تظهر فقط إذا كانت مدخلة في التفاصيل ولا تدخل في حساب العمولة إلا إذا فُعّل ذلك في الإعدادات.',
    declarantName: 'اسم المصرّح أو المرسل',
    phone: 'رقم الهاتف',
    bankTransfersSection: 'الأداءات البنكية',
    paymentType: 'أداء',
    bankReference: 'المرجع البنكي إن وجد',
    declarationCollecte: 'أصرح أن المعطيات أعلاه صحيحة وأرسلها للمدير من أجل إدخالها في التطبيق.',
    printablesNote: 'هذه المطبوعات مخصصة للمصرّح أو المرسل حتى يملأ المعطيات ويرسلها للمدير. المدير فقط هو من يدخل البيانات في التطبيق.'
  },
  fr: {
    appName: 'Mon Agence Talborjt',
    loginSetupHint: "Aucun mot de passe n'existe encore, choisissez-en un pour protéger vos données",
    password: 'Mot de passe',
    passwordConfirm: 'Confirmer le mot de passe',
    login: 'Connexion',
    dashboard: 'Tableau de bord',
    newEntry: 'Nouvelle opération',
    reviewTable: 'Tableau de révision',
    weeks: 'Semaines',
    printables: 'Imprimés',
    reports: 'Rapports',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    latestOperations: 'Dernières opérations',
    operationType: "Type d'opération",
    typeInvoice: 'Facture MDJS',
    typeExpense: 'Dépense',
    typeAdvance: 'Avance',
    typeCorrection: 'Correction',
    date: 'Date',
    invoiceNumber: 'N° facture',
    supplier: 'Fournisseur ou société',
    montantPrincipal: 'Montant principal',
    montantPaid: 'Montant payé aux sociétés',
    commission: 'Commission',
    tvaOptional: 'TVA optionnelle',
    tvaAmount: 'Montant TVA',
    expenseType: 'Type de dépense',
    montantExpense: 'Montant dépense',
    beneficiary: 'Bénéficiaire',
    montantAdvance: 'Montant avance',
    correctionAmount: 'Montant correction',
    note: 'Remarque',
    status: 'Statut',
    statusReview: 'En révision',
    statusValidated: 'Validé',
    save: 'Enregistrer',
    search: 'Rechercher...',
    allTypes: 'Tous les types',
    allStatuses: 'Tous les statuts',
    sortDateDesc: 'Plus récent',
    sortDateAsc: 'Plus ancien',
    amount: 'Montant',
    actions: 'Actions',
    newWeek: 'Nouvelle semaine',
    compareWeeks: 'Comparaison entre deux semaines',
    compare: 'Comparer',
    printCollecte: 'Fiche de collecte hebdomadaire',
    printInvoice: 'Fiche facture MDJS',
    printAdvance: 'Fiche avance',
    printExpense: 'Fiche dépense',
    printVerification: 'Fiche de vérification finale',
    printSummary: 'Récapitulatif hebdomadaire',
    reportWeekly: 'Rapport hebdomadaire',
    reportMonthly: 'Rapport mensuel',
    reportGlobal: 'Rapport global',
    reportCompare: 'Comparaison entre deux semaines',
    print: 'Imprimer',
    exportCsv: 'Exporter CSV',
    agencyName: "Nom de l'agence",
    userPercent: 'Pourcentage utilisateur',
    currency: 'Devise',
    defaultLang: 'Langue par défaut',
    tvaSettingLabel: 'Activer la déduction de la TVA de la commission',
    changePassword: 'Changer le mot de passe',
    currentPassword: 'Mot de passe actuel',
    newPassword: 'Nouveau mot de passe',
    backup: 'Sauvegarde',
    backupExport: 'Sauvegarder',
    backupImport: 'Importer',
    dangerZone: 'Zone dangereuse',
    deleteAllData: 'Supprimer toutes les données',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    weekName: 'Nom de la semaine',
    weekStart: 'Du',
    weekEnd: 'Au',
    totalCommission: 'Total commissions',
    userShare: 'Part utilisateur',
    agencyShare: 'Part agence',
    expensesLabel: 'Dépenses',
    advancesLabel: 'Avances',
    finalNet: 'Solde final',
    weekOpen: 'Ouverte',
    weekClosed: 'Fermée',
    openWeek: 'Ouvrir',
    renameWeek: 'Renommer',
    closeWeek: 'Fermer',
    reopenWeek: 'Rouvrir',
    deleteWeek: 'Supprimer',
    editTx: 'Modifier',
    deleteTx: 'Supprimer',
    noData: 'Aucune donnée pour le moment',
    noWeeks: 'Aucune semaine pour le moment, créez-en une pour commencer',
    confirmDeleteWeek: 'Voulez-vous vraiment supprimer cette semaine ? Toutes ses opérations seront supprimées définitivement.',
    confirmCloseWeek: 'Voulez-vous fermer cette semaine ?',
    confirmReopenWeek: 'Voulez-vous rouvrir cette semaine ?',
    confirmDeleteTx: 'Voulez-vous vraiment supprimer cette opération ?',
    confirmDeleteAll: 'Toutes vos données seront supprimées définitivement, êtes-vous sûr ?',
    restoreWarning: 'Toutes vos données actuelles seront remplacées par la sauvegarde importée, continuer ?',
    wrongPassword: 'Mot de passe incorrect',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    passwordTooShort: 'Mot de passe trop court (4 caractères minimum)',
    currentPasswordWrong: 'Mot de passe actuel incorrect',
    passwordChanged: 'Mot de passe modifié avec succès',
    settingsSaved: 'Paramètres enregistrés',
    activeWeek: 'Semaine active',
    weekCreated: 'Semaine créée et activée',
    weekOpened: 'Semaine ouverte et activée pour la saisie',
    selectWeekFirst: "Choisissez ou créez d'abord une semaine",
    txSaved: 'Opération enregistrée',
    langButtonLabel: 'العربية',
    agencyLabel: "Nom de l'agence",
    period: 'Période',
    printDate: "Date d'impression",
    signName: 'Nom et signature',
    declaration: 'Je déclare que les informations ci-dessus sont exactes.',
    additionalNotes: 'Remarques supplémentaires',
    sendDate: "Date d'envoi",
    weekOf: 'Semaine du',
    to: 'au',
    beneficiaryLabel: 'Bénéficiaire',
    expenseTypeLabel: 'Type de dépense',
    society: 'Société',
    verificationTitle: 'Fiche de vérification finale',
    summaryTitle: 'Récapitulatif hebdomadaire',
    operationsList: 'Liste des opérations',
    notesLabel: 'Remarques',
    comparisonResult: 'Résultat de la comparaison',
    difference: 'Différence',
    from: 'De',
    tvaNoteReport: "La TVA n'apparaît que si elle est saisie dans les détails et n'entre dans le calcul de la commission que si cette option est activée dans les paramètres.",
    declarantName: "Nom du déclarant ou expéditeur",
    phone: 'Téléphone',
    bankTransfersSection: 'Virements bancaires',
    paymentType: 'Paiement',
    bankReference: 'Référence bancaire',
    declarationCollecte: "Je déclare que les informations ci-dessus sont exactes et les transmets au gérant pour saisie dans l'application.",
    printablesNote: "Ces imprimés sont destinés au déclarant ou à l'expéditeur afin de remplir les données et les transmettre au gérant. Seul le gérant saisit les données dans l'application."
  }
};

let state = loadState();
let ui = { lang: state.settings.lang || 'ar', currentView: 'dashboard', entryType: 'invoice', dashboardWeekId: null };

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return migrateState(JSON.parse(raw));
  } catch (e) {}
  return {
    settings: { agencyName: 'وكالتي Talborjt', userPercent: 30, currency: 'MAD', lang: 'ar', tvaDeductionEnabled: false, passwordHash: null, passwordSalt: null },
    weeks: [],
    transactions: [],
    currentWeekId: null
  };
}
function migrateState(s) {
  s.settings = s.settings || {};
  if (s.settings.userPercent === undefined) s.settings.userPercent = 30;
  if (s.settings.currency === undefined) s.settings.currency = 'MAD';
  if (s.settings.lang === undefined) s.settings.lang = 'ar';
  if (s.settings.tvaDeductionEnabled === undefined) s.settings.tvaDeductionEnabled = false;
  if (s.settings.agencyName === undefined) s.settings.agencyName = 'وكالتي Talborjt';
  s.weeks = s.weeks || [];
  s.transactions = s.transactions || [];
  if (s.currentWeekId === undefined) s.currentWeekId = null;
  return s;
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function fmt(n) {
  const sign = n < 0 ? '-' : '';
  const v = Math.abs(Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return sign + v + ' ' + (state.settings.currency || 'MAD');
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function t(key) { return (I18N[ui.lang] && I18N[ui.lang][key]) || key; }

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function randomSalt() { return Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join(''); }

/* ---------- i18n apply ---------- */
function applyLang() {
  document.documentElement.lang = ui.lang;
  document.documentElement.dir = ui.lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder'))); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
  document.getElementById('lang-toggle').textContent = t('langButtonLabel');
  document.getElementById('login-lang-toggle').textContent = t('langButtonLabel');
  document.getElementById('topbar-agency-name').textContent = state.settings.agencyName || t('appName');
}
function toggleLang() {
  ui.lang = ui.lang === 'ar' ? 'fr' : 'ar';
  applyLang();
  renderCurrentView();
}

/* ---------- Auth ---------- */
async function handleLoginSubmit(e) {
  e.preventDefault();
  const pass = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.hidden = true;
  if (!state.settings.passwordHash) {
    const confirmPass = document.getElementById('login-password-confirm').value;
    if (pass.length < 4) { errEl.textContent = t('passwordTooShort'); errEl.hidden = false; return; }
    if (pass !== confirmPass) { errEl.textContent = t('passwordMismatch'); errEl.hidden = false; return; }
    const salt = randomSalt();
    state.settings.passwordSalt = salt;
    state.settings.passwordHash = await sha256(salt + pass);
    saveState();
    startSession();
    return;
  }
  const hash = await sha256(state.settings.passwordSalt + pass);
  if (hash !== state.settings.passwordHash) { errEl.textContent = t('wrongPassword'); errEl.hidden = false; return; }
  startSession();
}
function startSession() {
  sessionStorage.setItem(SESSION_KEY, '1');
  document.getElementById('login-form').reset();
  showApp();
}
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('login-screen').hidden = false;
  document.getElementById('app-shell').hidden = true;
  setupLoginScreen();
}
function showApp() {
  document.getElementById('login-screen').hidden = true;
  document.getElementById('app-shell').hidden = false;
  goTo('dashboard');
}
function setupLoginScreen() {
  const needsSetup = !state.settings.passwordHash;
  document.getElementById('login-setup-hint').hidden = !needsSetup;
  document.getElementById('login-password-confirm-wrap').hidden = !needsSetup;
}

/* ---------- Navigation ---------- */
function goTo(view) {
  ui.currentView = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.nav === view));
  closeNav();
  renderCurrentView();
}
function renderCurrentView() {
  if (ui.currentView === 'dashboard') renderDashboard();
  else if (ui.currentView === 'review') renderReview();
  else if (ui.currentView === 'weeks') renderWeeks();
  else if (ui.currentView === 'printables') renderPrintables();
  else if (ui.currentView === 'reports') renderReportControls();
  else if (ui.currentView === 'settings') renderSettings();
  else if (ui.currentView === 'entry') renderEntryWeekState();
}
function openNav() { document.getElementById('side-nav').classList.add('open'); document.getElementById('nav-backdrop').classList.add('open'); }
function closeNav() { document.getElementById('side-nav').classList.remove('open'); document.getElementById('nav-backdrop').classList.remove('open'); }

/* ---------- Confirm modal ---------- */
function confirmDialog(text) {
  return new Promise(resolve => {
    const modal = document.getElementById('confirm-modal');
    document.getElementById('confirm-modal-text').textContent = text;
    modal.hidden = false;
    const ok = document.getElementById('confirm-modal-ok');
    const cancel = document.getElementById('confirm-modal-cancel');
    function cleanup(result) { modal.hidden = true; ok.removeEventListener('click', onOk); cancel.removeEventListener('click', onCancel); resolve(result); }
    function onOk() { cleanup(true); }
    function onCancel() { cleanup(false); }
    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
  });
}

/* ---------- Calculation engine ---------- */
function computeWeekTotals(weekId) {
  const txs = state.transactions.filter(tx => tx.weekId === weekId);
  const invoices = txs.filter(tx => tx.type === 'invoice');
  const expenses = txs.filter(tx => tx.type === 'expense');
  const advances = txs.filter(tx => tx.type === 'advance');
  const corrections = txs.filter(tx => tx.type === 'correction');

  const totalPrincipal = invoices.reduce((s, tx) => s + num(tx.principal), 0);
  const totalPaid = invoices.reduce((s, tx) => s + num(tx.paid), 0);
  const totalTva = invoices.reduce((s, tx) => s + (tx.tvaEnabled ? num(tx.tva) : 0), 0);
  let totalCommission = invoices.reduce((s, tx) => s + num(tx.commission), 0);

  if (state.settings.tvaDeductionEnabled) totalCommission -= totalTva;

  const correctionsTotal = corrections.reduce((s, tx) => s + num(tx.correctionAmount), 0);
  totalCommission += correctionsTotal;

  const percent = num(state.settings.userPercent) / 100;
  const userShare = totalCommission * percent;
  const agencyShare = totalCommission - userShare;
  const totalExpenses = expenses.reduce((s, tx) => s + num(tx.expenseAmount), 0);
  const totalAdvances = advances.reduce((s, tx) => s + num(tx.advanceAmount), 0);
  const finalNet = agencyShare - totalExpenses - totalAdvances;

  return { totalPrincipal, totalPaid, totalCommission, totalTva, userShare, agencyShare, totalExpenses, totalAdvances, finalNet, count: txs.length };
}

/* ---------- Weeks helpers ---------- */
function getWeek(id) { return state.weeks.find(w => w.id === id); }
function sortedWeeks() { return [...state.weeks].sort((a, b) => (b.start || '').localeCompare(a.start || '') || b.createdAt - a.createdAt); }
function weekLabel(w) { return w ? `${w.name} (${w.start || '?'} - ${w.end || '?'})` : ''; }
function ensureActiveWeekOrWarn() {
  if (!state.currentWeekId || !getWeek(state.currentWeekId)) { alert(t('selectWeekFirst')); goTo('weeks'); return false; }
  return true;
}

/* ---------- Dashboard ---------- */
function populateWeekSelect(select, includeEmpty) {
  const prev = select.value;
  select.innerHTML = '';
  if (includeEmpty || state.weeks.length === 0) {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = '—';
    select.appendChild(opt);
  }
  sortedWeeks().forEach(w => {
    const opt = document.createElement('option');
    opt.value = w.id; opt.textContent = weekLabel(w);
    select.appendChild(opt);
  });
  if (prev && [...select.options].some(o => o.value === prev)) select.value = prev;
}
function renderDashboard() {
  const select = document.getElementById('dashboard-week-select');
  populateWeekSelect(select, false);
  if (!ui.dashboardWeekId || !getWeek(ui.dashboardWeekId)) ui.dashboardWeekId = state.currentWeekId || (sortedWeeks()[0] && sortedWeeks()[0].id) || null;
  if (ui.dashboardWeekId) select.value = ui.dashboardWeekId;
  select.onchange = () => { ui.dashboardWeekId = select.value; renderDashboard(); };

  const cards = document.getElementById('dashboard-cards');
  const recent = document.getElementById('dashboard-recent');
  cards.innerHTML = '';
  recent.innerHTML = '';

  if (!ui.dashboardWeekId) {
    cards.innerHTML = `<div class="empty-state">${t('noWeeks')}</div>`;
    return;
  }

  const totals = computeWeekTotals(ui.dashboardWeekId);
  const items = [
    { label: t('montantPrincipal'), value: totals.totalPrincipal },
    { label: t('montantPaid'), value: totals.totalPaid },
    { label: t('totalCommission'), value: totals.totalCommission },
    { label: t('userShare'), value: totals.userShare, emphasis: true },
    { label: t('agencyShare'), value: totals.agencyShare },
    { label: t('expensesLabel'), value: totals.totalExpenses },
    { label: t('advancesLabel'), value: totals.totalAdvances },
    { label: t('finalNet'), value: totals.finalNet, cls: totals.finalNet >= 0 ? 'positive' : 'negative' }
  ];
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'stat-card' + (it.emphasis ? ' emphasis' : '') + (it.cls ? ' ' + it.cls : '');
    div.innerHTML = `<div class="stat-label">${it.label}</div><div class="stat-value">${fmt(it.value)}</div>`;
    cards.appendChild(div);
  });

  const txs = state.transactions.filter(tx => tx.weekId === ui.dashboardWeekId).sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8);
  if (txs.length === 0) recent.innerHTML = `<div class="empty-state">${t('noData')}</div>`;
  txs.forEach(tx => {
    const div = document.createElement('div');
    div.className = 'recent-item';
    div.innerHTML = `<span>${tx.date || ''} — ${txDescription(tx)}</span><span class="tag">${t('type' + capitalize(tx.type))}</span>`;
    recent.appendChild(div);
  });
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function txDescription(tx) {
  if (tx.type === 'invoice') return `${tx.supplier || ''} ${tx.invoiceNumber ? '#' + tx.invoiceNumber : ''} — ${fmt(num(tx.commission))}`;
  if (tx.type === 'expense') return `${tx.expenseType || ''} — ${fmt(num(tx.expenseAmount))}`;
  if (tx.type === 'advance') return `${tx.beneficiary || ''} — ${fmt(num(tx.advanceAmount))}`;
  return `${tx.note || ''} — ${fmt(num(tx.correctionAmount))}`;
}

/* ---------- Entry form ---------- */
function setEntryType(type) {
  ui.entryType = type;
  document.querySelectorAll('#entry-type-tabs .type-tab').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  document.getElementById('fields-invoice').hidden = type !== 'invoice';
  document.getElementById('fields-expense').hidden = type !== 'expense';
  document.getElementById('fields-advance').hidden = type !== 'advance';
  document.getElementById('fields-correction').hidden = type !== 'correction';
}
function renderEntryWeekState() {
  const btn = document.querySelector('#entry-form button[type="submit"]');
  btn.disabled = !state.currentWeekId;
}
function resetEntryForm() {
  document.getElementById('entry-form').reset();
  document.getElementById('f-edit-id').value = '';
  document.getElementById('f-date').value = todayISO();
  document.getElementById('f-tva-wrap').hidden = true;
  setEntryType('invoice');
}
function fillEntryForm(tx) {
  setEntryType(tx.type);
  document.getElementById('f-edit-id').value = tx.id;
  document.getElementById('f-date').value = tx.date || '';
  document.getElementById('f-invoice-number').value = tx.invoiceNumber || '';
  document.getElementById('f-supplier').value = tx.supplier || '';
  document.getElementById('f-principal').value = tx.principal ?? '';
  document.getElementById('f-paid').value = tx.paid ?? '';
  document.getElementById('f-commission').value = tx.commission ?? '';
  document.getElementById('f-tva-toggle').checked = !!tx.tvaEnabled;
  document.getElementById('f-tva-wrap').hidden = !tx.tvaEnabled;
  document.getElementById('f-tva').value = tx.tva ?? '';
  document.getElementById('f-expense-type').value = tx.expenseType || '';
  document.getElementById('f-expense-amount').value = tx.expenseAmount ?? '';
  document.getElementById('f-beneficiary').value = tx.beneficiary || '';
  document.getElementById('f-advance-amount').value = tx.advanceAmount ?? '';
  document.getElementById('f-correction-amount').value = tx.correctionAmount ?? '';
  document.getElementById('f-note').value = tx.note || '';
  document.getElementById('f-status').value = tx.status || 'review';
  goTo('entry');
}
function handleEntrySubmit(e) {
  e.preventDefault();
  if (!ensureActiveWeekOrWarn()) return;
  const editId = document.getElementById('f-edit-id').value;
  const tx = {
    id: editId || uid(),
    weekId: state.currentWeekId,
    type: ui.entryType,
    date: document.getElementById('f-date').value || todayISO(),
    invoiceNumber: document.getElementById('f-invoice-number').value,
    supplier: document.getElementById('f-supplier').value,
    principal: num(document.getElementById('f-principal').value),
    paid: num(document.getElementById('f-paid').value),
    commission: num(document.getElementById('f-commission').value),
    tvaEnabled: document.getElementById('f-tva-toggle').checked,
    tva: num(document.getElementById('f-tva').value),
    expenseType: document.getElementById('f-expense-type').value,
    expenseAmount: num(document.getElementById('f-expense-amount').value),
    beneficiary: document.getElementById('f-beneficiary').value,
    advanceAmount: num(document.getElementById('f-advance-amount').value),
    correctionAmount: num(document.getElementById('f-correction-amount').value),
    note: document.getElementById('f-note').value,
    status: document.getElementById('f-status').value,
    createdAt: editId ? (state.transactions.find(x => x.id === editId) || {}).createdAt || Date.now() : Date.now()
  };
  if (editId) {
    const idx = state.transactions.findIndex(x => x.id === editId);
    state.transactions[idx] = tx;
  } else {
    state.transactions.push(tx);
  }
  saveState();
  resetEntryForm();
  toast(t('txSaved'));
  goTo('review');
}

/* ---------- Review table ---------- */
function renderReview() {
  const search = document.getElementById('review-search').value.trim().toLowerCase();
  const filterType = document.getElementById('review-filter-type').value;
  const filterStatus = document.getElementById('review-filter-status').value;
  const sort = document.getElementById('review-sort').value;

  let txs = state.transactions.filter(tx => tx.weekId === state.currentWeekId);
  if (filterType) txs = txs.filter(tx => tx.type === filterType);
  if (filterStatus) txs = txs.filter(tx => tx.status === filterStatus);
  if (search) {
    txs = txs.filter(tx => [tx.invoiceNumber, tx.supplier, tx.note, tx.expenseType, tx.beneficiary].filter(Boolean).some(v => v.toLowerCase().includes(search)));
  }
  txs.sort((a, b) => sort === 'date-asc' ? (a.date || '').localeCompare(b.date || '') : (b.date || '').localeCompare(a.date || ''));

  const tbody = document.getElementById('review-tbody');
  tbody.innerHTML = '';
  txs.forEach(tx => {
    const tr = document.createElement('tr');
    const amount = tx.type === 'expense' ? tx.expenseAmount : tx.type === 'advance' ? tx.advanceAmount : tx.type === 'correction' ? tx.correctionAmount : tx.commission;
    tr.innerHTML = `
      <td>${tx.date || ''}</td>
      <td>${t('type' + capitalize(tx.type))}</td>
      <td>${tx.invoiceNumber || ''}</td>
      <td>${tx.supplier || tx.beneficiary || tx.expenseType || ''}</td>
      <td>${tx.type === 'invoice' ? fmt(num(tx.principal)) : ''}</td>
      <td>${tx.type === 'invoice' ? fmt(num(tx.paid)) : ''}</td>
      <td>${tx.type === 'invoice' ? fmt(num(tx.commission)) : ''}</td>
      <td>${fmt(num(amount))}</td>
      <td><span class="badge badge-${tx.status === 'validated' ? 'validated' : 'review'}">${t('status' + capitalize(tx.status === 'validated' ? 'Validated' : 'Review'))}</span></td>
      <td>${tx.note || ''}</td>
      <td class="row-actions">
        <button data-edit="${tx.id}">${t('editTx')}</button>
        <button data-toggle="${tx.id}">${tx.status === 'validated' ? t('statusReview') : t('statusValidated')}</button>
        <button class="danger" data-delete="${tx.id}">${t('deleteTx')}</button>
      </td>`;
    tbody.appendChild(tr);
  });

  const summary = document.getElementById('review-summary');
  const totalAmount = txs.reduce((s, tx) => s + num(tx.type === 'expense' ? tx.expenseAmount : tx.type === 'advance' ? tx.advanceAmount : tx.type === 'correction' ? tx.correctionAmount : tx.commission), 0);
  summary.innerHTML = `<span>${t('actions')}: ${txs.length}</span><span>${t('amount')}: ${fmt(totalAmount)}</span>`;

  tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => fillEntryForm(state.transactions.find(x => x.id === b.dataset.edit))));
  tbody.querySelectorAll('[data-toggle]').forEach(b => b.addEventListener('click', () => {
    const tx = state.transactions.find(x => x.id === b.dataset.toggle);
    tx.status = tx.status === 'validated' ? 'review' : 'validated';
    saveState(); renderReview();
  }));
  tbody.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', async () => {
    if (await confirmDialog(t('confirmDeleteTx'))) {
      state.transactions = state.transactions.filter(x => x.id !== b.dataset.delete);
      saveState(); renderReview();
    }
  }));
}

/* ---------- Weeks management ---------- */
function openWeekModal(weekId) {
  const modal = document.getElementById('week-modal');
  const w = weekId ? getWeek(weekId) : null;
  document.getElementById('week-modal-title').textContent = t('newWeek');
  document.getElementById('week-modal-id').value = weekId || '';
  document.getElementById('week-modal-name').value = w ? w.name : '';
  document.getElementById('week-modal-start').value = w ? w.start || '' : '';
  document.getElementById('week-modal-end').value = w ? w.end || '' : '';
  modal.hidden = false;
}
function closeWeekModal() { document.getElementById('week-modal').hidden = true; }
function saveWeekModal() {
  const id = document.getElementById('week-modal-id').value;
  const name = document.getElementById('week-modal-name').value.trim();
  const start = document.getElementById('week-modal-start').value;
  const end = document.getElementById('week-modal-end').value;
  if (!name) return;
  if (id) {
    const w = getWeek(id);
    w.name = name; w.start = start; w.end = end;
  } else {
    const w = { id: uid(), name, start, end, status: 'open', createdAt: Date.now() };
    state.weeks.push(w);
    state.currentWeekId = w.id;
    toast(t('weekCreated'));
  }
  saveState();
  closeWeekModal();
  renderWeeks();
}
function renderWeeks() {
  const list = document.getElementById('weeks-list');
  list.innerHTML = '';
  const weeks = sortedWeeks();
  if (weeks.length === 0) { list.innerHTML = `<div class="empty-state">${t('noWeeks')}</div>`; }
  weeks.forEach(w => {
    const totals = computeWeekTotals(w.id);
    const div = document.createElement('div');
    div.className = 'week-card';
    const isActive = w.id === state.currentWeekId;
    div.innerHTML = `
      <div class="week-info">
        <b>${w.name} ${isActive ? '★' : ''}</b>
        <span>${w.start || '?'} — ${w.end || '?'} · ${t('finalNet')}: ${fmt(totals.finalNet)}</span>
        <span class="week-status ${w.status}">${w.status === 'open' ? t('weekOpen') : t('weekClosed')}</span>
      </div>
      <div class="week-actions">
        <button class="btn btn-ghost btn-sm" data-open="${w.id}">${t('openWeek')}</button>
        <button class="btn btn-ghost btn-sm" data-rename="${w.id}">${t('renameWeek')}</button>
        <button class="btn btn-ghost btn-sm" data-toggle-close="${w.id}">${w.status === 'open' ? t('closeWeek') : t('reopenWeek')}</button>
        <button class="btn btn-ghost btn-sm" data-delete="${w.id}">${t('deleteWeek')}</button>
      </div>`;
    list.appendChild(div);
  });
  list.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => { state.currentWeekId = b.dataset.open; saveState(); toast(t('weekOpened')); renderWeeks(); }));
  list.querySelectorAll('[data-rename]').forEach(b => b.addEventListener('click', () => openWeekModal(b.dataset.rename)));
  list.querySelectorAll('[data-toggle-close]').forEach(b => b.addEventListener('click', async () => {
    const w = getWeek(b.dataset.toggleClose || b.getAttribute('data-toggle-close'));
    const msg = w.status === 'open' ? t('confirmCloseWeek') : t('confirmReopenWeek');
    if (await confirmDialog(msg)) { w.status = w.status === 'open' ? 'closed' : 'open'; saveState(); renderWeeks(); }
  }));
  list.querySelectorAll('[data-delete]').forEach(b => b.addEventListener('click', async () => {
    if (await confirmDialog(t('confirmDeleteWeek'))) {
      const id = b.dataset.delete;
      state.weeks = state.weeks.filter(w => w.id !== id);
      state.transactions = state.transactions.filter(tx => tx.weekId !== id);
      if (state.currentWeekId === id) state.currentWeekId = null;
      saveState(); renderWeeks();
    }
  }));

  populateWeekSelect(document.getElementById('compare-week-a'), true);
  populateWeekSelect(document.getElementById('compare-week-b'), true);
}
function renderCompare() {
  const idA = document.getElementById('compare-week-a').value;
  const idB = document.getElementById('compare-week-b').value;
  const out = document.getElementById('compare-result');
  if (!idA || !idB) { out.innerHTML = ''; return; }
  const wa = getWeek(idA), wb = getWeek(idB);
  const ta = computeWeekTotals(idA), tb = computeWeekTotals(idB);
  const rows = [
    ['totalCommission', ta.totalCommission, tb.totalCommission],
    ['userShare', ta.userShare, tb.userShare],
    ['agencyShare', ta.agencyShare, tb.agencyShare],
    ['expensesLabel', ta.totalExpenses, tb.totalExpenses],
    ['advancesLabel', ta.totalAdvances, tb.totalAdvances],
    ['finalNet', ta.finalNet, tb.finalNet]
  ];
  out.innerHTML = `<div class="table-wrap"><table class="table"><thead><tr><th></th><th>${weekLabel(wa)}</th><th>${weekLabel(wb)}</th><th>${t('difference')}</th></tr></thead><tbody>
    ${rows.map(r => `<tr><td>${t(r[0])}</td><td>${fmt(r[1])}</td><td>${fmt(r[2])}</td><td>${fmt(r[2] - r[1])}</td></tr>`).join('')}
  </tbody></table></div>`;
}

/* ---------- Printables ---------- */
function psHead() {
  return `<div class="ps-head"><h1>${state.settings.agencyName || t('appName')}</h1><span class="ps-sub">${t('printDate')}: ${todayISO()}</span></div>`;
}
function psSign() {
  return `<div class="ps-notes"><b>${t('additionalNotes')}</b></div>
  <p style="font-size:11px">${t('declaration')}</p>
  <div class="ps-sign"><span>${t('signName')}: ______________________</span><span>${t('printDate')}: ______________</span></div>`;
}
function buildCollecteSheet(w) {
  const invoiceRows = (n) => Array.from({ length: n }).map(() => `<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('');
  const invoiceTable = (label) => `
    <div class="ps-section-title">${label}</div>
    <table><thead><tr><th>${t('invoiceNumber')}</th><th>${t('montantPrincipal')}</th><th>${t('montantPaid')}</th><th>${t('commission')}</th><th>${t('note')}</th></tr></thead><tbody>${invoiceRows(2)}</tbody></table>`;
  const bankRows = (n) => Array.from({ length: n }).map(() => `<tr><td>□ ${t('typeAdvance')}<br>□ ${t('paymentType')}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('');
  const expenseRows = (n) => Array.from({ length: n }).map(() => `<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('');
  return `<div class="print-sheet">${psHead()}
    <div class="ps-title">مطبوع ملء معطيات الأسبوع<small>Fiche de collecte hebdomadaire</small></div>
    <div class="ps-meta">
      <div>${t('agencyLabel')}: ${state.settings.agencyName || ''}</div>
      <div>${t('weekOf')}: ${w ? w.start || '' : ''} — ${t('to')}: ${w ? w.end || '' : ''}</div>
      <div>${t('declarantName')}: ______________________</div>
      <div>${t('phone')}: ______________</div>
      <div>${t('sendDate')}: ______________</div>
    </div>
    ${invoiceTable('MDJ')}
    ${invoiceTable('Loto')}
    ${invoiceTable('Sezal')}
    <div class="ps-section-title">${t('bankTransfersSection')}</div>
    <table><thead><tr><th>${t('operationType')}</th><th>${t('date')}</th><th>${t('amount')}</th><th>${t('bankReference')}</th><th>${t('note')}</th></tr></thead><tbody>${bankRows(4)}</tbody></table>
    <div class="ps-section-title">${t('expensesLabel')}</div>
    <table><thead><tr><th>${t('date')}</th><th>${t('expenseTypeLabel')}</th><th>${t('amount')}</th><th>${t('note')}</th></tr></thead><tbody>${expenseRows(3)}</tbody></table>
    <div class="ps-notes"><b>${t('additionalNotes')}</b></div>
    <p style="font-size:11px">${t('declarationCollecte')}</p>
    <div class="ps-sign"><span>${t('signName')}: ______________________</span><span>${t('printDate')}: ______________</span></div>
    <div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div>
  </div>`;
}
function buildInvoiceSheet() {
  return `<div class="print-sheet">${psHead()}
    <div class="ps-title">مطبوع فاتورة MDJS<small>Fiche facture MDJS</small></div>
    <div class="ps-meta">
      <div>${t('date')}: ______________</div>
      <div>${t('invoiceNumber')}: ______________</div>
      <div>${t('society')}: ______________________</div>
      <div>${t('montantPrincipal')}: ______________</div>
      <div>${t('montantPaid')}: ______________</div>
      <div>${t('commission')}: ______________</div>
      <div>TVA (${t('tvaOptional')}): ______________</div>
    </div>
    <div class="ps-notes"><b>${t('note')}</b></div>
    ${psSign()}
    <div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div>
  </div>`;
}
function buildAdvanceSheet() {
  return `<div class="print-sheet">${psHead()}
    <div class="ps-title">مطبوع التسبيق<small>Fiche avance</small></div>
    <div class="ps-meta">
      <div>${t('date')}: ______________</div>
      <div>${t('beneficiaryLabel')}: ______________________</div>
      <div>${t('amount')}: ______________</div>
    </div>
    <div class="ps-notes"><b>${t('note')}</b></div>
    ${psSign()}
    <div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div>
  </div>`;
}
function buildExpenseSheet() {
  return `<div class="print-sheet">${psHead()}
    <div class="ps-title">مطبوع المصروف<small>Fiche dépense</small></div>
    <div class="ps-meta">
      <div>${t('date')}: ______________</div>
      <div>${t('expenseTypeLabel')}: ______________________</div>
      <div>${t('amount')}: ______________</div>
    </div>
    <div class="ps-notes"><b>${t('note')}</b></div>
    ${psSign()}
    <div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div>
  </div>`;
}
function buildVerificationSheet(w) {
  const totals = w ? computeWeekTotals(w.id) : null;
  return `<div class="print-sheet">${psHead()}
    <div class="ps-title">مطبوع المراجعة النهائية<small>${t('verificationTitle')}</small></div>
    <div class="ps-meta">
      <div>${t('weekOf')}: ${w ? w.start || '' : ''} — ${t('to')}: ${w ? w.end || '' : ''}</div>
      <div>${t('agencyLabel')}: ${state.settings.agencyName || ''}</div>
    </div>
    <table><tbody>
      <tr><td>${t('montantPrincipal')}</td><td>${totals ? fmt(totals.totalPrincipal) : ''}</td></tr>
      <tr><td>${t('montantPaid')}</td><td>${totals ? fmt(totals.totalPaid) : ''}</td></tr>
      <tr><td>${t('totalCommission')}</td><td>${totals ? fmt(totals.totalCommission) : ''}</td></tr>
      <tr><td>${t('userShare')}</td><td>${totals ? fmt(totals.userShare) : ''}</td></tr>
      <tr><td>${t('agencyShare')}</td><td>${totals ? fmt(totals.agencyShare) : ''}</td></tr>
      <tr><td>${t('expensesLabel')}</td><td>${totals ? fmt(totals.totalExpenses) : ''}</td></tr>
      <tr><td>${t('advancesLabel')}</td><td>${totals ? fmt(totals.totalAdvances) : ''}</td></tr>
      <tr><td><b>${t('finalNet')}</b></td><td><b>${totals ? fmt(totals.finalNet) : ''}</b></td></tr>
    </tbody></table>
    ${psSign()}
    <div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div>
  </div>`;
}
function buildSummarySheet(w) {
  const totals = w ? computeWeekTotals(w.id) : null;
  const txs = w ? state.transactions.filter(tx => tx.weekId === w.id) : [];
  return `<div class="print-sheet">${psHead()}
    <div class="ps-title">مطبوع الملخص الأسبوعي<small>${t('summaryTitle')}</small></div>
    <div class="ps-meta">
      <div>${t('weekOf')}: ${w ? w.start || '' : ''} — ${t('to')}: ${w ? w.end || '' : ''}</div>
      <div>${t('agencyLabel')}: ${state.settings.agencyName || ''}</div>
    </div>
    <div class="ps-section-title">${t('operationsList')}</div>
    <table><thead><tr><th>${t('date')}</th><th>${t('operationType')}</th><th>${t('amount')}</th><th>${t('status')}</th></tr></thead>
    <tbody>${txs.map(tx => `<tr><td>${tx.date || ''}</td><td>${t('type' + capitalize(tx.type))}</td><td>${fmt(num(tx.type === 'expense' ? tx.expenseAmount : tx.type === 'advance' ? tx.advanceAmount : tx.type === 'correction' ? tx.correctionAmount : tx.commission))}</td><td>${tx.status === 'validated' ? t('statusValidated') : t('statusReview')}</td></tr>`).join('')}</tbody></table>
    <table><tbody>
      <tr><td>${t('totalCommission')}</td><td>${totals ? fmt(totals.totalCommission) : ''}</td></tr>
      <tr><td>${t('userShare')}</td><td>${totals ? fmt(totals.userShare) : ''}</td></tr>
      <tr><td><b>${t('finalNet')}</b></td><td><b>${totals ? fmt(totals.finalNet) : ''}</b></td></tr>
    </tbody></table>
    <div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div>
  </div>`;
}
function renderPrintables() {
  populateWeekSelect(document.getElementById('printables-week-select'), false);
  const sel = document.getElementById('printables-week-select');
  if (state.currentWeekId) sel.value = state.currentWeekId;
}
function printSheet(html) {
  const container = document.getElementById('print-frame-container');
  container.innerHTML = html;
  window.print();
}
document.addEventListener('click', e => {
  const card = e.target.closest('[data-print]');
  if (!card) return;
  const weekId = document.getElementById('printables-week-select').value || state.currentWeekId;
  const w = weekId ? getWeek(weekId) : null;
  const kind = card.dataset.print;
  const builders = { collecte: buildCollecteSheet, invoice: buildInvoiceSheet, advance: buildAdvanceSheet, expense: buildExpenseSheet, verification: buildVerificationSheet, summary: buildSummarySheet };
  printSheet(builders[kind](w));
});

/* ---------- Reports ---------- */
let reportMode = 'weekly';
function renderReportControls() {
  const controls = document.getElementById('report-controls');
  controls.innerHTML = '';
  if (reportMode === 'weekly') {
    const sel = document.createElement('select'); sel.className = 'select'; sel.id = 'report-week-select';
    controls.appendChild(sel);
    populateWeekSelect(sel, false);
    if (state.currentWeekId) sel.value = state.currentWeekId;
    sel.onchange = renderReportOutput;
  } else if (reportMode === 'monthly') {
    const input = document.createElement('input'); input.type = 'month'; input.className = 'input'; input.id = 'report-month-input';
    input.value = todayISO().slice(0, 7);
    controls.appendChild(input);
    input.onchange = renderReportOutput;
  } else if (reportMode === 'compare') {
    const a = document.createElement('select'); a.className = 'select'; a.id = 'report-compare-a';
    const b = document.createElement('select'); b.className = 'select'; b.id = 'report-compare-b';
    controls.appendChild(a); controls.appendChild(b);
    populateWeekSelect(a, true); populateWeekSelect(b, true);
    a.onchange = renderReportOutput; b.onchange = renderReportOutput;
  }
  renderReportOutput();
}
function aggregateTotals(weekIds) {
  const totals = { totalPrincipal: 0, totalPaid: 0, totalCommission: 0, totalTva: 0, userShare: 0, agencyShare: 0, totalExpenses: 0, totalAdvances: 0, finalNet: 0, count: 0 };
  weekIds.forEach(id => {
    const w = computeWeekTotals(id);
    Object.keys(totals).forEach(k => totals[k] += w[k]);
  });
  return totals;
}
function reportRowsHtml(totals) {
  return `<table><tbody>
    <tr><td>${t('montantPrincipal')}</td><td>${fmt(totals.totalPrincipal)}</td></tr>
    <tr><td>${t('montantPaid')}</td><td>${fmt(totals.totalPaid)}</td></tr>
    <tr><td>${t('totalCommission')}</td><td>${fmt(totals.totalCommission)}</td></tr>
    <tr><td>${t('userShare')}</td><td>${fmt(totals.userShare)}</td></tr>
    <tr><td>${t('agencyShare')}</td><td>${fmt(totals.agencyShare)}</td></tr>
    <tr><td>${t('expensesLabel')}</td><td>${fmt(totals.totalExpenses)}</td></tr>
    <tr><td>${t('advancesLabel')}</td><td>${fmt(totals.totalAdvances)}</td></tr>
    <tr><td><b>${t('finalNet')}</b></td><td><b>${fmt(totals.finalNet)}</b></td></tr>
  </tbody></table>`;
}
function renderReportOutput() {
  const out = document.getElementById('report-output');
  let weekIds = [];
  let periodLabel = '';
  if (reportMode === 'weekly') {
    const id = document.getElementById('report-week-select') ? document.getElementById('report-week-select').value : '';
    if (!id) { out.innerHTML = `<div class="empty-state">${t('noWeeks')}</div>`; return; }
    weekIds = [id];
    periodLabel = weekLabel(getWeek(id));
  } else if (reportMode === 'monthly') {
    const month = document.getElementById('report-month-input').value;
    weekIds = state.weeks.filter(w => (w.start || '').startsWith(month) || (w.end || '').startsWith(month)).map(w => w.id);
    periodLabel = month;
  } else if (reportMode === 'global') {
    weekIds = state.weeks.map(w => w.id);
    periodLabel = t('reportGlobal');
  } else if (reportMode === 'compare') {
    const idA = document.getElementById('report-compare-a').value;
    const idB = document.getElementById('report-compare-b').value;
    if (!idA || !idB) { out.innerHTML = ''; return; }
    const ta = computeWeekTotals(idA), tb = computeWeekTotals(idB);
    out.innerHTML = `<div class="table-wrap"><table class="table"><thead><tr><th></th><th>${weekLabel(getWeek(idA))}</th><th>${weekLabel(getWeek(idB))}</th><th>${t('difference')}</th></tr></thead><tbody>
      ${['totalCommission', 'userShare', 'agencyShare', 'expensesLabel', 'advancesLabel', 'finalNet'].map(k => {
        const keyMap = { totalCommission: 'totalCommission', userShare: 'userShare', agencyShare: 'agencyShare', expensesLabel: 'totalExpenses', advancesLabel: 'totalAdvances', finalNet: 'finalNet' };
        const va = ta[keyMap[k]], vb = tb[keyMap[k]];
        return `<tr><td>${t(k)}</td><td>${fmt(va)}</td><td>${fmt(vb)}</td><td>${fmt(vb - va)}</td></tr>`;
      }).join('')}
    </tbody></table></div>`;
    return;
  }
  const totals = aggregateTotals(weekIds);
  out.innerHTML = `<div class="ps-meta" style="margin-bottom:10px"><div>${t('agencyLabel')}: ${state.settings.agencyName || ''}</div><div>${t('period')}: ${periodLabel}</div></div>${reportRowsHtml(totals)}<p style="font-size:12px;color:var(--gray-600);margin-top:8px">${totals.totalTva > 0 ? t('tvaNoteReport') + ' (' + fmt(totals.totalTva) + ')' : ''}</p>`;
  out.dataset.weekIds = JSON.stringify(weekIds);
  out.dataset.period = periodLabel;
}
function exportReportCsv() {
  const out = document.getElementById('report-output');
  const weekIds = JSON.parse(out.dataset.weekIds || '[]');
  const totals = aggregateTotals(weekIds);
  const rows = [
    [t('agencyLabel'), state.settings.agencyName || ''],
    [t('period'), out.dataset.period || ''],
    [t('montantPrincipal'), totals.totalPrincipal],
    [t('montantPaid'), totals.totalPaid],
    [t('totalCommission'), totals.totalCommission],
    [t('userShare'), totals.userShare],
    [t('agencyShare'), totals.agencyShare],
    [t('expensesLabel'), totals.totalExpenses],
    [t('advancesLabel'), totals.totalAdvances],
    [t('finalNet'), totals.finalNet]
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rapport-talborjt.csv';
  a.click();
}
function printReport() {
  const out = document.getElementById('report-output');
  printSheet(`<div class="print-sheet">${psHead()}<div class="ps-title">${t('reports')}<small>${out.dataset.period || ''}</small></div>${out.innerHTML}<div class="ps-foot">${state.settings.agencyName || ''} — ${t('printDate')}: ${todayISO()}</div></div>`);
}

/* ---------- Settings ---------- */
function renderSettings() {
  document.getElementById('s-agency-name').value = state.settings.agencyName || '';
  document.getElementById('s-user-percent').value = state.settings.userPercent;
  document.getElementById('s-currency').value = state.settings.currency;
  document.getElementById('s-default-lang').value = state.settings.lang;
  document.getElementById('s-tva-toggle').checked = !!state.settings.tvaDeductionEnabled;
}
function handleSettingsSubmit(e) {
  e.preventDefault();
  state.settings.agencyName = document.getElementById('s-agency-name').value.trim() || t('appName');
  state.settings.userPercent = num(document.getElementById('s-user-percent').value) || 30;
  state.settings.currency = document.getElementById('s-currency').value.trim() || 'MAD';
  state.settings.lang = document.getElementById('s-default-lang').value;
  state.settings.tvaDeductionEnabled = document.getElementById('s-tva-toggle').checked;
  saveState();
  toast(t('settingsSaved'));
  applyLang();
  renderCurrentView();
}
async function handlePasswordChange() {
  const cur = document.getElementById('s-current-password').value;
  const next = document.getElementById('s-new-password').value;
  const errEl = document.getElementById('s-password-error');
  errEl.hidden = true;
  const hash = await sha256(state.settings.passwordSalt + cur);
  if (hash !== state.settings.passwordHash) { errEl.textContent = t('currentPasswordWrong'); errEl.hidden = false; return; }
  if (next.length < 4) { errEl.textContent = t('passwordTooShort'); errEl.hidden = false; return; }
  const salt = randomSalt();
  state.settings.passwordSalt = salt;
  state.settings.passwordHash = await sha256(salt + next);
  saveState();
  document.getElementById('s-current-password').value = '';
  document.getElementById('s-new-password').value = '';
  toast(t('passwordChanged'));
}
function backupExport() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `talborjt-backup-${todayISO()}.json`;
  a.click();
}
async function backupImport(file) {
  if (!(await confirmDialog(t('restoreWarning')))) return;
  const text = await file.text();
  try {
    const parsed = JSON.parse(text);
    state = migrateState(parsed);
    saveState();
    ui.lang = state.settings.lang || 'ar';
    applyLang();
    goTo('dashboard');
  } catch (e) { alert(t('wrongPassword')); }
}
async function deleteAllData() {
  if (!(await confirmDialog(t('confirmDeleteAll')))) return;
  const keepAuth = { passwordHash: state.settings.passwordHash, passwordSalt: state.settings.passwordSalt };
  state = { settings: { agencyName: 'وكالتي Talborjt', userPercent: 30, currency: 'MAD', lang: ui.lang, tvaDeductionEnabled: false, ...keepAuth }, weeks: [], transactions: [], currentWeekId: null };
  saveState();
  goTo('dashboard');
}

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#0b1f3a;color:#fff;padding:10px 18px;border-radius:20px;font-size:13px;z-index:100;box-shadow:0 4px 14px rgba(0,0,0,0.2)';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.opacity = '0'; }, 2200);
}

/* ---------- Init ---------- */
function init() {
  applyLang();
  setupLoginScreen();

  document.getElementById('login-form').addEventListener('submit', handleLoginSubmit);
  document.getElementById('login-lang-toggle').addEventListener('click', () => { toggleLang(); setupLoginScreen(); });
  document.getElementById('lang-toggle').addEventListener('click', toggleLang);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('nav-toggle').addEventListener('click', openNav);
  document.getElementById('nav-backdrop').addEventListener('click', closeNav);
  document.querySelectorAll('.nav-item').forEach(b => b.addEventListener('click', () => goTo(b.dataset.nav)));

  document.querySelectorAll('#entry-type-tabs .type-tab').forEach(b => b.addEventListener('click', () => setEntryType(b.dataset.type)));
  document.getElementById('f-tva-toggle').addEventListener('change', e => { document.getElementById('f-tva-wrap').hidden = !e.target.checked; });
  document.getElementById('entry-form').addEventListener('submit', handleEntrySubmit);
  resetEntryForm();

  document.getElementById('review-search').addEventListener('input', renderReview);
  document.getElementById('review-filter-type').addEventListener('change', renderReview);
  document.getElementById('review-filter-status').addEventListener('change', renderReview);
  document.getElementById('review-sort').addEventListener('change', renderReview);

  document.getElementById('week-create-btn').addEventListener('click', () => openWeekModal(null));
  document.getElementById('week-modal-cancel').addEventListener('click', closeWeekModal);
  document.getElementById('week-modal-save').addEventListener('click', saveWeekModal);
  document.getElementById('compare-btn').addEventListener('click', renderCompare);

  document.getElementById('report-tabs').addEventListener('click', e => {
    const b = e.target.closest('[data-report]');
    if (!b) return;
    document.querySelectorAll('#report-tabs .type-tab').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    reportMode = b.dataset.report;
    renderReportControls();
  });
  document.getElementById('report-csv').addEventListener('click', exportReportCsv);
  document.getElementById('report-print').addEventListener('click', printReport);

  document.getElementById('settings-form').addEventListener('submit', handleSettingsSubmit);
  document.getElementById('s-password-btn').addEventListener('click', handlePasswordChange);
  document.getElementById('s-backup-btn').addEventListener('click', backupExport);
  document.getElementById('s-restore-input').addEventListener('change', e => { if (e.target.files[0]) backupImport(e.target.files[0]); e.target.value = ''; });
  document.getElementById('s-delete-all-btn').addEventListener('click', deleteAllData);

  document.getElementById('confirm-modal-cancel').addEventListener('click', () => {});

  if (sessionStorage.getItem(SESSION_KEY) === '1' && state.settings.passwordHash) {
    showApp();
  }

  renderReportControls();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
