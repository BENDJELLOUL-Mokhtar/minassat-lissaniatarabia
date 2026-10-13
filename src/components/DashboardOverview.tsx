'use client';

import React, { useState } from 'react';
import { Course, Lecture, Exercise, Student, Announcement, UserRole } from '@/types';
import { getAssetUrl } from '@/lib/utils';
import { 
  BookOpen, 
  FileCode2, 
  Users, 
  Bot, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Sparkles, 
  TrendingUp, 
  Award, 
  AlertCircle,
  Play,
  Send,
  Building,
  ScrollText,
  Bookmark,
  LogIn,
  UserPlus,
  Lock,
  User,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface DashboardOverviewProps {
  currentRole: UserRole;
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  course: Course;
  lectures: Lecture[];
  exercises: Exercise[];
  students: Student[];
  announcements: Announcement[];
  onNavigateTab: (tab: NavTab) => void;
  onSelectLecture: (lecture: Lecture) => void;
  onSelectExercise: (exercise: Exercise) => void;
  onAskAIQuick: (question: string) => void;
  onOpenStudentReg: () => void;
  onOpenProfessorReg: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentRole,
  courses,
  selectedCourseId,
  onSelectCourse,
  course,
  lectures,
  exercises,
  students,
  announcements,
  onNavigateTab,
  onSelectLecture,
  onSelectExercise,
  onAskAIQuick,
  onOpenStudentReg,
  onOpenProfessorReg,
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<string | null>(null);

  const handleQuickQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onAskAIQuick(quickQuestion);
    setQuickQuestion('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) return;
    setLoginSuccessMessage(`مرحباً بك يا ${loginUsername}! تم تسجيل الدخول بنجاح كـ ${currentRole === 'professor' ? 'أستاذ محاضر' : 'طالب جامعي'}.`);
    setTimeout(() => {
      setLoginSuccessMessage(null);
    }, 4000);
  };

  const nextExercise = exercises[0];
  const latestLecture = lectures[0];

  return (
    <div className="space-y-8 pb-14">
      {/* 1. Official Academic Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#121929] via-[#0d1424] to-[#1a1209] border border-amber-600/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Main Hero Information */}
          <div className="space-y-6 max-w-3xl">
            {/* Institutional Affiliations Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-200 text-xs font-bold tracking-wide">
                <Building className="w-4 h-4 text-amber-400" />
                <span>جامعة ابن خلدون تيارت — كلية الآداب واللغات — قسم اللغة والأدب العربي</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 text-xs font-bold tracking-wide">
                <ScrollText className="w-4 h-4 text-cyan-400" />
                <span>مخبر الدراسات النحوية واللغوية بين التراث والحداثة في الجزائر</span>
              </div>
            </div>

            {/* Professor Welcome Title */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                المنصة التعليمية للأستاذ الدكتور بن جلول مختار
              </h1>
              <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed font-sans">
                فضاء بيداغوجي وأكاديمي مخصص لطلبة الدراسات الأدبية واللغوية، يربط بين أصالة الفكر النحوي واللساني العربي التراثي وآفاق الدراسات اللسانية المعاصرة، مدعوماً بوكلاء الذكاء الاصطناعي للمساعدة والتقييم الذاتي.
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab('ai-studio')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition transform active:scale-95"
              >
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>استشارة الوكيل اللساني الذكي</span>
              </button>
              <button
                onClick={() => onNavigateTab('lectures')}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700/80 hover:bg-amber-600 border border-amber-500/40 text-white font-semibold text-xs shadow-md shadow-amber-800/20 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>تصفح المحاضرات المقررة</span>
              </button>
            </div>
          </div>

          {/* Official Professor Portrait Spotlight Card */}
          <div className="lg:w-72 shrink-0 self-center lg:self-auto">
            <div className="relative p-1 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-950 shadow-2xl shadow-amber-950/60 ring-1 ring-amber-400/40">
              <div className="p-4 rounded-[22px] bg-[#0b101d]/95 backdrop-blur-md text-center space-y-3">
                <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden ring-4 ring-amber-500/50 shadow-xl bg-gray-900 group">
                  <img
                    src={getAssetUrl('/professor-bendjelloul.png')}
                    alt="الأستاذ الدكتور بن جلول مختار"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                  {/* Official Emblem Stamp Badge */}
                  <div className="absolute bottom-1.5 left-1.5 w-9 h-9 rounded-full ring-2 ring-amber-400 overflow-hidden shadow-lg bg-black/40 backdrop-blur-sm">
                    <img src={getAssetUrl('/logo.png')} alt="شعار المخبر" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    أ.د. بن جلول مختار
                  </h2>
                  <p className="text-xs font-semibold text-amber-300">
                    أستاذ التعليم العالي
                  </p>
                  <p className="text-[11px] text-gray-300 leading-snug">
                    مدير مخبر الدراسات النحوية واللغوية
                  </p>
                  <div className="pt-2 border-t border-gray-800/80 flex items-center justify-center gap-1.5 text-[10px] text-amber-200/80 font-medium">
                    <span>جامعة ابن خلدون — تيارت</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Authentication & Registration Showcase Box (المطلب الثالث) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Login Box (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-3xl border-amber-500/30 bg-[#0e1526]/90 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 p-0.5 bg-white/5 shadow-md shrink-0">
                  <img src={getAssetUrl('/logo.png')} alt="شعار جامعة تيارت" className="w-full h-full object-cover rounded-xl" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">تسجيل الدخول للمنصة</h2>
                  <p className="text-[11px] text-amber-200/70">بوابة الولوج المعتمدة لطلبة وأساتذة المقياس</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                بوابة معتمدة
              </span>
            </div>

            {loginSuccessMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{loginSuccessMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">اسم المستخدم (Username):</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم أو البريد الجامعي"
                    className="w-full bg-gray-950/90 border border-gray-750 focus:border-amber-500 rounded-xl pr-9 pl-3 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">كلمة المرور (Password):</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-950/90 border border-gray-750 focus:border-amber-500 rounded-xl pr-9 pl-3 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-700/20 transition transform active:scale-98"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </button>
            </form>
          </div>

          {/* Registration Options Buttons (خيارات الانضمام) */}
          <div className="mt-6 pt-5 border-t border-gray-800 space-y-2.5">
            <p className="text-[11px] text-gray-400 text-center font-medium">
              ليس لديك حساب بعد؟ اختر نوع طلب الانضمام:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onOpenStudentReg}
                className="w-full py-2 px-3 rounded-xl bg-blue-950/50 hover:bg-blue-900/60 border border-blue-500/40 text-blue-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>طلب الانضمام كطالب</span>
              </button>

              <button
                type="button"
                onClick={onOpenProfessorReg}
                className="w-full py-2 px-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>طلب الانضمام كأستاذ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Selected Course Summary & Lab Banner (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between glass-panel p-6 sm:p-7 rounded-3xl border-gray-800 bg-gradient-to-br from-[#0e1526]/80 to-[#141b2c]/80">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                المقياس النشط حالياً: {course.code}
              </span>
              <span className="text-xs text-gray-400">{course.term}</span>
            </div>

            <h2 className="text-xl font-bold text-white leading-snug">
              {course.title}
            </h2>

            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {course.description}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 block">المحاضرات</span>
                <span className="text-base font-bold text-white">{course.lecturesCount} محاضرة</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 block">التطبيقات</span>
                <span className="text-base font-bold text-emerald-400">{course.exercisesCount} واجب</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
                <span className="text-[10px] text-gray-400 block">الطلبة المسجلين</span>
                <span className="text-base font-bold text-cyan-400">{course.totalStudents} طالب</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
            <div className="text-xs text-amber-300/80 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>إشراف وتدريس: أ.د. بن جلول مختار</span>
            </div>
            <button
              onClick={() => onNavigateTab('lectures')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>دخول مقياس {course.title}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Courses Section (المطلب الثاني: قسم المقاييس والدروس) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white">قسم المقاييس والدروس</h2>
              <p className="text-xs text-gray-400">المقررات الأكاديمية التي يدرسها الأستاذ الدكتور بن جلول مختار بجامعة ابن خلدون تيارت</p>
            </div>
          </div>
        </div>

        {/* 3 Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {courses.map((c) => {
            const isSelected = c.id === selectedCourseId;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCourse(c.id)}
                className={`group cursor-pointer rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1b2234] to-[#121828] border-amber-500/60 shadow-xl shadow-amber-900/10 ring-1 ring-amber-500/40'
                    : 'glass-card hover:border-amber-500/30 hover:bg-[#121929]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {c.code}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>المحدد حالياً</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800 text-xs text-amber-200/90 font-medium">
                    {c.term}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-800 flex items-center justify-between text-xs">
                  <span className="text-gray-400">{c.totalStudents} طالب مسجل</span>
                  <span className="text-amber-400 group-hover:translate-x-[-3px] transition-transform font-semibold flex items-center gap-1">
                    <span>فتح المقياس</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. AI Quick Query Interaction Bar */}
      <div className="glass-card p-4 rounded-2xl border-cyan-500/30 bg-gradient-to-r from-gray-950 via-cyan-950/20 to-gray-950 shadow-xl">
        <form onSubmit={handleQuickQuestionSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs sm:text-sm shrink-0">
            <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span>اسأل الوكيل اللساني والنحوي فورياً:</span>
          </div>
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="مثال: كيف نقارن نظرية العامل عند النحاة مع مفهوم العمل والربط عند تشومسكي؟"
            className="w-full bg-gray-900/90 border border-gray-700 focus:border-cyan-500 rounded-xl px-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition shrink-0"
          >
            <span>استشارة</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 5. Lecture & Practical Exercise Spotlights + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Latest Lecture & Active Exercise */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lecture Card */}
          {latestLecture && (
            <div className="glass-card p-5 rounded-2xl border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">المحاضرة الحالية في {course.title}</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('lectures')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <span>كافة محاضرات المقياس</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-gray-950/70 border border-gray-850 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                      الأسبوع {latestLecture.weekNumber}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {latestLecture.duration}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {latestLecture.titleAr}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {latestLecture.summary}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {latestLecture.keyConcepts.map((concept, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-850 text-amber-200/80">
                        #{concept}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectLecture(latestLecture)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-medium text-xs flex items-center justify-center gap-2 shrink-0 shadow-md shadow-amber-800/20 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>دخول المحاضرة</span>
                </button>
              </div>
            </div>
          )}

          {/* Exercise Card */}
          {nextExercise && (
            <div className="glass-card p-5 rounded-2xl border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">التطبيق العملي والواجب المطلوب</h3>
                </div>
                <button
                  onClick={() => onNavigateTab('exercises')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <span>كافة التطبيقات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-gray-950/70 border border-gray-850 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      مستوى: {nextExercise.difficulty}
                    </span>
                    <span className="text-xs text-amber-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      آخر موعد: {nextExercise.dueDate}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {nextExercise.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {nextExercise.description}
                  </p>
                </div>

                <button
                  onClick={() => onSelectExercise(nextExercise)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs flex items-center justify-center gap-2 shrink-0 shadow-md shadow-emerald-700/20 transition"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>حل وفحص بالذكاء الاصطناعي</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right (1 col): Announcements */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">إعلانات الأستاذ والمخبر</h3>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-3.5 rounded-xl border text-right transition ${
                    ann.isImportant
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-gray-950/60 border-gray-850 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white">{ann.title}</span>
                    <span className="text-[10px] text-gray-400">{ann.date}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-2">
                    {ann.content}
                  </p>
                  <div className="text-[10px] text-amber-300/80 font-medium">
                    {ann.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
