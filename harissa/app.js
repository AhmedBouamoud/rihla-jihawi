/* =====================================================================
   مساعد الحراسة العامة — مؤسسة الحنان
   نسخة ثنائية اللغة (عربي / فرنسي). النصوص مجمّعة في STRINGS بالأسفل.
   القيم المخزَّنة (الأقسام، أنواع الحالات، الإجراءات) تبقى عربية ثابتة
   في localStorage لتفادي أي هجرة بيانات؛ فقط التسميات المعروضة تُترجم.
   لا توجد أي قاعدة بيانات خارجية: كل البيانات محفوظة في localStorage.
   ===================================================================== */
(function(){
"use strict";

/* ============================= مفاتيح التخزين ============================= */
const K_AUTH        = 'hg_auth_v1';
const K_PWHASH       = 'hg_pwhash_v1';
const K_PINHASH      = 'hg_pinhash_v1';
const SS_UNLOCKED    = 'hg_session_unlocked';
const SS_PIN_LOCKED  = 'hg_pin_locked';
const K_SETTINGS     = 'hg_settings_v1';
const K_STUDENTS     = 'hg_students_v1';
const K_TEACHERS     = 'hg_teachers_v1';
const K_ATTENDANCE   = 'hg_attendance_v1';
const K_BEHAVIOR     = 'hg_behavior_v1';
const K_MSGLOG       = 'hg_msglog_v1';
const K_TEMPLATES    = 'hg_templates_v1';
const K_REPORTS      = 'hg_reports_v1';
const K_SEEDED       = 'hg_seeded_v1';
const K_LANG         = 'hg_lang_v1';

/* ============================= القاموس ثنائي اللغة ============================= */
const STRINGS = {
ar: {
  app:{ title:'مساعد الحراسة العامة', tagline:'نظام ذكي لتتبع الحياة المدرسية اليومية — مؤسسة الحنان', footer:'مساعد الحراسة العامة — مؤسسة الحنان — جميع البيانات محفوظة محلياً في متصفحك فقط (لا يوجد اتصال بخادم خارجي).' },
  auth:{
    setupTag:'إعداد الحماية لأول مرة', yourName:'اسمك', namePh:'مثال: عبد الرحيم',
    newPassword:'كلمة مرور جديدة', pwPh:'4 أحرف على الأقل', confirmPassword:'تأكيد كلمة المرور',
    newPin:'رقم سري قصير (4 أرقام) للقفل السريع', pinPh:'مثال: 1234', confirmPin:'تأكيد الرقم السري',
    setupSave:'🔐 حفظ وتفعيل الحماية',
    setupNote:'🔒 هذا القفل يحمي من الاستعمال العرضي على هذا الجهاز. البيانات نفسها محفوظة في متصفحك بصيغة عادية (غير مشفّرة)، فلا تتركي الجهاز مفتوحاً لمن لا تثقين به.',
    loginTag:'أدخل كلمة المرور للمتابعة', password:'كلمة المرور', loginBtn:'🔓 دخول',
    forgotNote:'نسيت كلمة المرور؟ لا يمكن استرجاعها لأنها غير محفوظة على أي خادم. إعادة الضبط تتطلب مسح بيانات المتصفح لهذا الموقع من إعدادات المتصفح، ثم إعادة الاستيراد من نسخة احتياطية مصدَّرة إن وُجدت (من ⚙️ الإعدادات).',
    lockedTitle:'التطبيق مقفل', pinSub:'أدخل الرقم السري لمتابعة العمل', pin:'الرقم السري', pinBtn:'🔓 فتح',
    errPwShort:'كلمة المرور يجب أن تكون 4 أحرف على الأقل', errPwMismatch:'كلمتا المرور غير متطابقتين',
    errPinFormat:'الرقم السري يجب أن يكون من 4 إلى 6 أرقام', errPinMismatch:'الرقمان السريان غير متطابقين',
    errPwWrong:'كلمة المرور غير صحيحة', errPinWrong:'الرقم السري غير صحيح',
    confirmLogout:'هل تريد تسجيل الخروج؟ (البيانات لن تُحذف، وستحتاج كلمة المرور فقط للعودة)',
    defaultName:'الحارس(ة) العام(ة)', defaultRole:'حارس عام'
  },
  header:{ searchPh:'🔍 ابحث عن تلميذ بالاسم أو القسم...', lockTitle:'قفل سريع بالرقم السري', logoutTitle:'تسجيل الخروج', noResults:'لا توجد نتائج' },
  nav:{ dashboard:'لوحة اليوم', students:'سجل التلاميذ', teachers:'الأساتذة', attendance:'الغياب والتأخر', behavior:'السلوك والتدخلات', messages:'التواصل مع الآباء', reports:'التقارير والقوالب', dailylog:'سجل اليوم', stats:'الإحصائيات', settings:'الإعدادات' },
  dash:{
    qaAttendance:'تسجيل غياب أو تأخر', qaBehavior:'إضافة ملاحظة سلوكية', qaSummon:'استدعاء ولي أمر',
    qaIntervention:'تسجيل تدخل', qaDailyReport:'توليد تقرير اليوم', recentToday:'آخر الأحداث اليوم',
    noEventsToday:'لا توجد أحداث مسجلة اليوم بعد.',
    cardAbsentToday:'الغائبون اليوم', cardTardyToday:'المتأخرون اليوم', cardBehaviorToday:'الحالات السلوكية اليوم',
    cardPendingCases:'حالات تنتظر المتابعة', cardMsgsToday:'اتصالات اليوم بالآباء',
    tagAbsence:'غياب', tagTardiness:'تأخر', tagBehavior:'سلوك', tagContact:'اتصال'
  },
  students:{
    title:'سجل التلاميذ', add:'إضافة تلميذ', searchPh:'ابحث بالاسم أو القسم...', thName:'الاسم الكامل', thSection:'القسم',
    thStatus:'الحالة', thPhone:'هاتف ولي الأمر', backToList:'↩ رجوع لسجل التلاميذ', section:'القسم:', status:'الحالة:',
    parentPhone:'هاتف ولي الأمر:', parentPhone2:'هاتف ثانٍ:', notes:'ملاحظات:', tabMessages:'الاتصالات', genReport:'توليد تقرير هذا التلميذ',
    noneMatching:'لا يوجد تلاميذ مطابقون.', btnOpen:'فتح', btnEdit:'تعديل', btnDelete:'حذف',
    confirmDelete:'هل تريد حذف التلميذ(ة) "{n}"؟ سيتم حذف كل السجلات المرتبطة به (الغياب، السلوك، الاتصالات).',
    toastDeleted:'تم حذف التلميذ وسجلاته', editTitle:'✏️ تعديل بيانات تلميذ', addTitle:'➕ إضافة تلميذ جديد',
    labelFullName:'الاسم الكامل', labelSection:'القسم', labelPhone1:'هاتف ولي الأمر', labelPhone2:'رقم ثانٍ (اختياري)',
    labelNotes:'ملاحظات خاصة', labelStatus:'الحالة', toastNeedNameSection:'يرجى إدخال الاسم والقسم', toastSaved:'تم الحفظ',
    toastNotFound:'تعذر العثور على التلميذ', noAttendanceRecords:'لا توجد سجلات غياب أو تأخر لهذا التلميذ.',
    noBehaviorRecords:'لا توجد حالات سلوكية لهذا التلميذ.', noMessages:'لا توجد اتصالات مسجلة لهذا التلميذ.',
    csvName:'الاسم الكامل', csvSection:'القسم', csvPhone1:'هاتف ولي الأمر', csvPhone2:'هاتف ثانٍ', csvStatus:'الحالة', csvNotes:'ملاحظات',
    toastNoneToExport:'لا يوجد تلاميذ لتصديرهم', toastExported:'تم تصدير اللائحة ({n} تلميذ)', filenameBase:'لائحة-التلاميذ-',
    importTitle:'⬆️ استيراد لائحة تلاميذ', importHint:'الصق لائحة من Excel أو اكتبها يدوياً — سطر لكل تلميذ(ة)، بهذا الترتيب:',
    importHintBold:'الاسم الكامل، القسم، هاتف ولي الأمر، هاتف ثانٍ (اختياري)، ملاحظات (اختياري)',
    importPh:'مثال:\nأحمد الإدريسي، الأولى إعدادي 1، 0612345678', importFileLabel:'أو اختر ملف CSV',
    toastNoContent:'لا يوجد محتوى للاستيراد', toastImported:'تم استيراد {added} تلميذ(ة)', toastDupSkipped:' — تم تجاهل {n} مكرر', toastInvalidSkipped:' — {n} سطر غير صالح'
  },
  common:{
    importList:'استيراد لائحة', exportList:'تصدير اللائحة', allSections:'كل الأقسام', allStatuses:'كل الحالات',
    thActions:'إجراءات', editData:'تعديل البيانات', section:'القسم', student:'التلميذ(ة)', date:'التاريخ', time:'الساعة',
    reason:'السبب', optional:'اختياري', extraNote:'ملاحظة إضافية', save:'حفظ', prepMessage:'إعداد رسالة لولي الأمر',
    searchPh:'ابحث...', back:'↩ رجوع', printPdf:'طباعة / PDF', add:'إضافة', cancel:'إلغاء'
  },
  status:{ normal:'عادي', tracking:'يحتاج تتبع', urgent:'حالة مستعجلة' },
  teachers:{
    title:'لائحة الأساتذة', add:'إضافة أستاذ(ة)', searchPh:'ابحث بالاسم أو المادة أو القسم...', thSubject:'المادة',
    thSections:'الأقسام', thPhone:'الهاتف', noneMatching:'لا يوجد أساتذة مطابقون.', confirmDelete:'هل تريد حذف الأستاذ(ة) "{n}"؟',
    toastDeleted:'تم الحذف', editTitle:'✏️ تعديل بيانات أستاذ(ة)', addTitle:'➕ إضافة أستاذ(ة) جديد(ة)',
    labelFullName:'الاسم الكامل', labelSubject:'المادة', labelSections:'الأقسام (مفصولة بفاصلة)', sectionsPh:'مثال: الأولى إعدادي 1، الثانية إعدادي 2',
    labelPhone:'الهاتف', labelNotes:'ملاحظات', toastNeedName:'يرجى إدخال الاسم الكامل', toastSaved:'تم الحفظ',
    csvName:'الاسم الكامل', csvSubject:'المادة', csvSections:'الأقسام', csvPhone:'الهاتف', csvNotes:'ملاحظات',
    toastNoneToExport:'لا يوجد أساتذة لتصديرهم', toastExported:'تم تصدير اللائحة ({n} أستاذ/ة)', filenameBase:'لائحة-الأساتذة-',
    importTitle:'⬆️ استيراد لائحة أساتذة', importHint:'الصق لائحة من Excel أو اكتبها يدوياً — سطر لكل أستاذ(ة)، بهذا الترتيب:',
    importHintBold:'الاسم الكامل، المادة، الأقسام، الهاتف (اختياري)، ملاحظات (اختياري)',
    importPh:'مثال:\nذ. سفيان الحمداوي، الرياضيات، الأولى إعدادي 1', importFileLabel:'أو اختر ملف CSV',
    toastNoContent:'لا يوجد محتوى للاستيراد', toastImported:'تم استيراد {added} أستاذ(ة)', toastDupSkipped:' — تم تجاهل {n} مكرر', toastInvalidSkipped:' — {n} سطر غير صالح'
  },
  attendance:{
    newEntry:'تسجيل حالة جديدة', caseType:'نوع الحالة', absence:'غياب', tardiness:'تأخر', justification:'الوضعية',
    addToDaily:'إضافة إلى تقرير اليوم', recentEntries:'آخر التسجيلات', thType:'النوع', noneYet:'لا توجد تسجيلات بعد.',
    confirmDelete:'حذف هذا التسجيل؟', toastDeleted:'تم الحذف', toastNeedStudent:'يرجى اختيار القسم والتلميذ(ة)',
    alertRepeat:'⚠️ تنبيه: هذه هي الحالة رقم {n} من نوع "{type}" لهذا التلميذ. يُنصح بمتابعة الملف أو التواصل مع ولي الأمر.',
    toastSaved:'تم الحفظ', toastAddedToDaily:'تمت الإضافة — سيظهر تلقائياً في تقرير اليوم'
  },
  justif:{ pending:'ينتظر التبرير', justified:'مبرر', unjustified:'غير مبرر' },
  behavior:{
    severity:'درجة الخطورة', description:'وصف الحالة', action:'الإجراء المتخذ', followUp:'تاريخ المتابعة',
    fileStatus:'حالة الملف', registered:'الحالات المسجلة', allFiles:'كل الملفات', openOnly:'مفتوحة فقط', closedOnly:'مغلقة فقط',
    file:'الملف', noneYet:'لا توجد حالات مسجلة بعد.', btnCloseFile:'إغلاق الملف', btnReopenFile:'إعادة الفتح',
    confirmDelete:'حذف هذه الحالة؟', toastDeleted:'تم الحذف', toastFileUpdated:'تم تحديث حالة الملف',
    toastNeedStudent:'يرجى اختيار القسم والتلميذ(ة)', toastNeedDescription:'يرجى كتابة وصف الحالة', toastSaved:'تم الحفظ'
  },
  severity:{ light:'بسيطة', medium:'متوسطة', urgent:'مستعجلة' },
  file:{ open:'مفتوح', closed:'مغلق' },
  messages:{
    template:'القالب', previewLabel:'نص الرسالة (قابل للتعديل قبل الإرسال)', aiImprove:'تحسين الصياغة بالذكاء الاصطناعي',
    openWhatsapp:'فتح في واتساب', copyText:'نسخ النص', recentLog:'سجل الاتصالات الأخيرة', noneYet:'لا توجد اتصالات مسجلة بعد.',
    toastNeedStudent:'يرجى اختيار التلميذ(ة)', toastNoPhone:'لا يوجد رقم هاتف مسجل لولي أمر هذا التلميذ',
    toastCopied:'تم نسخ النص', toastCopyFailed:'تعذر النسخ التلقائي — انسخ النص يدوياً',
    aiImproving:'⏳ جارٍ التحسين...', toastNoDraft:'لا يوجد نص لتحسينه', toastAiError:'تعذر الاتصال بخدمة الذكاء الاصطناعي',
    toastAiOk:'تم تحسين الصياغة — راجع النص قبل الإرسال', toastAiNetError:'تعذر الاتصال بخدمة الذكاء الاصطناعي — تحقق من الاتصال بالإنترنت'
  },
  reports:{
    smartTitle:'⚡ تقارير ذكية (تُولَّد تلقائياً من بياناتك)', smartDaily:'تقرير اليوم', smartStudent:'تقرير تلميذ',
    smartSection:'تقرير قسم', smartMonthly:'تقرير غياب شهري', smartRepeated:'تقرير تأخر متكرر',
    customTitle:'📄 نماذج قابلة للتعبئة والتخصيص', newTemplate:'قالب جديد', searchPh:'ابحث عن نموذج...', allCategories:'كل الفئات',
    clearFields:'تفريغ الحقول', saveToLog:'حفظ في السجل', formData:'📝 بيانات النموذج', extraFields:'➕ حقول إضافية لهذا التقرير',
    addExtraField:'إضافة حقل إضافي', printPreview:'🖨️ معاينة الطباعة', saveTemplate:'حفظ القالب', templateName:'اسم النموذج',
    templateNamePh:'مثال: تقرير غياب مخصص', category:'الفئة', categoryPh:'مثال: الغياب والتأخر', templateFields:'حقول النموذج', addField:'إضافة حقل',
    noneMatching:'لا توجد نماذج مطابقة.', custom:'مخصص', fieldsCount:'{n} حقل/حقول', btnOpenForm:'📝 فتح النموذج',
    btnEditTpl:'✏️ تعديل', btnDeleteTpl:'🗑️ حذف', btnDuplicateTpl:'📄 تكرار وتعديل', confirmDeleteTpl:'هل تريد حذف القالب "{n}"؟',
    toastTplDeleted:'تم حذف القالب', selectPlaceholder:'— اختر —', btnAddRow:'➕ إضافة سطر', btnRemoveRow:'حذف',
    noExtraFields:'لا توجد حقول إضافية.', promptExtraLabel:'عنوان الحقل الإضافي:', promptExtraType:'نوع الحقل: 1=نص قصير 2=نص طويل 3=رقم 4=تاريخ',
    fillTitleDefault:'تعبئة نموذج', confirmClearForm:'تفريغ كل الحقول؟', toastFillRequired:'يرجى تعبئة: {list}', toastReportSaved:'تم حفظ التقرير في السجل',
    duplicateSuffix:' (نسخة معدّلة)', builderEditTitle:'تعديل القالب', builderNewTitle:'قالب جديد',
    fieldLabelPh:'عنوان الحقل', optionsPh:'خيارات القائمة (كل خيار في سطر)', columnsPh:'أعمدة الجدول (كل عمود في سطر)', requiredCheck:'حقل إلزامي',
    toastNeedField:'أضف حقلاً واحداً على الأقل', toastFieldNoLabel:'يوجد حقل بدون عنوان', toastNeedTplName:'يرجى إدخال اسم النموذج', toastTplSaved:'تم حفظ القالب',
    pickerCancel:'إلغاء', pickerGenerate:'توليد التقرير', pickStudent:'اختر التلميذ(ة)', pickSection:'اختر القسم', pickSectionAll:'اختر القسم (أو كل الأقسام)',
    allSectionsOpt:'كل الأقسام', dailyReportTitle:'تقرير اليوم — {d}', studentReportTitle:'تقرير تلميذ — {n}', sectionReportTitle:'تقرير قسم — {s}',
    monthlyReportTitle:'تقرير غياب شهري — {m}', repeatedTardinessTitle:'تقرير التأخر المتكرر',
    summaryLabel:'ملخص عددي', summaryText:'الغياب: {a} — التأخر: {t} — الحالات السلوكية: {b} — الاتصالات: {m}',
    absenceLabel:'الغياب', tardinessLabel:'التأخر', behaviorLabel:'السلوك والتدخلات', contactsLabel:'الاتصالات مع أولياء الأمور',
    studentInfoLabel:'بيانات التلميذ(ة)', studentInfoText:'الاسم: {n} — القسم: {s} — الحالة: {st} — هاتف ولي الأمر: {p}',
    attendanceHistoryLabel:'سجل الغياب والتأخر', behaviorHistoryLabel:'سجل السلوك والتدخلات', contactsHistoryLabel:'سجل الاتصالات',
    sectionLabel:'القسم', sectionText:'{s} — عدد التلاميذ: {n}', studentsListLabel:'لائحة التلاميذ',
    monthLabel:'الشهر', monthText:'{m}{s}', monthSectionSuffix:' — القسم: {s}', monthAllSuffix:' — كل الأقسام',
    monthlyStudentsLabel:'التلاميذ المسجَّل لهم غياب أو تأخر هذا الشهر', repeatedLabel:'التلاميذ الذين تجاوزوا 3 حالات تأخر',
    noData:'لا توجد بيانات لعرضها.',
    colStudent:'التلميذ(ة)', colSection:'القسم', colStatus:'الوضعية', colTime:'الساعة', colType:'النوع', colSeverity:'الخطورة',
    colAction:'الإجراء', colTemplate:'القالب', colAbsCount:'عدد الغياب', colTardyCount:'عدد التأخر', colBehCount:'عدد الحالات السلوكية',
    colOverallStatus:'الحالة', colTardyTotal:'عدد مرات التأخر', colAbsTotal:'عدد أيام الغياب', colFullName:'الاسم الكامل'
  },
  dailylog:{ messages:'الاتصالات', openFiles:'الملفات المفتوحة (كل الفترات)', noAttendance:'لا توجد حالات غياب أو تأخر اليوم.',
    noBehavior:'لا توجد حالات سلوكية اليوم.', noMessages:'لا توجد اتصالات اليوم.', noOpenFiles:'لا توجد ملفات مفتوحة حالياً.', openTag:'مفتوح' },
  stats:{ absenceBySection:'الغياب حسب القسم', tardyBySection:'التأخر حسب القسم', topTardy:'الأكثر تكراراً في التأخر', topAbsence:'الأكثر تكراراً في الغياب',
    totalStudents:'عدد التلاميذ', totalAbs:'إجمالي الغياب', totalTardy:'إجمالي التأخر', openCases:'حالات مفتوحة', closedCases:'حالات مغلقة', totalMsgs:'اتصالات بأولياء الأمور',
    noData:'لا توجد بيانات كافية بعد.' },
  settings:{
    institutionInfo:'معلومات المؤسسة', institutionName:'اسم المؤسسة', niaba:'النيابة الإقليمية', academy:'الأكاديمية الجهوية',
    year:'السنة الدراسية', supervisor:'اسم الحارس(ة) العام(ة)', saveInfo:'حفظ المعلومات', sections:'الأقسام', newSectionPh:'اسم قسم جديد',
    caseTypes:'أنواع الحالات السلوكية', newCaseTypePh:'نوع حالة جديد', messageTemplates:'قوالب رسائل أولياء الأمور',
    security:'🔐 الأمان', changePassword:'تغيير كلمة المرور', changePin:'تغيير الرقم السري',
    securityHint:'استعمل زر 🔒 في الرأس لقفل التطبيق سريعاً بالرقم السري، وزر 🚪 لتسجيل الخروج الكامل (يتطلب كلمة المرور عند الدخول التالي).',
    dataTitle:'البيانات', exportBackup:'تصدير نسخة احتياطية', importBackup:'استيراد نسخة احتياطية', wipeData:'مسح جميع البيانات',
    exportHint:'التصدير يشمل: التلاميذ، الأساتذة، الغياب والتأخر، السلوك، سجل الاتصالات، القوالب المخصصة، التقارير المحفوظة، والإعدادات.',
    toastRemoved:'تم الحذف', toastAdded:'تمت الإضافة',
    msgVarsHint:'المتغيرات المتاحة: {name} الاسم، {section} القسم، {date} التاريخ، {institution} اسم المؤسسة، {caseType} نوع الحالة.',
    btnSaveMsgTemplates:'💾 حفظ قوالب الرسائل', toastMsgTemplatesSaved:'تم حفظ قوالب الرسائل', toastInfoSaved:'تم حفظ معلومات المؤسسة',
    scChangePwTitle:'🔑 تغيير كلمة المرور', scChangePinTitle:'🔢 تغيير الرقم السري', scCurrentLabel:'كلمة المرور الحالية',
    scNewPwLabel:'كلمة المرور الجديدة', scConfirmPwLabel:'تأكيد كلمة المرور الجديدة', scNewPinLabel:'الرقم السري الجديد', scConfirmPinLabel:'تأكيد الرقم السري الجديد',
    scErrCurrentWrong:'كلمة المرور الحالية غير صحيحة', scErrMismatch:'القيمتان غير متطابقتين',
    scPwSuccessMsg:'تم تغيير كلمة المرور', scPinSuccessMsg:'تم تغيير الرقم السري',
    exportFilenameBase:'نسخة-احتياطية-حراسة-الحنان-', toastImportedOk:'تم الاستيراد بنجاح', toastImportInvalid:'ملف غير صالح',
    wipePrompt:'لتأكيد مسح جميع البيانات نهائياً، اكتب "حذف نهائي" بالضبط:', wipeConfirmPhrase:'حذف نهائي',
    toastWipeMismatch:'لم يتم المسح — النص غير مطابق', toastWiped:'تم مسح جميع البيانات — سيُعاد تحميل الصفحة'
  },
  doc:{ schoolYear:'السنة الدراسية:', editDate:'تاريخ التحرير:', supervisorCap:'الحارس(ة) العام(ة)', adminCap:'الإدارة', yes:'✅ نعم', no:'❌ لا', extraInfo:'معلومات إضافية' },
  fieldtype:{ text:'نص قصير', textarea:'نص طويل', date:'تاريخ', time:'وقت', number:'رقم', select:'قائمة اختيار', checkbox:'خانة اختيار', table:'جدول ديناميكي' }
},
fr: {
  app:{ title:"Assistant de Surveillance Générale", tagline:"Système intelligent de suivi de la vie scolaire quotidienne — École Al Hanane", footer:"Assistant de Surveillance Générale — École Al Hanane — toutes les données sont conservées localement dans votre navigateur (aucune connexion à un serveur externe)." },
  auth:{
    setupTag:"Configuration initiale de la protection", yourName:"Votre nom", namePh:"Exemple : Abderrahim",
    newPassword:"Nouveau mot de passe", pwPh:"4 caractères minimum", confirmPassword:"Confirmer le mot de passe",
    newPin:"Code court (4 chiffres) pour le verrouillage rapide", pinPh:"Exemple : 1234", confirmPin:"Confirmer le code",
    setupSave:"🔐 Enregistrer et activer la protection",
    setupNote:"🔒 Ce verrouillage protège uniquement contre une utilisation accidentelle sur cet appareil. Les données elles-mêmes restent stockées en clair (non chiffrées) dans votre navigateur, ne laissez donc pas l'appareil accessible à des personnes non autorisées.",
    loginTag:"Entrez le mot de passe pour continuer", password:"Mot de passe", loginBtn:"🔓 Connexion",
    forgotNote:"Mot de passe oublié ? Il ne peut pas être récupéré car il n'est stocké sur aucun serveur. La réinitialisation nécessite d'effacer les données du navigateur pour ce site, puis de réimporter une sauvegarde exportée si elle existe (depuis ⚙️ Paramètres).",
    lockedTitle:"Application verrouillée", pinSub:"Entrez le code pour continuer", pin:"Code secret", pinBtn:"🔓 Déverrouiller",
    errPwShort:"Le mot de passe doit contenir au moins 4 caractères", errPwMismatch:"Les deux mots de passe ne correspondent pas",
    errPinFormat:"Le code doit comporter de 4 à 6 chiffres", errPinMismatch:"Les deux codes ne correspondent pas",
    errPwWrong:"Mot de passe incorrect", errPinWrong:"Code incorrect",
    confirmLogout:"Voulez-vous vous déconnecter ? (Les données ne seront pas supprimées, seul le mot de passe sera requis pour revenir)",
    defaultName:"Le/La Surveillant(e) Général(e)", defaultRole:"Surveillant général"
  },
  header:{ searchPh:"🔍 Rechercher un élève par nom ou classe...", lockTitle:"Verrouillage rapide par code", logoutTitle:"Déconnexion", noResults:"Aucun résultat" },
  nav:{ dashboard:"Tableau du jour", students:"Registre des élèves", teachers:"Enseignants", attendance:"Absences et retards", behavior:"Comportement et interventions", messages:"Communication avec les parents", reports:"Rapports et modèles", dailylog:"Journal du jour", stats:"Statistiques", settings:"Paramètres" },
  dash:{
    qaAttendance:"Enregistrer une absence ou un retard", qaBehavior:"Ajouter une remarque comportementale", qaSummon:"Convoquer un tuteur",
    qaIntervention:"Enregistrer une intervention", qaDailyReport:"Générer le rapport du jour", recentToday:"Derniers événements du jour",
    noEventsToday:"Aucun événement enregistré aujourd'hui pour l'instant.",
    cardAbsentToday:"Absents aujourd'hui", cardTardyToday:"Retardataires aujourd'hui", cardBehaviorToday:"Cas comportementaux aujourd'hui",
    cardPendingCases:"Cas en attente de suivi", cardMsgsToday:"Contacts aujourd'hui avec les parents",
    tagAbsence:"Absence", tagTardiness:"Retard", tagBehavior:"Comportement", tagContact:"Contact"
  },
  students:{
    title:"Registre des élèves", add:"Ajouter un élève", searchPh:"Rechercher par nom ou classe...", thName:"Nom complet", thSection:"Classe",
    thStatus:"Statut", thPhone:"Téléphone du tuteur", backToList:"↩ Retour au registre", section:"Classe :", status:"Statut :",
    parentPhone:"Téléphone du tuteur :", parentPhone2:"Téléphone secondaire :", notes:"Remarques :", tabMessages:"Contacts", genReport:"Générer le rapport de cet élève",
    noneMatching:"Aucun élève correspondant.", btnOpen:"Ouvrir", btnEdit:"Modifier", btnDelete:"Supprimer",
    confirmDelete:'Voulez-vous supprimer l\'élève "{n}" ? Tous les enregistrements liés (absences, comportement, contacts) seront supprimés.',
    toastDeleted:"Élève et ses enregistrements supprimés", editTitle:"✏️ Modifier les informations de l'élève", addTitle:"➕ Ajouter un nouvel élève",
    labelFullName:"Nom complet", labelSection:"Classe", labelPhone1:"Téléphone du tuteur", labelPhone2:"Second numéro (facultatif)",
    labelNotes:"Remarques particulières", labelStatus:"Statut", toastNeedNameSection:"Veuillez saisir le nom et la classe", toastSaved:"Enregistré",
    toastNotFound:"Élève introuvable", noAttendanceRecords:"Aucun enregistrement d'absence ou de retard pour cet élève.",
    noBehaviorRecords:"Aucun cas comportemental pour cet élève.", noMessages:"Aucun contact enregistré pour cet élève.",
    csvName:"Nom complet", csvSection:"Classe", csvPhone1:"Téléphone du tuteur", csvPhone2:"Téléphone secondaire", csvStatus:"Statut", csvNotes:"Remarques",
    toastNoneToExport:"Aucun élève à exporter", toastExported:"Liste exportée ({n} élèves)", filenameBase:"liste-eleves-",
    importTitle:"⬆️ Importer une liste d'élèves", importHint:"Collez une liste depuis Excel ou saisissez-la manuellement — une ligne par élève, dans cet ordre :",
    importHintBold:"Nom complet, Classe, Téléphone du tuteur, Second téléphone (facultatif), Remarques (facultatif)",
    importPh:"Exemple :\nAhmed Idrissi, 1ère année collège 1, 0612345678", importFileLabel:"Ou choisir un fichier CSV",
    toastNoContent:"Aucun contenu à importer", toastImported:"{added} élève(s) importé(s)", toastDupSkipped:" — {n} doublon(s) ignoré(s)", toastInvalidSkipped:" — {n} ligne(s) invalide(s)"
  },
  common:{
    importList:"Importer une liste", exportList:"Exporter la liste", allSections:"Toutes les classes", allStatuses:"Tous les statuts",
    thActions:"Actions", editData:"Modifier les informations", section:"Classe", student:"Élève", date:"Date", time:"Heure",
    reason:"Motif", optional:"facultatif", extraNote:"Remarque supplémentaire", save:"Enregistrer", prepMessage:"Préparer un message au tuteur",
    searchPh:"Rechercher...", back:"↩ Retour", printPdf:"Imprimer / PDF", add:"Ajouter", cancel:"Annuler"
  },
  status:{ normal:"Normal", tracking:"À suivre", urgent:"Cas urgent" },
  teachers:{
    title:"Liste des enseignants", add:"Ajouter un enseignant(e)", searchPh:"Rechercher par nom, matière ou classe...", thSubject:"Matière",
    thSections:"Classes", thPhone:"Téléphone", noneMatching:"Aucun enseignant correspondant.", confirmDelete:'Voulez-vous supprimer l\'enseignant(e) "{n}" ?',
    toastDeleted:"Supprimé", editTitle:"✏️ Modifier les informations de l'enseignant(e)", addTitle:"➕ Ajouter un(e) nouvel(le) enseignant(e)",
    labelFullName:"Nom complet", labelSubject:"Matière", labelSections:"Classes (séparées par une virgule)", sectionsPh:"Exemple : 1ère année collège 1, 2ème année collège 2",
    labelPhone:"Téléphone", labelNotes:"Remarques", toastNeedName:"Veuillez saisir le nom complet", toastSaved:"Enregistré",
    csvName:"Nom complet", csvSubject:"Matière", csvSections:"Classes", csvPhone:"Téléphone", csvNotes:"Remarques",
    toastNoneToExport:"Aucun enseignant à exporter", toastExported:"Liste exportée ({n} enseignant(e)s)", filenameBase:"liste-enseignants-",
    importTitle:"⬆️ Importer une liste d'enseignants", importHint:"Collez une liste depuis Excel ou saisissez-la manuellement — une ligne par enseignant(e), dans cet ordre :",
    importHintBold:"Nom complet, Matière, Classes, Téléphone (facultatif), Remarques (facultatif)",
    importPh:"Exemple :\nM. Sofiane Hamdaoui, Mathématiques, 1ère année collège 1", importFileLabel:"Ou choisir un fichier CSV",
    toastNoContent:"Aucun contenu à importer", toastImported:"{added} enseignant(e)(s) importé(e)(s)", toastDupSkipped:" — {n} doublon(s) ignoré(s)", toastInvalidSkipped:" — {n} ligne(s) invalide(s)"
  },
  attendance:{
    newEntry:"Enregistrer un nouveau cas", caseType:"Type de cas", absence:"Absence", tardiness:"Retard", justification:"Statut",
    addToDaily:"Ajouter au rapport du jour", recentEntries:"Derniers enregistrements", thType:"Type", noneYet:"Aucun enregistrement pour l'instant.",
    confirmDelete:"Supprimer cet enregistrement ?", toastDeleted:"Supprimé", toastNeedStudent:"Veuillez choisir la classe et l'élève",
    alertRepeat:'⚠️ Attention : il s\'agit du cas n°{n} de type "{type}" pour cet élève. Il est conseillé de suivre le dossier ou de contacter le tuteur.',
    toastSaved:"Enregistré", toastAddedToDaily:"Ajouté — apparaîtra automatiquement dans le rapport du jour"
  },
  justif:{ pending:"En attente de justification", justified:"Justifié", unjustified:"Non justifié" },
  behavior:{
    severity:"Degré de gravité", description:"Description du cas", action:"Mesure prise", followUp:"Date de suivi",
    fileStatus:"Statut du dossier", registered:"Cas enregistrés", allFiles:"Tous les dossiers", openOnly:"Ouverts seulement", closedOnly:"Fermés seulement",
    file:"Dossier", noneYet:"Aucun cas enregistré pour l'instant.", btnCloseFile:"Fermer le dossier", btnReopenFile:"Rouvrir",
    confirmDelete:"Supprimer ce cas ?", toastDeleted:"Supprimé", toastFileUpdated:"Statut du dossier mis à jour",
    toastNeedStudent:"Veuillez choisir la classe et l'élève", toastNeedDescription:"Veuillez décrire le cas", toastSaved:"Enregistré"
  },
  severity:{ light:"Légère", medium:"Moyenne", urgent:"Urgente" },
  file:{ open:"Ouvert", closed:"Fermé" },
  messages:{
    template:"Modèle", previewLabel:"Texte du message (modifiable avant envoi)", aiImprove:"Améliorer la formulation par IA",
    openWhatsapp:"Ouvrir dans WhatsApp", copyText:"Copier le texte", recentLog:"Journal des contacts récents", noneYet:"Aucun contact enregistré pour l'instant.",
    toastNeedStudent:"Veuillez choisir l'élève", toastNoPhone:"Aucun numéro de téléphone enregistré pour le tuteur de cet élève",
    toastCopied:"Texte copié", toastCopyFailed:"Copie automatique impossible — copiez le texte manuellement",
    aiImproving:"⏳ Amélioration en cours...", toastNoDraft:"Aucun texte à améliorer", toastAiError:"Impossible de contacter le service d'IA",
    toastAiOk:"Formulation améliorée — relisez le texte avant d'envoyer", toastAiNetError:"Impossible de contacter le service d'IA — vérifiez votre connexion Internet"
  },
  reports:{
    smartTitle:"⚡ Rapports intelligents (générés automatiquement depuis vos données)", smartDaily:"Rapport du jour", smartStudent:"Rapport d'élève",
    smartSection:"Rapport de classe", smartMonthly:"Rapport d'absences mensuel", smartRepeated:"Rapport de retards répétés",
    customTitle:"📄 Modèles personnalisables", newTemplate:"Nouveau modèle", searchPh:"Rechercher un modèle...", allCategories:"Toutes les catégories",
    clearFields:"Vider les champs", saveToLog:"Enregistrer dans le journal", formData:"📝 Données du formulaire", extraFields:"➕ Champs supplémentaires pour ce rapport",
    addExtraField:"Ajouter un champ supplémentaire", printPreview:"🖨️ Aperçu avant impression", saveTemplate:"Enregistrer le modèle", templateName:"Nom du modèle",
    templateNamePh:"Exemple : rapport d'absence personnalisé", category:"Catégorie", categoryPh:"Exemple : Absences et retards", templateFields:"Champs du modèle", addField:"Ajouter un champ",
    noneMatching:"Aucun modèle correspondant.", custom:"Personnalisé", fieldsCount:"{n} champ(s)", btnOpenForm:"📝 Ouvrir le formulaire",
    btnEditTpl:"✏️ Modifier", btnDeleteTpl:"🗑️ Supprimer", btnDuplicateTpl:"📄 Dupliquer et modifier", confirmDeleteTpl:'Voulez-vous supprimer le modèle "{n}" ?',
    toastTplDeleted:"Modèle supprimé", selectPlaceholder:"— Choisir —", btnAddRow:"➕ Ajouter une ligne", btnRemoveRow:"Supprimer",
    noExtraFields:"Aucun champ supplémentaire.", promptExtraLabel:"Titre du champ supplémentaire :", promptExtraType:"Type de champ : 1=texte court 2=texte long 3=nombre 4=date",
    fillTitleDefault:"Remplir un formulaire", confirmClearForm:"Vider tous les champs ?", toastFillRequired:"Veuillez remplir : {list}", toastReportSaved:"Rapport enregistré dans le journal",
    duplicateSuffix:" (copie modifiée)", builderEditTitle:"Modifier le modèle", builderNewTitle:"Nouveau modèle",
    fieldLabelPh:"Titre du champ", optionsPh:"Options de la liste (une par ligne)", columnsPh:"Colonnes du tableau (une par ligne)", requiredCheck:"Champ obligatoire",
    toastNeedField:"Ajoutez au moins un champ", toastFieldNoLabel:"Un champ n'a pas de titre", toastNeedTplName:"Veuillez saisir le nom du modèle", toastTplSaved:"Modèle enregistré",
    pickerCancel:"Annuler", pickerGenerate:"Générer le rapport", pickStudent:"Choisir l'élève", pickSection:"Choisir la classe", pickSectionAll:"Choisir la classe (ou toutes)",
    allSectionsOpt:"Toutes les classes", dailyReportTitle:"Rapport du jour — {d}", studentReportTitle:"Rapport d'élève — {n}", sectionReportTitle:"Rapport de classe — {s}",
    monthlyReportTitle:"Rapport d'absences mensuel — {m}", repeatedTardinessTitle:"Rapport des retards répétés",
    summaryLabel:"Résumé chiffré", summaryText:"Absences : {a} — Retards : {t} — Cas comportementaux : {b} — Contacts : {m}",
    absenceLabel:"Absences", tardinessLabel:"Retards", behaviorLabel:"Comportement et interventions", contactsLabel:"Contacts avec les parents",
    studentInfoLabel:"Informations de l'élève", studentInfoText:"Nom : {n} — Classe : {s} — Statut : {st} — Téléphone du tuteur : {p}",
    attendanceHistoryLabel:"Historique des absences et retards", behaviorHistoryLabel:"Historique du comportement", contactsHistoryLabel:"Historique des contacts",
    sectionLabel:"Classe", sectionText:"{s} — Nombre d'élèves : {n}", studentsListLabel:"Liste des élèves",
    monthLabel:"Mois", monthText:"{m}{s}", monthSectionSuffix:" — Classe : {s}", monthAllSuffix:" — Toutes les classes",
    monthlyStudentsLabel:"Élèves avec absences ou retards ce mois-ci", repeatedLabel:"Élèves ayant dépassé 3 cas de retard",
    noData:"Aucune donnée à afficher.",
    colStudent:"Élève", colSection:"Classe", colStatus:"Statut", colTime:"Heure", colType:"Type", colSeverity:"Gravité",
    colAction:"Mesure", colTemplate:"Modèle", colAbsCount:"Nb absences", colTardyCount:"Nb retards", colBehCount:"Nb cas comportementaux",
    colOverallStatus:"Statut", colTardyTotal:"Nb de retards", colAbsTotal:"Nb de jours d'absence", colFullName:"Nom complet"
  },
  dailylog:{ messages:"Contacts", openFiles:"Dossiers ouverts (toutes périodes)", noAttendance:"Aucune absence ou retard aujourd'hui.",
    noBehavior:"Aucun cas comportemental aujourd'hui.", noMessages:"Aucun contact aujourd'hui.", noOpenFiles:"Aucun dossier ouvert actuellement.", openTag:"Ouvert" },
  stats:{ absenceBySection:"Absences par classe", tardyBySection:"Retards par classe", topTardy:"Les plus fréquents en retards", topAbsence:"Les plus fréquents en absences",
    totalStudents:"Nombre d'élèves", totalAbs:"Total absences", totalTardy:"Total retards", openCases:"Dossiers ouverts", closedCases:"Dossiers fermés", totalMsgs:"Contacts avec les parents",
    noData:"Pas assez de données pour l'instant." },
  settings:{
    institutionInfo:"Informations de l'établissement", institutionName:"Nom de l'établissement", niaba:"Délégation provinciale", academy:"Académie régionale",
    year:"Année scolaire", supervisor:"Nom du/de la surveillant(e) général(e)", saveInfo:"Enregistrer les informations", sections:"Classes", newSectionPh:"Nom de la nouvelle classe",
    caseTypes:"Types de cas comportementaux", newCaseTypePh:"Nouveau type de cas", messageTemplates:"Modèles de messages aux parents",
    security:"🔐 Sécurité", changePassword:"Changer le mot de passe", changePin:"Changer le code secret",
    securityHint:"Utilisez le bouton 🔒 en haut pour verrouiller rapidement l'application avec le code, et le bouton 🚪 pour une déconnexion complète (nécessite le mot de passe à la prochaine connexion).",
    dataTitle:"Données", exportBackup:"Exporter une sauvegarde", importBackup:"Importer une sauvegarde", wipeData:"Effacer toutes les données",
    exportHint:"L'export inclut : les élèves, les enseignants, les absences et retards, le comportement, le journal des contacts, les modèles personnalisés, les rapports enregistrés et les paramètres.",
    toastRemoved:"Supprimé", toastAdded:"Ajouté",
    msgVarsHint:"Variables disponibles : {name} le nom, {section} la classe, {date} la date, {institution} le nom de l'établissement, {caseType} le type de cas.",
    btnSaveMsgTemplates:"💾 Enregistrer les modèles de messages", toastMsgTemplatesSaved:"Modèles de messages enregistrés", toastInfoSaved:"Informations de l'établissement enregistrées",
    scChangePwTitle:"🔑 Changer le mot de passe", scChangePinTitle:"🔢 Changer le code secret", scCurrentLabel:"Mot de passe actuel",
    scNewPwLabel:"Nouveau mot de passe", scConfirmPwLabel:"Confirmer le nouveau mot de passe", scNewPinLabel:"Nouveau code secret", scConfirmPinLabel:"Confirmer le nouveau code",
    scErrCurrentWrong:"Mot de passe actuel incorrect", scErrMismatch:"Les deux valeurs ne correspondent pas",
    scPwSuccessMsg:"Mot de passe modifié", scPinSuccessMsg:"Code secret modifié",
    exportFilenameBase:"sauvegarde-surveillance-hanane-", toastImportedOk:"Importation réussie", toastImportInvalid:"Fichier invalide",
    wipePrompt:'Pour confirmer l\'effacement définitif de toutes les données, tapez exactement "SUPPRESSION DEFINITIVE" :', wipeConfirmPhrase:'SUPPRESSION DEFINITIVE',
    toastWipeMismatch:"Aucune suppression — le texte ne correspond pas", toastWiped:"Toutes les données ont été effacées — la page va se recharger"
  },
  doc:{ schoolYear:"Année scolaire :", editDate:"Date de rédaction :", supervisorCap:"Le/La Surveillant(e) Général(e)", adminCap:"Administration", yes:"✅ Oui", no:"❌ Non", extraInfo:"Informations supplémentaires" },
  fieldtype:{ text:"Texte court", textarea:"Texte long", date:"Date", time:"Heure", number:"Nombre", select:"Liste déroulante", checkbox:"Case à cocher", table:"Tableau dynamique" }
}
};

function t(ns,key){ const d = STRINGS[state.lang][ns]; return d && d[key]!==undefined ? d[key] : key; }
function fmt(str, params){ return str.replace(/\{(\w+)\}/g, (m,k)=> params && params[k]!==undefined ? params[k] : m); }
function L(val){
  if(val && typeof val==='object' && !Array.isArray(val) && (('ar' in val) || ('fr' in val))){
    return val[state.lang] !== undefined ? val[state.lang] : (val.ar !== undefined ? val.ar : val.fr);
  }
  return val;
}

/* ============================= ثوابت نصية عامة (ثنائية اللغة) ============================= */
const KINGDOM_LINE  = { ar:'المملكة المغربية', fr:'Royaume du Maroc' };
const MINISTRY_LINE = { ar:'وزارة التربية الوطنية والتعليم الأولي والرياضة', fr:"Ministère de l'Éducation Nationale, du Préscolaire et des Sports" };

const STATUS_LABELS = { normal:{ar:'عادي',fr:'Normal'}, tracking:{ar:'يحتاج تتبع',fr:'À suivre'}, urgent:{ar:'حالة مستعجلة',fr:'Cas urgent'} };
const JUSTIF_LABELS = { pending:{ar:'ينتظر التبرير',fr:'En attente de justification'}, justified:{ar:'مبرر',fr:'Justifié'}, unjustified:{ar:'غير مبرر',fr:'Non justifié'} };
const SEVERITY_LABELS = { light:{ar:'بسيطة',fr:'Légère'}, medium:{ar:'متوسطة',fr:'Moyenne'}, urgent:{ar:'مستعجلة',fr:'Urgente'} };
const FILESTATUS_LABELS = { open:{ar:'مفتوح',fr:'Ouvert'}, closed:{ar:'مغلق',fr:'Fermé'} };
const ATTTYPE_LABELS = { absence:{ar:'غياب',fr:'Absence'}, tardiness:{ar:'تأخر',fr:'Retard'} };
function statusLabel(k){ return L(STATUS_LABELS[k])||k; }
function justifLabel(k){ return L(JUSTIF_LABELS[k])||k; }
function severityLabel(k){ return L(SEVERITY_LABELS[k])||k; }
function fileStatusLabel(k){ return L(FILESTATUS_LABELS[k])||k; }
function attTypeLabel(k){ return L(ATTTYPE_LABELS[k])||k; }

const ACTIONS_LIST = ['تنبيه شفوي','توجيه تربوي','استدعاء ولي الأمر','إحالة على الإدارة','التزام مكتوب','متابعة لاحقة'];
const ACTION_FR = {
  'تنبيه شفوي':'Avertissement oral', 'توجيه تربوي':'Orientation éducative', 'استدعاء ولي الأمر':'Convocation du tuteur',
  'إحالة على الإدارة':"Renvoi à l'administration", 'التزام مكتوب':'Engagement écrit', 'متابعة لاحقة':'Suivi ultérieur'
};
function actionLabel(v){ return state.lang==='fr' ? (ACTION_FR[v]||v) : v; }

/* ============================= فئات القوالب ============================= */
const CATEGORIES = [
  {id:'ghiyab', ar:'الغياب والتأخر', fr:'Absences et retards', icon:'📋'},
  {id:'suluk', ar:'السلوك والانضباط', fr:'Comportement et discipline', icon:'⚖️'},
  {id:'hawadith', ar:'الحوادث والوقائع', fr:'Incidents et événements', icon:'🚨'},
  {id:'murasalat', ar:'المراسلات', fr:'Correspondances', icon:'✉️'},
  {id:'majalis', ar:'المجالس والمحاضر', fr:'Conseils et procès-verbaux', icon:'🏛️'},
  {id:'imtihanat', ar:'الامتحانات', fr:'Examens', icon:'📝'},
  {id:'other', ar:'أخرى', fr:'Autre', icon:'🗂️'}
];
function categoryLabel(cat){ const f = CATEGORIES.find(c=>c.id===cat); return f ? f[state.lang] : cat; }
function categoryIcon(cat){ const f = CATEGORIES.find(c=>c.id===cat); return f ? f.icon : '🗂️'; }
function categoryIdFromLabel(text){ const tx = (text||'').trim(); const f = CATEGORIES.find(c=>c.ar===tx || c.fr===tx); return f ? f.id : tx; }

const DEFAULT_SETTINGS = {
  institution:'مؤسسة الحنان', niaba:'', academy:'', year:'', supervisor:'',
  sections:[
    'الأولى إعدادي 1','الأولى إعدادي 2','الثانية إعدادي 1','الثانية إعدادي 2','الثالثة إعدادي 1','الثالثة إعدادي 2',
    'الجذع المشترك 1','الجذع المشترك 2','الأولى بكالوريا 1','الأولى بكالوريا 2','الثانية بكالوريا 1','الثانية بكالوريا 2'
  ],
  caseTypes:['شجار','عدم احترام','تأخر متكرر','غياب متكرر','استعمال الهاتف','إزعاج داخل القسم','مخالفة النظام الداخلي','حالة صحية','حالة اجتماعية/نفسية تحتاج تتبعًا','أخرى'],
  messageTemplates:[
    {key:'absence', title:{ar:'إشعار غياب', fr:"Avis d'absence"}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name}، نحيطكم علماً بغياب ابنكم/ابنتكم بقسم {section} بتاريخ {date}. نرجو التواصل مع الإدارة لتبرير الغياب.\nتحياتنا، الحراسة العامة — {institution}.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name}, nous vous informons de l'absence de votre enfant en classe {section} le {date}. Merci de contacter l'administration pour justifier cette absence.\nCordialement, la Surveillance Générale — {institution}."
    }},
    {key:'tardiness', title:{ar:'إشعار تأخر', fr:'Avis de retard'}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name}، نحيطكم علماً بتأخر ابنكم/ابنتكم عن الحصة بقسم {section} بتاريخ {date}. نرجو الحرص على الالتزام بالتوقيت.\nتحياتنا، الحراسة العامة — {institution}.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name}, nous vous informons du retard de votre enfant au cours en classe {section} le {date}. Merci de veiller à la ponctualité.\nCordialement, la Surveillance Générale — {institution}."
    }},
    {key:'summon', title:{ar:'استدعاء ولي أمر', fr:'Convocation du tuteur'}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، تدعوكم إدارة {institution} لحضور لقاء بخصوص وضعية ابنكم/ابنتكم بتاريخ {date}. نرجو الحضور في أقرب وقت ممكن.\nتحياتنا، الحراسة العامة.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name} en classe {section}, l'administration de {institution} vous invite à un entretien concernant la situation de votre enfant le {date}. Merci de vous présenter dans les meilleurs délais.\nCordialement, la Surveillance Générale."
    }},
    {key:'behavior', title:{ar:'إشعار بسلوك غير مناسب', fr:'Avis de comportement inapproprié'}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، نحيطكم علماً بتسجيل ملاحظة سلوكية بتاريخ {date} تتعلق بـ: {caseType}. نرجو التواصل مع الحراسة العامة للمتابعة.\nتحياتنا.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name} en classe {section}, nous vous informons de l'enregistrement d'une remarque comportementale le {date} concernant : {caseType}. Merci de contacter la Surveillance Générale pour le suivi.\nCordialement."
    }},
    {key:'urgent', title:{ar:'طلب حضور عاجل', fr:'Demande de présence urgente'}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، نطلب حضوركم العاجل إلى المؤسسة اليوم {date} بخصوص وضعية مستعجلة تخص ابنكم/ابنتكم.\nتحياتنا، الحراسة العامة — {institution}.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name} en classe {section}, nous demandons votre présence urgente à l'établissement aujourd'hui {date} concernant une situation urgente relative à votre enfant.\nCordialement, la Surveillance Générale — {institution}."
    }},
    {key:'thanks', title:{ar:'شكر لولي الأمر على الحضور', fr:'Remerciement pour la présence'}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name}، نشكركم على حضوركم وتعاونكم بتاريخ {date} بخصوص متابعة وضعية ابنكم/ابنتكم.\nتحياتنا، الحراسة العامة — {institution}.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name}, nous vous remercions pour votre présence et votre collaboration le {date} concernant le suivi de la situation de votre enfant.\nCordialement, la Surveillance Générale — {institution}."
    }},
    {key:'improvement', title:{ar:'إشعار بتحسن سلوك التلميذ', fr:'Avis d’amélioration du comportement'}, body:{
      ar:'السيد(ة) ولي أمر التلميذ(ة) {name} بقسم {section}، يسرنا إعلامكم بالتحسن الملحوظ في سلوك ابنكم/ابنتكم خلال الفترة الأخيرة. نشكركم على تعاونكم.\nتحياتنا، الحراسة العامة — {institution}.',
      fr:"Monsieur/Madame le tuteur/la tutrice de l'élève {name} en classe {section}, nous avons le plaisir de vous informer de l'amélioration notable du comportement de votre enfant durant la période récente. Nous vous remercions pour votre collaboration.\nCordialement, la Surveillance Générale — {institution}."
    }}
  ]
};

const SECTION_FR = {
  'الأولى إعدادي 1':'1ère année collège 1', 'الأولى إعدادي 2':'1ère année collège 2',
  'الثانية إعدادي 1':'2ème année collège 1', 'الثانية إعدادي 2':'2ème année collège 2',
  'الثالثة إعدادي 1':'3ème année collège 1', 'الثالثة إعدادي 2':'3ème année collège 2',
  'الجذع المشترك 1':'Tronc commun 1', 'الجذع المشترك 2':'Tronc commun 2',
  'الأولى بكالوريا 1':'1ère Bac 1', 'الأولى بكالوريا 2':'1ère Bac 2',
  'الثانية بكالوريا 1':'2ème Bac 1', 'الثانية بكالوريا 2':'2ème Bac 2'
};
function sectionLabel(v){ return state.lang==='fr' ? (SECTION_FR[v]||v) : v; }

const CASETYPE_FR = {
  'شجار':'Bagarre', 'عدم احترام':'Manque de respect', 'تأخر متكرر':'Retards répétés', 'غياب متكرر':'Absences répétées',
  'استعمال الهاتف':'Usage du téléphone', 'إزعاج داخل القسم':'Perturbation en classe', 'مخالفة النظام الداخلي':'Infraction au règlement intérieur',
  'حالة صحية':'Cas médical', 'حالة اجتماعية/نفسية تحتاج تتبعًا':'Cas social/psychologique à suivre', 'أخرى':'Autre'
};
function caseTypeLabel(v){ return state.lang==='fr' ? (CASETYPE_FR[v]||v) : v; }

/* ============================= القوالب الجاهزة (محرك التقارير المرنة) ============================= */
const BUILTIN_TEMPLATES = [
  { id:'ghiyab', builtin:true, category:'ghiyab', name:{ar:'تقرير غياب التلاميذ',fr:"Rapport d'absence des élèves"}, fields:[
    {id:'f1', type:'date', label:{ar:'اليوم والتاريخ',fr:'Jour et date'}, required:true},
    {id:'f2', type:'text', label:{ar:'القسم / الأقسام المعنية',fr:'Classe(s) concernée(s)'}, required:false},
    {id:'f3', type:'table', label:{ar:'لائحة الغياب',fr:'Liste des absences'}, columns:{ar:['الاسم الكامل','رقم التسجيل','القسم','مدة الغياب','السبب (إن وجد)'], fr:['Nom complet',"N° d'inscription",'Classe',"Durée d'absence",'Motif (si disponible)']}},
    {id:'f4', type:'textarea', label:{ar:'ملاحظات عامة',fr:'Remarques générales'}, required:false}
  ]},
  { id:'taakhor', builtin:true, category:'ghiyab', name:{ar:'تقرير التأخر عن الحصص',fr:'Rapport de retard aux cours'}, fields:[
    {id:'f1', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f2', type:'text', label:{ar:'الحصة / التوقيت',fr:'Cours / Horaire'}, required:false},
    {id:'f3', type:'table', label:{ar:'لائحة المتأخرين',fr:'Liste des retardataires'}, columns:{ar:['الاسم الكامل','القسم','وقت الوصول','المدة المتأخر بها','السبب'], fr:['Nom complet','Classe',"Heure d'arrivée",'Durée du retard','Motif']}},
    {id:'f4', type:'textarea', label:{ar:'الإجراء المتخذ',fr:'Mesure prise'}, required:false}
  ]},
  { id:'suluk', builtin:true, category:'suluk', name:{ar:'تقرير سلوك / مخالفة تلميذ',fr:"Rapport de comportement / infraction d'élève"}, fields:[
    {id:'f1', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f2', type:'text', label:{ar:'اسم التلميذ',fr:"Nom de l'élève"}, required:true},
    {id:'f3', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f4', type:'select', label:{ar:'نوع المخالفة',fr:"Type d'infraction"}, options:{ar:['خفيفة','متوسطة','جسيمة'], fr:['Légère','Moyenne','Grave']}},
    {id:'f5', type:'textarea', label:{ar:'وصف الواقعة',fr:'Description des faits'}, required:true},
    {id:'f6', type:'textarea', label:{ar:'الإجراء المتخذ',fr:'Mesure prise'}, required:false},
    {id:'f7', type:'text', label:{ar:'الأطراف الحاضرة / الشهود',fr:'Parties présentes / Témoins'}, required:false}
  ]},
  { id:'majlis-indibat', builtin:true, category:'majalis', name:{ar:'محضر مجلس الانضباط',fr:'Procès-verbal du conseil de discipline'}, fields:[
    {id:'f1', type:'date', label:{ar:'تاريخ الانعقاد',fr:'Date de la réunion'}, required:true},
    {id:'f2', type:'text', label:{ar:'اسم التلميذ المعني',fr:"Nom de l'élève concerné"}, required:true},
    {id:'f3', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f4', type:'textarea', label:{ar:'موضوع الانعقاد',fr:'Objet de la réunion'}, required:false},
    {id:'f5', type:'table', label:{ar:'أعضاء المجلس الحاضرون',fr:'Membres du conseil présents'}, columns:{ar:['الاسم','الصفة'], fr:['Nom','Qualité']}},
    {id:'f6', type:'textarea', label:{ar:'مداولات المجلس',fr:'Délibérations du conseil'}, required:false},
    {id:'f7', type:'textarea', label:{ar:'القرار المتخذ',fr:'Décision prise'}, required:true}
  ]},
  { id:'istidaa', builtin:true, category:'murasalat', name:{ar:'استدعاء ولي أمر',fr:'Convocation du tuteur'}, fields:[
    {id:'f1', type:'text', label:{ar:'اسم ولي الأمر',fr:'Nom du tuteur'}, required:true},
    {id:'f2', type:'text', label:{ar:'اسم التلميذ(ة)',fr:"Nom de l'élève"}, required:true},
    {id:'f3', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f4', type:'date', label:{ar:'تاريخ الاستدعاء',fr:'Date de convocation'}, required:true},
    {id:'f5', type:'time', label:{ar:'الساعة',fr:'Heure'}, required:false},
    {id:'f6', type:'textarea', label:{ar:'موضوع الاستدعاء',fr:'Objet de la convocation'}, required:true}
  ]},
  { id:'haditha', builtin:true, category:'hawadith', name:{ar:'تقرير حادثة / واقعة',fr:"Rapport d'incident"}, fields:[
    {id:'f1', type:'date', label:{ar:'تاريخ الحادثة',fr:"Date de l'incident"}, required:true},
    {id:'f2', type:'time', label:{ar:'وقت الحادثة',fr:"Heure de l'incident"}, required:false},
    {id:'f3', type:'text', label:{ar:'المكان',fr:'Lieu'}, required:false},
    {id:'f4', type:'textarea', label:{ar:'وصف الحادثة',fr:"Description de l'incident"}, required:true},
    {id:'f5', type:'text', label:{ar:'الأطراف المعنية',fr:'Parties concernées'}, required:false},
    {id:'f6', type:'textarea', label:{ar:'الإجراءات المتخذة',fr:'Mesures prises'}, required:false},
    {id:'f7', type:'textarea', label:{ar:'توصيات',fr:'Recommandations'}, required:false}
  ]},
  { id:'hirasat-imtihan', builtin:true, category:'imtihanat', name:{ar:'تقرير حراسة الامتحان',fr:"Rapport de surveillance d'examen"}, fields:[
    {id:'f1', type:'text', label:{ar:'المادة الممتحن فيها',fr:"Matière de l'examen"}, required:true},
    {id:'f2', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f3', type:'text', label:{ar:'التوقيت',fr:'Horaire'}, required:false},
    {id:'f4', type:'text', label:{ar:'رقم القاعة',fr:'N° de salle'}, required:false},
    {id:'f5', type:'number', label:{ar:'عدد المسجلين',fr:"Nombre d'inscrits"}, required:false},
    {id:'f6', type:'number', label:{ar:'عدد الحاضرين',fr:'Nombre de présents'}, required:false},
    {id:'f7', type:'number', label:{ar:'عدد الغائبين',fr:"Nombre d'absents"}, required:false},
    {id:'f8', type:'table', label:{ar:'حالات الغش أو المخالفات',fr:"Cas de fraude ou d'infractions"}, columns:{ar:['اسم التلميذ','رقم الطاولة','نوع المخالفة','الإجراء'], fr:["Nom de l'élève",'N° de table',"Type d'infraction",'Mesure']}},
    {id:'f9', type:'textarea', label:{ar:'ملاحظات حول سير الحراسة',fr:'Remarques sur le déroulement'}, required:false}
  ]},
  { id:'rokhsat-khoroj', builtin:true, category:'murasalat', name:{ar:'رخصة خروج / مغادرة',fr:'Autorisation de sortie'}, fields:[
    {id:'f1', type:'text', label:{ar:'اسم التلميذ(ة)',fr:"Nom de l'élève"}, required:true},
    {id:'f2', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f3', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f4', type:'time', label:{ar:'وقت الخروج',fr:'Heure de sortie'}, required:false},
    {id:'f5', type:'textarea', label:{ar:'سبب المغادرة',fr:'Motif du départ'}, required:true},
    {id:'f6', type:'text', label:{ar:'اسم المرافق / ولي الأمر (إن وجد)',fr:"Nom de l'accompagnant (si existant)"}, required:false}
  ]},
  { id:'istiqbal-wali', builtin:true, category:'murasalat', name:{ar:'محضر استقبال ولي أمر',fr:'Procès-verbal de réception du tuteur'}, fields:[
    {id:'f1', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f2', type:'time', label:{ar:'الساعة',fr:'Heure'}, required:false},
    {id:'f3', type:'text', label:{ar:'اسم ولي الأمر',fr:'Nom du tuteur'}, required:true},
    {id:'f4', type:'text', label:{ar:'اسم التلميذ(ة)',fr:"Nom de l'élève"}, required:true},
    {id:'f5', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f6', type:'textarea', label:{ar:'موضوع اللقاء',fr:"Objet de l'entretien"}, required:false},
    {id:'f7', type:'textarea', label:{ar:'ملخص اللقاء',fr:"Résumé de l'entretien"}, required:true},
    {id:'f8', type:'textarea', label:{ar:'القرار / التوصية',fr:'Décision / Recommandation'}, required:false}
  ]},
  { id:'iltizam-wali', builtin:true, category:'murasalat', name:{ar:'التزام ولي أمر',fr:'Engagement du tuteur'}, fields:[
    {id:'f1', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f2', type:'text', label:{ar:'اسم ولي الأمر',fr:'Nom du tuteur'}, required:true},
    {id:'f3', type:'text', label:{ar:'اسم التلميذ(ة)',fr:"Nom de l'élève"}, required:true},
    {id:'f4', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f5', type:'textarea', label:{ar:'نص الالتزام',fr:"Texte de l'engagement"}, required:true},
    {id:'f6', type:'text', label:{ar:'مدة المتابعة',fr:'Durée du suivi'}, required:false}
  ]},
  { id:'bitaqa-tatabbo3', builtin:true, category:'other', name:{ar:'بطاقة تتبع تربوي',fr:'Fiche de suivi éducatif'}, fields:[
    {id:'f1', type:'text', label:{ar:'اسم التلميذ(ة)',fr:"Nom de l'élève"}, required:true},
    {id:'f2', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f3', type:'date', label:{ar:'تاريخ فتح البطاقة',fr:"Date d'ouverture de la fiche"}, required:true},
    {id:'f4', type:'textarea', label:{ar:'سبب التتبع',fr:'Motif du suivi'}, required:true},
    {id:'f5', type:'textarea', label:{ar:'الإجراءات المتخذة',fr:'Mesures prises'}, required:false},
    {id:'f6', type:'date', label:{ar:'تاريخ آخر متابعة',fr:'Date du dernier suivi'}, required:false},
    {id:'f7', type:'select', label:{ar:'الحالة الحالية',fr:'Statut actuel'}, options:{ar:['مستمر','تم تجاوزه','محال على جهة مختصة'], fr:['En cours','Résolu','Transféré à un service compétent']}}
  ]},
  { id:'halat-sulukiya', builtin:true, category:'suluk', name:{ar:'تقرير حالة سلوكية (نموذج حر)',fr:'Rapport de cas comportemental (modèle libre)'}, fields:[
    {id:'f1', type:'date', label:{ar:'التاريخ',fr:'Date'}, required:true},
    {id:'f2', type:'text', label:{ar:'اسم التلميذ(ة)',fr:"Nom de l'élève"}, required:true},
    {id:'f3', type:'text', label:{ar:'القسم',fr:'Classe'}, required:false},
    {id:'f4', type:'text', label:{ar:'نوع الحالة',fr:'Type de cas'}, required:false},
    {id:'f5', type:'select', label:{ar:'درجة الخطورة',fr:'Degré de gravité'}, options:{ar:['بسيطة','متوسطة','مستعجلة'], fr:['Légère','Moyenne','Urgente']}},
    {id:'f6', type:'textarea', label:{ar:'وصف الحالة',fr:'Description du cas'}, required:true},
    {id:'f7', type:'textarea', label:{ar:'الإجراء المتخذ',fr:'Mesure prise'}, required:false},
    {id:'f8', type:'date', label:{ar:'تاريخ المتابعة',fr:'Date de suivi'}, required:false}
  ]}
];

/* ============================= أدوات مساعدة عامة ============================= */
function esc(v){
  if(v===undefined || v===null) return '';
  return String(v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function iso(v){ return '⁦' + v + '⁩'; }
function uid(prefix){ return (prefix||'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
function todayISO(){ const d=new Date(); return d.toISOString().slice(0,10); }
function nowHM(){ const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
function loadJSON(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function saveJSON(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>el.classList.remove('show'), 2400);
}
function waPhone(phone){
  let p = String(phone||'').replace(/\D/g,'');
  if(!p) return '';
  if(p.startsWith('212')) return p;
  if(p.startsWith('0')) return '212' + p.slice(1);
  return '212' + p;
}
function monthKey(dateStr){ return (dateStr||'').slice(0,7); }
function populateSelectOptions(sel, options, placeholder, labelFn){
  sel.innerHTML = (placeholder!==undefined ? `<option value="">${esc(placeholder)}</option>` : '') +
    options.map(o=>`<option value="${esc(o)}">${esc(labelFn?labelFn(o):o)}</option>`).join('');
}

/* ============================= الحالة العامة ============================= */
const state = {
  lang: loadJSON(K_LANG, 'ar'),
  settings: loadJSON(K_SETTINGS, DEFAULT_SETTINGS),
  students: loadJSON(K_STUDENTS, []),
  teachers: loadJSON(K_TEACHERS, []),
  attendance: loadJSON(K_ATTENDANCE, []),
  behavior: loadJSON(K_BEHAVIOR, []),
  msglog: loadJSON(K_MSGLOG, []),
  customTemplates: loadJSON(K_TEMPLATES, []),
  reports: loadJSON(K_REPORTS, []),
  currentView: 'view-dashboard',
  currentStudentId: null,
  currentTemplate: null,
  currentReportId: null,
  formValues: {},
  extraFields: [],
  builderFields: [],
  builderEditingId: null,
  pendingMessageContext: null,
  _msgCaseType: ''
};
function saveSettings(){ saveJSON(K_SETTINGS, state.settings); }
function saveStudents(){ saveJSON(K_STUDENTS, state.students); }
function saveTeachers(){ saveJSON(K_TEACHERS, state.teachers); }
function saveAttendance(){ saveJSON(K_ATTENDANCE, state.attendance); }
function saveBehavior(){ saveJSON(K_BEHAVIOR, state.behavior); }
function saveMsgLog(){ saveJSON(K_MSGLOG, state.msglog); }
function saveTemplates(){ saveJSON(K_TEMPLATES, state.customTemplates); }
function saveReports(){ saveJSON(K_REPORTS, state.reports); }

function allTemplates(){ return BUILTIN_TEMPLATES.concat(state.customTemplates); }
function findTemplate(id){ return allTemplates().find(t=>t.id===id); }
function studentById(id){ return state.students.find(s=>s.id===id); }
function studentsInSection(section){ return state.students.filter(s=>!section || s.section===section); }
function msgLogLabel(m){
  if(m.templateKey){ const tt = state.settings.messageTemplates.find(x=>x.key===m.templateKey); if(tt) return L(tt.title); }
  return m.templateTitle || '—';
}

/* ============================= بيانات تجريبية (تُزرع مرة واحدة فقط) ============================= */
function seedDemoData(){
  if(localStorage.getItem(K_SEEDED)) return;
  if(state.students.length>0){ localStorage.setItem(K_SEEDED,'1'); return; }

  const sections = state.settings.sections;
  const names = [
    'أيوب الفاسي','سلمى بنعلي','يوسف الإدريسي','مريم الشرقاوي','أنس بوزيان','خديجة العلوي',
    'عبد الرحمن الحسني','فاطمة الزهراء بناني','سعيد الوردي','إيمان الغازي','محمد أمين الطاهري',
    'نور الهدى الصقلي','حمزة الخياط','سارة المرابط','عثمان الرافعي','لبنى الشرقي','طه الوزاني','رانية الكتاني'
  ];
  const students = names.map((name,i)=>({
    id: uid('stu'),
    fullName: name,
    section: sections[i % sections.length],
    parentPhone: '06' + String(10000000 + Math.floor(Math.random()*89999999)).slice(0,8),
    parentPhone2:'',
    notes:'',
    status:'normal',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }));
  state.students = students;

  const attendance = [];
  const behavior = [];
  const today = new Date();
  function isoDaysAgo(n){ const d=new Date(today); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }

  [students[0], students[3], students[7]].forEach((s,i)=>{
    attendance.push({ id:uid('att'), studentId:s.id, type: i===1?'tardiness':'absence', date:todayISO(), time:nowHM(),
      reason:'', justification:'pending', note:'', createdAt:new Date().toISOString() });
  });
  [students[2], students[5]].forEach(s=>{
    attendance.push({ id:uid('att'), studentId:s.id, type:'tardiness', date:todayISO(), time:'08:15',
      reason:'ازدحام النقل', justification:'justified', note:'', createdAt:new Date().toISOString() });
  });

  for(let i=0;i<4;i++){
    attendance.push({ id:uid('att'), studentId:students[1].id, type:'tardiness', date:isoDaysAgo(3+i*3), time:'08:10',
      reason:'', justification:'unjustified', note:'', createdAt:new Date().toISOString() });
  }
  for(let i=0;i<3;i++){
    attendance.push({ id:uid('att'), studentId:students[9].id, type:'absence', date:isoDaysAgo(5+i*4), time:'',
      reason:'', justification:'pending', note:'', createdAt:new Date().toISOString() });
  }
  students[1].status = 'tracking';
  students[9].status = 'tracking';

  behavior.push({ id:uid('beh'), studentId:students[4].id, date:todayISO(), type:'استعمال الهاتف', severity:'light',
    description:'استعمال الهاتف داخل القسم أثناء الحصة.', action:'تنبيه شفوي', followUpDate:'', fileStatus:'closed',
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
  behavior.push({ id:uid('beh'), studentId:students[6].id, date:todayISO(), type:'شجار', severity:'urgent',
    description:'شجار مع تلميذ آخر بالساحة.', action:'إحالة على الإدارة', followUpDate: isoDaysAgo(-2), fileStatus:'open',
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
  behavior.push({ id:uid('beh'), studentId:students[11].id, date:isoDaysAgo(6), type:'حالة اجتماعية/نفسية تحتاج تتبعًا', severity:'medium',
    description:'ملاحظة تراجع في التركيز والمشاركة داخل القسم.', action:'متابعة لاحقة', followUpDate: isoDaysAgo(-4), fileStatus:'open',
    createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() });
  students[6].status = 'urgent';
  students[11].status = 'tracking';

  state.attendance = attendance;
  state.behavior = behavior;
  saveStudents(); saveAttendance(); saveBehavior();
  localStorage.setItem(K_SEEDED,'1');
}
function seedTeachersIfEmpty(){
  if(state.teachers.length>0) return;
  const teacherSeed = [
    {fullName:'ذ. يوسف العماري', subject:'الرياضيات', sections:'الأولى إعدادي 1، الأولى إعدادي 2'},
    {fullName:'ة. سعاد بنكيران', subject:'اللغة العربية', sections:'الثانية إعدادي 1، الثانية إعدادي 2'},
    {fullName:'ذ. كريم الفيلالي', subject:'الاجتماعيات', sections:'الثالثة إعدادي 1، الثالثة إعدادي 2'},
    {fullName:'ة. حنان الطيبي', subject:'اللغة الفرنسية', sections:'الأولى إعدادي 1، الثانية إعدادي 1'},
    {fullName:'ذ. عمر الشرقاوي', subject:'العلوم الفيزيائية', sections:'الثانية إعدادي 2، الثالثة إعدادي 1'},
    {fullName:'ة. مريم الإدريسي', subject:'التربية الإسلامية', sections:'كل الأقسام'}
  ];
  state.teachers = teacherSeed.map(t=>({
    id: uid('tch'), fullName:t.fullName, subject:t.subject, sections:t.sections,
    phone:'06' + String(10000000 + Math.floor(Math.random()*89999999)).slice(0,8),
    notes:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()
  }));
  saveTeachers();
}
function migrateSecondaryLevels(){
  const required = ['الجذع المشترك 1','الجذع المشترك 2','الأولى بكالوريا 1','الأولى بكالوريا 2','الثانية بكالوريا 1','الثانية بكالوريا 2'];
  const missing = required.filter(s=>!state.settings.sections.includes(s));
  if(missing.length===0) return;
  state.settings.sections = state.settings.sections.concat(missing);
  saveSettings();
}
// يرقّي قوالب الرسائل المحفوظة قبل تفعيل الفرنسية (كانت title/body نصاً عادياً) إلى الصيغة الثنائية اللغة {ar,fr}،
// مع الحفاظ على أي تعديل عربي أجراه المستخدم على نص الرسالة، وإضافة الترجمة الفرنسية الافتراضية له
function migrateMessageTemplates(){
  let changed = false;
  state.settings.messageTemplates = state.settings.messageTemplates.map(tpl=>{
    if(tpl.title && typeof tpl.title === 'object') return tpl;
    changed = true;
    const def = DEFAULT_SETTINGS.messageTemplates.find(d=>d.key===tpl.key);
    return {
      key: tpl.key,
      title: def ? def.title : { ar: tpl.title, fr: tpl.title },
      body: { ar: tpl.body || (def?def.body.ar:''), fr: def ? def.body.fr : (tpl.body||'') }
    };
  });
  if(changed) saveSettings();
}

/* ============================= الحماية: كلمة المرور والرقم السري ============================= */
function randomSalt(){
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function sha256Hex(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function setSecret(key, value){
  const salt = randomSalt();
  const hash = await sha256Hex(salt + ':' + value);
  saveJSON(key, {salt, hash});
}
async function verifySecret(key, value){
  const stored = loadJSON(key, null);
  if(!stored) return false;
  const hash = await sha256Hex(stored.salt + ':' + value);
  return hash === stored.hash;
}
function hasPasswordConfigured(){ return !!loadJSON(K_PWHASH, null); }

/* ============================= بوابة الدخول ============================= */
function showAuthCard(mode){
  document.getElementById('loginGate').classList.remove('hidden');
  document.getElementById('appRoot').classList.add('hidden');
  ['Setup','Login','Pin'].forEach(m=>{
    document.getElementById('authCard'+m).classList.toggle('hidden', m.toLowerCase()!==mode);
  });
}
function initLoginGate(){
  const auth = loadJSON(K_AUTH, null);
  if(!hasPasswordConfigured()){
    if(auth && auth.name) document.getElementById('setupName').value = auth.name;
    showAuthCard('setup');
  } else if(sessionStorage.getItem(SS_UNLOCKED)==='1'){
    if(sessionStorage.getItem(SS_PIN_LOCKED)==='1') showAuthCard('pin');
    else showApp(auth);
  } else {
    showAuthCard('login');
  }

  document.getElementById('btnSetupSave').addEventListener('click', async ()=>{
    const name = document.getElementById('setupName').value.trim() || t('auth','defaultName');
    const pw = document.getElementById('setupPw').value;
    const pwConfirm = document.getElementById('setupPwConfirm').value;
    const pin = document.getElementById('setupPin').value.trim();
    const pinConfirm = document.getElementById('setupPinConfirm').value.trim();
    const errEl = document.getElementById('setupError');
    errEl.classList.add('hidden');
    if(pw.length < 4){ errEl.textContent = t('auth','errPwShort'); errEl.classList.remove('hidden'); return; }
    if(pw !== pwConfirm){ errEl.textContent = t('auth','errPwMismatch'); errEl.classList.remove('hidden'); return; }
    if(!/^\d{4,6}$/.test(pin)){ errEl.textContent = t('auth','errPinFormat'); errEl.classList.remove('hidden'); return; }
    if(pin !== pinConfirm){ errEl.textContent = t('auth','errPinMismatch'); errEl.classList.remove('hidden'); return; }
    await setSecret(K_PWHASH, pw);
    await setSecret(K_PINHASH, pin);
    const newAuth = { name, role: t('auth','defaultRole'), loggedInAt: new Date().toISOString() };
    saveJSON(K_AUTH, newAuth);
    sessionStorage.setItem(SS_UNLOCKED, '1');
    sessionStorage.removeItem(SS_PIN_LOCKED);
    showApp(newAuth);
  });

  document.getElementById('btnLoginSubmit').addEventListener('click', async ()=>{
    const pw = document.getElementById('loginPw').value;
    const errEl = document.getElementById('loginError');
    const ok = await verifySecret(K_PWHASH, pw);
    if(!ok){ errEl.textContent = t('auth','errPwWrong'); errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');
    document.getElementById('loginPw').value = '';
    sessionStorage.setItem(SS_UNLOCKED, '1');
    sessionStorage.removeItem(SS_PIN_LOCKED);
    showApp(loadJSON(K_AUTH, {name:t('auth','defaultName'), role:t('auth','defaultRole')}));
  });
  document.getElementById('loginPw').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('btnLoginSubmit').click(); });

  document.getElementById('btnPinSubmit').addEventListener('click', async ()=>{
    const pin = document.getElementById('pinInput').value;
    const errEl = document.getElementById('pinError');
    const ok = await verifySecret(K_PINHASH, pin);
    if(!ok){ errEl.textContent = t('auth','errPinWrong'); errEl.classList.remove('hidden'); return; }
    errEl.classList.add('hidden');
    document.getElementById('pinInput').value = '';
    sessionStorage.removeItem(SS_PIN_LOCKED);
    showApp(loadJSON(K_AUTH, {name:t('auth','defaultName'), role:t('auth','defaultRole')}));
  });
  document.getElementById('pinInput').addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('btnPinSubmit').click(); });

  document.getElementById('btnLock').addEventListener('click', ()=>{
    sessionStorage.setItem(SS_PIN_LOCKED, '1');
    showAuthCard('pin');
  });
  document.getElementById('btnLogout').addEventListener('click', ()=>{
    if(confirm(t('auth','confirmLogout'))){
      sessionStorage.removeItem(SS_UNLOCKED);
      sessionStorage.removeItem(SS_PIN_LOCKED);
      showAuthCard('login');
    }
  });
}
let appBooted = false;
function showApp(auth){
  document.getElementById('loginGate').classList.add('hidden');
  document.getElementById('appRoot').classList.remove('hidden');
  document.getElementById('userBadge').textContent = '👤 ' + auth.name + ' — ' + auth.role;
  if(!appBooted){
    appBooted = true;
    bootApp();
  } else {
    showView(state.currentView);
  }
}

/* ============================= التنقل بين الشاشات ============================= */
function showView(id){
  document.querySelectorAll('#appRoot > main > .view').forEach(v=>v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  state.currentView = id;
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===id));
  window.scrollTo({top:0, behavior:'instant'});
  if(id==='view-dashboard') renderDashboard();
  if(id==='view-students'){
    document.getElementById('students-detail-view').classList.add('hidden');
    document.getElementById('students-list-view').classList.remove('hidden');
    state.currentStudentId = null;
    renderStudentsTable();
  }
  if(id==='view-teachers') renderTeachersTable();
  if(id==='view-attendance') renderAttendanceView();
  if(id==='view-behavior') renderBehaviorView();
  if(id==='view-messages') renderMessagesView();
  if(id==='view-reports') { showReportsSubview('reports-home-view'); renderHome(); }
  if(id==='view-dailylog') renderDailyLog();
  if(id==='view-stats') renderStats();
  if(id==='view-settings') renderSettingsView();
}
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>showView(btn.dataset.view));
});

/* ============================= البحث الشامل في الرأس ============================= */
function initGlobalSearch(){
  const input = document.getElementById('globalSearch');
  const results = document.getElementById('globalSearchResults');
  input.addEventListener('input', ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ results.classList.add('hidden'); results.innerHTML=''; return; }
    const matches = state.students.filter(s=> s.fullName.toLowerCase().includes(q) || s.section.toLowerCase().includes(q)).slice(0,8);
    if(matches.length===0){ results.innerHTML = `<div class="sr-item">${esc(t('header','noResults'))}</div>`; }
    else {
      results.innerHTML = matches.map(s=>`<div class="sr-item" data-id="${esc(s.id)}">${esc(s.fullName)}<small>${esc(sectionLabel(s.section))}</small></div>`).join('');
    }
    results.classList.remove('hidden');
  });
  results.addEventListener('click', e=>{
    const item = e.target.closest('.sr-item[data-id]');
    if(!item) return;
    input.value=''; results.classList.add('hidden');
    showView('view-students');
    openStudentDetail(item.dataset.id);
  });
  document.addEventListener('click', e=>{
    if(!e.target.closest('.header-search')) results.classList.add('hidden');
  });
}

/* ============================= لوحة اليوم (Dashboard) ============================= */
function renderDashboard(){
  document.getElementById('todayDateLabel').textContent = new Date().toLocaleDateString(state.lang==='fr'?'fr-FR':'ar-MA', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
  const today = todayISO();
  const absToday = state.attendance.filter(a=>a.date===today && a.type==='absence').length;
  const tardyToday = state.attendance.filter(a=>a.date===today && a.type==='tardiness').length;
  const behToday = state.behavior.filter(b=>b.date===today).length;
  const pendingCases = state.behavior.filter(b=>b.fileStatus==='open').length;
  const msgsToday = state.msglog.filter(m=>m.date===today).length;

  const cards = [
    {n:absToday, l:t('dash','cardAbsentToday'), c:'red', i:'📋'},
    {n:tardyToday, l:t('dash','cardTardyToday'), c:'orange', i:'⏱️'},
    {n:behToday, l:t('dash','cardBehaviorToday'), c:'orange', i:'⚖️'},
    {n:pendingCases, l:t('dash','cardPendingCases'), c:'red', i:'📂'},
    {n:msgsToday, l:t('dash','cardMsgsToday'), c:'green', i:'✉️'}
  ];
  document.getElementById('statGrid').innerHTML = cards.map(c=>`
    <div class="stat-card ${c.c}">
      <div class="stat-icon">${c.i}</div>
      <div class="stat-num">${c.n}</div>
      <div class="stat-label">${esc(c.l)}</div>
    </div>`).join('');

  const events = [];
  state.attendance.filter(a=>a.date===today).forEach(a=>{
    const s = studentById(a.studentId); if(!s) return;
    events.push({time:a.time||'', tag: a.type==='absence' ? t('dash','tagAbsence'):t('dash','tagTardiness'), tagClass: a.type==='absence'?'tag-red':'tag-orange',
      text:`${iso(s.fullName)} — ${sectionLabel(s.section)}`});
  });
  state.behavior.filter(b=>b.date===today).forEach(b=>{
    const s = studentById(b.studentId); if(!s) return;
    events.push({time:'', tag:t('dash','tagBehavior'), tagClass: b.severity==='urgent'?'tag-red':'tag-orange', text:`${iso(s.fullName)} — ${caseTypeLabel(b.type)}`});
  });
  state.msglog.filter(m=>m.date===today).forEach(m=>{
    const s = studentById(m.studentId);
    events.push({time:'', tag:t('dash','tagContact'), tagClass:'tag-green', text:`${s? s.fullName : '—'} — ${msgLogLabel(m)}`});
  });
  const wrap = document.getElementById('dashRecentToday');
  wrap.innerHTML = events.length ? events.map(e=>`
    <div class="recent-item"><span class="tag ${e.tagClass}">${esc(e.tag)}</span><span>${esc(e.text)}</span>${e.time?`<span>${esc(e.time)}</span>`:''}</div>
  `).join('') : `<div class="empty-hint">${esc(t('dash','noEventsToday'))}</div>`;
}
document.querySelectorAll('.qa-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const qa = btn.dataset.qa;
    if(qa==='attendance') showView('view-attendance');
    else if(qa==='behavior') showView('view-behavior');
    else if(qa==='intervention'){ showView('view-behavior'); document.getElementById('behAction').value='إحالة على الإدارة'; }
    else if(qa==='summon'){ state.pendingMessageContext = {templateKey:'summon'}; showView('view-messages'); }
    else if(qa==='dailyreport'){ generateDailyReport(); }
  });
});

/* ============================= سجل التلاميذ ============================= */
function populateSectionFilterSelects(){
  populateSelectOptions(document.getElementById('studentSectionFilter'), state.settings.sections, t('common','allSections'), sectionLabel);
}
function renderStudentsTable(){
  populateSectionFilterSelects();
  const q = (document.getElementById('studentSearch').value||'').trim().toLowerCase();
  const secF = document.getElementById('studentSectionFilter').value;
  const statF = document.getElementById('studentStatusFilter').value;
  const rows = state.students.filter(s=>{
    if(secF && s.section!==secF) return false;
    if(statF && s.status!==statF) return false;
    if(q && !(s.fullName.toLowerCase().includes(q) || s.section.toLowerCase().includes(q))) return false;
    return true;
  });
  const tbody = document.getElementById('studentsTbody');
  if(rows.length===0){ tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">${esc(t('students','noneMatching'))}</td></tr>`; return; }
  tbody.innerHTML = rows.map(s=>`
    <tr>
      <td>${esc(s.fullName)}</td>
      <td>${esc(sectionLabel(s.section))}</td>
      <td><span class="status-badge status-${s.status}">${esc(statusLabel(s.status))}</span></td>
      <td>${esc(s.parentPhone||'—')}</td>
      <td>
        <button class="btn btn-primary btn-sm" data-stu-act="open" data-id="${esc(s.id)}">${esc(t('students','btnOpen'))}</button>
        <button class="btn btn-light btn-sm" data-stu-act="edit" data-id="${esc(s.id)}">${esc(t('students','btnEdit'))}</button>
        <button class="btn btn-danger btn-sm" data-stu-act="del" data-id="${esc(s.id)}">${esc(t('students','btnDelete'))}</button>
      </td>
    </tr>`).join('');
}
document.getElementById('studentSearch').addEventListener('input', renderStudentsTable);
document.getElementById('studentSectionFilter').addEventListener('change', renderStudentsTable);
document.getElementById('studentStatusFilter').addEventListener('change', renderStudentsTable);
document.getElementById('studentsTbody').addEventListener('click', e=>{
  const btn = e.target.closest('button[data-stu-act]'); if(!btn) return;
  const id = btn.dataset.id, act = btn.dataset.stuAct;
  if(act==='open') openStudentDetail(id);
  else if(act==='edit') openStudentForm(studentById(id));
  else if(act==='del'){
    const s = studentById(id);
    if(confirm(fmt(t('students','confirmDelete'),{n:s.fullName}))){
      state.students = state.students.filter(x=>x.id!==id);
      state.attendance = state.attendance.filter(x=>x.studentId!==id);
      state.behavior = state.behavior.filter(x=>x.studentId!==id);
      state.msglog = state.msglog.filter(x=>x.studentId!==id);
      saveStudents(); saveAttendance(); saveBehavior(); saveMsgLog();
      renderStudentsTable();
      toast(t('students','toastDeleted'));
    }
  }
});
document.getElementById('btnAddStudent').addEventListener('click', ()=>openStudentForm(null));

/* ---- تصدير واستيراد لائحة التلاميذ (CSV) ---- */
function csvEscape(v){
  const s = String(v===undefined||v===null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
}
function parseCSVLine(line){
  const delim = line.includes('\t') ? '\t' : (line.includes('،') ? '،' : ',');
  const out = []; let cur = ''; let inQuotes = false;
  for(let i=0;i<line.length;i++){
    const ch = line[i];
    if(inQuotes){
      if(ch === '"'){ if(line[i+1] === '"'){ cur += '"'; i++; } else inQuotes = false; }
      else cur += ch;
    } else {
      if(ch === '"') inQuotes = true;
      else if(ch === delim){ out.push(cur); cur=''; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out.map(s=>s.trim());
}
document.getElementById('btnExportStudents').addEventListener('click', ()=>{
  if(state.students.length===0){ toast(t('students','toastNoneToExport')); return; }
  const header = [t('students','csvName'), t('students','csvSection'), t('students','csvPhone1'), t('students','csvPhone2'), t('students','csvStatus'), t('students','csvNotes')];
  const rows = state.students.map(s=>[s.fullName, s.section, s.parentPhone||'', s.parentPhone2||'', statusLabel(s.status), s.notes||'']);
  const csv = [header].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = t('students','filenameBase') + todayISO() + '.csv';
  a.click(); URL.revokeObjectURL(a.href);
  toast(fmt(t('students','toastExported'),{n:state.students.length}));
});
document.getElementById('btnImportStudents').addEventListener('click', ()=>{
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${esc(t('students','importTitle'))}</h3>
      <p class="hint">${esc(t('students','importHint'))}<br>
      <b>${esc(t('students','importHintBold'))}</b></p>
      <div class="field-group"><textarea id="importCsvText" rows="8" placeholder="${esc(t('students','importPh'))}"></textarea></div>
      <div class="field-group">
        <label>${esc(t('students','importFileLabel'))}</label>
        <input type="file" id="importCsvFile" accept=".csv,text/csv">
      </div>
      <div class="modal-actions">
        <button class="btn btn-light" id="importCsvCancel">${esc(t('common','cancel'))}</button>
        <button class="btn btn-primary" id="importCsvOk">${esc(t('common','importList'))}</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#importCsvCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#importCsvFile').addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ bg.querySelector('#importCsvText').value = reader.result; };
    reader.readAsText(file);
  });
  bg.querySelector('#importCsvOk').addEventListener('click', ()=>{
    const text = bg.querySelector('#importCsvText').value.trim();
    if(!text){ toast(t('students','toastNoContent')); return; }
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    let added = 0, skippedDup = 0, skippedInvalid = 0;
    lines.forEach(line=>{
      const cols = parseCSVLine(line);
      const [fullName, section, parentPhone, parentPhone2, notes] = cols;
      if(!fullName || !section || fullName.includes('الاسم الكامل') || fullName.includes('Nom complet')){ skippedInvalid++; return; }
      const dup = state.students.some(s=>s.fullName===fullName && s.section===section);
      if(dup){ skippedDup++; return; }
      state.students.push({
        id: uid('stu'), fullName, section,
        parentPhone: parentPhone||'', parentPhone2: parentPhone2||'', notes: notes||'',
        status:'normal', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      added++;
    });
    saveStudents();
    renderStudentsTable();
    bg.remove();
    toast(fmt(t('students','toastImported'),{added}) + (skippedDup?fmt(t('students','toastDupSkipped'),{n:skippedDup}):'') + (skippedInvalid?fmt(t('students','toastInvalidSkipped'),{n:skippedInvalid}):''));
  });
});

function openStudentForm(student){
  const isEdit = !!student;
  const s = student || {fullName:'', section: state.settings.sections[0]||'', parentPhone:'', parentPhone2:'', notes:'', status:'normal'};
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${isEdit ? esc(t('students','editTitle')) : esc(t('students','addTitle'))}</h3>
      <div class="field-group"><label>${esc(t('students','labelFullName'))} <span class="req">*</span></label><input type="text" id="stuName" value="${esc(s.fullName)}"></div>
      <div class="field-group"><label>${esc(t('students','labelSection'))} <span class="req">*</span></label>
        <input type="text" id="stuSection" list="stuSectionList" value="${esc(s.section)}">
        <datalist id="stuSectionList">${state.settings.sections.map(x=>`<option value="${esc(x)}">`).join('')}</datalist>
      </div>
      <div class="field-group"><label>${esc(t('students','labelPhone1'))}</label><input type="text" id="stuPhone1" value="${esc(s.parentPhone)}" placeholder="06XXXXXXXX"></div>
      <div class="field-group"><label>${esc(t('students','labelPhone2'))}</label><input type="text" id="stuPhone2" value="${esc(s.parentPhone2)}"></div>
      <div class="field-group"><label>${esc(t('students','labelNotes'))}</label><textarea id="stuNotes">${esc(s.notes)}</textarea></div>
      <div class="field-group"><label>${esc(t('students','labelStatus'))}</label>
        <select id="stuStatus">
          <option value="normal" ${s.status==='normal'?'selected':''}>${esc(statusLabel('normal'))}</option>
          <option value="tracking" ${s.status==='tracking'?'selected':''}>${esc(statusLabel('tracking'))}</option>
          <option value="urgent" ${s.status==='urgent'?'selected':''}>${esc(statusLabel('urgent'))}</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-light" id="stuCancel">${esc(t('common','cancel'))}</button>
        <button class="btn btn-primary" id="stuSave">💾 ${esc(t('common','save'))}</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#stuCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#stuSave').addEventListener('click', ()=>{
    const fullName = bg.querySelector('#stuName').value.trim();
    const section = bg.querySelector('#stuSection').value.trim();
    if(!fullName || !section){ toast(t('students','toastNeedNameSection')); return; }
    const data = {
      fullName, section,
      parentPhone: bg.querySelector('#stuPhone1').value.trim(),
      parentPhone2: bg.querySelector('#stuPhone2').value.trim(),
      notes: bg.querySelector('#stuNotes').value.trim(),
      status: bg.querySelector('#stuStatus').value,
      updatedAt: new Date().toISOString()
    };
    if(isEdit){
      Object.assign(student, data);
    } else {
      state.students.push({ id: uid('stu'), createdAt: new Date().toISOString(), ...data });
    }
    saveStudents();
    bg.remove();
    renderStudentsTable();
    if(isEdit && state.currentStudentId === student.id) openStudentDetail(student.id);
    toast(t('students','toastSaved'));
  });
}

function openStudentDetail(id){
  const s = studentById(id);
  if(!s){ toast(t('students','toastNotFound')); return; }
  state.currentStudentId = id;
  document.getElementById('students-list-view').classList.add('hidden');
  document.getElementById('students-detail-view').classList.remove('hidden');
  document.getElementById('studentDetailName').textContent = s.fullName;
  document.getElementById('sdSection').textContent = sectionLabel(s.section);
  document.getElementById('sdStatus').innerHTML = `<span class="status-badge status-${s.status}">${esc(statusLabel(s.status))}</span>`;
  document.getElementById('sdPhone1').textContent = s.parentPhone || '—';
  document.getElementById('sdPhone2').textContent = s.parentPhone2 || '—';
  document.getElementById('sdNotes').textContent = s.notes || '—';
  renderStudentTabs(id);
}
document.getElementById('btnBackToStudents').addEventListener('click', ()=>{
  document.getElementById('students-detail-view').classList.add('hidden');
  document.getElementById('students-list-view').classList.remove('hidden');
  state.currentStudentId = null;
  renderStudentsTable();
});
document.getElementById('btnEditStudent').addEventListener('click', ()=>openStudentForm(studentById(state.currentStudentId)));
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    ['attendance','behavior','messages'].forEach(t2=>{
      document.getElementById('sdTab'+t2[0].toUpperCase()+t2.slice(1)).classList.toggle('hidden', t2!==btn.dataset.tab);
    });
  });
});
function renderStudentTabs(id){
  const att = state.attendance.filter(a=>a.studentId===id).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('sdTabAttendance').innerHTML = att.length ? `
    <table class="log-table"><thead><tr><th>${esc(t('reports','colType'))}</th><th>${esc(t('common','date'))}</th><th>${esc(t('common','time'))}</th><th>${esc(t('attendance','justification'))}</th><th>${esc(t('common','reason'))}</th></tr></thead>
    <tbody>${att.map(a=>`<tr><td>${esc(attTypeLabel(a.type))}</td><td>${esc(a.date)}</td><td>${esc(a.time||'—')}</td><td>${esc(justifLabel(a.justification))}</td><td>${esc(a.reason||'—')}</td></tr>`).join('')}</tbody></table>
  ` : `<div class="empty-hint">${esc(t('students','noAttendanceRecords'))}</div>`;

  const beh = state.behavior.filter(b=>b.studentId===id).sort((a,b)=>b.date.localeCompare(a.date));
  document.getElementById('sdTabBehavior').innerHTML = beh.length ? `
    <table class="log-table"><thead><tr><th>${esc(t('reports','colType'))}</th><th>${esc(t('behavior','severity'))}</th><th>${esc(t('common','date'))}</th><th>${esc(t('behavior','action'))}</th><th>${esc(t('behavior','file'))}</th></tr></thead>
    <tbody>${beh.map(b=>`<tr><td>${esc(caseTypeLabel(b.type))}</td><td>${esc(severityLabel(b.severity))}</td><td>${esc(b.date)}</td><td>${esc(actionLabel(b.action)||'—')}</td><td>${esc(fileStatusLabel(b.fileStatus))}</td></tr>`).join('')}</tbody></table>
  ` : `<div class="empty-hint">${esc(t('students','noBehaviorRecords'))}</div>`;

  const msgs = state.msglog.filter(m=>m.studentId===id).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  document.getElementById('sdTabMessages').innerHTML = msgs.length ? `
    <table class="log-table"><thead><tr><th>${esc(t('messages','template'))}</th><th>${esc(t('common','date'))}</th></tr></thead>
    <tbody>${msgs.map(m=>`<tr><td>${esc(msgLogLabel(m))}</td><td>${esc(m.date)}</td></tr>`).join('')}</tbody></table>
  ` : `<div class="empty-hint">${esc(t('students','noMessages'))}</div>`;
}
document.getElementById('btnStudentReport').addEventListener('click', ()=>generateStudentReport(state.currentStudentId));

/* ============================= لائحة الأساتذة ============================= */
function renderTeachersTable(){
  const q = (document.getElementById('teacherSearch').value||'').trim().toLowerCase();
  const rows = state.teachers.filter(tt=>{
    if(!q) return true;
    return tt.fullName.toLowerCase().includes(q) || (tt.subject||'').toLowerCase().includes(q) || (tt.sections||'').toLowerCase().includes(q);
  });
  const tbody = document.getElementById('teachersTbody');
  if(rows.length===0){ tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:20px">${esc(t('teachers','noneMatching'))}</td></tr>`; return; }
  tbody.innerHTML = rows.map(tc=>`
    <tr>
      <td>${esc(tc.fullName)}</td>
      <td>${esc(tc.subject||'—')}</td>
      <td>${esc(tc.sections||'—')}</td>
      <td>${esc(tc.phone||'—')}</td>
      <td>
        <button class="btn btn-light btn-sm" data-tch-act="edit" data-id="${esc(tc.id)}">${esc(t('students','btnEdit'))}</button>
        <button class="btn btn-danger btn-sm" data-tch-act="del" data-id="${esc(tc.id)}">${esc(t('students','btnDelete'))}</button>
      </td>
    </tr>`).join('');
}
document.getElementById('teacherSearch').addEventListener('input', renderTeachersTable);
document.getElementById('teachersTbody').addEventListener('click', e=>{
  const btn = e.target.closest('button[data-tch-act]'); if(!btn) return;
  const id = btn.dataset.id, act = btn.dataset.tchAct;
  const teacher = state.teachers.find(tc=>tc.id===id);
  if(act==='edit') openTeacherForm(teacher);
  else if(act==='del'){
    if(confirm(fmt(t('teachers','confirmDelete'),{n:teacher.fullName}))){
      state.teachers = state.teachers.filter(tc=>tc.id!==id);
      saveTeachers(); renderTeachersTable();
      toast(t('teachers','toastDeleted'));
    }
  }
});
document.getElementById('btnAddTeacher').addEventListener('click', ()=>openTeacherForm(null));
function openTeacherForm(teacher){
  const isEdit = !!teacher;
  const tc = teacher || {fullName:'', subject:'', sections:'', phone:'', notes:''};
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${isEdit ? esc(t('teachers','editTitle')) : esc(t('teachers','addTitle'))}</h3>
      <div class="field-group"><label>${esc(t('teachers','labelFullName'))} <span class="req">*</span></label><input type="text" id="tchName" value="${esc(tc.fullName)}"></div>
      <div class="field-group"><label>${esc(t('teachers','labelSubject'))}</label><input type="text" id="tchSubject" value="${esc(tc.subject)}"></div>
      <div class="field-group"><label>${esc(t('teachers','labelSections'))}</label><input type="text" id="tchSections" value="${esc(tc.sections)}" placeholder="${esc(t('teachers','sectionsPh'))}"></div>
      <div class="field-group"><label>${esc(t('teachers','labelPhone'))}</label><input type="text" id="tchPhone" value="${esc(tc.phone)}" placeholder="06XXXXXXXX"></div>
      <div class="field-group"><label>${esc(t('teachers','labelNotes'))}</label><textarea id="tchNotes">${esc(tc.notes)}</textarea></div>
      <div class="modal-actions">
        <button class="btn btn-light" id="tchCancel">${esc(t('common','cancel'))}</button>
        <button class="btn btn-primary" id="tchSave">💾 ${esc(t('common','save'))}</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#tchCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#tchSave').addEventListener('click', ()=>{
    const fullName = bg.querySelector('#tchName').value.trim();
    if(!fullName){ toast(t('teachers','toastNeedName')); return; }
    const data = {
      fullName,
      subject: bg.querySelector('#tchSubject').value.trim(),
      sections: bg.querySelector('#tchSections').value.trim(),
      phone: bg.querySelector('#tchPhone').value.trim(),
      notes: bg.querySelector('#tchNotes').value.trim(),
      updatedAt: new Date().toISOString()
    };
    if(isEdit) Object.assign(teacher, data);
    else state.teachers.push({ id: uid('tch'), createdAt: new Date().toISOString(), ...data });
    saveTeachers();
    bg.remove();
    renderTeachersTable();
    toast(t('teachers','toastSaved'));
  });
}
document.getElementById('btnExportTeachers').addEventListener('click', ()=>{
  if(state.teachers.length===0){ toast(t('teachers','toastNoneToExport')); return; }
  const header = [t('teachers','csvName'), t('teachers','csvSubject'), t('teachers','csvSections'), t('teachers','csvPhone'), t('teachers','csvNotes')];
  const rows = state.teachers.map(tc=>[tc.fullName, tc.subject||'', tc.sections||'', tc.phone||'', tc.notes||'']);
  const csv = [header].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = t('teachers','filenameBase') + todayISO() + '.csv';
  a.click(); URL.revokeObjectURL(a.href);
  toast(fmt(t('teachers','toastExported'),{n:state.teachers.length}));
});
document.getElementById('btnImportTeachers').addEventListener('click', ()=>{
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${esc(t('teachers','importTitle'))}</h3>
      <p class="hint">${esc(t('teachers','importHint'))}<br>
      <b>${esc(t('teachers','importHintBold'))}</b></p>
      <div class="field-group"><textarea id="importTchText" rows="8" placeholder="${esc(t('teachers','importPh'))}"></textarea></div>
      <div class="field-group">
        <label>${esc(t('teachers','importFileLabel'))}</label>
        <input type="file" id="importTchFile" accept=".csv,text/csv">
      </div>
      <div class="modal-actions">
        <button class="btn btn-light" id="importTchCancel">${esc(t('common','cancel'))}</button>
        <button class="btn btn-primary" id="importTchOk">${esc(t('common','importList'))}</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#importTchCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#importTchFile').addEventListener('change', e=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{ bg.querySelector('#importTchText').value = reader.result; };
    reader.readAsText(file);
  });
  bg.querySelector('#importTchOk').addEventListener('click', ()=>{
    const text = bg.querySelector('#importTchText').value.trim();
    if(!text){ toast(t('teachers','toastNoContent')); return; }
    const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    let added = 0, skippedDup = 0, skippedInvalid = 0;
    lines.forEach(line=>{
      const cols = parseCSVLine(line);
      const [fullName, subject, sections, phone, notes] = cols;
      if(!fullName || fullName.includes('الاسم الكامل') || fullName.includes('Nom complet')){ skippedInvalid++; return; }
      const dup = state.teachers.some(tc=>tc.fullName===fullName && tc.subject===(subject||''));
      if(dup){ skippedDup++; return; }
      state.teachers.push({
        id: uid('tch'), fullName, subject: subject||'', sections: sections||'', phone: phone||'', notes: notes||'',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });
      added++;
    });
    saveTeachers();
    renderTeachersTable();
    bg.remove();
    toast(fmt(t('teachers','toastImported'),{added}) + (skippedDup?fmt(t('teachers','toastDupSkipped'),{n:skippedDup}):'') + (skippedInvalid?fmt(t('teachers','toastInvalidSkipped'),{n:skippedInvalid}):''));
  });
});

/* ============================= الغياب والتأخر ============================= */
function renderAttendanceView(){
  populateSelectOptions(document.getElementById('attSection'), state.settings.sections, undefined, sectionLabel);
  populateAttStudents();
  document.getElementById('attDate').value = todayISO();
  document.getElementById('attTime').value = nowHM();
  document.getElementById('attAlertBox').classList.add('hidden');
  renderAttendanceList();
}
function populateAttStudents(){
  const sec = document.getElementById('attSection').value;
  populateSelectOptions(document.getElementById('attStudent'), studentsInSection(sec).map(s=>s.fullName));
}
document.getElementById('attSection').addEventListener('change', populateAttStudents);

function currentAttStudent(){
  const sec = document.getElementById('attSection').value;
  const name = document.getElementById('attStudent').value;
  return state.students.find(s=>s.section===sec && s.fullName===name);
}

function renderAttendanceList(){
  const q = (document.getElementById('attListSearch').value||'').trim().toLowerCase();
  const rows = state.attendance.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(a=>{
    const s = studentById(a.studentId);
    if(!s) return false;
    if(q && !(s.fullName.toLowerCase().includes(q) || s.section.toLowerCase().includes(q))) return false;
    return true;
  }).slice(0,40);
  const tbody = document.getElementById('attTbody');
  tbody.innerHTML = rows.length ? rows.map(a=>{
    const s = studentById(a.studentId);
    return `<tr>
      <td>${esc(s.fullName)}</td><td>${esc(sectionLabel(s.section))}</td><td>${esc(attTypeLabel(a.type))}</td>
      <td>${esc(a.date)}</td><td>${esc(justifLabel(a.justification))}</td>
      <td><button class="btn btn-danger btn-sm" data-att-del="${esc(a.id)}">${esc(t('students','btnDelete'))}</button></td>
    </tr>`;
  }).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:16px">${esc(t('attendance','noneYet'))}</td></tr>`;
}
document.getElementById('attListSearch').addEventListener('input', renderAttendanceList);
document.getElementById('attTbody').addEventListener('click', e=>{
  const btn = e.target.closest('[data-att-del]'); if(!btn) return;
  if(confirm(t('attendance','confirmDelete'))){
    state.attendance = state.attendance.filter(a=>a.id!==btn.dataset.attDel);
    saveAttendance(); renderAttendanceList();
    toast(t('attendance','toastDeleted'));
  }
});

function saveAttendanceEntry(){
  const student = currentAttStudent();
  if(!student){ toast(t('attendance','toastNeedStudent')); return null; }
  const record = {
    id: uid('att'), studentId: student.id,
    type: document.getElementById('attType').value,
    date: document.getElementById('attDate').value || todayISO(),
    time: document.getElementById('attTime').value || '',
    reason: document.getElementById('attReason').value.trim(),
    justification: document.getElementById('attJustification').value,
    note: document.getElementById('attNote').value.trim(),
    createdAt: new Date().toISOString()
  };
  state.attendance.push(record);
  saveAttendance();

  const count = state.attendance.filter(a=>a.studentId===student.id && a.type===record.type).length;
  const box = document.getElementById('attAlertBox');
  if(count>=3){
    box.textContent = fmt(t('attendance','alertRepeat'), {n:count, type:attTypeLabel(record.type)});
    box.className = 'alert-box danger';
    box.classList.remove('hidden');
    if(student.status==='normal'){ student.status='tracking'; student.updatedAt=new Date().toISOString(); saveStudents(); }
  } else {
    box.classList.add('hidden');
  }
  renderAttendanceList();
  renderDashboard();
  return record;
}
document.getElementById('btnAttSave').addEventListener('click', ()=>{ if(saveAttendanceEntry()) toast(t('attendance','toastSaved')); });
document.getElementById('btnAttAddToDaily').addEventListener('click', ()=>{
  if(saveAttendanceEntry()) toast(t('attendance','toastAddedToDaily'));
});
document.getElementById('btnAttMessage').addEventListener('click', ()=>{
  const student = currentAttStudent();
  if(!student){ toast(t('attendance','toastNeedStudent')); return; }
  const type = document.getElementById('attType').value;
  state.pendingMessageContext = { studentId: student.id, templateKey: type==='absence'?'absence':'tardiness' };
  showView('view-messages');
});

/* ============================= السلوك والتدخلات ============================= */
function renderBehaviorView(){
  populateSelectOptions(document.getElementById('behSection'), state.settings.sections, undefined, sectionLabel);
  populateBehStudents();
  populateSelectOptions(document.getElementById('behType'), state.settings.caseTypes, undefined, caseTypeLabel);
  populateSelectOptions(document.getElementById('behAction'), ACTIONS_LIST, undefined, actionLabel);
  document.getElementById('behDate').value = todayISO();
  renderBehaviorList();
}
function populateBehStudents(){
  const sec = document.getElementById('behSection').value;
  populateSelectOptions(document.getElementById('behStudent'), studentsInSection(sec).map(s=>s.fullName));
}
document.getElementById('behSection').addEventListener('change', populateBehStudents);
function currentBehStudent(){
  const sec = document.getElementById('behSection').value;
  const name = document.getElementById('behStudent').value;
  return state.students.find(s=>s.section===sec && s.fullName===name);
}
function renderBehaviorList(){
  const q = (document.getElementById('behListSearch').value||'').trim().toLowerCase();
  const fileF = document.getElementById('behFileFilter').value;
  const rows = state.behavior.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).filter(b=>{
    const s = studentById(b.studentId); if(!s) return false;
    if(fileF && b.fileStatus!==fileF) return false;
    if(q && !(s.fullName.toLowerCase().includes(q) || b.type.toLowerCase().includes(q))) return false;
    return true;
  });
  const tbody = document.getElementById('behTbody');
  tbody.innerHTML = rows.length ? rows.map(b=>{
    const s = studentById(b.studentId);
    return `<tr>
      <td>${esc(s.fullName)}</td><td>${esc(caseTypeLabel(b.type))}</td><td>${esc(severityLabel(b.severity))}</td>
      <td>${esc(b.date)}</td><td>${esc(fileStatusLabel(b.fileStatus))}</td>
      <td>
        <button class="btn btn-light btn-sm" data-beh-toggle="${esc(b.id)}">${b.fileStatus==='open'?esc(t('behavior','btnCloseFile')):esc(t('behavior','btnReopenFile'))}</button>
        <button class="btn btn-danger btn-sm" data-beh-del="${esc(b.id)}">${esc(t('students','btnDelete'))}</button>
      </td>
    </tr>`;
  }).join('') : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:16px">${esc(t('behavior','noneYet'))}</td></tr>`;
}
document.getElementById('behListSearch').addEventListener('input', renderBehaviorList);
document.getElementById('behFileFilter').addEventListener('change', renderBehaviorList);
document.getElementById('behTbody').addEventListener('click', e=>{
  const delBtn = e.target.closest('[data-beh-del]');
  const toggleBtn = e.target.closest('[data-beh-toggle]');
  if(delBtn){
    if(confirm(t('behavior','confirmDelete'))){
      state.behavior = state.behavior.filter(b=>b.id!==delBtn.dataset.behDel);
      saveBehavior(); renderBehaviorList();
      toast(t('behavior','toastDeleted'));
    }
  } else if(toggleBtn){
    const rec = state.behavior.find(b=>b.id===toggleBtn.dataset.behToggle);
    rec.fileStatus = rec.fileStatus==='open' ? 'closed' : 'open';
    rec.updatedAt = new Date().toISOString();
    saveBehavior(); renderBehaviorList();
    toast(t('behavior','toastFileUpdated'));
  }
});
document.getElementById('btnBehSave').addEventListener('click', ()=>{
  const student = currentBehStudent();
  if(!student){ toast(t('behavior','toastNeedStudent')); return; }
  const description = document.getElementById('behDescription').value.trim();
  if(!description){ toast(t('behavior','toastNeedDescription')); return; }
  const record = {
    id: uid('beh'), studentId: student.id,
    date: document.getElementById('behDate').value || todayISO(),
    type: document.getElementById('behType').value,
    severity: document.getElementById('behSeverity').value,
    description,
    action: document.getElementById('behAction').value,
    followUpDate: document.getElementById('behFollowUp').value,
    fileStatus: document.getElementById('behFileStatus').value,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  state.behavior.push(record);
  if(record.severity==='urgent') student.status = 'urgent';
  else if(student.status==='normal') student.status = 'tracking';
  student.updatedAt = new Date().toISOString();
  saveBehavior(); saveStudents();
  renderBehaviorList(); renderDashboard();
  toast(t('behavior','toastSaved'));
});
document.getElementById('btnBehMessage').addEventListener('click', ()=>{
  const student = currentBehStudent();
  if(!student){ toast(t('behavior','toastNeedStudent')); return; }
  state.pendingMessageContext = { studentId: student.id, templateKey:'behavior', caseType: document.getElementById('behType').value };
  showView('view-messages');
});

/* ============================= التواصل مع أولياء الأمور ============================= */
function populateMsgTemplateSelect(){
  const sel = document.getElementById('msgTemplate');
  sel.innerHTML = state.settings.messageTemplates.map(tt=>`<option value="${esc(tt.key)}">${esc(L(tt.title))}</option>`).join('');
}
function renderMessagesView(){
  populateMsgTemplateSelect();
  populateSelectOptions(document.getElementById('msgSection'), state.settings.sections, undefined, sectionLabel);
  populateMsgStudents();
  const ctx = state.pendingMessageContext;
  if(ctx){
    if(ctx.templateKey) document.getElementById('msgTemplate').value = ctx.templateKey;
    if(ctx.studentId){
      const s = studentById(ctx.studentId);
      if(s){
        document.getElementById('msgSection').value = s.section;
        populateMsgStudents();
        document.getElementById('msgStudent').value = s.fullName;
      }
    }
    state._msgCaseType = ctx.caseType || '';
    state.pendingMessageContext = null;
  }
  updateMsgPreview();
  renderMsgLog();
}
function populateMsgStudents(){
  const sec = document.getElementById('msgSection').value;
  populateSelectOptions(document.getElementById('msgStudent'), studentsInSection(sec).map(s=>s.fullName));
}
document.getElementById('msgSection').addEventListener('change', ()=>{ populateMsgStudents(); updateMsgPreview(); });
document.getElementById('msgStudent').addEventListener('change', updateMsgPreview);
document.getElementById('msgTemplate').addEventListener('change', updateMsgPreview);
function currentMsgStudent(){
  const sec = document.getElementById('msgSection').value;
  const name = document.getElementById('msgStudent').value;
  return state.students.find(s=>s.section===sec && s.fullName===name);
}
function updateMsgPreview(){
  const tplKey = document.getElementById('msgTemplate').value;
  const tpl = state.settings.messageTemplates.find(tt=>tt.key===tplKey);
  const student = currentMsgStudent();
  if(!tpl){ document.getElementById('msgPreview').value=''; return; }
  let text = L(tpl.body);
  text = text.replaceAll('{name}', student ? student.fullName : '—')
             .replaceAll('{section}', student ? sectionLabel(student.section) : '—')
             .replaceAll('{date}', todayISO())
             .replaceAll('{institution}', state.settings.institution || 'المؤسسة')
             .replaceAll('{caseType}', state._msgCaseType ? caseTypeLabel(state._msgCaseType) : '—');
  document.getElementById('msgPreview').value = text;
}
document.getElementById('btnMsgWhatsapp').addEventListener('click', ()=>{
  const student = currentMsgStudent();
  if(!student){ toast(t('messages','toastNeedStudent')); return; }
  const phone = waPhone(student.parentPhone);
  if(!phone){ toast(t('messages','toastNoPhone')); return; }
  const text = document.getElementById('msgPreview').value;
  const tplKey = document.getElementById('msgTemplate').value;
  const tpl = state.settings.messageTemplates.find(tt=>tt.key===tplKey);
  state.msglog.unshift({ id: uid('msg'), studentId: student.id, templateKey: tplKey, templateTitle: tpl?L(tpl.title):tplKey, date: todayISO(), createdAt: new Date().toISOString() });
  saveMsgLog();
  renderMsgLog(); renderDashboard();
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
});
document.getElementById('btnMsgCopy').addEventListener('click', async ()=>{
  const text = document.getElementById('msgPreview').value;
  try{ await navigator.clipboard.writeText(text); toast(t('messages','toastCopied')); }
  catch(e){ toast(t('messages','toastCopyFailed')); }
});
document.getElementById('btnMsgAI').addEventListener('click', async ()=>{
  const btn = document.getElementById('btnMsgAI');
  const student = currentMsgStudent();
  const draftText = document.getElementById('msgPreview').value.trim();
  if(!draftText){ toast(t('messages','toastNoDraft')); return; }
  const originalLabel = btn.innerHTML;
  btn.disabled = true; btn.textContent = t('messages','aiImproving');
  try{
    const resp = await fetch('/.netlify/functions/draft-message', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        draftText,
        studentName: student ? student.fullName : '',
        section: student ? sectionLabel(student.section) : '',
        caseType: state._msgCaseType ? caseTypeLabel(state._msgCaseType) : '',
        institution: state.settings.institution
      })
    });
    const data = await resp.json().catch(()=>({}));
    if(!resp.ok || !data.text){ toast(data.error || t('messages','toastAiError')); return; }
    document.getElementById('msgPreview').value = data.text;
    toast(t('messages','toastAiOk'));
  }catch(e){
    toast(t('messages','toastAiNetError'));
  }finally{
    btn.disabled = false; btn.innerHTML = originalLabel;
  }
});
function renderMsgLog(){
  const rows = state.msglog.slice(0,20);
  document.getElementById('msgLogTbody').innerHTML = rows.length ? rows.map(m=>{
    const s = studentById(m.studentId);
    return `<tr><td>${esc(s? s.fullName : '—')}</td><td>${esc(msgLogLabel(m))}</td><td>${esc(m.date)}</td></tr>`;
  }).join('') : `<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:16px">${esc(t('messages','noneYet'))}</td></tr>`;
}

/* ============================= محرك التقارير المرنة (نماذج قابلة للتخصيص) ============================= */
function showReportsSubview(id){
  document.querySelectorAll('#view-reports > .view, #view-reports > #reports-home-view').forEach(v=>v.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
function renderCategoryFilterOptions(){
  const sel = document.getElementById('categoryFilter');
  const cats = [...new Set(allTemplates().map(tt=>tt.category))];
  sel.innerHTML = `<option value="">${esc(t('reports','allCategories'))}</option>` + cats.map(c=>`<option value="${esc(c)}">${esc(categoryLabel(c))}</option>`).join('');
}
function renderHome(){
  renderCategoryFilterOptions();
  const q = (document.getElementById('searchInput').value || '').trim().toLowerCase();
  const catF = document.getElementById('categoryFilter').value;
  const tpls = allTemplates().filter(tt=>{
    if(catF && tt.category!==catF) return false;
    if(q && !L(tt.name).toLowerCase().includes(q)) return false;
    return true;
  });
  const byCat = {};
  tpls.forEach(tt=>{ (byCat[tt.category] = byCat[tt.category]||[]).push(tt); });
  const container = document.getElementById('templatesContainer');
  const cats = Object.keys(byCat);
  if(cats.length===0){ container.innerHTML = `<div class="empty">${esc(t('reports','noneMatching'))}</div>`; return; }
  container.innerHTML = cats.map(cat=>{
    const cards = byCat[cat].map(tt=>{
      const isCustom = !tt.builtin;
      return `
      <div class="tpl-card">
        <div class="top"><span class="emoji">${categoryIcon(tt.category)}</span><span class="name">${esc(L(tt.name))}</span>${isCustom?`<span class="badge-custom">${esc(t('reports','custom'))}</span>`:''}</div>
        <div class="meta">${fmt(t('reports','fieldsCount'),{n:tt.fields.length})}</div>
        <div class="actions">
          <button class="btn btn-primary btn-sm" data-act="open" data-id="${esc(tt.id)}">${esc(t('reports','btnOpenForm'))}</button>
          ${isCustom
            ? `<button class="btn btn-light btn-sm" data-act="edit" data-id="${esc(tt.id)}">${esc(t('reports','btnEditTpl'))}</button><button class="btn btn-danger btn-sm" data-act="del" data-id="${esc(tt.id)}">${esc(t('reports','btnDeleteTpl'))}</button>`
            : `<button class="btn btn-light btn-sm" data-act="dup" data-id="${esc(tt.id)}">${esc(t('reports','btnDuplicateTpl'))}</button>`}
        </div>
      </div>`;
    }).join('');
    return `<div class="cat-block"><h3>${categoryIcon(cat)} ${esc(categoryLabel(cat))}</h3><div class="cards-grid">${cards}</div></div>`;
  }).join('');
}
document.getElementById('templatesContainer').addEventListener('click', e=>{
  const btn = e.target.closest('button[data-act]'); if(!btn) return;
  const id = btn.dataset.id, act = btn.dataset.act, tpl = findTemplate(id);
  if(!tpl) return;
  if(act==='open') openFillView(tpl, null);
  else if(act==='dup') openBuilder(cloneTemplateForEdit(tpl), true);
  else if(act==='edit') openBuilder(tpl, false);
  else if(act==='del'){
    if(confirm(fmt(t('reports','confirmDeleteTpl'),{n:L(tpl.name)}))){
      state.customTemplates = state.customTemplates.filter(tt=>tt.id!==id);
      saveTemplates(); renderHome(); toast(t('reports','toastTplDeleted'));
    }
  }
});
document.getElementById('searchInput').addEventListener('input', renderHome);
document.getElementById('categoryFilter').addEventListener('change', renderHome);

function blankRow(columns){ const o={}; columns.forEach(c=>o[c]=''); return o; }
function openFillView(tpl, existingReport){
  state.currentTemplate = tpl;
  state.currentReportId = existingReport ? existingReport.id : null;
  state.formValues = existingReport ? JSON.parse(JSON.stringify(existingReport.values)) : {};
  state.extraFields = existingReport ? JSON.parse(JSON.stringify(existingReport.extraFields||[])) : [];
  tpl.fields.forEach(f=>{
    if(state.formValues[f.id] !== undefined) return;
    if(f.type==='table') state.formValues[f.id] = [blankRow(L(f.columns))];
    else if(f.type==='date' && !existingReport) state.formValues[f.id] = todayISO();
    else state.formValues[f.id] = '';
  });
  document.getElementById('fillTitle').textContent = L(tpl.name);
  renderFillForm(); renderExtraFields(); renderDocPreview();
  showReportsSubview('view-fill');
}
function renderFillForm(){
  const tpl = state.currentTemplate;
  document.getElementById('formFields').innerHTML = tpl.fields.map(renderFieldInput).join('');
  tpl.fields.forEach(f=>{
    if(f.type==='table') bindTableEvents(f);
    else {
      const el = document.getElementById('inp_'+f.id); if(!el) return;
      const evt = f.type==='checkbox' ? 'change' : 'input';
      el.addEventListener(evt, ()=>{ state.formValues[f.id] = f.type==='checkbox' ? el.checked : el.value; renderDocPreview(); });
    }
  });
}
function renderFieldInput(f){
  const val = state.formValues[f.id];
  const label = L(f.label);
  const reqMark = f.required ? '<span class="req">*</span>' : '';
  switch(f.type){
    case 'textarea': return `<div class="field-group"><label>${esc(label)} ${reqMark}</label><textarea id="inp_${f.id}">${esc(val)}</textarea></div>`;
    case 'select': return `<div class="field-group"><label>${esc(label)} ${reqMark}</label><select id="inp_${f.id}"><option value="">${esc(t('reports','selectPlaceholder'))}</option>${L(f.options||[]).map(o=>`<option value="${esc(o)}" ${val===o?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`;
    case 'checkbox': return `<div class="field-group checkbox-row"><input type="checkbox" id="inp_${f.id}" ${val?'checked':''}><label>${esc(label)}</label></div>`;
    case 'table': { const cols = L(f.columns); return `<div class="field-group"><label>${esc(label)}</label><table class="dyn-table" id="tbl_${f.id}"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}<th></th></tr></thead><tbody>${renderTableRows(f)}</tbody></table><button type="button" class="btn btn-light btn-sm" style="margin-top:6px" data-add-row="${f.id}">${esc(t('reports','btnAddRow'))}</button></div>`; }
    case 'date': case 'time': case 'number': return `<div class="field-group"><label>${esc(label)} ${reqMark}</label><input type="${f.type}" id="inp_${f.id}" value="${esc(val)}"></div>`;
    default: return `<div class="field-group"><label>${esc(label)} ${reqMark}</label><input type="text" id="inp_${f.id}" value="${esc(val)}"></div>`;
  }
}
function renderTableRows(f){
  const rows = state.formValues[f.id] || [];
  const cols = L(f.columns);
  return rows.map((row,ri)=>`<tr data-row="${ri}">${cols.map(c=>`<td><input type="text" data-col="${esc(c)}" value="${esc(row[c]||'')}"></td>`).join('')}<td><button type="button" class="rm-row-btn" data-rm-row="${ri}">${esc(t('reports','btnRemoveRow'))}</button></td></tr>`).join('');
}
function bindTableEvents(f){
  const tbl = document.getElementById('tbl_'+f.id);
  document.querySelector(`[data-add-row="${f.id}"]`).addEventListener('click', ()=>{
    state.formValues[f.id].push(blankRow(L(f.columns)));
    tbl.querySelector('tbody').innerHTML = renderTableRows(f);
    bindTableRowEvents(f, tbl); renderDocPreview();
  });
  bindTableRowEvents(f, tbl);
}
function bindTableRowEvents(f, tbl){
  tbl.querySelectorAll('input[data-col]').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      const ri = +inp.closest('tr').dataset.row;
      state.formValues[f.id][ri][inp.dataset.col] = inp.value;
      renderDocPreview();
    });
  });
  tbl.querySelectorAll('[data-rm-row]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ri = +btn.dataset.rmRow;
      state.formValues[f.id].splice(ri,1);
      if(state.formValues[f.id].length===0) state.formValues[f.id].push(blankRow(L(f.columns)));
      tbl.querySelector('tbody').innerHTML = renderTableRows(f);
      bindTableRowEvents(f, tbl); renderDocPreview();
    });
  });
}
function renderExtraFields(){
  const wrap = document.getElementById('extraFieldsList');
  if(state.extraFields.length===0){ wrap.innerHTML = `<div style="color:var(--muted);font-size:.82rem;margin-bottom:8px">${esc(t('reports','noExtraFields'))}</div>`; return; }
  wrap.innerHTML = state.extraFields.map((ef,i)=>`
    <div class="extra-field-row" data-i="${i}">
      <div class="grow"><label style="font-size:.8rem;font-weight:700">${esc(ef.label)}</label>
      ${ef.type==='textarea' ? `<textarea data-extra-val="${i}">${esc(ef.value)}</textarea>` : `<input type="${ef.type}" data-extra-val="${i}" value="${esc(ef.value)}">`}</div>
      <button type="button" class="rm" data-extra-rm="${i}">🗑️</button>
    </div>`).join('');
  wrap.querySelectorAll('[data-extra-val]').forEach(el=>el.addEventListener('input', ()=>{ state.extraFields[+el.dataset.extraVal].value = el.value; renderDocPreview(); }));
  wrap.querySelectorAll('[data-extra-rm]').forEach(btn=>btn.addEventListener('click', ()=>{ state.extraFields.splice(+btn.dataset.extraRm,1); renderExtraFields(); renderDocPreview(); }));
}
document.getElementById('btnAddExtraField').addEventListener('click', ()=>{
  const label = prompt(t('reports','promptExtraLabel')); if(!label) return;
  const typeChoice = prompt(t('reports','promptExtraType'), '1');
  const type = ({'1':'text','2':'textarea','3':'number','4':'date'})[typeChoice] || 'text';
  state.extraFields.push({id:uid('ex'), label, type, value:''});
  renderExtraFields(); renderDocPreview();
});

function renderLetterheadHead(){
  const s = state.settings;
  return `<div class="doc-head">
    <div class="kingdom">${esc(L(KINGDOM_LINE))}</div>
    <div class="line">${esc(L(MINISTRY_LINE))}</div>
    <div class="line">${esc(s.academy || (state.lang==='fr'?'Académie régionale':'الأكاديمية الجهوية'))} — ${esc(s.niaba || (state.lang==='fr'?'Délégation provinciale':'النيابة الإقليمية'))}</div>
    <div class="inst">${esc(s.institution || 'مؤسسة الحنان')}</div>
  </div>`;
}
function docSignatureBlock(){
  const s = state.settings;
  return `<div class="doc-sign">
    <div class="box"><div class="cap">${esc(t('doc','supervisorCap'))}${s.supervisor?'<br>'+esc(s.supervisor):''}</div><div class="line-blank"></div></div>
    <div class="box"><div class="cap">${esc(t('doc','adminCap'))}</div><div class="line-blank"></div></div>
  </div>`;
}
function renderFieldPreview(f){
  const val = state.formValues[f.id];
  const label = L(f.label);
  if(f.type==='table'){
    const cols = L(f.columns);
    const rows = (val||[]).filter(r=>cols.some(c=>(r[c]||'').trim()!==''));
    if(rows.length===0) return '';
    return `<div class="doc-row"><div class="lbl">${esc(label)}</div><table class="doc-table"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if(f.type==='checkbox') return `<div class="doc-row"><span class="lbl">${esc(label)}:</span> ${val?esc(t('doc','yes')):esc(t('doc','no'))}</div>`;
  if(val===undefined||val===null||String(val).trim()==='') return '';
  return `<div class="doc-row"><div class="lbl">${esc(label)}</div><div class="val">${esc(val)}</div></div>`;
}
function renderDocPreview(){
  const tpl = state.currentTemplate, s = state.settings;
  const fieldsHtml = tpl.fields.map(renderFieldPreview).join('');
  const extraHtml = state.extraFields.filter(ef=>String(ef.value).trim()!=='').map(ef=>`<div class="doc-row"><div class="lbl">${esc(ef.label)}</div><div class="val">${esc(ef.value)}</div></div>`).join('');
  document.getElementById('docPreview').innerHTML = `
    ${renderLetterheadHead()}
    <div class="doc-title">${esc(L(tpl.name))}</div>
    <div class="doc-meta"><span>${esc(t('doc','schoolYear'))} ${esc(s.year || '—')}</span><span>${esc(t('doc','editDate'))} ${esc(todayISO())}</span></div>
    ${fieldsHtml}
    ${extraHtml ? `<div class="doc-row"><div class="lbl" style="color:var(--gold)">${esc(t('doc','extraInfo'))}</div></div>${extraHtml}` : ''}
    ${docSignatureBlock()}
  `;
}
document.getElementById('btnBackFromFill').addEventListener('click', ()=>{ showReportsSubview('reports-home-view'); renderHome(); });
document.getElementById('btnClearForm').addEventListener('click', ()=>{
  if(!confirm(t('reports','confirmClearForm'))) return;
  const tpl = state.currentTemplate; state.formValues = {}; state.extraFields = [];
  tpl.fields.forEach(f=>{ state.formValues[f.id] = f.type==='table' ? [blankRow(L(f.columns))] : ''; });
  renderFillForm(); renderExtraFields(); renderDocPreview();
});
document.getElementById('btnPrintReport').addEventListener('click', ()=>window.print());
document.getElementById('btnSaveReport').addEventListener('click', ()=>{
  const tpl = state.currentTemplate;
  const missing = tpl.fields.filter(f=>f.required && f.type!=='table' && f.type!=='checkbox' && !String(state.formValues[f.id]||'').trim());
  if(missing.length){ toast(fmt(t('reports','toastFillRequired'),{list:missing.map(f=>L(f.label)).join('، ')})); return; }
  const record = {
    id: state.currentReportId || uid('rep'), templateId: tpl.id, templateName: L(tpl.name), category: tpl.category,
    savedAt: new Date().toISOString(), values: JSON.parse(JSON.stringify(state.formValues)), extraFields: JSON.parse(JSON.stringify(state.extraFields))
  };
  const idx = state.reports.findIndex(r=>r.id===record.id);
  if(idx>=0) state.reports[idx]=record; else state.reports.unshift(record);
  state.currentReportId = record.id;
  saveReports();
  toast(t('reports','toastReportSaved'));
});

function cloneTemplateForEdit(tpl){
  const name = L(tpl.name) + t('reports','duplicateSuffix');
  return { id: uid('tpl'), builtin:false, category: tpl.category, name,
    fields: JSON.parse(JSON.stringify(tpl.fields)).map(f=>({...f, id:uid('f'), label: L(f.label), options: f.options?L(f.options):undefined, columns: f.columns?L(f.columns):undefined })) };
}
function openBuilder(tpl, isDuplicate){
  state.builderEditingId = (tpl && !isDuplicate && !tpl.builtin) ? tpl.id : null;
  const base = tpl || {name:'', category:'', fields:[]};
  document.getElementById('tplName').value = L(base.name);
  document.getElementById('tplCategory').value = base.category ? categoryLabel(base.category) : '';
  state.builderFields = JSON.parse(JSON.stringify(base.fields)).map(f=>({...f, label: L(f.label), options: f.options?L(f.options):f.options, columns: f.columns?L(f.columns):f.columns }));
  populateCatList(); renderBuilderFields();
  document.getElementById('builderTitle').textContent = state.builderEditingId ? t('reports','builderEditTitle') : t('reports','builderNewTitle');
  showReportsSubview('view-builder');
}
function populateCatList(){
  const dl = document.getElementById('catList');
  const labels = [...new Set(allTemplates().map(tt=>categoryLabel(tt.category)))];
  dl.innerHTML = labels.map(c=>`<option value="${esc(c)}">`).join('');
}
function renderBuilderFields(){
  const wrap = document.getElementById('builderFields');
  if(state.builderFields.length===0){ wrap.innerHTML = `<div class="empty" style="margin-bottom:12px">${esc(t('reports','noExtraFields'))}</div>`; return; }
  wrap.innerHTML = state.builderFields.map((f,i)=>`
    <div class="field-editor" data-i="${i}">
      <div class="row1">
        <input type="text" data-b="label" placeholder="${esc(t('reports','fieldLabelPh'))}" value="${esc(f.label)}">
        <select data-b="type">${Object.entries(STRINGS[state.lang].fieldtype).map(([v,l])=>`<option value="${v}" ${f.type===v?'selected':''}>${esc(l)}</option>`).join('')}</select>
      </div>
      ${f.type==='select' ? `<div class="row2"><textarea data-b="options" placeholder="${esc(t('reports','optionsPh'))}">${esc((f.options||[]).join('\n'))}</textarea></div>` : ''}
      ${f.type==='table' ? `<div class="row2"><textarea data-b="columns" placeholder="${esc(t('reports','columnsPh'))}">${esc((f.columns||[]).join('\n'))}</textarea></div>` : ''}
      <div class="row3">
        <label class="req-check"><input type="checkbox" data-b="required" ${f.required?'checked':''}> ${esc(t('reports','requiredCheck'))}</label>
        <div class="move-btns"><button type="button" data-b="up">⬆️</button><button type="button" data-b="down">⬇️</button><button type="button" data-b="del">🗑️</button></div>
      </div>
    </div>`).join('');
  wrap.querySelectorAll('.field-editor').forEach(box=>{
    const i = +box.dataset.i;
    box.querySelector('[data-b=label]').addEventListener('input', e=>state.builderFields[i].label = e.target.value);
    box.querySelector('[data-b=type]').addEventListener('change', e=>{
      state.builderFields[i].type = e.target.value;
      if(e.target.value==='select' && !state.builderFields[i].options) state.builderFields[i].options=[];
      if(e.target.value==='table' && !state.builderFields[i].columns) state.builderFields[i].columns=['عمود 1','عمود 2'];
      renderBuilderFields();
    });
    const opt = box.querySelector('[data-b=options]'); if(opt) opt.addEventListener('input', e=>{ state.builderFields[i].options = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean); });
    const cols = box.querySelector('[data-b=columns]'); if(cols) cols.addEventListener('input', e=>{ state.builderFields[i].columns = e.target.value.split('\n').map(s=>s.trim()).filter(Boolean); });
    box.querySelector('[data-b=required]').addEventListener('change', e=>state.builderFields[i].required = e.target.checked);
    box.querySelector('[data-b=up]').addEventListener('click', ()=>{ if(i===0) return; [state.builderFields[i-1],state.builderFields[i]]=[state.builderFields[i],state.builderFields[i-1]]; renderBuilderFields(); });
    box.querySelector('[data-b=down]').addEventListener('click', ()=>{ if(i===state.builderFields.length-1) return; [state.builderFields[i+1],state.builderFields[i]]=[state.builderFields[i],state.builderFields[i+1]]; renderBuilderFields(); });
    box.querySelector('[data-b=del]').addEventListener('click', ()=>{ state.builderFields.splice(i,1); renderBuilderFields(); });
  });
}
document.getElementById('btnAddField').addEventListener('click', ()=>{ state.builderFields.push({id:uid('f'), type:'text', label:'', required:false}); renderBuilderFields(); });
document.getElementById('btnNewTpl').addEventListener('click', ()=>openBuilder(null,false));
document.getElementById('btnBackFromBuilder').addEventListener('click', ()=>{ showReportsSubview('reports-home-view'); renderHome(); });
document.getElementById('btnSaveTemplate').addEventListener('click', ()=>{
  const name = document.getElementById('tplName').value.trim();
  const rawCat = document.getElementById('tplCategory').value.trim();
  const category = rawCat ? categoryIdFromLabel(rawCat) : 'other';
  if(!name){ toast(t('reports','toastNeedTplName')); return; }
  if(state.builderFields.length===0){ toast(t('reports','toastNeedField')); return; }
  if(state.builderFields.find(f=>!f.label.trim())){ toast(t('reports','toastFieldNoLabel')); return; }
  if(state.builderEditingId){
    const idx = state.customTemplates.findIndex(tt=>tt.id===state.builderEditingId);
    if(idx>=0) state.customTemplates[idx] = {...state.customTemplates[idx], name, category, fields: state.builderFields};
  } else {
    state.customTemplates.push({ id: uid('tpl'), builtin:false, name, category, fields: state.builderFields });
  }
  saveTemplates(); toast(t('reports','toastTplSaved'));
  showReportsSubview('reports-home-view'); renderHome();
});

/* ============================= التقارير الذكية (تُولَّد تلقائياً من البيانات) ============================= */
function ensureReportsViewVisible(){
  document.querySelectorAll('#appRoot > main > .view').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-reports').classList.remove('hidden');
  state.currentView = 'view-reports';
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view==='view-reports'));
}
function openSmartPrint(title, bodyHtml){
  ensureReportsViewVisible();
  document.getElementById('smartPrintTitle').textContent = title;
  document.getElementById('smartDocPreview').innerHTML = `
    ${renderLetterheadHead()}
    <div class="doc-title">${esc(title)}</div>
    <div class="doc-meta"><span>${esc(t('doc','schoolYear'))} ${esc(state.settings.year||'—')}</span><span>${esc(t('doc','editDate'))} ${esc(todayISO())}</span></div>
    ${bodyHtml}
    ${docSignatureBlock()}
  `;
  showReportsSubview('view-smart-print');
}
document.getElementById('btnBackFromSmartPrint').addEventListener('click', ()=>{ showReportsSubview('reports-home-view'); renderHome(); });
document.getElementById('btnPrintSmart').addEventListener('click', ()=>window.print());

function simpleTable(headers, rows){
  if(rows.length===0) return `<div class="empty-hint">${esc(t('reports','noData'))}</div>`;
  return `<table class="doc-table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function generateDailyReport(){
  const today = todayISO();
  const att = state.attendance.filter(a=>a.date===today);
  const beh = state.behavior.filter(b=>b.date===today);
  const msgs = state.msglog.filter(m=>m.date===today);
  const absences = att.filter(a=>a.type==='absence');
  const tardies = att.filter(a=>a.type==='tardiness');
  const body = `
    <div class="doc-row"><div class="lbl">${esc(t('reports','summaryLabel'))}</div><div class="val">${esc(fmt(t('reports','summaryText'),{a:absences.length,t:tardies.length,b:beh.length,m:msgs.length}))}</div></div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','absenceLabel'))}</div>${simpleTable([t('reports','colStudent'),t('reports','colSection'),t('reports','colStatus')], absences.map(a=>{const s=studentById(a.studentId); return [s?s.fullName:'—', s?sectionLabel(s.section):'—', justifLabel(a.justification)];}))}</div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','tardinessLabel'))}</div>${simpleTable([t('reports','colStudent'),t('reports','colSection'),t('reports','colTime'),t('reports','colStatus')], tardies.map(a=>{const s=studentById(a.studentId); return [s?s.fullName:'—', s?sectionLabel(s.section):'—', a.time||'—', justifLabel(a.justification)];}))}</div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','behaviorLabel'))}</div>${simpleTable([t('reports','colStudent'),t('reports','colType'),t('reports','colSeverity'),t('reports','colAction')], beh.map(b=>{const s=studentById(b.studentId); return [s?s.fullName:'—', caseTypeLabel(b.type), severityLabel(b.severity), actionLabel(b.action)||'—'];}))}</div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','contactsLabel'))}</div>${simpleTable([t('reports','colStudent'),t('reports','colTemplate')], msgs.map(m=>{const s=studentById(m.studentId); return [s?s.fullName:'—', msgLogLabel(m)];}))}</div>
  `;
  openSmartPrint(fmt(t('reports','dailyReportTitle'),{d:today}), body);
}
document.getElementById('btnSmartDaily').addEventListener('click', generateDailyReport);
document.getElementById('btnGenerateDailyFromLog').addEventListener('click', generateDailyReport);

function generateStudentReport(studentId){
  const s = studentById(studentId);
  if(!s){ toast(t('students','toastNotFound')); return; }
  const att = state.attendance.filter(a=>a.studentId===studentId).sort((a,b)=>b.date.localeCompare(a.date));
  const beh = state.behavior.filter(b=>b.studentId===studentId).sort((a,b)=>b.date.localeCompare(a.date));
  const msgs = state.msglog.filter(m=>m.studentId===studentId).sort((a,b)=>b.date.localeCompare(a.date));
  const body = `
    <div class="doc-row"><div class="lbl">${esc(t('reports','studentInfoLabel'))}</div><div class="val">${esc(fmt(t('reports','studentInfoText'),{n:s.fullName, s:sectionLabel(s.section), st:statusLabel(s.status), p:s.parentPhone||'—'}))}</div></div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','attendanceHistoryLabel'))}</div>${simpleTable([t('reports','colType'),t('common','date'),t('common','time'),t('reports','colStatus'),t('common','reason')], att.map(a=>[attTypeLabel(a.type), a.date, a.time||'—', justifLabel(a.justification), a.reason||'—']))}</div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','behaviorHistoryLabel'))}</div>${simpleTable([t('reports','colType'),t('behavior','severity'),t('common','date'),t('behavior','action'),t('behavior','file')], beh.map(b=>[caseTypeLabel(b.type), severityLabel(b.severity), b.date, actionLabel(b.action)||'—', fileStatusLabel(b.fileStatus)]))}</div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','contactsHistoryLabel'))}</div>${simpleTable([t('reports','colTemplate'),t('common','date')], msgs.map(m=>[msgLogLabel(m), m.date]))}</div>
  `;
  openSmartPrint(fmt(t('reports','studentReportTitle'),{n:s.fullName}), body);
}
document.getElementById('btnSmartStudent').addEventListener('click', ()=>{
  openPickerModal(t('reports','pickStudent'), state.students.map(s=>({value:s.id, label:`${iso(s.fullName)} — ${sectionLabel(s.section)}`})), (id)=>generateStudentReport(id));
});

function generateSectionReport(section){
  const students = studentsInSection(section);
  const rows = students.map(s=>{
    const absC = state.attendance.filter(a=>a.studentId===s.id && a.type==='absence').length;
    const tardyC = state.attendance.filter(a=>a.studentId===s.id && a.type==='tardiness').length;
    const behC = state.behavior.filter(b=>b.studentId===s.id).length;
    return [s.fullName, absC, tardyC, behC, statusLabel(s.status)];
  });
  const body = `
    <div class="doc-row"><div class="lbl">${esc(t('reports','sectionLabel'))}</div><div class="val">${esc(fmt(t('reports','sectionText'),{s:sectionLabel(section), n:students.length}))}</div></div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','studentsListLabel'))}</div>${simpleTable([t('reports','colFullName'),t('reports','colAbsCount'),t('reports','colTardyCount'),t('reports','colBehCount'),t('reports','colOverallStatus')], rows)}</div>
  `;
  openSmartPrint(fmt(t('reports','sectionReportTitle'),{s:sectionLabel(section)}), body);
}
document.getElementById('btnSmartSection').addEventListener('click', ()=>{
  openPickerModal(t('reports','pickSection'), state.settings.sections.map(s=>({value:s, label:sectionLabel(s)})), (sec)=>generateSectionReport(sec));
});

function generateMonthlyAbsenceReport(section){
  const mk = monthKey(todayISO());
  const students = studentsInSection(section);
  const rows = students.map(s=>{
    const absC = state.attendance.filter(a=>a.studentId===s.id && a.type==='absence' && monthKey(a.date)===mk).length;
    const tardyC = state.attendance.filter(a=>a.studentId===s.id && a.type==='tardiness' && monthKey(a.date)===mk).length;
    return [s.fullName, sectionLabel(s.section), absC, tardyC];
  }).filter(r=>r[2]>0 || r[3]>0);
  const body = `
    <div class="doc-row"><div class="lbl">${esc(t('reports','monthLabel'))}</div><div class="val">${esc(fmt(t('reports','monthText'),{m:mk, s: section ? fmt(t('reports','monthSectionSuffix'),{s:sectionLabel(section)}) : t('reports','monthAllSuffix')}))}</div></div>
    <div class="doc-row"><div class="lbl">${esc(t('reports','monthlyStudentsLabel'))}</div>${simpleTable([t('reports','colFullName'),t('reports','colSection'),t('reports','colAbsTotal'),t('reports','colTardyTotal')], rows)}</div>
  `;
  openSmartPrint(fmt(t('reports','monthlyReportTitle'),{m:mk}), body);
}
document.getElementById('btnSmartMonthlyAbsence').addEventListener('click', ()=>{
  openPickerModal(t('reports','pickSectionAll'), [{value:'',label:t('reports','allSectionsOpt')}].concat(state.settings.sections.map(s=>({value:s,label:sectionLabel(s)}))), (sec)=>generateMonthlyAbsenceReport(sec));
});

function generateRepeatedTardinessReport(){
  const counts = {};
  state.attendance.filter(a=>a.type==='tardiness').forEach(a=>{ counts[a.studentId] = (counts[a.studentId]||0)+1; });
  const rows = Object.entries(counts).filter(([,c])=>c>=3).sort((a,b)=>b[1]-a[1]).map(([id,c])=>{
    const s = studentById(id); return s ? [s.fullName, sectionLabel(s.section), c] : null;
  }).filter(Boolean);
  const body = `<div class="doc-row"><div class="lbl">${esc(t('reports','repeatedLabel'))}</div>${simpleTable([t('reports','colFullName'),t('reports','colSection'),t('reports','colTardyTotal')], rows)}</div>`;
  openSmartPrint(t('reports','repeatedTardinessTitle'), body);
}
document.getElementById('btnSmartRepeatedTardiness').addEventListener('click', generateRepeatedTardinessReport);

function openPickerModal(title, options, onConfirm){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal"><h3>${esc(title)}</h3>
    <div class="field-group"><select id="pickerSelect">${options.map(o=>`<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}</select></div>
    <div class="modal-actions"><button class="btn btn-light" id="pickerCancel">${esc(t('reports','pickerCancel'))}</button><button class="btn btn-primary" id="pickerOk">${esc(t('reports','pickerGenerate'))}</button></div>
  </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#pickerCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#pickerOk').addEventListener('click', ()=>{
    const val = bg.querySelector('#pickerSelect').value;
    bg.remove();
    onConfirm(val);
  });
}

/* ============================= سجل اليوم ============================= */
function renderDailyLog(){
  const today = todayISO();
  document.getElementById('dailyLogDate').textContent = today;
  const att = state.attendance.filter(a=>a.date===today);
  document.getElementById('dlAttendance').innerHTML = att.length ? att.map(a=>{
    const s = studentById(a.studentId);
    return `<div class="recent-item"><span class="tag ${a.type==='absence'?'tag-red':'tag-orange'}">${esc(attTypeLabel(a.type))}</span><span>${iso(esc(s?s.fullName:'—'))} — ${esc(s?sectionLabel(s.section):'—')}</span><span>${esc(justifLabel(a.justification))}</span></div>`;
  }).join('') : `<div class="empty-hint">${esc(t('dailylog','noAttendance'))}</div>`;

  const beh = state.behavior.filter(b=>b.date===today);
  document.getElementById('dlBehavior').innerHTML = beh.length ? beh.map(b=>{
    const s = studentById(b.studentId);
    return `<div class="recent-item"><span class="tag ${b.severity==='urgent'?'tag-red':'tag-orange'}">${esc(caseTypeLabel(b.type))}</span><span>${esc(s?s.fullName:'—')}</span><span>${esc(actionLabel(b.action)||'—')}</span></div>`;
  }).join('') : `<div class="empty-hint">${esc(t('dailylog','noBehavior'))}</div>`;

  const msgs = state.msglog.filter(m=>m.date===today);
  document.getElementById('dlMessages').innerHTML = msgs.length ? msgs.map(m=>{
    const s = studentById(m.studentId);
    return `<div class="recent-item"><span class="tag tag-green">${esc(msgLogLabel(m))}</span><span>${esc(s?s.fullName:'—')}</span></div>`;
  }).join('') : `<div class="empty-hint">${esc(t('dailylog','noMessages'))}</div>`;

  const open = state.behavior.filter(b=>b.fileStatus==='open');
  document.getElementById('dlOpenFiles').innerHTML = open.length ? open.map(b=>{
    const s = studentById(b.studentId);
    return `<div class="recent-item"><span class="tag tag-red">${esc(t('dailylog','openTag'))}</span><span>${iso(esc(s?s.fullName:'—'))} — ${esc(caseTypeLabel(b.type))}</span><span>${esc(b.date)}</span></div>`;
  }).join('') : `<div class="empty-hint">${esc(t('dailylog','noOpenFiles'))}</div>`;
}

/* ============================= الإحصائيات ============================= */
function barList(containerId, data){
  const max = Math.max(1, ...data.map(d=>d.v));
  document.getElementById(containerId).innerHTML = data.length ? data.map(d=>`
    <div class="bar-item"><div class="bar-label">${esc(d.k)}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.round(d.v/max*100)}%"></div></div><div class="bar-val">${d.v}</div></div>
  `).join('') : `<div class="empty-hint">${esc(t('stats','noData'))}</div>`;
}
function renderStats(){
  const totalStudents = state.students.length;
  const totalAbs = state.attendance.filter(a=>a.type==='absence').length;
  const totalTardy = state.attendance.filter(a=>a.type==='tardiness').length;
  const openCases = state.behavior.filter(b=>b.fileStatus==='open').length;
  const closedCases = state.behavior.filter(b=>b.fileStatus==='closed').length;
  const totalMsgs = state.msglog.length;
  document.getElementById('statsSummaryGrid').innerHTML = [
    {n:totalStudents,l:t('stats','totalStudents'),c:'blue',i:'🧑‍🎓'},
    {n:totalAbs,l:t('stats','totalAbs'),c:'red',i:'📋'},
    {n:totalTardy,l:t('stats','totalTardy'),c:'orange',i:'⏱️'},
    {n:openCases,l:t('stats','openCases'),c:'red',i:'📂'},
    {n:closedCases,l:t('stats','closedCases'),c:'green',i:'✅'},
    {n:totalMsgs,l:t('stats','totalMsgs'),c:'green',i:'✉️'}
  ].map(c=>`<div class="stat-card ${c.c}"><div class="stat-icon">${c.i}</div><div class="stat-num">${c.n}</div><div class="stat-label">${esc(c.l)}</div></div>`).join('');

  barList('statAbsenceBySection', state.settings.sections.map(sec=>({k:sectionLabel(sec), v: state.attendance.filter(a=>a.type==='absence' && studentById(a.studentId)?.section===sec).length})));
  barList('statTardyBySection', state.settings.sections.map(sec=>({k:sectionLabel(sec), v: state.attendance.filter(a=>a.type==='tardiness' && studentById(a.studentId)?.section===sec).length})));

  const tardyCounts = {}, absCounts = {};
  state.attendance.forEach(a=>{
    const bucket = a.type==='tardiness' ? tardyCounts : absCounts;
    bucket[a.studentId] = (bucket[a.studentId]||0)+1;
  });
  function topList(counts){
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([id,c])=>{
      const s = studentById(id); return s ? {k:s.fullName, v:c} : null;
    }).filter(Boolean);
  }
  barList('statTopTardy', topList(tardyCounts));
  barList('statTopAbsence', topList(absCounts));
}

/* ============================= الإعدادات ============================= */
function renderSettingsView(){
  const s = state.settings;
  document.getElementById('setInstitution').value = s.institution;
  document.getElementById('setNiaba').value = s.niaba;
  document.getElementById('setAcademy').value = s.academy;
  document.getElementById('setYear').value = s.year;
  document.getElementById('setSupervisor').value = s.supervisor;
  renderChips('settingsSections', s.sections, removeSection, sectionLabel);
  renderChips('settingsCaseTypes', s.caseTypes, removeCaseType, caseTypeLabel);
  renderMessageTemplatesSettings();
}
function renderChips(containerId, items, onRemove, labelFn){
  document.getElementById(containerId).innerHTML = items.map((it,i)=>`<span class="chip">${esc(labelFn?labelFn(it):it)}<button data-i="${i}">×</button></span>`).join('');
  document.getElementById(containerId).querySelectorAll('button').forEach(btn=>btn.addEventListener('click', ()=>onRemove(+btn.dataset.i)));
}
function removeSection(i){ state.settings.sections.splice(i,1); saveSettings(); renderSettingsView(); toast(t('settings','toastRemoved')); }
function removeCaseType(i){ state.settings.caseTypes.splice(i,1); saveSettings(); renderSettingsView(); toast(t('settings','toastRemoved')); }
document.getElementById('btnAddSection').addEventListener('click', ()=>{
  const v = document.getElementById('newSectionInput').value.trim();
  if(!v) return;
  state.settings.sections.push(v); saveSettings();
  document.getElementById('newSectionInput').value='';
  renderSettingsView(); toast(t('settings','toastAdded'));
});
document.getElementById('btnAddCaseType').addEventListener('click', ()=>{
  const v = document.getElementById('newCaseTypeInput').value.trim();
  if(!v) return;
  state.settings.caseTypes.push(v); saveSettings();
  document.getElementById('newCaseTypeInput').value='';
  renderSettingsView(); toast(t('settings','toastAdded'));
});
function renderMessageTemplatesSettings(){
  const wrap = document.getElementById('settingsMessageTemplates');
  wrap.innerHTML = state.settings.messageTemplates.map((tt,i)=>`
    <div class="field-group">
      <label>${esc(L(tt.title))}</label>
      <textarea data-mt="${i}" rows="3">${esc(L(tt.body))}</textarea>
    </div>`).join('') + `<button class="btn btn-primary btn-sm" id="btnSaveMsgTemplates">${esc(t('settings','btnSaveMsgTemplates'))}</button>
    <p class="hint">${esc(t('settings','msgVarsHint'))}</p>`;
  document.getElementById('btnSaveMsgTemplates').addEventListener('click', ()=>{
    wrap.querySelectorAll('[data-mt]').forEach(ta=>{
      const tpl = state.settings.messageTemplates[+ta.dataset.mt];
      if(tpl.body && typeof tpl.body==='object') tpl.body[state.lang] = ta.value;
      else tpl.body = { ar: state.lang==='ar'?ta.value:tpl.body, fr: state.lang==='fr'?ta.value:tpl.body };
    });
    saveSettings(); toast(t('settings','toastMsgTemplatesSaved'));
  });
}
document.getElementById('btnSaveSettings').addEventListener('click', ()=>{
  state.settings.institution = document.getElementById('setInstitution').value.trim();
  state.settings.niaba = document.getElementById('setNiaba').value.trim();
  state.settings.academy = document.getElementById('setAcademy').value.trim();
  state.settings.year = document.getElementById('setYear').value.trim();
  state.settings.supervisor = document.getElementById('setSupervisor').value.trim();
  saveSettings();
  toast(t('settings','toastInfoSaved'));
});

/* ---- تغيير كلمة المرور / الرقم السري (يتطلب التحقق من كلمة المرور الحالية) ---- */
function openSecretChangeModal({title, currentLabel, verifyKey, newLabel, confirmLabel, newPattern, patternErr, saveKey, successMsg}){
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `
    <div class="modal">
      <h3>${esc(title)}</h3>
      <div class="field-group"><label>${esc(currentLabel)}</label><input type="password" id="scCurrent"></div>
      <div class="field-group"><label>${esc(newLabel)}</label><input type="password" id="scNew"></div>
      <div class="field-group"><label>${esc(confirmLabel)}</label><input type="password" id="scNewConfirm"></div>
      <p class="auth-error hidden" id="scError"></p>
      <div class="modal-actions">
        <button class="btn btn-light" id="scCancel">${esc(t('common','cancel'))}</button>
        <button class="btn btn-primary" id="scSave">💾 ${esc(t('common','save'))}</button>
      </div>
    </div>`;
  document.body.appendChild(bg);
  bg.addEventListener('click', e=>{ if(e.target===bg) bg.remove(); });
  bg.querySelector('#scCancel').addEventListener('click', ()=>bg.remove());
  bg.querySelector('#scSave').addEventListener('click', async ()=>{
    const errEl = bg.querySelector('#scError');
    const current = bg.querySelector('#scCurrent').value;
    const okCurrent = await verifySecret(verifyKey, current);
    if(!okCurrent){ errEl.textContent = t('settings','scErrCurrentWrong'); errEl.classList.remove('hidden'); return; }
    const val = bg.querySelector('#scNew').value;
    const confirm2 = bg.querySelector('#scNewConfirm').value;
    if(!newPattern.test(val)){ errEl.textContent = patternErr; errEl.classList.remove('hidden'); return; }
    if(val !== confirm2){ errEl.textContent = t('settings','scErrMismatch'); errEl.classList.remove('hidden'); return; }
    await setSecret(saveKey, val);
    bg.remove();
    toast(successMsg);
  });
}
document.getElementById('btnChangePassword').addEventListener('click', ()=>{
  openSecretChangeModal({
    title:t('settings','scChangePwTitle'), currentLabel:t('settings','scCurrentLabel'), verifyKey:K_PWHASH,
    newLabel:t('settings','scNewPwLabel'), confirmLabel:t('settings','scConfirmPwLabel'), newPattern:/^.{4,}$/, patternErr:t('auth','errPwShort'),
    saveKey:K_PWHASH, successMsg:t('settings','scPwSuccessMsg')
  });
});
document.getElementById('btnChangePin').addEventListener('click', ()=>{
  openSecretChangeModal({
    title:t('settings','scChangePinTitle'), currentLabel:t('settings','scCurrentLabel'), verifyKey:K_PWHASH,
    newLabel:t('settings','scNewPinLabel'), confirmLabel:t('settings','scConfirmPinLabel'), newPattern:/^\d{4,6}$/, patternErr:t('auth','errPinFormat'),
    saveKey:K_PINHASH, successMsg:t('settings','scPinSuccessMsg')
  });
});

document.getElementById('btnExportAll').addEventListener('click', ()=>{
  const data = {
    settings: state.settings, students: state.students, teachers: state.teachers, attendance: state.attendance, behavior: state.behavior,
    msglog: state.msglog, customTemplates: state.customTemplates, reports: state.reports, exportedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = t('settings','exportFilenameBase') + todayISO() + '.json';
  a.click(); URL.revokeObjectURL(a.href);
});
document.getElementById('importFile').addEventListener('change', e=>{
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(data.settings) state.settings = {...state.settings, ...data.settings};
      if(Array.isArray(data.students)) state.students = state.students.concat(data.students);
      if(Array.isArray(data.teachers)) state.teachers = state.teachers.concat(data.teachers);
      if(Array.isArray(data.attendance)) state.attendance = state.attendance.concat(data.attendance);
      if(Array.isArray(data.behavior)) state.behavior = state.behavior.concat(data.behavior);
      if(Array.isArray(data.msglog)) state.msglog = state.msglog.concat(data.msglog);
      if(Array.isArray(data.customTemplates)) state.customTemplates = state.customTemplates.concat(data.customTemplates);
      if(Array.isArray(data.reports)) state.reports = state.reports.concat(data.reports);
      saveSettings(); saveStudents(); saveTeachers(); saveAttendance(); saveBehavior(); saveMsgLog(); saveTemplates(); saveReports();
      renderSettingsView();
      toast(t('settings','toastImportedOk'));
    }catch(err){ toast(t('settings','toastImportInvalid')); }
    e.target.value = '';
  };
  reader.readAsText(file);
});
document.getElementById('btnWipeData').addEventListener('click', ()=>{
  const phrase = prompt(t('settings','wipePrompt'));
  if(phrase !== t('settings','wipeConfirmPhrase')){ toast(t('settings','toastWipeMismatch')); return; }
  [K_SETTINGS,K_STUDENTS,K_TEACHERS,K_ATTENDANCE,K_BEHAVIOR,K_MSGLOG,K_TEMPLATES,K_REPORTS,K_SEEDED,K_AUTH,K_PWHASH,K_PINHASH].forEach(k=>localStorage.removeItem(k));
  sessionStorage.removeItem(SS_UNLOCKED); sessionStorage.removeItem(SS_PIN_LOCKED);
  toast(t('settings','toastWiped'));
  setTimeout(()=>location.reload(), 900);
});

/* ============================= اللغة (عربي / فرنسي) ============================= */
function applyStaticStrings(){
  document.documentElement.lang = state.lang==='fr' ? 'fr' : 'ar-MA';
  document.documentElement.dir = state.lang==='fr' ? 'ltr' : 'rtl';
  document.title = t('app','title') + (state.lang==='fr' ? ' – École Al Hanane' : ' – مؤسسة الحنان');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const [ns,k] = el.dataset.i18n.split('.');
    if(STRINGS[state.lang][ns] && STRINGS[state.lang][ns][k]!==undefined) el.textContent = STRINGS[state.lang][ns][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const [ns,k] = el.dataset.i18nPh.split('.');
    if(STRINGS[state.lang][ns] && STRINGS[state.lang][ns][k]!==undefined) el.placeholder = STRINGS[state.lang][ns][k];
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{
    const [ns,k] = el.dataset.i18nTitle.split('.');
    if(STRINGS[state.lang][ns] && STRINGS[state.lang][ns][k]!==undefined) el.title = STRINGS[state.lang][ns][k];
  });
  const lbl = document.getElementById('lblLangToggle');
  if(lbl) lbl.textContent = state.lang==='fr' ? 'AR' : 'FR';
}
function rerenderCurrentView(){
  const id = state.currentView;
  if(id==='view-dashboard') renderDashboard();
  if(id==='view-students'){
    if(state.currentStudentId) openStudentDetail(state.currentStudentId); else renderStudentsTable();
  }
  if(id==='view-teachers') renderTeachersTable();
  if(id==='view-attendance') renderAttendanceView();
  if(id==='view-behavior') renderBehaviorView();
  if(id==='view-messages') renderMessagesView();
  if(id==='view-reports'){
    renderHome();
    if(state.currentTemplate && !document.getElementById('view-fill').classList.contains('hidden')){
      document.getElementById('fillTitle').textContent = L(state.currentTemplate.name);
      renderFillForm(); renderExtraFields(); renderDocPreview();
    }
    if(!document.getElementById('view-builder').classList.contains('hidden')){ populateCatList(); renderBuilderFields(); }
  }
  if(id==='view-dailylog') renderDailyLog();
  if(id==='view-stats') renderStats();
  if(id==='view-settings') renderSettingsView();
}
function initLangToggle(){
  const btn = document.getElementById('btnLangToggle');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    state.lang = state.lang==='fr' ? 'ar' : 'fr';
    saveJSON(K_LANG, state.lang);
    applyStaticStrings();
    if(appBooted) rerenderCurrentView();
  });
}

/* ============================= بدء التشغيل ============================= */
function bootApp(){
  if(!state.settings.year){
    const y = new Date().getFullYear(); const m = new Date().getMonth();
    state.settings.year = (m>=8) ? `${y}-${y+1}` : `${y-1}-${y}`;
    saveSettings();
  }
  seedDemoData();
  seedTeachersIfEmpty();
  migrateSecondaryLevels();
  migrateMessageTemplates();
  initGlobalSearch();
  showView('view-dashboard');
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
}

applyStaticStrings();
initLangToggle();
initLoginGate();
})();
