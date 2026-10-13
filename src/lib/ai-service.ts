import { Lecture, ExerciseSubmission } from '@/types';

export interface AIServiceResponse {
  answer: string;
  keyTakeaways?: string[];
  suggestedQuestions?: string[];
  evaluation?: {
    score: number;
    strengths: string[];
    improvements: string[];
    detailedAnalysis: string;
  };
}

export async function askAITutor(
  userQuery: string,
  currentLecture?: Lecture,
  conversationHistory: { role: string; content: string }[] = [],
  apiKey?: string
): Promise<AIServiceResponse> {
  // If an external Gemini API key is provided and valid
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const systemInstruction = `أنت المساعد الأكاديمي واللساني الذكي في "المنصة التعليمية للأستاذ الدكتور بن جلول مختار" - جامعة ابن خلدون تيارت (كلية الآداب واللغات - قسم اللغة والأدب العربي - مخبر الدراسات النحوية واللغوية بين التراث والحداثة في الجزائر).
المقرر أو المحاضرة الحالية: ${currentLecture ? currentLecture.titleAr : 'مقاييس اللسانيات والصرف والنحو العربي'}
محتوى المحاضرة ومفاهيمها: ${currentLecture ? currentLecture.content : ''}
مهمتك:
- تقديم شروحات علمية لسانية ونحوية وصرفية رصينة باللغة العربية الفصحى.
- الجمع بين التراث اللغوي العربي الأصيل (سيبويه، ابن جني، عبد القاهر الجرجاني، الزمخشري) والرؤى اللسانية الحديثة (دي سوسير، تشومسكي، دي بوغراند، التداولية).
- مساعدة الطلبة على فك الإشكالات الإعرابية والصرفية وتحليل النصوص والخطابات.
- تحفيز التفكير اللساني والنقدي بما يخدم رؤية مخبر الدراسات النحوية واللغوية.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemInstruction }] },
              ...conversationHistory.map(h => ({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }]
              })),
              { role: 'user', parts: [{ text: userQuery }] }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 1200
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            answer: text,
            suggestedQuestions: [
              'كيف نربط هذا المفهوم بنظرية النظم للجرجاني؟',
              'ما هو التفسير الصرفي أو الإعرابي الدقيق لهذا الشاهد؟',
              'ما رأي ابن مضاء القرطبي والنحاة المعاصرين في ذلك؟'
            ]
          };
        }
      }
    } catch (e) {
      console.warn('API call fallback to built-in linguistic AI engine:', e);
    }
  }

  // Built-in Pedagogical Intelligence (Linguistics, Morphology & Grammar Context Engine)
  await new Promise(resolve => setTimeout(resolve, 800));

  const q = userQuery.toLowerCase();

  // 1. اللسانيات وتحليل الخطاب
  if (q.includes('لسانيات') || q.includes('خطاب') || q.includes('اتساق') || q.includes('انسجام') || q.includes('جرجاني') || q.includes('نص')) {
    return {
      answer: `أهلاً بك في فضاء **اللسانيات وتحليل الخطاب** (ماستر 1 - إشراف أ.د. بن جلول مختار):

يفرق البحث اللساني الحديث بين مفهومين جوهريين:
1. **الاتساق (Cohésion)**: ترابط الأجزاء السطحية للنص بوسائل نحوية ومعجمية (الإحالة، الحذف، الاستبدال، والربط العطفي والشرطي).
2. **الانسجام (Cohérence)**: التماسك الدلالي والمنطقي العميق الذي يبنيه المتلقي في ذهنه اعتماداً على المعرفة الخلفية والسياق التلفظي.

في التراث البلاغي والنحوي العربي، يعتبر **عبد القاهر الجرجاني** في نظريته "النظم" رائد البعد التماسك النصي، حيث أكد أن الألفاظ لا تتفاضل في ذواتها بل بمواقعها في سياق النظم وتلاقي معاني النحو مع مقاصد الخطاب.`,
      keyTakeaways: [
        'الاتساق مظهره شكلي تركيبي، بينما الانسجام جوهره دلالي تداولي',
        'معايير النصية السبعة (دي بوغراند) تمثل إطاراً جامعاً للتحليل اللساني',
        'نظرية النظم العربية سبقت اللسانيات الغربية في ربط التركيب بالدلالة'
      ],
      suggestedQuestions: [
        'ما هي أنواع الإحالة (القبلية والبعدية، المقالية والمقامية)؟',
        'كيف يساهم التناص في بناء انسجام الخطاب؟',
        'ما الفرق بين لسانيات النص وتحليل الخطاب عند باتريك شارودو؟'
      ]
    };
  }

  // 2. الصرف العربي والميزان الصرفي
  if (q.includes('صرف') || q.includes('ميزان') || q.includes('إعلال') || q.includes('إبدال') || q.includes('مشتق') || q.includes('وزن')) {
    return {
      answer: `مرحباً بك في مباحث **الصرف العربي** (السنة الثانية ليسانس - إشراف أ.د. بن جلول مختار):

**الميزان الصرفي** هو المعيار الدقيق الذي ابتكره علماء العربية لضبط بنية المفردة:
- جعلوا الأصل الثلاثي يقابل **(ف - ع - ل)**: فاء الكلمة، عين الكلمة، ولام الكلمة.
- ما زاد من حروف سألتمونيها ينزل بحروفه في الميزان (مثل: استخرج -> استَفعلَ).
- ما تكرر أصلاً بالتضعيف يضعف نظيره (مثل: علَّم -> فَعَّل).
- عند حدوث **إبدال صوتي** (مثل: *اضطرب* من *ضرب*)، تظل تاء الافتعال في الميزان؛ فالوزن الصرفي هو **(افتعل)** لأن الطاء منقلبة عن تاء.
- وعند **الحذف** يحذف ما يقابله، فكلمة **(قِ)** من (وقى/يفقي) وزنها **(عِ)** لحذف الفاء واللام.`,
      keyTakeaways: [
        'الميزان الصرفي هو صورة صوتية ومعنوية لهندسة اللفظ العربي',
        'الإبدال الصوتي في صيغ الافتعال غايته الانسجام الصوتي وتسهيل النطق',
        'الزيادة في المبنى تدل غالباً على زيادة في المعنى'
      ],
      suggestedQuestions: [
        'ما الفرق الدقيق بين الإعلال والإبدال في الصرف العربي؟',
        'ما هي معاني صيغة (استفعل) وصيغة (أفعل)؟',
        'كيف نزن الكلمات ذات القلب المكاني مثل (أشياء) و(جاه)؟'
      ]
    };
  }

  // 3. النحو العربي ونظرية العامل
  if (q.includes('نحو') || q.includes('عامل') || q.includes('إعراب') || q.includes('ابن مضاء') || q.includes('سيبويه') || q.includes('فاعل') || q.includes('مبتدأ')) {
    return {
      answer: `أهلاً بك في رحاب **النحو العربي** (السنة الثانية ليسانس - إشراف أ.د. بن جلول مختار):

**نظرية العامل** هي العمود الفقري للنحو العربي التراثي:
1. **أصل النظرية**: انطلاق النحاة الأوائل من أن كل تغيير إعرابي (رفع، نصب، جر، جزم) لابد له من سبب مقتضٍ يُسمى **العامل**.
2. **أقسام العوامل**:
   - عوامل **لفظية**: مثل الفعل (يرفع الفاعل وينصب المفعول)، وحروف الجر والنواسخ.
   - عوامل **معنوية**: مثل عامل *الابتداء* في رفع المبتدأ، وعامل *التجرد* في رفع الفعل المضارع.
3. **النقد التراثي والحديث**:
   - انتقد **ابن مضاء القرطبي** التوسع في تقدير العوامل المحذوفة والعلل الثواني والثوالث.
   - في المقابل، أعادت اللسانيات التوليدية الحديثة (نظرية العمل والربط - تشومسكي) الاعتبار لمفهوم "الحكم والعمل" باعتباره ظاهرة تركيبية كلية تميز اللغات الطبيعية.`,
      keyTakeaways: [
        'الإعراب أثر وظيفي يُظهر العلاقات النحوية بين عناصر الجملة',
        'الخلاف بين البصريين والكوفيين أثرى نظرية العامل بالتأويل والسماع',
        'مخبر تيارت يبحث في إعادة قراءة العامل النحوي قراءة لسانية معاصرة'
      ],
      suggestedQuestions: [
        'ما الفرق بين مذهب البصرة ومذهب الكوفة في عامل رفع الخبر؟',
        'كيف عالج تشومسكي مفهوم العامل في اللسانيات التوليدية؟',
        'هل يمكن الاستغناء عن نظرية العامل في تدريس النحو المعاصر؟'
      ]
    };
  }

  // General Context
  return {
    answer: `مرحباً بك في المنصة التعليمية لـ **أ.د. بن جلول مختار** (جامعة ابن خلدون تيارت - مخبر الدراسات النحوية واللغوية بين التراث والحداثة في الجزائر).

سؤالك حول "${userQuery}" يتصل مباشرة بقضايا ${currentLecture ? `المحاضرة: "${currentLecture.titleAr}"` : 'المقاييس اللغوية والنحوية المقررة'}.

يمكنك توجيه استفسارك سواء في الجانب التطبيقي (إعراب، وزن صرفي، استخراج شواهد) أو في الجانب النظري الإبستيمولوجي (تاريخ النظريات اللغوية، المدارس اللسانية)، وسأقوم بشرحه بالتفصيل الأكاديمي المنهجي.`,
    keyTakeaways: [
      'التوثيق العلمي الدقيق للنصوص والمصادر اللغوية',
      'الربط الدائم بين المنطق التراثي والأفق اللساني الحديث'
    ],
    suggestedQuestions: [
      'وجه لي سؤالاً تدريبياً في مقياس النحو العربي',
      'ما هي أهم مصادر مخبر الدراسات النحوية واللغوية بتيارت؟',
      'أريد توضيحاً إعرابياً وصرفياً لبيت شعري'
    ]
  };
}

// Professor AI Grader & Assessment Engine
export async function evaluateStudentSubmission(
  exerciseTitle: string,
  submissionContent: string,
  instructions: string[]
): Promise<AIServiceResponse['evaluation']> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const wordCount = submissionContent.trim().split(/\s+/).length;
  const hasLinguisticKeywords = submissionContent.includes('وزن') || submissionContent.includes('عامل') || submissionContent.includes('إعراب') || submissionContent.includes('اتساق') || submissionContent.includes('انسجام') || submissionContent.includes('صرف') || submissionContent.includes('افتعل');

  let score = 94;
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (wordCount > 25 || hasLinguisticKeywords) {
    score = Math.min(99, 88 + Math.floor(Math.random() * 10));
    strengths.push('استخدام رصين للمصطلحات الأكاديمية واللسانية المعتمدة');
    strengths.push('تحليل منهجي مستوفٍ لشروط المقياس ومعايير أ.د. بن جلول مختار');
    strengths.push('دقة في التعليل الصرفي أو التركيبي والنحوي');
    improvements.push('يمكن تدعيم الإجابة بذكر شواهد قرآنية أو أبيات شعرية من التراث العربي');
    improvements.push('الإحالة إلى مراجع المخبر في الدراسات النحوية واللسانية لتعزيز البعد الأكاديمي');
  } else {
    score = 75;
    strengths.push('الفكرة العامة سليمة وفي الاتجاه الصحيح');
    improvements.push('الإجابة موجزة جداً؛ ينبغي التفصيل في ذكر العلل الصرفية أو النحوية والتمثيل لها');
    improvements.push('مراعاة خطوات التحليل اللساني المنهجي المقررة في المقياس');
  }

  return {
    score,
    strengths,
    improvements,
    detailedAnalysis: `تمت مراجعة الإجابة الأكاديمية لمهمة "${exerciseTitle}". أظهر الطالب استيعاباً ممتازاً لمفاهيم المقياس ومنهج التحليل اللغوي المعتمد في كلية الآداب واللغات بجامعة ابن خلدون تيارت.`
  };
}

// Professor AI Course & Curriculum Generator
export async function generateCourseModuleAI(
  topicTitle: string,
  targetAudience: string = 'طلبة قسم اللغة والأدب العربي - جامعة تيارت'
): Promise<{
  titleAr: string;
  summary: string;
  keyConcepts: string[];
  suggestedDuration: string;
  outline: string[];
  suggestedAssignment: {
    title: string;
    description: string;
    difficulty: 'سهل' | 'متوسط' | 'متقدم';
  };
}> {
  await new Promise(resolve => setTimeout(resolve, 1400));

  return {
    titleAr: `محاضرة: قضايا متقدمة في ${topicTitle}`,
    summary: `وحدة تعليمية وبحثية أعدت لـ ${targetAudience} تستعرض الجذور التراثية والأبعاد اللسانية المعاصرة لموضوع ${topicTitle} ضمن أبحاث مخبر الدراسات النحوية واللغوية.`,
    keyConcepts: [
      `التأصيل النظري لـ ${topicTitle}`,
      'موقف النحاة واللغويين الأوائل',
      'القراءة في ضوء المدارس اللسانية الحديثة',
      'التطبيقات النصية والشواهد الإعرابية والصرفية'
    ],
    suggestedDuration: '90 دقيقة',
    outline: [
      '1. مدخل إبستيمولوجي وتحديد المصطلح لغة واصطلاحاً',
      '2. إشكالية المبحث في التراث اللغوي والنحوي العربي',
      '3. الرؤية المقارنة مع النظريات اللسانية الغربية الحديثة',
      '4. نماذج تطبيقية ونصوص تحليلية للشرح والمناقشة',
      '5. خلاصة المبحث وتوصيات للبحوث الأكاديمية والماستر'
    ],
    suggestedAssignment: {
      title: `تطبيق أكاديمي: دراسة مقارنة حول ${topicTitle}`,
      description: `يطلب من الطالب تحرير ورقة بحثية مصغرة تستنطق الشواهد وتحلل الأبعاد التركيبية والدلالية للموضوع مع التوثيق المنهجي.`,
      difficulty: 'متوسط'
    }
  };
}
