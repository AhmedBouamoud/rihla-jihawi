# -*- coding: utf-8 -*-
"""توليد ملفات النطق العربي لتطبيق عالم نون عبر espeak-ng (ctypes) + ترميز MP3.

المخرجات:
  - alam-noon/assets/audio/<slug>.mp3  لكل عبارة
  - alam-noon/assets/js/voice-map.js   خريطة نص → ملف (تُستبدل ملفاتها لاحقاً بتسجيلات بشرية بنفس الأسماء)
"""
import ctypes, json, os, sys, hashlib
import espeakng_loader
import lameenc

APP = '/home/user/rihla-jihawi/alam-noon'
OUT_AUDIO = os.path.join(APP, 'assets/audio')
os.makedirs(OUT_AUDIO, exist_ok=True)

# ============ قائمة العبارات (المصدر الوحيد للحقيقة) ============
# slug: اسم الملف (ثابت — التسجيلات البشرية المستقبلية تحمل الأسماء نفسها)
PHRASES = {
  # مقدمات الصفحات
  'intro-home':     'مَرْحَبًا يَا صَدِيقِي! أَنَا نُون، صَدِيقُكَ فِي الرِّحْلَة. سَرَقَ ظِلُّ الصَّمْتِ خَمْسَةَ مَفَاتِيحَ مِنْ مَدِينَةِ الأَصْوَات، فَانْطَفَأَتْ أَنْوَارُهَا. هَيَّا نُعِيدُهَا مَعًا، مِفْتَاحًا بَعْدَ مِفْتَاح!',
  'intro-station1': 'هَذَا مَخْبَزُ العَمِّ مِيم. أَفْرَانُهُ انْطَفَأَتْ لِأَنَّ صَوْتَ مْ ضَاع. اِضْغَطْ عَلَى أَيِّ بِطَاقَةٍ لِتَسْمَعَ كَلِمَتَهَا، فَإِنْ بَدَأَتْ بِصَوْتِ مْ اضْغَطْهَا مَرَّةً ثَانِيَةً لِتُشْعِلَ فُرْنًا!',
  'intro-station2': 'وَصَلْنَا غَابَةَ البَالُونَات! البَالُونَاتُ الزَّرْقَاءُ تَحْمِلُ صَوْتَ بْ. اِلْمِسْهَا لِتُفَرْقِعَهَا، وَاحْذَرِ البَالُونَاتِ البُرْتُقَالِيَّةَ فَهِيَ لِأَصْوَاتٍ أُخْرَى.',
  'intro-station3': 'هَذَا جِسْرُ الإِيقَاع. اِسْمَعِ الطُّبُولَ جَيِّدًا: مَ... بَ... ثُمَّ أَعِدِ الإِيقَاعَ نَفْسَهُ بِالضَّغْطِ عَلَى الطَّبْلَيْنِ بِالتَّرْتِيب.',
  'intro-station4': 'هَذَا كَهْفُ المِرْآة، وَهُنَا يَسْكُنُ حَرْفِي أَنَا: حَرْفُ نُون! نْ... مِثْلَ نَجْمَة وَنُور. مَرِّرْ إِصْبَعَكَ فَوْقَ الحَرْفِ الكَبِيرِ لِتَرْسُمَهُ بِخَيْطِ النُّور.',
  'intro-station5': 'وَصَلْنَا قَصْرَ النُّجُوم، وَهُنَا المِفْتَاحُ الأَخِير! سَأَسْأَلُكَ عَنِ الأَصْوَاتِ الَّتِي تَعَلَّمْنَاهَا. اِضْغَطِ الإِجَابَةَ لِتَسْمَعَهَا، ثُمَّ اضْغَطْهَا ثَانِيَةً لِتَخْتَارَهَا.',
  'intro-parents':  'هَذِهِ لَوْحَةُ الوَالِدَيْن. مِنْ هُنَا يُمْكِنُ مُتَابَعَةُ التَّقَدُّمِ وَإِعَادَةُ الرِّحْلَة.',
  # كلمات المحطة 1 والاختبار
  'word-maa':      'مَاء',
  'word-bab':      'بَاب',
  'word-mawz':     'مَوْز',
  'word-tuffaha':  'تُفَّاحَة',
  'word-milaaqa':  'مِلْعَقَة',
  'word-samaka':   'سَمَكَة',
  'word-balloon':  'بَالُون',
  'word-najma':    'نَجْمَة',
  'word-nar':      'نَار',
  # حروف وأصوات
  'l-ma':  'مَ',
  'l-ba':  'بَ',
  'l-bu':  'بُ',
  'l-b':   'ب',
  'l-m':   'م',
  'l-s':   'س',
  'l-l':   'ل',
  # تغذية راجعة — المحطة 1
  'ok1-maa':     'أَحْسَنْتَ! مَاء تَبْدَأُ بِصَوْتِ مْ. اِشْتَعَلَ فُرْن!',
  'ok1-mawz':    'أَحْسَنْتَ! مَوْز تَبْدَأُ بِصَوْتِ مْ. اِشْتَعَلَ فُرْن!',
  'ok1-milaaqa': 'أَحْسَنْتَ! مِلْعَقَة تَبْدَأُ بِصَوْتِ مْ. اِشْتَعَلَ فُرْن!',
  'no1-bab':     'بَاب تَبْدَأُ بِصَوْتٍ آخَر، لَيْسَ مْ. جَرِّبْ غَيْرَهَا!',
  'no1-tuffaha': 'تُفَّاحَة تَبْدَأُ بِصَوْتٍ آخَر، لَيْسَ مْ. جَرِّبْ غَيْرَهَا!',
  'no1-samaka':  'سَمَكَة تَبْدَأُ بِصَوْتٍ آخَر، لَيْسَ مْ. جَرِّبْ غَيْرَهَا!',
  'done1': 'رَائِع يَا بَطَل! عَادَ صَوْتُ مْ وَاشْتَعَلَتِ الأَفْرَانُ كُلُّهَا. خُذِ المِفْتَاحَ الأَوَّل، وَهَيَّا إِلَى غَابَةِ البَالُونَات!',
  # المحطة 2
  'no2':   'لَيْسَ هَذَا صَوْتَ بْ',
  'done2': 'أَبْلَيْتَ بَلَاءً حَسَنًا! جَمَعْتَ بَالُونَاتِ صَوْتِ بْ كُلَّهَا، وَفُتِحَ جِسْرُ الإِيقَاع.',
  # المحطة 3
  'no3':   'لَا بَأْسَ. اِسْتَمِعْ ثُمَّ حَاوِلْ مَرَّةً أُخْرَى.',
  'wait3': 'اِنْتَظِرْ حَتَّى يَنْتَهِي الإِيقَاع',
  'done3': 'مُمْتَاز! عَزَفْتَ الإِيقَاعَ صَحِيحًا وَعَبَرْنَا الجِسْر. فُتِحَ كَهْفُ المِرْآة!',
  # المحطة 4
  'more4': 'رَسْمُكَ جَيِّد. وَاصِلْ فَوْقَ الحَرْفِ قَلِيلًا ثُمَّ تَحَقَّقْ.',
  'done4': 'أَحْسَنْتَ! رَسَمْتَ حَرْفَ نُون بِخَيْطِ النُّور: نْ... مِثْلَ نَجْمَة. اِنْعَكَسَ النُّورُ وَفُتِحَ قَصْرُ النُّجُوم!',
  # المحطة 5 — الأسئلة
  'q-m': 'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ مْ؟',
  'q-b': 'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ بْ؟',
  'q-n': 'أَيْنَ الكَلِمَةُ الَّتِي تَبْدَأُ بِصَوْتِ نْ؟',
  'ok5-mawz':    'إِجَابَةٌ صَحِيحَة! مَوْز',
  'ok5-balloon': 'إِجَابَةٌ صَحِيحَة! بَالُون',
  'ok5-najma':   'إِجَابَةٌ صَحِيحَة! نَجْمَة',
  'ok5-milaaqa': 'إِجَابَةٌ صَحِيحَة! مِلْعَقَة',
  'ok5-nar':     'إِجَابَةٌ صَحِيحَة! نَار',
  'fix5-mawz':    'لَا بَأْسَ. الإِجَابَةُ الصَّحِيحَةُ هِيَ: مَوْز',
  'fix5-balloon': 'لَا بَأْسَ. الإِجَابَةُ الصَّحِيحَةُ هِيَ: بَالُون',
  'fix5-najma':   'لَا بَأْسَ. الإِجَابَةُ الصَّحِيحَةُ هِيَ: نَجْمَة',
  'fix5-milaaqa': 'لَا بَأْسَ. الإِجَابَةُ الصَّحِيحَةُ هِيَ: مِلْعَقَة',
  'fix5-nar':     'لَا بَأْسَ. الإِجَابَةُ الصَّحِيحَةُ هِيَ: نَار',
  'done5': 'مَبْرُوك يَا بَطَل! أَعَدْتَ المِفْتَاحَ الأَخِيرَ، وَأَضَأْتَ مَدِينَةَ الأَصْوَاتِ كُلَّهَا!',
}

# ============ espeak-ng عبر ctypes ============
AUDIO_OUTPUT_SYNCHRONOUS = 0x02
espeakCHARS_UTF8 = 1
lib = ctypes.cdll.LoadLibrary(espeakng_loader.get_library_path())
data_path = espeakng_loader.get_data_path()

samples_buf = []
CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.c_void_p)
def _cb(wav, numsamples, events):
    if numsamples > 0:
        samples_buf.append(ctypes.string_at(wav, numsamples * 2))
    return 0
cb = CB(_cb)

rate = lib.espeak_Initialize(AUDIO_OUTPUT_SYNCHRONOUS, 0, data_path.encode(), 0)
assert rate > 0, 'espeak init failed'
lib.espeak_SetSynthCallback(cb)
assert lib.espeak_SetVoiceByName(b'ar') == 0, 'no arabic voice'
# إبطاء وتليين مناسبان للأطفال
lib.espeak_SetParameter(1, 130, 0)   # espeakRATE
lib.espeak_SetParameter(3, 60, 0)    # espeakPITCH أعلى قليلاً (طفولي)
lib.espeak_SetParameter(2, 150, 0)   # espeakVOLUME

def synth(text):
    samples_buf.clear()
    t = text.encode('utf-8')
    r = lib.espeak_Synth(t, len(t) + 1, 0, 0, 0, espeakCHARS_UTF8, None, None)
    assert r == 0, f'synth failed for {text[:20]}'
    return b''.join(samples_buf)

def to_mp3(pcm, path):
    enc = lameenc.Encoder()
    enc.set_bit_rate(48)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    data = enc.encode(pcm)
    data += enc.flush()
    open(path, 'wb').write(bytes(data))

total = 0
by_text = {}
by_slug = {}
for slug, text in PHRASES.items():
    pcm = synth(text)
    out = os.path.join(OUT_AUDIO, slug + '.mp3')
    to_mp3(pcm, out)
    kb = os.path.getsize(out) // 1024
    total += kb
    path = 'assets/audio/' + slug + '.mp3'
    by_text[text] = path
    by_slug[slug] = path
    print(f'{slug}.mp3 {kb}KB')

# خريطتا نص→ملف ومعرّف→ملف تُحمَّلان قبل app.js
js = ('// خريطة النطق المولّد — استبدل ملفات assets/audio بنفس الأسماء عند توفر تسجيلات بشرية\n'
      'window.VOICE_MAP = ' + json.dumps(by_text, ensure_ascii=False, indent=1) + ';\n'
      'window.VOICE_FILES = ' + json.dumps(by_slug, ensure_ascii=False, indent=1) + ';\n')
open(os.path.join(APP, 'assets/js/voice-map.js'), 'w', encoding='utf-8').write(js)

# تحديث Service Worker: إصدار v4 + إدراج ملفات الصوت في التخزين المسبق
swp = os.path.join(APP, 'service-worker.js')
sw = open(swp, encoding='utf-8').read()
sw = sw.replace("alam-noon-release-v3", "alam-noon-release-v4")
audio_entries = ',\n'.join(f'  "./{p}"' for p in sorted(by_slug.values()))
marker = '  "./assets/img/social-preview.webp"'
assert marker in sw and 'assets/audio' not in sw
sw = sw.replace(marker, marker + ',\n  "./assets/js/voice-map.js",\n' + audio_entries)
open(swp, 'w', encoding='utf-8').write(sw)
print('service-worker v4 updated')
print(f'\nTOTAL: {total}KB in {len(PHRASES)} clips')
print('voice-map.js written')
