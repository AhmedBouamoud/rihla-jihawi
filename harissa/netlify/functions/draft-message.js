// دالة خادم (Netlify Function) تعيد صياغة رسالة ولي الأمر بمساعدة الذكاء الاصطناعي (Groq).
// المفتاح GROQ_API_KEY محفوظ كمتغير بيئة على الخادم فقط، ولا يظهر أبداً في كود المتصفح.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'لم يتم إعداد مفتاح خدمة الذكاء الاصطناعي على الخادم بعد.' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'بيانات غير صالحة.' }) };
  }

  const draftText = (payload.draftText || '').trim();
  if (!draftText) {
    return { statusCode: 400, body: JSON.stringify({ error: 'نص الرسالة الأصلي مطلوب.' }) };
  }
  const studentName = (payload.studentName || '').slice(0, 100);
  const section = (payload.section || '').slice(0, 60);
  const caseType = (payload.caseType || '').slice(0, 100);
  const institution = (payload.institution || '').slice(0, 120);

  const prompt = `أنت مساعد إداري في مؤسسة تعليمية مغربية. أعد صياغة الرسالة التالية الموجّهة لولي أمر تلميذ بأسلوب عربي فصيح مهني ولطيف، مع الحفاظ الدقيق على كل المعلومات الواردة فيها (الاسم، القسم، التاريخ، السبب) دون اختراع أي معلومة جديدة وبدون إضافة تفاصيل غير موجودة. لا تتجاوز 3 جمل قصيرة. أعد النص النهائي فقط دون أي مقدمة أو تعليق.

معطيات السياق: التلميذ(ة): ${studentName || '—'} — القسم: ${section || '—'} — نوع الحالة: ${caseType || '—'} — المؤسسة: ${institution || '—'}

الرسالة الأصلية:
${draftText}`;

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
        max_tokens: 300
      })
    });
    const data = await resp.json();
    if (!resp.ok) {
      const msg = (data && data.error && data.error.message) || 'تعذر الاتصال بخدمة الذكاء الاصطناعي.';
      return { statusCode: resp.status, body: JSON.stringify({ error: msg }) };
    }
    const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content.trim() : '';
    if (!text) {
      return { statusCode: 502, body: JSON.stringify({ error: 'رد غير متوقع من خدمة الذكاء الاصطناعي.' }) };
    }
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'خطأ في الاتصال بخدمة الذكاء الاصطناعي.' }) };
  }
};
