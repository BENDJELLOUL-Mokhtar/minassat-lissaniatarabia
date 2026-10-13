'use client';

import React, { useState } from 'react';
import { Lecture, Course, UserRole } from '@/types';
import { 
  BookOpen, 
  FileText, 
  Download, 
  Sparkles, 
  Bot, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  Play, 
  ChevronRight,
  Upload,
  FileCheck,
  AlertCircle,
  X,
  FileSpreadsheet,
  Paperclip,
  Check,
  Cloud,
  ExternalLink
} from 'lucide-react';
import { generateCourseModuleAI } from '@/lib/ai-service';

interface LecturesViewProps {
  currentRole: UserRole;
  course: Course;
  lectures: Lecture[];
  selectedLecture: Lecture | null;
  onSelectLecture: (lecture: Lecture | null) => void;
  onOpenAITutorWithLecture: (lecture: Lecture) => void;
  onAddNewLecture: (lecture: Lecture) => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({
  currentRole,
  course,
  lectures,
  selectedLecture,
  onSelectLecture,
  onOpenAITutorWithLecture,
  onAddNewLecture,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'materials'>('content');
  
  // Upload lecture modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [targetWeekNumber, setTargetWeekNumber] = useState<number>(1);
  const [lectureTitleInput, setLectureTitleInput] = useState('');
  const [lectureSummaryInput, setLectureSummaryInput] = useState('');
  const [lectureConceptsInput, setLectureConceptsInput] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [googleDriveUrlInput, setGoogleDriveUrlInput] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);

  const filteredLectures = lectures.filter(
    (l) =>
      l.titleAr.includes(searchQuery) ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.summary.includes(searchQuery)
  );

  // Open modal for a specific week or general
  const handleOpenUploadForWeek = (weekNum: number, existing?: Lecture) => {
    setTargetWeekNumber(weekNum);
    if (existing) {
      setLectureTitleInput(existing.titleAr.replace(`المحاضرة ${weekNum}: `, ''));
      setLectureSummaryInput(existing.summary);
      setLectureConceptsInput(existing.keyConcepts.join('، '));
      setSelectedFileName(existing.uploadedFileName || null);
      setGoogleDriveUrlInput(existing.googleDriveUrl || '');
    } else {
      setLectureTitleInput('');
      setLectureSummaryInput('');
      setLectureConceptsInput('');
      setSelectedFileName(null);
      setGoogleDriveUrlInput('');
    }
    setShowUploadModal(true);
  };

  // Handle actual upload submission
  const handleSaveUploadedLecture = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFileName = selectedFileName || `محاضرة_${targetWeekNumber}_${course.code}.pdf`;
    
    const existing = lectures.find(l => l.weekNumber === targetWeekNumber && l.courseId === course.id);
    const updatedLecture: Lecture = {
      id: existing ? existing.id : `lec-${course.id}-${targetWeekNumber}`,
      courseId: course.id,
      weekNumber: targetWeekNumber,
      title: lectureTitleInput.trim() || `Lecture ${targetWeekNumber}`,
      titleAr: `المحاضرة ${targetWeekNumber}: ${lectureTitleInput.trim() || `الموضوع الأكاديمي ${targetWeekNumber}`}`,
      summary: lectureSummaryInput.trim() || `المحتوى الأكاديمي المعتمد للمحاضرة ${targetWeekNumber} في مقياس ${course.title}.`,
      duration: '90 دقيقة',
      content: `المحتوى الأكاديمي المفصل للمحاضرة ${targetWeekNumber}:
- الأستاذ المشرف: أ.د. بن جلول مختار.
- المقياس: ${course.title}.
- المستند المرفوع: ${finalFileName}.
${googleDriveUrlInput ? `- رابط Google Drive: ${googleDriveUrlInput}` : ''}

ملخص المحاضرة:
${lectureSummaryInput.trim()}

المفاهيم المحورية:
${lectureConceptsInput.split('،').map(c => `- ${c.trim()}`).join('\n')}`,
      keyConcepts: lectureConceptsInput.split('،').map(c => c.trim()).filter(Boolean).length > 0
        ? lectureConceptsInput.split('،').map(c => c.trim()).filter(Boolean)
        : ['مفاهيم أساسية', 'شواهد تحليلية'],
      materials: [
        {
          id: `mat-${Date.now()}`,
          title: `مطبوعة المحاضرة ${targetWeekNumber} (${finalFileName})`,
          type: 'pdf',
          url: googleDriveUrlInput.trim() || '#',
          size: '3.4 MB'
        }
      ],
      isUploaded: true,
      uploadedFileName: finalFileName,
      uploadedFileSize: '3.4 MB',
      uploadedFileDate: new Date().toISOString().split('T')[0],
      googleDriveUrl: googleDriveUrlInput.trim() || existing?.googleDriveUrl || undefined,
      aiSummary: lectureSummaryInput.trim(),
      hasExercises: true,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    onAddNewLecture(updatedLecture);
    setShowUploadModal(false);
    setUploadSuccessToast(`تم حفظ وتثبيت المحاضرة ${targetWeekNumber} بنجاح، وربطها بـ Google Drive.`);
    setTimeout(() => setUploadSuccessToast(null), 4000);
  };

  const handleDownloadFile = (lec: Lecture) => {
    // Simulated instant download action
    const fileName = lec.uploadedFileName || `محاضرة_${lec.weekNumber}_${course.title}.pdf`;
    const dummyContent = `جامعة ابن خلدون تيارت - كلية الآداب واللغات - قسم اللغة والأدب العربي
مخبر الدراسات النحوية واللغوية بين التراث والحداثة في الجزائر
المنصة التعليمية للأستاذ الدكتور بن جلول مختار

${lec.titleAr}
المقياس: ${course.title}
الأسبوع: ${lec.weekNumber}

الملخص:
${lec.summary}

المحتوى:
${lec.content}
`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace('.pdf', '.txt'); // text preview or pdf
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Toast Notification */}
      {uploadSuccessToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{uploadSuccessToast}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-bold text-white">المحاضرات والمطبوعات الأكاديمية (14 محاضرة)</h1>
          </div>
          <p className="text-xs text-amber-200/80 mt-1">
            المنهج الفصلي الكامل لمقياس: <strong className="text-white">{course.title}</strong> — إشراف أ.د. بن جلول مختار
          </p>
        </div>

        {/* Top Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Drive Course Folder Button */}
          <a
            href={course.googleDriveUrl || 'https://drive.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-500/40 text-cyan-200 hover:text-white text-xs font-bold transition shadow-sm"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>مجلد المقياس على Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          </a>

          {currentRole === 'professor' && (
            <button
              onClick={() => handleOpenUploadForWeek(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-900/30 transition transform active:scale-95"
            >
              <Upload className="w-4 h-4 text-amber-100" />
              <span>رفع وتحميل محاضرة جديدة (PDF)</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Lecture Detail Reader */}
      {selectedLecture ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Back button & Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onSelectLecture(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
              <span>العودة لكافة المحاضرات الـ 14</span>
            </button>

            <button
              onClick={() => onOpenAITutorWithLecture(selectedLecture)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 text-xs font-medium transition"
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>استشارة الوكيل اللساني حول هذا الدرس</span>
            </button>
          </div>

          {/* Lecture Hero Card */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border-amber-500/30 bg-gradient-to-br from-[#101726]/95 via-[#0c1220]/95 to-[#161009]/95">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  الأسبوع {selectedLecture.weekNumber} من 14
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedLecture.duration}
                </span>
                <span className="text-xs text-gray-400">
                  تاريخ الإدراج: {selectedLecture.dateAdded}
                </span>
              </div>

              {/* Direct Download & Google Drive Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedLecture.googleDriveUrl && (
                  <a
                    href={selectedLecture.googleDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-cyan-200 hover:text-white text-xs font-bold border border-blue-500/40 shadow-md transition transform active:scale-95"
                  >
                    <Cloud className="w-4 h-4 text-cyan-400" />
                    <span>مطالعة في Google Drive</span>
                    <ExternalLink className="w-3 h-3 text-cyan-300" />
                  </a>
                )}

                {selectedLecture.isUploaded ? (
                  <button
                    onClick={() => handleDownloadFile(selectedLecture)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition transform active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل ملف المحاضرة المعتمد (PDF)</span>
                  </button>
                ) : (
                  currentRole === 'professor' && (
                    <button
                      onClick={() => handleOpenUploadForWeek(selectedLecture.weekNumber, selectedLecture)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>رفع ملف هذه المحاضرة الآن</span>
                    </button>
                  )
                )}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-snug">
              {selectedLecture.titleAr}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed max-w-4xl font-sans">
              {selectedLecture.summary}
            </p>

            {/* Key Concepts Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-800">
              <span className="text-xs text-amber-400 font-semibold">المفاهيم اللسانية والنحوية:</span>
              {selectedLecture.keyConcepts.map((concept, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-900 text-amber-200/90 border border-amber-500/20 font-medium"
                >
                  #{concept}
                </span>
              ))}
            </div>
          </div>

          {/* Lecture Content & AI Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lecture Text Body */}
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>الشرح والتأطير الأكاديمي للمحاضرة</span>
                </h3>
                {selectedLecture.isUploaded && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>الملف مرفوع: {selectedLecture.uploadedFileName}</span>
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm text-gray-200 leading-loose whitespace-pre-line bg-gray-950/70 p-5 rounded-xl border border-gray-850 font-sans">
                {selectedLecture.content}
              </div>

              {/* Download Banner inside reader */}
              {selectedLecture.isUploaded && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-gray-900 to-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">مطبوعة المحاضرة الأصلية المعتمدة</h4>
                      <p className="text-[11px] text-gray-400">
                        {selectedLecture.uploadedFileName} • الحجم: {selectedLecture.uploadedFileSize || '3.2 MB'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(selectedLecture)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل النسخة الكاملة</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI Assistant Widget */}
            <div className="space-y-4">
              <div className="glass-card p-5 rounded-2xl border-cyan-500/30 bg-gradient-to-b from-gray-950/90 to-cyan-950/20">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>استشارة فورية حول هذه المحاضرة</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed mb-4 font-sans">
                  وكيل الذكاء الاصطناعي الأكاديمي جاهز لتلخيص المحاضرة، اختبار فهمك للشواهد اللغوية، والإجابة عن أي مسألة إعرابية أو صرفية.
                </p>
                <button
                  onClick={() => onOpenAITutorWithLecture(selectedLecture)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-600/20"
                >
                  <Bot className="w-4 h-4" />
                  <span>بدء النقاش اللساني مع الوكيل</span>
                </button>
              </div>

              {/* Concepts Explorer */}
              <div className="glass-card p-5 rounded-2xl border-gray-800">
                <h4 className="text-xs font-bold text-white mb-3">شواهد ومحاور المحاضرة</h4>
                <div className="space-y-2">
                  {selectedLecture.keyConcepts.map((concept, idx) => (
                    <button
                      key={idx}
                      onClick={() => onOpenAITutorWithLecture(selectedLecture)}
                      className="w-full text-right p-2.5 rounded-lg bg-gray-900/60 hover:bg-gray-800/80 border border-gray-850 text-xs text-amber-200/90 transition"
                    >
                      ما هو التحليل اللساني لـ {concept}؟
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 14 Lectures Structured Grid */
        <div className="space-y-6">
          {/* Search bar & Status info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم المحاضرة، العنوان، أو المفاهيم..."
                className="w-full bg-gray-950/90 border border-gray-800 focus:border-amber-500 rounded-xl pr-9 pl-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>14 أسبوعاً دراسياً مقرراً</span>
            </div>
          </div>

          {/* Grid of the 14 Lectures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLectures.map((lec) => {
              const hasFile = lec.isUploaded;
              return (
                <div
                  key={lec.id}
                  className={`glass-card p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    hasFile
                      ? 'border-amber-600/30 hover:border-amber-500/60 bg-[#0d1424]/90'
                      : 'border-gray-800/80 hover:border-gray-750 bg-[#090e1a]/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                        الأسبوع {lec.weekNumber}
                      </span>
                      {hasFile ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>المطبوعة متوفرة</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                          بانتظار الرفع
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                      {lec.titleAr}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-sans">
                      {lec.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {lec.keyConcepts.slice(0, 3).map((concept, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-gray-900 text-amber-200/80 border border-gray-800">
                          #{concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-4 mt-4 border-t border-gray-800/80 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectLecture(lec)}
                        className="flex-1 py-2 px-3 rounded-xl bg-amber-700/80 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>فتح المحاضرة</span>
                      </button>

                      {lec.googleDriveUrl && (
                        <a
                          href={lec.googleDriveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-500/30 transition flex items-center justify-center"
                          title="تحميل أو فتح المحاضرة من Google Drive"
                        >
                          <Cloud className="w-4 h-4" />
                        </a>
                      )}

                      {hasFile ? (
                        <button
                          onClick={() => handleDownloadFile(lec)}
                          className="p-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 transition"
                          title="تحميل مطبوعة المحاضرة (PDF)"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      ) : (
                        currentRole === 'professor' && (
                          <button
                            onClick={() => handleOpenUploadForWeek(lec.weekNumber, lec)}
                            className="p-2 rounded-xl bg-gray-800 hover:bg-amber-950/60 text-amber-300 border border-gray-700 transition"
                            title="رفع ملف المحاضرة"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </div>

                    {currentRole === 'professor' && hasFile && (
                      <button
                        onClick={() => handleOpenUploadForWeek(lec.weekNumber, lec)}
                        className="w-full text-center text-[10px] text-amber-400 hover:underline pt-1"
                      >
                        تحديث أو استبدال ملف المحاضرة / رابط Drive
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Professor Lecture Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border-amber-500/40 shadow-2xl space-y-5 my-8 relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 left-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/40">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  رفع واعتماد محاضرة (PDF / Word)
                </h3>
                <p className="text-xs text-amber-200/80">
                  {course.title} — إشراف أ.د. بن جلول مختار
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUploadedLecture} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-gray-200 font-semibold block mb-1">رقم المحاضرة:</label>
                  <select
                    value={targetWeekNumber}
                    onChange={(e) => setTargetWeekNumber(Number(e.target.value))}
                    className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3 py-2.5 text-gray-100 font-bold focus:outline-none"
                  >
                    {Array.from({ length: 14 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>المحاضرة {num}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="text-gray-200 font-semibold block mb-1">عنوان موضوع المحاضرة:</label>
                  <input
                    type="text"
                    required
                    value={lectureTitleInput}
                    onChange={(e) => setLectureTitleInput(e.target.value)}
                    placeholder="مثال: آليات الاتساق النصي والإحالة في الخطاب العربي"
                    className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-200 font-semibold block mb-1">ملخص المحاضرة والمحاور:</label>
                <textarea
                  rows={3}
                  required
                  value={lectureSummaryInput}
                  onChange={(e) => setLectureSummaryInput(e.target.value)}
                  placeholder="اكتب ملخصاً تعريفياً لمحتوى المحاضرة والنقاط التي سيتناولها الدرس..."
                  className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl p-3 text-gray-100 placeholder-gray-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-gray-200 font-semibold block mb-1">المفاهيم المحورية (افصل بينها بفاصلة):</label>
                <input
                  type="text"
                  value={lectureConceptsInput}
                  onChange={(e) => setLectureConceptsInput(e.target.value)}
                  placeholder="مثال: الإحالة القبلية، الحذف، التماسك الدلالي"
                  className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* File Attachment Box */}
              <div>
                <label className="text-gray-200 font-semibold block mb-1">ملف المحاضرة (PDF / Word / عرض تقديمي):</label>
                <div className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 bg-gray-950/60 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                    id="lecture-file-input"
                  />
                  <label htmlFor="lecture-file-input" className="cursor-pointer block">
                    <Paperclip className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-white">
                      {selectedFileName ? `الملف المختار: ${selectedFileName}` : 'اضغط لاختيار ملف المحاضرة من جهازك (PDF / Word)'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      يدعم صيغ PDF والوثائق الجامعية الرسمية
                    </p>
                  </label>
                </div>
              </div>

              {/* Google Drive Link Input */}
              <div>
                <label className="text-gray-200 font-semibold block mb-1">
                  رابط المحاضرة على Google Drive (اختياري للتحميل المباشر والمعاينة السحابية):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-blue-400">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={googleDriveUrlInput}
                    onChange={(e) => setGoogleDriveUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... أو رابط المجلد"
                    className="w-full bg-gray-950 border border-gray-750 focus:border-blue-500 rounded-xl pr-9 pl-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  ضع رابط ملف PDF أو المجلد من Google Drive، ليتمكن الطلبة من فتحه وتحميله فورياً من أي جهاز.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-amber-900/30 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>تأكيد رفع المحاضرة وإتاحتها للطلبة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
