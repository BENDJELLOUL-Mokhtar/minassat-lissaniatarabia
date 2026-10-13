'use client';

import React, { useState } from 'react';
import { Exercise, Course, UserRole, ExerciseSubmission } from '@/types';
import { 
  FileCode2, 
  CheckCircle2, 
  Clock, 
  Send, 
  Sparkles, 
  Bot, 
  ChevronRight, 
  AlertCircle, 
  Award, 
  Code2, 
  RotateCcw,
  UserCheck,
  Check,
  TrendingUp
} from 'lucide-react';
import { evaluateStudentSubmission } from '@/lib/ai-service';

interface ExercisesViewProps {
  currentRole: UserRole;
  course: Course;
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  onSelectExercise: (exercise: Exercise | null) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  currentRole,
  course,
  exercises,
  selectedExercise,
  onSelectExercise,
}) => {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(selectedExercise || exercises[0]);
  const [submissionCode, setSubmissionCode] = useState<string>(activeExercise?.starterCode || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<any | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Professor submissions mock
  const [submissionsList, setSubmissionsList] = useState<ExerciseSubmission[]>([
    {
      id: 'sub-1',
      exerciseId: 'ex-1',
      studentId: 'std-101',
      studentName: 'أحمد بن علي الزهراني',
      submittedAt: 'منذ ساعتين',
      content: `النظام الذكي: السيارة ذاتية القيادة (Autonomous Vehicle)
1. معيار الأداء (Performance): الوصول الآمن، تقليل زمن الرحلة، الالتزام بقواعد المرور، راحة الركاب.
2. البيئة (Environment): الطرق، المشاة، الإشارات الضوئية، المركبات الأخرى، الظروف الجوية.
3. المشغلات (Actuators): المقود، دواسة الفرامل والوقود، الإشارات الضوئية.
4. المستشعرات (Sensors): الكاميرات، الليدار LiDAR، الرادار، مستشعرات الموجات فوق الصوتية، GPS.
تصنيف البيئة: بيئة جزئياً قابلة للملاحظة (Partially Observable)، عشوائية (Stochastic)، ديناميكية (Dynamic)، متصلة (Continuous).
نوع الوكيل: وكيل قائم على المنفعة (Utility-based Agent) لضمان تحقيق أفضل توازن بين السرعة وسلامة الركاب.`,
      status: 'graded',
      grade: 96,
      aiFeedback: {
        score: 96,
        strengths: ['تصنيف دقيق جداً لعناصر PEAS', 'تحليل ممتاز لخصائص البيئة واختيار صائب للوكيل القائم على المنفعة'],
        improvements: ['يمكن إضافة مستشعرات الأعطال الميكانيكية الداخلية ضمن المستشعرات'],
        detailedAnalysis: 'إجابة نموذجية ممتازة تستوفي كافة المعايير الأكاديمية.',
        evaluatedAt: '2026-10-12'
      },
      professorFeedback: 'أحسنت يا أحمد، تحليل علمي راقٍ.'
    },
    {
      id: 'sub-2',
      exerciseId: 'ex-1',
      studentId: 'std-102',
      studentName: 'فاطمة محمد الغامدي',
      submittedAt: 'منذ 4 ساعات',
      content: `المكنسة الذكية:
Performance: نظافة الأرضيات، استهلاك البطارية.
Environment: غرف المنزل، الأثاث، السجاد.
Actuators: العجلات، فرشاة التنظيف، نظام الشفط.
Sensors: مستشعر الصدمات، الأشعة تحت الحمراء، مستشعر سقوط الدرج.`,
      status: 'graded',
      grade: 92,
      aiFeedback: {
        score: 92,
        strengths: ['بنية واضحة ومباشرة'],
        improvements: ['تحديد خصائص البيئة ونوع الوكيل لم يكتمل بالتفصيل'],
        detailedAnalysis: 'إجابة جيدة ولكن تحتاج إلى استكمال الجزء الثاني المتعلق بنوع الوكيل.',
        evaluatedAt: '2026-10-12'
      }
    }
  ]);

  const handleSelect = (ex: Exercise) => {
    setActiveExercise(ex);
    setSubmissionCode(ex.starterCode || '');
    setAiEvaluationResult(null);
    setSubmittedSuccess(false);
  };

  const handleRunAIEvaluation = async () => {
    if (!activeExercise || !submissionCode.trim()) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateStudentSubmission(
        activeExercise.title,
        submissionCode,
        activeExercise.instructions
      );
      setAiEvaluationResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleOfficialSubmit = () => {
    if (!activeExercise || !submissionCode.trim()) return;
    setSubmittedSuccess(true);
    const newSub: ExerciseSubmission = {
      id: `sub-${Date.now()}`,
      exerciseId: activeExercise.id,
      studentId: 'std-101',
      studentName: 'أحمد بن علي الزهراني',
      submittedAt: 'الآن',
      content: submissionCode,
      status: aiEvaluationResult ? 'graded' : 'submitted',
      grade: aiEvaluationResult?.score || 90,
      aiFeedback: aiEvaluationResult || undefined
    };
    setSubmissionsList([newSub, ...submissionsList]);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">التطبيقات والواجبات العملية</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            حل المهام البرمجية والتحليلية مع التقييم الآلي الفوري المدعوم بالذكاء الاصطناعي
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300">
            {currentRole === 'professor' ? 'وضع إدارة وتقييم أعمال الطلبة' : 'وضع تسليم واختبار الواجبات'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exercises Sidebar List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            قائمة التمارين المتاحة ({exercises.length})
          </h2>

          <div className="space-y-2.5">
            {exercises.map((ex) => {
              const isCurrent = activeExercise?.id === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => handleSelect(ex)}
                  className={`w-full text-right p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-white shadow-md'
                      : 'bg-gray-900/60 border-gray-800/80 text-gray-300 hover:bg-gray-850 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-800 text-emerald-300 font-mono">
                      {ex.difficulty}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ex.dueDate}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-1 mb-1">
                    {ex.title}
                  </h3>

                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-400">
                    <span>الدرجة: {ex.maxScore} نقطة</span>
                    <span className="text-emerald-400">{ex.submissionsCount} تسليم</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercise Workspace / Submissions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {activeExercise && (
            <>
              {/* Exercise Description Box */}
              <div className="glass-card p-6 rounded-2xl border-gray-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      تطبيق {activeExercise.type === 'code' ? 'برمجي' : 'تحليلي'}
                    </span>
                    <span className="text-xs text-gray-400">
                      الدرجة القصوى: {activeExercise.maxScore}
                    </span>
                  </div>
                  <span className="text-xs text-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    الموعد النهائي: {activeExercise.dueDate}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white">
                  {activeExercise.title}
                </h2>

                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeExercise.description}
                </p>

                {/* Instructions Checklist */}
                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-gray-200">معايير الحل والمطلوب:</h4>
                  <ul className="space-y-1.5 text-xs text-gray-400">
                    {activeExercise.instructions.map((inst, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Student View: Solution Editor & AI Auto Grader */}
              {currentRole === 'student' ? (
                <div className="space-y-4">
                  <div className="glass-card rounded-2xl border-gray-800 overflow-hidden">
                    <div className="p-3.5 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <span>محرر الحل والبرمجة التفاعلي</span>
                      </div>
                      <button
                        onClick={() => setSubmissionCode(activeExercise.starterCode || '')}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        title="إعادة التعيين للكود المبدئي"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>إعادة ضبط</span>
                      </button>
                    </div>

                    <div className="p-4 bg-[#080d1a]">
                      <textarea
                        value={submissionCode}
                        onChange={(e) => setSubmissionCode(e.target.value)}
                        placeholder="اكتب حلك البرمجي أو تحليلك الأكاديمي هنا..."
                        rows={12}
                        className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-y leading-relaxed"
                        dir="ltr"
                      />
                    </div>

                    <div className="p-4 bg-gray-900/90 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={handleRunAIEvaluation}
                        disabled={isEvaluating || !submissionCode.trim()}
                        className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition"
                      >
                        {isEvaluating ? (
                          <>
                            <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                            <span>جارٍ فحص وتحليل الحل بالذكاء الاصطناعي...</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-4 h-4 text-cyan-200" />
                            <span>فحص وتقييم الحل عبر الوكيل الذكي (فوري)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleOfficialSubmit}
                        disabled={!submissionCode.trim() || submittedSuccess}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittedSuccess ? 'تم التسليم بنجاح ✓' : 'تسليم رسمي للأستاذ'}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Evaluation Feedback Card */}
                  {aiEvaluationResult && (
                    <div className="glass-card p-6 rounded-2xl border-cyan-500/40 bg-gradient-to-br from-gray-900/90 via-cyan-950/20 to-gray-900/90 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-cyan-400" />
                          <h3 className="text-base font-bold text-white">تقرير تقييم وكيل الذكاء الاصطناعي</h3>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 font-bold text-sm">
                          <Award className="w-4 h-4 text-cyan-300" />
                          <span>الدرجة المقدرة: {aiEvaluationResult.score} / 100</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                        {aiEvaluationResult.detailedAnalysis}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                          <span className="text-xs font-bold text-emerald-300 block mb-1.5">
                            ✓ نقاط القوة في الإجابة:
                          </span>
                          <ul className="space-y-1 text-xs text-gray-300">
                            {aiEvaluationResult.strengths.map((s: string, idx: number) => (
                              <li key={idx}>• {s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                          <span className="text-xs font-bold text-amber-300 block mb-1.5">
                            ⚡ مقترحات للتحسين والوصول للدرجة الكاملة:
                          </span>
                          <ul className="space-y-1 text-xs text-gray-300">
                            {aiEvaluationResult.improvements.map((imp: string, idx: number) => (
                              <li key={idx}>• {imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Professor View: Student Submissions Review Table */
                <div className="glass-card p-6 rounded-2xl border-gray-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-purple-400" />
                      <span>حلول الطلبة المسلمة لهذا التطبيق ({submissionsList.length})</span>
                    </h3>
                    <span className="text-xs text-gray-400">
                      مدعومة بالتصحيح الذاتي التلقائي
                    </span>
                  </div>

                  <div className="space-y-3">
                    {submissionsList.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{sub.studentName}</span>
                            <span className="text-[10px] text-gray-400">تاريخ التسليم: {sub.submittedAt}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              الدرجة: {sub.grade} / 100
                            </span>
                            <button
                              onClick={() => alert(`اعتماد درجة الطالب ${sub.studentName}`)}
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition"
                            >
                              اعتماد الدرجة
                            </button>
                          </div>
                        </div>

                        {/* Submission Content Preview */}
                        <div className="p-3 rounded-lg bg-gray-950/70 border border-gray-850 text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto" dir="auto">
                          {sub.content}
                        </div>

                        {/* AI Analysis Snippet */}
                        {sub.aiFeedback && (
                          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-center gap-2">
                            <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span><strong>تقييم الوكيل الآلي:</strong> {sub.aiFeedback.detailedAnalysis}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
