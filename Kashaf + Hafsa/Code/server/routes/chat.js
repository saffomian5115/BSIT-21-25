const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── HARD FILTER — Health topics only ─────────────────────────────────────────
const HEALTH_KEYWORDS = [
  // English
  'pain','ache','stomach','gastro','digest','food','eat','diet','nutrition','health',
  'doctor','medicine','symptom','disease','illness','sick','hurt','fever','nausea',
  'vomit','diarrhea','constipation','bloat','gas','acid','reflux','ulcer','liver',
  'intestine','bowel','colon','ibs','gerd','weight','calorie','vitamin','protein',
  'allergy','medication','drug','treatment','therapy','exercise','sleep','stress',
  'blood','pressure','sugar','diabetes','cholesterol','heart','breath','headache',
  'fatigue','energy','immune','infection','inflammation','cancer','surgery','hospital',
  'remedy','cure','prevent','hygiene','water','hydrat','fiber','probiotic','gut',
  'crohn','celiac','gallstone','appendix','pancreas','spleen','kidney','urine',
  'stool','feces','bowel','abdomen','abdominal','chest','throat','esophagus',
  'endoscopy','colonoscopy','biopsy','scan','test','diagnosis','prescription',
  // Urdu keywords
  'درد','معدہ','صحت','خوراک','دوا','بیماری','علاج','پیٹ','کھانا','بخار',
  'قبض','اسہال','تیزابیت','وزن','خون','ڈاکٹر','دل','سانس','الٹی','غذا',
  // Turkish keywords
  'ağrı','mide','sağlık','yemek','diyet','ilaç','hastalık','tedavi','karın',
  'bulantı','kusma','ishal','kabız','reflü','ağırlık','kan','doktor','nefes'
];

const BLOCK_MESSAGES = {
  english: `I'm GastroCare AI — your specialized health assistant! 🏥\n\nI can only help with:\n• 🫁 Gastro & digestive health\n• 🥗 Diet & nutrition advice\n• 💊 General health & wellness\n• 🚨 Emergency health guidance\n\nPlease ask me a health-related question and I'll be happy to help!`,
  urdu: `میں GastroCare AI ہوں — آپ کا صحت کا معاون! 🏥\n\nمیں صرف ان موضوعات پر مدد کر سکتا ہوں:\n• 🫁 معدے اور ہاضمے کی صحت\n• 🥗 خوراک اور غذائیت\n• 💊 عمومی صحت اور تندرستی\n• 🚨 ہنگامی صحت رہنمائی\n\nبراہ کرم صحت سے متعلق سوال پوچھیں!`,
  turkish: `Ben GastroCare AI — sağlık asistanınız! 🏥\n\nYalnızca şu konularda yardımcı olabilirim:\n• 🫁 Gastro ve sindirim sağlığı\n• 🥗 Diyet ve beslenme\n• 💊 Genel sağlık ve wellness\n• 🚨 Acil sağlık rehberliği\n\nLütfen sağlıkla ilgili bir soru sorun!`
};

const isHealthRelated = (message) => {
  const lower = message.toLowerCase();
  // Check if any health keyword exists
  const hasHealthKeyword = HEALTH_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
  // Also allow greetings and short messages (might be starting conversation)
  const isGreeting = /^(hi|hello|hey|salam|merhaba|assalam|help|haan|okay|ok|yes|no).{0,20}$/i.test(message.trim());
  const isShort = message.trim().length < 25;
  return hasHealthKeyword || isGreeting || isShort;
};

// ─── Emergency Detection ───────────────────────────────────────────────────────
const EMERGENCY_KEYWORDS = {
  english: ['chest pain','heart attack','stroke','cant breathe',"can't breathe",'not breathing',
    'unconscious','fainted','collapsed','bleeding heavily','severe bleeding',
    'overdose','poisoning','seizure','choking','difficulty breathing',
    'blood in stool','vomiting blood','severe abdominal pain'],
  urdu: ['سینے میں درد','دل کا دورہ','سانس نہیں','بے ہوش','خون آ رہا ہے','زہر','دورہ','الٹی میں خون'],
  turkish: ['göğüs ağrısı','kalp krizi','nefes alamıyorum','bayıldı','çok kanıyor','zehirlenme','kan kusma']
};

const EMERGENCY_ALERT = {
  english: '🚨 **EMERGENCY DETECTED!**\n\nCall emergency services IMMEDIATELY!\n\n• 🇵🇰 Pakistan: **1122** / **115**\n• 🇺🇸 USA: **911**\n• 🇬🇧 UK: **999**\n• 🇹🇷 Turkey: **112**\n\n---\n\n',
  urdu: '🚨 **ہنگامی صورتحال!**\n\nفوری کال کریں!\n\n• 🇵🇰 پاکستان: **1122** / **115**\n• 🇺🇸 USA: **911**\n• 🇬🇧 UK: **999**\n• 🇹🇷 ترکی: **112**\n\n---\n\n',
  turkish: '🚨 **ACİL DURUM!**\n\nHemen acil servisi arayın!\n\n• 🇵🇰 Pakistan: **1122** / **115**\n• 🇺🇸 ABD: **911**\n• 🇬🇧 İngiltere: **999**\n• 🇹🇷 Türkiye: **112**\n\n---\n\n'
};

const checkEmergency = (message, language) => {
  const keywords = EMERGENCY_KEYWORDS[language] || EMERGENCY_KEYWORDS.english;
  const lower = message.toLowerCase();
  return keywords.some(kw => lower.includes(kw.toLowerCase()));
};

// ─── System Prompts with User Profile ─────────────────────────────────────────
const buildSystemPrompt = (language, userProfile) => {
  // Build personalized context from user profile
  let personalContext = '';
  if (userProfile) {
    const p = userProfile.profile || {};
    const m = userProfile.medicalHistory || {};
    const parts = [];
    if (userProfile.name) parts.push(`Name: ${userProfile.name}`);
    if (p.age) parts.push(`Age: ${p.age} years`);
    if (p.height) parts.push(`Height: ${p.height}`);
    if (m.weight) parts.push(`Weight: ${m.weight}`);
    if (m.bloodGroup) parts.push(`Blood Group: ${m.bloodGroup}`);
    if (p.maritalStatus) parts.push(`Marital Status: ${p.maritalStatus}`);
    if (p.country) parts.push(`Country: ${p.country}`);
    if (m.dietType) parts.push(`Diet Type: ${m.dietType}`);
    if (m.smokingStatus) parts.push(`Smoking: ${m.smokingStatus}`);
    if (m.alcoholConsumption) parts.push(`Alcohol: ${m.alcoholConsumption}`);
    if (m.allergies?.length) parts.push(`Allergies: ${m.allergies.join(', ')}`);
    if (m.chronicDiseases?.length) parts.push(`Chronic Diseases: ${m.chronicDiseases.join(', ')}`);
    if (m.currentMedications?.length) parts.push(`Current Medications: ${m.currentMedications.join(', ')}`);
    if (m.previousSurgeries?.length) parts.push(`Previous Surgeries: ${m.previousSurgeries.join(', ')}`);
    if (m.digestiveIssues?.length) parts.push(`Digestive Issues: ${m.digestiveIssues.join(', ')}`);

    if (parts.length > 0) {
      personalContext = `\n\n=== PATIENT PROFILE ===\n${parts.join('\n')}\n=== END PROFILE ===\n\nIMPORTANT: Use this profile to personalize your responses. Consider the patient's age, allergies, medications, and medical history when giving advice. If they have allergies, never suggest foods containing those allergens. If they have chronic diseases, tailor advice accordingly.`;
    }
  }

  const prompts = {
    english: `You are GastroCare AI — a highly knowledgeable, compassionate, and professional medical health assistant specializing in:
- Gastroenterology (stomach, intestines, digestive system, liver, colon)
- General nutrition and diet planning  
- Digestive disorders (IBS, GERD, Crohn's, ulcers, acid reflux, etc.)
- General health and wellness
- Preventive healthcare and healthy lifestyle

Your behavior rules:
1. Always respond warmly, professionally, and empathetically
2. Give detailed, helpful, and accurate health information
3. Ask follow-up questions to better understand the patient's condition
4. Suggest home remedies when appropriate, always recommend a doctor for serious issues
5. For emergency symptoms — immediately alert to call emergency services
6. Remember conversation context and refer back to previous messages
7. Organize responses with bullet points or numbered lists when helpful
8. ALWAYS end responses with a gentle reminder that your advice is informational only
9. YOU ONLY DISCUSS HEALTH, MEDICAL, NUTRITION, DIET, AND WELLNESS TOPICS
10. If asked about ANYTHING unrelated to health — politely decline and redirect to health topics${personalContext}`,

    urdu: `آپ GastroCare AI ہیں — ایک انتہائی علم دار، ہمدرد اور پیشہ ور طبی معاون جو ان شعبوں میں مہارت رکھتے ہیں:
- معدے کی بیماریاں اور نظام ہاضمہ
- عمومی غذائیت اور خوراک کی منصوبہ بندی
- ہاضمے کی خرابیاں (IBS، GERD، السر، تیزابیت وغیرہ)
- عمومی صحت اور تندرستی

آپ کے اصول:
1. ہمیشہ گرمجوشی اور ہمدردانہ لہجے میں جواب دیں
2. تفصیلی اور درست صحت کی معلومات فراہم کریں
3. سنگین مسائل کے لیے ڈاکٹر سے ملنے کی تاکید کریں
4. صرف صحت، طب، غذائیت سے متعلق بات کریں
5. غیر متعلقہ سوالات پر شائستگی سے معذرت کریں${personalContext}`,

    turkish: `Siz GastroCare AI'sınız — gastroenteroloji, beslenme ve genel sağlık konusunda uzman tıbbi asistan.

Kurallar:
1. Her zaman sıcak ve profesyonel yanıt verin
2. Ayrıntılı ve doğru sağlık bilgileri sağlayın
3. Ciddi sorunlar için mutlaka doktora gidin deyin
4. YALNIZCA sağlık, tıp, beslenme konularında konuşun
5. Sağlıkla ilgisi olmayan sorulara nezaketle reddedin${personalContext}`
  };

  return prompts[language] || prompts.english;
};

// ─── Groq AI Call ─────────────────────────────────────────────────────────────
const callGroqAI = async (messages, language, userProfile) => {
  const systemPrompt = buildSystemPrompt(language, userProfile);
  const recentMessages = messages.slice(-12);

  const groqMessages = [
    { role: 'system', content: systemPrompt },
    ...recentMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: groqMessages,
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    stream: false
  });

  return completion.choices[0]?.message?.content || 'I could not generate a response. Please try again.';
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all chats
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .select('title language createdAt updatedAt messages')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single chat
router.get('/:id', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new chat
router.post('/new', protect, async (req, res) => {
  try {
    const { language = 'english' } = req.body;
    const chat = await Chat.create({
      userId: req.user._id,
      language,
      messages: [],
      title: 'New Chat'
    });
    res.status(201).json(chat);
  } catch (error) {
    console.error('New chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST send message
router.post('/:id/message', protect, async (req, res) => {
  try {
    const { message, language = 'english' } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message cannot be empty' });

    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // ── HARD FILTER: Block irrelevant questions ──
    if (!isHealthRelated(message)) {
      const blockMsg = BLOCK_MESSAGES[language] || BLOCK_MESSAGES.english;
      // Save the exchange to chat history
      chat.messages.push({ role: 'user', content: message });
      chat.messages.push({ role: 'assistant', content: blockMsg });
      if (chat.title === 'New Chat' && chat.messages.length === 2) {
        chat.title = message.substring(0, 45) + (message.length > 45 ? '...' : '');
      }
      chat.updatedAt = new Date();
      await chat.save();
      return res.json({ response: blockMsg, isEmergency: false, isBlocked: true, chatId: chat._id, title: chat.title });
    }

    // ── Emergency check ──
    const isEmergency = checkEmergency(message, language);

    // ── Fetch user profile for personalization ──
    const userProfile = await User.findById(req.user._id).select('-password');

    // ── Add user message ──
    chat.messages.push({ role: 'user', content: message });
    if (chat.title === 'New Chat' && chat.messages.length === 1) {
      chat.title = message.length > 50 ? message.substring(0, 50) + '...' : message;
    }

    // ── Call Groq with user profile ──
    let aiResponse = await callGroqAI(chat.messages, language, userProfile);

    // ── Prepend emergency alert ──
    if (isEmergency) {
      aiResponse = (EMERGENCY_ALERT[language] || EMERGENCY_ALERT.english) + aiResponse;
    }

    chat.messages.push({ role: 'assistant', content: aiResponse });
    chat.updatedAt = new Date();
    await chat.save();

    res.json({ response: aiResponse, isEmergency, isBlocked: false, chatId: chat._id, title: chat.title });

  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ message: 'AI error: ' + error.message });
  }
});

// DELETE chat
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Chat not found' });
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
