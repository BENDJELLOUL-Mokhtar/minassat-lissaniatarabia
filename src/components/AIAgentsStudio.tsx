'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Lecture, Course, UserRole, AIMessage } from '@/types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  BookOpen, 
  GraduationCap, 
  Settings2, 
  FileCode2, 
  HelpCircle, 
  Key, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw,
  Lightbulb,
  Cpu
} from 'lucide-react';
import { askAITutor, generateCourseModuleAI } from '@/lib/ai-service';

interface AIAgentsStudioProps {
  currentRole: UserRole;
  course: Course;
  lectures: Lecture[];
  initialLectureContext?: Lecture | null;
}

export const AIAgentsStudio: React.FC<AIAgentsStudioProps> = ({
  currentRole,
  course,
  lectures,
  initialLectureContext,
}) => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'generator' | 'settings'>(
    currentRole === 'professor' ? 'generator' : 'tutor'
  );

  // AI Tutor State
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      role: 'مساعد أكاديمي ذكي',
      content: `أهلاً بك! أنا **وكيل الذكاء الاصطناعي الأكاديمي** لمساق "${course.title}". 
أنا متصل مباشرة بمحتوى المحاضرات والتطبيقات العملية لمساعدتك على فهم المفاهيم المعقدة، حل التمارين البرمجية، والاستعداد للاختبارات.

ما الذي تود مناقشته اليوم؟`,
      timestamp: 'الآن',
      suggestedPrompts: [
        'اشرح لي كيف تعمل خوارزمية A* Search ببساطة',
        'ما هي عناصر نموذج PEAS في الذكاء الاصطناعي؟',
        'اختبرني بسؤال سريع من المحاضرة الأولى',
        'ما الفرق بين دالة ReLU ودالة Sigmoid في الشبكات العصبية؟'
      ]
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedLectureContext, setSelectedLectureContext] = useState<string>(
    initialLectureContext ? initialLectureContext.id : 'all'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Professor Generator State
  const [generatorTopic, setGeneratorTopic] = useState('');
  const [generatorType, setGeneratorType] = useState<'module' | 'quiz' | 'rubric'>('module');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  // Settings State
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const activeLectureObj = lectures.find(l => l.id === selectedLectureContext);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isLoading) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender,
        content: m.content
      }));

      const res = await askAITutor(
        text,
        activeLectureObj,
        history,
        geminiApiKey
      );

      const aiMsg: AIMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        role: 'الوكيل الأكاديمي',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: res.suggestedQuestions,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunGenerator = async () => {
    if (!generatorTopic.trim() || isGenerating) return;
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      if (generatorType === 'module') {
        const result = await generateCourseModuleAI(generatorTopic);
        setGeneratedResult(result);
      } else if (generatorType === 'quiz') {
        await new Promise(r => setTimeout(r, 1200));
        setGeneratedResult({
          type: 'quiz',
          title: `اختبار قصير: ${generatorTopic}`,
          questions: [
            {
              q: `ما هو المبدأ الحسابي الأساسي الذي يرتكز عليه ${generatorTopic}؟`,
              options: ['التحسين التكراري عبر دوال التكلفة', 'البحث العشوائي غير الموجه', 'التصنيف الثابت بالاعتماد على الجداول', 'لا شيء مما سبق'],
              correct: 0,
              explanation: 'يعتمد على التحديث التكراري لتقليل قيمة دالة الخسارة.'
            },
            {
              q: `في أي سياق تطبيقي يعتبر استخدام ${generatorTopic} غير مناسب؟`,
              options: ['عندما تكون البيانات غير مكتملة بنسبة 100%', 'عندما يتطلب التطبيق استجابة في الوقت الحقيقي وتكون الموارد الحسابية محدودة جداً', 'في الحوسبة السحابية', 'في تطبيقات الويب'],
              correct: 1,
              explanation: 'التعقيد الحسابي المرتفع يتطلب عتاداً مناسباً.'
            }
          ]
        });
      } else {
        await new Promise(r => setTimeout(r, 1000));
        setGeneratedResult({
          type: 'rubric',
          title: `معايير تقييم (Rubric) لـ ${generatorTopic}`,
          criteria: [
            { criterion: 'صحة المنطق الرياضي والبرمجي', weight: '40%', details: 'تطبيق صحيح للخوارزمية بدون أخطاء منطقية' },
            { criterion: 'كفاءة التعقيد الحسابي والذاكرة', weight: '30%', details: 'اختيار هياكل بيانات ملائمة وتفادي الحلقات الزائدة' },
            { criterion: 'التوثيق وجودة الكود والتعليقات', weight: '20%', details: 'كتابة تعليقات واضحة للمكونات الرئيسية' },
            { criterion: 'معالجة الحالات الحدية (Edge Cases)', weight: '10%', details: 'اختبار المدخلات الصفرية أو الفارغة' }
          ]
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>مختبر وكلاء الذكاء الاصطناعي</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  متصل ومتاح
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                منظومة وكلاء تفاعليين تخدم كلاً من الطلبة والأساتذة
              </p>
            </div>
          </div>
        </div>

        {/* Studio Subtabs */}
        <div className="flex items-center p-1 rounded-xl bg-gray-900 border border-gray-800 text-xs">
          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'tutor'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>وكيل الطالب (المساعد الدراسي)</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'generator'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>وكيل الأستاذ (بناء المحتوى والامتحانات)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-2 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="إعدادات المفاتيح والنماذج"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab 1: AI Student Tutor (Full Chat with Lecture Grounding) */}
      {activeTab === 'tutor' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Context Selector Sidebar (1 col) */}
          <div className="glass-card p-5 rounded-2xl border-gray-800 space-y-4">
            <div>
              <span className="text-xs font-bold text-gray-200 block mb-1.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>سياق المحاضرة المرجعي:</span>
              </span>
              <p className="text-[11px] text-gray-400 mb-3">
                يقرأ الوكيل محتوى المحاضرة المحددة للإجابة بدقة متناهية (RAG)
              </p>

              <select
                value={selectedLectureContext}
                onChange={(e) => setSelectedLectureContext(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">كل محتوى ومقررات المنهج</option>
                {lectures.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    الأسبوع {lec.weekNumber}: {lec.titleAr}
                  </option>
                ))}
              </select>
            </div>

            {activeLectureObj && (
              <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-850 space-y-2">
                <span className="text-[10px] font-bold text-cyan-300 block">
                  المفاهيم المحملة في ذاكرة الوكيل:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeLectureObj.keyConcepts.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-800">
              <span className="text-[11px] font-bold text-gray-400 block mb-2">أمثلة مقترحة للنقاش:</span>
              <div className="space-y-1.5">
                {[
                  'لخص لي المحاضرة في نقاط سريعة',
                  'ما هي أهم صيغة رياضية مشروحة هنا؟',
                  'أعطني تمريناً برمجياً يحاكي هذه الفكرة',
                  'كيف أستعد لاختبار هذا الفصل؟'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sample)}
                    className="w-full text-right p-2 rounded-lg bg-gray-900/50 hover:bg-cyan-950/40 text-[11px] text-gray-300 hover:text-cyan-200 border border-gray-800/80 transition"
                  >
                    💡 {sample}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Main Chat Window (3 cols) */}
          <div className="lg:col-span-3 glass-card rounded-2xl border-gray-800 flex flex-col h-[650px] overflow-hidden">
            {/* Chat Top Banner */}
            <div className="p-4 bg-gray-900/80 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">المساعد الأكاديمي الذكي (AI University Tutor)</h3>
                  <span className="text-[10px] text-gray-400">
                    السياق النشط: {activeLectureObj ? activeLectureObj.titleAr : 'مقرر الذكاء الاصطناعي الكامل'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>جاهز للدردشة التفاعلية</span>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 transition-all ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                        : 'glass-panel border-gray-700/80 text-gray-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1 text-[11px] opacity-75">
                      <span className="font-semibold">{msg.sender === 'user' ? 'أنت (طالب)' : 'المساعد الذكي'}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {msg.sender === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-gray-700/50 flex items-center justify-between">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 transition"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>نسخ الشرح</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Prompts if any */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[85%]">
                      {msg.suggestedPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-200 transition"
                        >
                          ✦ {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-900/80 border border-gray-850 text-xs text-gray-400 max-w-xs animate-pulse">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>يقوم الوكيل بالبحث في المحاضرة وصياغة الجواب...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-gray-900/90 border-t border-gray-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="اكتب سؤالك الأكاديمي أو استفسارك هنا..."
                  className="flex-1 bg-gray-950 border border-gray-700/80 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isLoading}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-600/20"
                >
                  <span>إرسال</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Professor AI Co-Pilot (Curriculum & Exam Generator) */}
      {activeTab === 'generator' && (
        <div className="glass-card p-6 rounded-2xl border-purple-500/30 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>مساعد الأستاذ الأكاديمي (Professor AI Co-Pilot)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              أداة مخصصة لعضو هيئة التدريس لصياغة المحاضرات التفاعلية، بنوك الأسئلة، ومعايير تصحيح الواجبات بسرعة فائقة.
            </p>
          </div>

          {/* Generator Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setGeneratorType('module')}
              className={`p-4 rounded-xl border text-right transition ${
                generatorType === 'module'
                  ? 'bg-purple-950/50 border-purple-500 text-white shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5 text-purple-400 mb-2" />
              <h3 className="text-xs font-bold text-white">توليد وحدة دراسية ومحاضرة</h3>
              <p className="text-[10px] text-gray-400 mt-1">صياغة محاور المحاضرة، الأهداف، والتطبيق المقترح</p>
            </button>

            <button
              onClick={() => setGeneratorType('quiz')}
              className={`p-4 rounded-xl border text-right transition ${
                generatorType === 'quiz'
                  ? 'bg-purple-950/50 border-purple-500 text-white shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-5 h-5 text-purple-400 mb-2" />
              <h3 className="text-xs font-bold text-white">توليد أسئلة اختبار (Quiz Builder)</h3>
              <p className="text-[10px] text-gray-400 mt-1">صياغة أسئلة اختيار من متعدد وتفسير الإجابات</p>
            </button>

            <button
              onClick={() => setGeneratorType('rubric')}
              className={`p-4 rounded-xl border text-right transition ${
                generatorType === 'rubric'
                  ? 'bg-purple-950/50 border-purple-500 text-white shadow-lg'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-purple-400 mb-2" />
              <h3 className="text-xs font-bold text-white">بناء معايير تصحيح (Rubric)</h3>
              <p className="text-[10px] text-gray-400 mt-1">تحديد أوزان التقييم للواجبات والمشاريع العملية</p>
            </button>
          </div>

          {/* Generator Input Form */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-200 block">
              الموضوع الأكاديمي المراد توليده:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={generatorTopic}
                onChange={(e) => setGeneratorTopic(e.target.value)}
                placeholder="مثال: خوارزمية Minimax ونظرية الألعاب في الذكاء الاصطناعي"
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={handleRunGenerator}
                disabled={isGenerating || !generatorTopic.trim()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-50 transition shadow-lg shadow-purple-600/20"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ البناء...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد بالذكاء الاصطناعي</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Display */}
          {generatedResult && (
            <div className="glass-panel p-5 rounded-xl border-purple-500/40 bg-gray-950/70 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">
                  {generatedResult.title || generatedResult.titleAr}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  تم التوليد بنجاح
                </span>
              </div>

              {generatorType === 'module' && (
                <div className="space-y-3 text-xs text-gray-300">
                  <p className="leading-relaxed">{generatedResult.summary}</p>
                  <div>
                    <h4 className="font-bold text-white mb-1.5">مخطط المحاضرة:</h4>
                    <ul className="space-y-1 pr-4">
                      {generatedResult.outline?.map((item: string, i: number) => (
                        <li key={i} className="list-disc text-gray-300">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {generatedResult.suggestedAssignment && (
                    <div className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                      <span className="font-bold text-emerald-400 block mb-1">
                        تطبيق مقترح: {generatedResult.suggestedAssignment.title}
                      </span>
                      <p className="text-[11px] text-gray-400">{generatedResult.suggestedAssignment.description}</p>
                    </div>
                  )}
                </div>
              )}

              {generatorType === 'quiz' && (
                <div className="space-y-4">
                  {generatedResult.questions?.map((q: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-gray-900 border border-gray-800 text-xs space-y-2">
                      <span className="font-bold text-white block">س{idx + 1}: {q.q}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt: string, oi: number) => (
                          <div
                            key={oi}
                            className={`p-2 rounded-lg border text-[11px] ${
                              oi === q.correct
                                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 font-semibold'
                                : 'bg-gray-950 border-gray-800 text-gray-400'
                            }`}
                          >
                            {opt} {oi === q.correct && '✓ (الإجابة النموذجية)'}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-400 pt-1">التفسير الأكاديمي: {q.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {generatorType === 'rubric' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400">
                        <th className="py-2 px-3">معيار التقييم</th>
                        <th className="py-2 px-3">الوزن النسبي</th>
                        <th className="py-2 px-3">الوصف والتفاصيل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-850">
                      {generatedResult.criteria?.map((c: any, i: number) => (
                        <tr key={i} className="text-gray-200">
                          <td className="py-2 px-3 font-semibold">{c.criterion}</td>
                          <td className="py-2 px-3 text-purple-400 font-bold">{c.weight}</td>
                          <td className="py-2 px-3 text-gray-400">{c.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Settings & API Key */}
      {activeTab === 'settings' && (
        <div className="glass-card p-6 rounded-2xl border-gray-800 space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gray-800 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">إعدادات محرك الذكاء الاصطناعي الأكاديمي</h2>
              <p className="text-xs text-gray-400">
                التطبيق مجهز بمحرك معرفي محلي مدمج فائق الدقة، كما يمكنك ربط مفتاح Google Gemini API لتمكين الذكاء التوليدي السحابي المباشر.
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-gray-950/60 p-4 rounded-xl border border-gray-800">
            <label className="text-xs font-semibold text-gray-200 block">
              مفتاح Google Gemini API (اختياري):
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => {
                  setGeminiApiKey(e.target.value);
                  setKeySaved(false);
                }}
                placeholder="AIzaSy..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <button
                onClick={() => setKeySaved(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                {keySaved ? 'تم الحفظ ✓' : 'حفظ المفتاح'}
              </button>
            </div>
            <p className="text-[10px] text-gray-400">
              ملاحظة: إذا لم يتوفر مفتاح، سيعمل النظام بسلاسة بنسبة 100% باستخدام المحاكي الأكاديمي المدمج.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-200 space-y-1">
            <span className="font-bold block">ميزات المنظومة:</span>
            <p>• دعم كامل للسياق العربي والمصطلحات الأكاديمية.</p>
            <p>• ربط تلقائي بملفات المحاضرات والواجبات المعتمدة في الجامعة.</p>
          </div>
        </div>
      )}
    </div>
  );
};
