import { Course, Lecture, Exercise, Student, Announcement } from '@/types';

export const initialCourses: Course[] = [
  {
    id: 'course-ling-401',
    code: 'لسان 401',
    title: 'مقياس اللسانيات العربية',
    department: 'قسم اللغة والأدب العربي - كلية الآداب واللغات',
    instructorName: 'أ.د. بن جلول مختار',
    description: 'موجه لطلبة (ماستر 1 - شعبة الدراسات اللغوية - تخصص لسانيات الخطاب). يتناول قضايا اللسانيات العامة واللسانيات العربية، وتحليل الخطاب، والتداولية، وعلاقة التراث اللغوي بالمدارس اللسانية الحديثة.',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    totalStudents: 34,
    lecturesCount: 14,
    exercisesCount: 6,
    term: 'السداسي الأول - ماستر 1 (شعبة الدراسات اللغوية - تخصص لسانيات الخطاب)',
    color: 'from-amber-700 via-amber-800 to-amber-950',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_BenDjelloul_Linguistics_Drive'
  },
  {
    id: 'course-sarf-201',
    code: 'صرف 201',
    title: 'مقياس الصرف العربي',
    department: 'قسم اللغة والأدب العربي - كلية الآداب واللغات',
    instructorName: 'أ.د. بن جلول مختار',
    description: 'موجه لطلبة (السنة الثانية ليسانس - الشعبة الأدبية والشعبة النقدية - السداسي الأول). دراسة معمقة للميزان الصرفي، بنية الكلمة العربية، الاشتقاق، التصريف، وأبنية المصادر والمشتقات والإعلال والإبدال.',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    totalStudents: 78,
    lecturesCount: 14,
    exercisesCount: 8,
    term: 'السنة الثانية ليسانس - السداسي الأول (الشعبة الأدبية والنقدية)',
    color: 'from-emerald-800 via-teal-900 to-emerald-950',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_BenDjelloul_Sarf_Drive'
  },
  {
    id: 'course-nahw-202',
    code: 'نحو 202',
    title: 'مقياس النحو العربي',
    department: 'قسم اللغة والأدب العربي - كلية الآداب واللغات',
    instructorName: 'أ.د. بن جلول مختار',
    description: 'موجه لطلبة (السنة الثانية ليسانس - الشعبة الأدبية والشعبة النقدية - السداسي الثاني). دراسة نظرية العامل، الجملة العربية ونواسخها، المنصوبات والمجرورات، والمقارنة بين أصول النحو التراثي والنظريات التركيبية الحديثة.',
    thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    totalStudents: 82,
    lecturesCount: 14,
    exercisesCount: 8,
    term: 'السنة الثانية ليسانس - السداسي الثاني (الشعبة الأدبية والنقدية)',
    color: 'from-blue-900 via-indigo-950 to-slate-900',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1_BenDjelloul_Nahw_Drive'
  }
];

// Helper to generate 14 official academic lectures for each course
const generateFourteenLectures = (
  courseId: string, 
  topics: { titleAr: string; titleEn: string; summary: string; concepts: string[] }[]
): Lecture[] => {
  return topics.map((t, index) => {
    const weekNum = index + 1;
    const isFirst = weekNum <= 2; // First two lectures have pre-prepared materials, others ready for professor upload
    return {
      id: `lec-${courseId}-${weekNum}`,
      courseId,
      weekNumber: weekNum,
      title: t.titleEn,
      titleAr: `المحاضرة ${weekNum}: ${t.titleAr}`,
      summary: t.summary,
      duration: '90 دقيقة',
      content: `المحاور الأكاديمية للمحاضرة ${weekNum}:
1. مدخل تمهيدي وتأطير إبستيمولوجي للمبحث: ${t.titleAr}.
2. دراسة الشواهد والنصوص اللغوية التراثية والحديثة المرتبطة بالموضوع.
3. تفكيك العناصر اللسانية والتحليل التركيبي والدلالي في ضوء منهج الأستاذ الدكتور بن جلول مختار.
4. آفاق البحث والمناقشة الأكاديمية لطلبة جامعة ابن خلدون تيارت.`,
      keyConcepts: t.concepts,
      materials: isFirst ? [
        { id: `mat-${courseId}-${weekNum}-1`, title: `مطبوعة المحاضرة ${weekNum} (PDF)`, type: 'pdf', url: '#', size: '2.8 MB' },
        { id: `mat-${courseId}-${weekNum}-2`, title: `ملخص العرض الأكاديمي (Slides)`, type: 'slides', url: '#', size: '1.5 MB' }
      ] : [],
      isUploaded: isFirst,
      uploadedFileName: isFirst ? `محاضرة_${weekNum}_${courseId}.pdf` : undefined,
      uploadedFileSize: isFirst ? '2.8 MB' : undefined,
      uploadedFileDate: isFirst ? '2026-10-10' : undefined,
      googleDriveUrl: isFirst ? `https://drive.google.com/file/d/1_Drive_Lecture_${weekNum}_${courseId}/view` : undefined,
      aiSummary: `ملخص شامل للمحاضرة ${weekNum} في مبحث ${t.titleAr} وفق مقررات مخبر الدراسات النحوية واللغوية.`,
      hasExercises: weekNum % 2 === 0,
      dateAdded: `2026-10-${weekNum < 10 ? '0' + weekNum : weekNum}`
    };
  });
};

// 14 Topics for Arabic Linguistics (ماستر 1 - شعبة الدراسات اللغوية - تخصص لسانيات الخطاب)
const lingTopics = [
  { titleAr: 'مدخل إلى اللسانيات العامة ولسانيات الخطاب', titleEn: 'Discourse Analysis Foundations', summary: 'التمييز بين لسانيات الجملة ولسانيات النص والخطاب وسياق التلفظ.', concepts: ['لسانيات النص', 'تحليل الخطاب', 'السياق التلفظي'] },
  { titleAr: 'معايير النصية السبعة عند روبرت دي بوغراند', titleEn: 'Seven Standards of Textuality', summary: 'الاتساق، الانسجام، القصدية، المقبولية، الإخبارية، المقامية، والتناص.', concepts: ['الاتساق', 'الانسجام', 'التناص', 'المقامية'] },
  { titleAr: 'آليات الاتساق النحوي والمعجمي في العربية', titleEn: 'Grammatical and Lexical Cohesion', summary: 'الإحالة الضميرية والاسمية، الاستبدال، الحذف، والربط العطفي والشرطي.', concepts: ['الإحالة القبلية والبعدية', 'الحذف', 'الربط الحجاجي'] },
  { titleAr: 'الانسجام الدلالي والتداوليات المعاصرة', titleEn: 'Semantic Coherence and Pragmatics', summary: 'نظرية أفعال الكلام ومبدأ التعاون لغرايس ومقتضيات التخاطب.', concepts: ['أفعال الكلام', 'الاستلزام الحواري', 'مبدأ التعاون'] },
  { titleAr: 'نظرية النظم عند عبد القاهر الجرجاني', titleEn: 'Nazm Theory by Al-Jurjani', summary: 'تلاقي المعنى مع التركيب والنحو في دلائل الإعجاز.', concepts: ['نظرية النظم', 'التعليق', 'دلائل الإعجاز'] },
  { titleAr: 'البعد التداولي عند علماء التراث اللغوي العربي', titleEn: 'Pragmatic Dimension in Arab Heritage', summary: 'ابن جني في الخصائص وسيبويه في مراعاة مقتضى حال المخاطب.', concepts: ['شجاعة العربية', 'مقتضى الحال', 'الحمل على المعنى'] },
  { titleAr: 'بنية الخطاب الحجاجي وآليات الإقناع', titleEn: 'Argumentative Discourse and Persuasion', summary: 'نظريات الحجاج اللساني عند أنسكومبر وديكرو.', concepts: ['الحجاج اللساني', 'السلالم الحجاجية', 'الروابط الحجاجية'] },
  { titleAr: 'التناص وتعدد الأصوات (البوليفونية) في الخطاب', titleEn: 'Intertextuality and Polyphony', summary: 'ميخائيل باختين وجوليا كريستيفا وتطبيقاتها في الخطاب العربي.', concepts: ['البوليفونية', 'التناص', 'تداخل النصوص'] },
  { titleAr: 'التحليل اللساني للخطاب السياسي والإعلامي', titleEn: 'Political and Media Discourse Analysis', summary: 'تفكيك الاستراتيجيات الخطابية ومضمرات القول والأيديولوجيا.', concepts: ['الاستراتيجيات الخطابية', 'المضمرات', 'الأيديولوجيا'] },
  { titleAr: 'اللسانيات التوليدية والتحويلية وتحليل التراكيب', titleEn: 'Generative Grammar and Syntax', summary: 'مبادئ تشومسكي في البنية العميقة والسطحية ومقارنتها بنحو العربية.', concepts: ['البنية العميقة والسطحية', 'التحويل', 'القدرة اللسانية'] },
  { titleAr: 'السيميائيات وتحليل الخطاب الأدبي', titleEn: 'Semiotics and Literary Discourse', summary: 'المربعات السيميائية لمسار المعنى وسيميائيات غريماس.', concepts: ['المربع السيميائي', 'العوامل السيميائية', 'إنتاج الدلالة'] },
  { titleAr: 'اللسانيات الحاسوبية ومعالجة اللغة العربية آلياً', titleEn: 'Computational Arabic Linguistics', summary: 'النماذج الحاسوبية في التحليل الصرفي والنحوي والذكاء الاصطناعي.', concepts: ['المعالجة الآلية', 'المحلل الصرفي', 'اللسانيات الحاسوبية'] },
  { titleAr: 'قضايا المصطلح اللساني العربي والترجمة', titleEn: 'Arabic Linguistic Terminology and Translation', summary: 'إشكالات تعريب المصطلح اللساني وتعدد المقابلات في المغرب والمشرق.', concepts: ['المصطلح اللساني', 'التعريب', 'التوحيد المصطلحي'] },
  { titleAr: 'خاتمة المقياس: آفاق البحث اللساني في مخبر تيارت', titleEn: 'Future Horizons in Linguistic Research', summary: 'مشروعات مخبر الدراسات النحوية واللغوية بين التراث والحداثة.', concepts: ['مخبر تيارت', 'التراث والحداثة', 'مشاريع الماستر والدكتوراه'] }
];

// 14 Topics for Arabic Morphology (السنة الثانية ليسانس - الصرف العربي)
const sarfTopics = [
  { titleAr: 'مدخل إلى علم الصرف وفلسفة الميزان الصرفي', titleEn: 'Introduction to Arabic Morphology & Scale', summary: 'تعريف الصرف ومادته واختيار (فعل) للميزان وضبط الحركات.', concepts: ['الميزان الصرفي', 'فاء وعين ولام الكلمة', 'الأصل والزيادة'] },
  { titleAr: 'المجرد والمزيد من الأفعال والأسماء', titleEn: 'Bare and Augmented Words', summary: 'الثلاثي والرباعي المجرد وأحرف الزيادة (سألتمونيها).', concepts: ['المجرد الثلاثي', 'المجرد الرباعي', 'أحرف الزيادة'] },
  { titleAr: 'معاني صيغ الزيادة في الأفعال الثلاثية', titleEn: 'Meanings of Augmented Verb Forms', summary: 'أفعل، فعَّل، فاعل، تفعَّل، تفاعل، واستفعل ودلالاتها الوظيفية.', concepts: ['التعدية', 'المشاركة', 'المبالغة', 'الطلب والتحول'] },
  { titleAr: 'الجامد والمشتق والمصادر الصريحة', titleEn: 'Rigid vs Derived & Verbal Nouns', summary: 'المصدر الأصلي، الميمي، الصناعي، واسم المرة والهيئة.', concepts: ['المصدر الصريح', 'المصدر الميمي', 'اسم المرة والهيئة'] },
  { titleAr: 'اسم الفاعل وصيغ المبالغة وعملها', titleEn: 'Active Participle and Intensive Forms', summary: 'صياغتها من الثلاثي وغير الثلاثي والدلالة والعمل النحوي.', concepts: ['اسم الفاعل', 'صيغ المبالغة', 'إعمال المشتقات'] },
  { titleAr: 'اسم المفعول وبناؤه الصرفي', titleEn: 'Passive Participle', summary: 'أبنية اسم المفعول وتصريف الأجوف والناقص فيه.', concepts: ['اسم المفعول', 'تصريف المعتل', 'شروط العمل'] },
  { titleAr: 'الصفة المشبهة باسم الفاعل وأوزانها', titleEn: 'Assimilate Adjective', summary: 'الفرق بين الصفة المشبهة واسم الفاعل وأوزانها القياسية والسماعية.', concepts: ['الصفة المشبهة', 'أوزان الصفة', 'الثبوت والحدوث'] },
  { titleAr: 'اسما الزمان والمكان واسم الآلة', titleEn: 'Nouns of Time, Place, and Instrument', summary: 'صياغة مفعل ومفعل واسم الآلة القياسي والجامد.', concepts: ['اسم الزمان والمكان', 'اسم الآلة', 'الأوزان القياسية الحديثة'] },
  { titleAr: 'اسم التفضيل: صياغته وأحواله واستعمالاته', titleEn: 'Superlative and Comparative Noun', summary: 'شروط صياغة أفعل التفضيل والمطابقة مع الموصوف وعدمها.', concepts: ['اسم التفضيل', 'شروط الصياغة', 'أحوال اسم التفضيل'] },
  { titleAr: 'الإعلال بالقلب في الأفعال والأسماء', titleEn: 'Morphological Mutation by Inversion', summary: 'قلب الواو والياء ألفاً أو همزة وشروطه الصرفية الدقيقة.', concepts: ['الإعلال بالقلب', 'قلب الواو ألفاً', 'قلب الياء همزة'] },
  { titleAr: 'الإعلال بالحذف وبالتسكين', titleEn: 'Mutation by Deletion and Quiescence', summary: 'حذف فاء المثال وعين الأجوف ولام الناقص والإعلال بالنقل.', concepts: ['الإعلال بالحذف', 'الإعلال بالنقل', 'الفعل الأجوف والناقص'] },
  { titleAr: 'الإبدال الصوتي في صيغ الافتعال', titleEn: 'Phonetic Substitution in Ifteala', summary: 'إبدال تاء الافتعال طاء أو دالاً والإدغام والانسجام الصوتي.', concepts: ['الإبدال الصوتي', 'تاء الافتعال', 'الانسجام الصوتي'] },
  { titleAr: 'النسب والوقف والقلب المكاني', titleEn: 'Attribution, Pausing, and Metathesis', summary: 'قواعد ياء النسب والقلب المكاني وطرق استكشافه في الميزان.', concepts: ['ياء النسب', 'القلب المكاني', 'أشياء وجاه'] },
  { titleAr: 'مراجعة شاملة وتطبيقات صرفية في نصوص تراثية', titleEn: 'Comprehensive Morphological Review', summary: 'تطبيقات عملية في وزن الشواهد الشعرية والقرآنية لامتحانات السداسي.', concepts: ['تحليل صرفي شامل', 'وزن الشواهد', 'التحضير للامتحان'] }
];

// 14 Topics for Arabic Syntax (السنة الثانية ليسانس - النحو العربي)
const nahwTopics = [
  { titleAr: 'مدخل إلى نظرية العامل النحوي ونشأتها', titleEn: 'Governing Theory in Arabic Grammar', summary: 'مفهوم العامل والمعمول والأثر الإعرابي وتاريخ نشأة النظرية.', concepts: ['نظرية العامل', 'العامل والمعمول', 'الأثر الإعرابي'] },
  { titleAr: 'أقسام العوامل: اللفظية والمعنوية', titleEn: 'Verbal and Abstract Governors', summary: 'العوامل اللفظية الأصلية والتبعية وعامل الابتداء والتجرد.', concepts: ['العوامل اللفظية', 'العوامل المعنوية', 'عامل الابتداء'] },
  { titleAr: 'بنية الجملة العربية: الاسمية والفعلية', titleEn: 'Arabic Sentence Structure', summary: 'رتبة الفاعل والمفعول وأحكام المبتدأ والخبر ووجوب التقديم والتأخير.', concepts: ['الجملة الاسمية', 'الجملة الفعلية', 'رتبة الكلمات'] },
  { titleAr: 'نواسخ الابتداء: كان وأخواتها وأفعال المقاربة', titleEn: 'Sentence Annulers: Kana and Inchoatives', summary: 'الأفعال الناسخة الناقصة والتامة ومعاني كاد وأخواتها.', concepts: ['كان وأخواتها', 'أفعال المقاربة والرجاء والشروع', 'النواسخ الفعلية'] },
  { titleAr: 'الحروف الناسخة: إن وأخواتها ولا النافية للجنس', titleEn: 'Inna and its Sisters & Absolute Negation', summary: 'دلالات الحروف الناسخة وأحكام كفها بـ (ما) وأحكام لا النافية للجنس.', concepts: ['إن وأخواتها', 'لا النافية للجنس', 'كف إن بما'] },
  { titleAr: 'أحكام الفاعل ونائب الفاعل والتنازع النحوي', titleEn: 'Subject, Passive Agent & Syntactic Conflict', summary: 'أحكام تأنيث الفعل مع الفاعل وباب التنازع في العمل الإعرابي.', concepts: ['الفاعل', 'نائب الفاعل', 'باب التنازع'] },
  { titleAr: 'المفاعيل الخمسة (المفعول به، المطلق، فيه، له، ومعه)', titleEn: 'The Five Objects in Arabic Syntax', summary: 'أحكام المنصوبات والتمييز الدلالي والتركيبي بين أنواع المفاعيل.', concepts: ['المفعول به', 'المفعول المطلق', 'المفعول لأجله وفيه ومعه'] },
  { titleAr: 'الحال والتمييز: الفروق التركيبية والدلالية', titleEn: 'Circumstantial State and Specification', summary: 'شروط الحال والتمييز والجمود والاشتقاق وأحكام تمييز العدد.', concepts: ['الحال', 'التمييز', 'تمييز الأعداد'] },
  { titleAr: 'الاستثناء وأحكام المستثنى بإلا وغير وسوى', titleEn: 'Exception in Arabic Grammar', summary: 'الكلام التام الموجب والتام المنفي والمفرغ وأحكام خلا وعدا وحاشا.', concepts: ['أسلوب الاستثناء', 'إلا وغير وسوى', 'الاستثناء المفرغ'] },
  { titleAr: 'المجرورات بالحرف وبالإضافة وأحكام الإضافة', titleEn: 'Genitive by Preposition and Annexation', summary: 'معاني حروف الجر والإضافة اللفظية والمعنوية وأحكام المضاف إليه.', concepts: ['معاني حروف الجر', 'الإضافة المعنوية واللفظية', 'أحكام المضاف'] },
  { titleAr: 'التوابع: النعت والتوكيد والعطف والبدل', titleEn: 'Syntactic Followers: Adjective, Emphasis, etc.', summary: 'أحكام التبعية الإعرابية وشروط النعت السببي والبدل بأنواعه.', concepts: ['النعت الحقيقي والسببي', 'التوكيد', 'العطف', 'البدل'] },
  { titleAr: 'جوازم الفعل المضارع وأدوات الشرط الجازمة', titleEn: 'Jussive Mood and Conditional Tools', summary: 'الجوازم لفعل واحد وأدوات الشرط الجازمة لفعلين واقتران الجواب بالفاء.', concepts: ['أدوات الشرط', 'جزم المضارع', 'جواب الشرط المقترن بالفاء'] },
  { titleAr: 'نقد نظرية العامل: ابن مضاء القرطبي واللسانيات الحديثة', titleEn: 'Critique of Governing Theory: Ibn Mada & Modernity', summary: 'قراءة في كتاب الرد على النحاة ومقارنة العامل بنظرية العمل والربط لتشومسكي.', concepts: ['ابن مضاء القرطبي', 'الرد على النحاة', 'تشومسكي ونظرية الربط'] },
  { titleAr: 'تطبيقات إعرابية وتحليل نصوص شعرية وقرآنية', titleEn: 'Applied Parsing and Textual Analysis', summary: 'إعراب شواهد تطبيقية مركبة وتدريب الطلبة على الدقة الإعرابية التراثية.', concepts: ['الإعراب التقديري والمحلي', 'شواهد شعرية', 'التحضير للامتحان النهائي'] }
];

export const initialLectures: Lecture[] = [
  ...generateFourteenLectures('course-ling-401', lingTopics),
  ...generateFourteenLectures('course-sarf-201', sarfTopics),
  ...generateFourteenLectures('course-nahw-202', nahwTopics),
];

export const initialExercises: Exercise[] = [
  {
    id: 'ex-ling-1',
    courseId: 'course-ling-401',
    lectureId: 'lec-course-ling-401-1',
    title: 'تطبيق لساني: تحليل آليات الاتساق النصي في نص أدبي جزائري',
    description: 'اختر نصاً أدبياً أو خطاباً فكرياً جزائرياً معاصراً، وقم بتطبيق معايير الاتساق (الإحالة القبلية والبعدية، الاستبدال، الحذف، والربط الحجاجي) مبيناً دورها في تشكيل بنية الخطاب.',
    type: 'essay',
    difficulty: 'متقدم',
    maxScore: 100,
    dueDate: '2026-10-25',
    instructions: [
      'توثيق النص المختار وصاحبه وسياقه التلفظي.',
      'استخراج أدوات الاتساق النحوي والمعجمي وتصنيفها.',
      'بيان الفرق بين الاتساق الشكلي والانسجام الدلالي داخل النص.',
      'ربط التحليل بأحد مفاهيم اللسانيات التراثية (كالتعليق أو النظم عند الجرجاني).'
    ],
    sampleSolution: 'يقوم الطالب بتحليل نص للأديب رضا حوحو أو مالك بن نبي، مستخرجاً الروابط المنطقية والإحالات الضميرية.',
    submissionsCount: 28
  },
  {
    id: 'ex-sarf-1',
    courseId: 'course-sarf-201',
    lectureId: 'lec-course-sarf-201-1',
    title: 'تطبيق صرفي: موازنة الكلمات وتحليل التغيرات الصوتية والصرفية',
    description: 'زن الكلمات التالية وزناً صرفياً دقيقاً مع ذكر ما طرأ عليها من زيادة أو إعلال أو إبدال أو حذف: (استقامَ، دَعْ، قِ، اضطَرَبَ، اصطَفَى، مِيعاد، قاضٍ).',
    type: 'code',
    difficulty: 'متوسط',
    maxScore: 100,
    dueDate: '2026-10-28',
    instructions: [
      'بيان الجذر اللغوي لكل كلمة (الأصل الثلاثي).',
      'ذكر صيغة الوزن الصرفي بالميزان (ف - ع - ل).',
      'توضيح سبب الإبدال الصوتي في صيغ افتعل (تاء الافتعال).',
      'التعليل الصرفي الدقيق للحذف في (قِ) و (دَعْ).'
    ],
    starterCode: `# الإجابة المقترحة للتطبيق الصرفي:
الكلمة: اضطرب
الجذر: ضرب (فعل)
الوزن الصرفي: افتعل
الظاهرة الصرفية: إبدال تاء الافتعال طاء لمجاورتها حرف الضاد وهو من حروف الاستعلاء والإطباق.

الكلمة: قِ
الجذر: وقى (فعل)
الوزن الصرفي: عِ
الظاهرة الصرفية: حذف فاء الكلمة (الواو) وحذف لام الكلمة (حرف العلة) للبناء على حذف حرف العلة.
`,
    submissionsCount: 65
  },
  {
    id: 'ex-nahw-1',
    courseId: 'course-nahw-202',
    lectureId: 'lec-course-nahw-202-1',
    title: 'تطبيق نحوي: تفكيك نظرية العامل ومناقشة آراء ابن مضاء القرطبي',
    description: 'حرر دراسة نقدية تقارن فيها بين منطق العامل عند نحاة البصرة وموقف ابن مضاء القرطبي في كتاب "الرد على النحاة"، موضحاً أثر إسقاط العامل على البنية الإعرابية للجملة.',
    type: 'essay',
    difficulty: 'متقدم',
    maxScore: 100,
    dueDate: '2026-11-05',
    instructions: [
      'عرض حجج النحاة في إثبات العوامل المعنوية واللفظية.',
      'تلخيص اعتراضات ابن مضاء الأربعة على النحاة (العلل الثواني والثوالث، التقدير، إلخ).',
      'إبداء الرأي النقدي المدعم بأدلة من المدارس اللسانية الحديثة.'
    ],
    submissionsCount: 52
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-201',
    name: 'عبد القادر بن عيسى',
    email: 'a.benaissa@univ-tiaret.dz',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    universityId: '202238014522',
    major: 'ماستر 1 - لسانيات الخطاب',
    level: 'ماستر 1',
    branch: 'الدراسات اللغوية',
    specialty: 'لسانيات الخطاب',
    groupNumber: 'الفوج 1',
    enrolledCourseIds: ['course-ling-401'],
    attendanceRate: 98,
    averageGrade: 95,
    completedAssignments: 5,
    totalAssignments: 6,
    lastActive: 'منذ 10 دقائق'
  },
  {
    id: 'std-202',
    name: 'مريم قدور بلحاج',
    email: 'm.kaddour@univ-tiaret.dz',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    universityId: '202338029104',
    major: 'السنة الثانية ليسانس - الشعبة الأدبية',
    level: 'السنة الثانية ليسانس',
    branch: 'الشعبة الأدبية',
    groupNumber: 'الفوج 2',
    enrolledCourseIds: ['course-sarf-201', 'course-nahw-202'],
    attendanceRate: 100,
    averageGrade: 97,
    completedAssignments: 6,
    totalAssignments: 6,
    lastActive: 'متصلة الآن'
  },
  {
    id: 'std-203',
    name: 'إسماعيل زواوي',
    email: 'i.zouaoui@univ-tiaret.dz',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    universityId: '202338031189',
    major: 'السنة الثانية ليسانس - الشعبة النقدية',
    level: 'السنة الثانية ليسانس',
    branch: 'الشعبة النقدية',
    groupNumber: 'الفوج 1',
    enrolledCourseIds: ['course-sarf-201', 'course-nahw-202'],
    attendanceRate: 92,
    averageGrade: 88,
    completedAssignments: 4,
    totalAssignments: 6,
    lastActive: 'منذ ساعة'
  },
  {
    id: 'std-204',
    name: 'حليمة سعيدي',
    email: 'h.saidi@univ-tiaret.dz',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    universityId: '202238019044',
    major: 'ماستر 1 - لسانيات الخطاب',
    level: 'ماستر 1',
    branch: 'الدراسات اللغوية',
    specialty: 'لسانيات الخطاب',
    groupNumber: 'الفوج 2',
    enrolledCourseIds: ['course-ling-401'],
    attendanceRate: 95,
    averageGrade: 93,
    completedAssignments: 5,
    totalAssignments: 6,
    lastActive: 'أمس'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    courseId: 'course-ling-401',
    title: 'موعد الندوة العلمية لمخبر الدراسات النحوية واللغوية',
    content: 'يعلم الأستاذ الدكتور بن جلول مختار طلبة ماستر 1 لسانيات الخطاب عن انعقاد ندوة حضورية وافتراضية حول: "تحليل الخطاب العربي بين التراث البلاغي واللسانيات المعاصرة"، وذلك يوم الخميس القادم بقاعة المحاضرات بكلية الآداب واللغات.',
    author: 'أ.د. بن جلول مختار',
    date: '13 أكتوبر 2026',
    isImportant: true
  },
  {
    id: 'ann-2',
    courseId: 'course-sarf-201',
    title: 'تسليم التطبيق الأول لمقياس الصرف العربي',
    content: 'تنبيه لطلبة السنة الثانية ليسانس: يرجى تسليم تطبيق الميزان الصرفي والإبدال عبر المنصة قبل يوم الإثنين، مع إمكانية مراجعة الإجابة أولاً بواسطة وكيل الذكاء الاصطناعي الأكاديمي.',
    author: 'أ.د. بن جلول مختار',
    date: '11 أكتوبر 2026',
    isImportant: false
  }
];
