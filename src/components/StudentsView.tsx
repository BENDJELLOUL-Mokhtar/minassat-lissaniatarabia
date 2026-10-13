'use client';

import React, { useState } from 'react';
import { Student, Course, UserRole } from '@/types';
import { 
  Users, 
  Search, 
  Mail, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Bot, 
  Plus, 
  Send,
  X,
  TrendingUp,
  GraduationCap,
  Download,
  Filter
} from 'lucide-react';

interface StudentsViewProps {
  currentRole: UserRole;
  course: Course;
  students: Student[];
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  currentRole,
  course,
  students,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [diagnosticReport, setDiagnosticReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.includes(searchQuery) ||
      s.universityId.includes(searchQuery) ||
      s.major.includes(searchQuery) ||
      (s.groupNumber && s.groupNumber.includes(searchQuery));

    const matchesLevel = selectedLevelFilter === 'all' || s.level === selectedLevelFilter;
    const matchesBranch = selectedBranchFilter === 'all' || s.branch === selectedBranchFilter;

    return matchesSearch && matchesLevel && matchesBranch;
  });

  const handleExportStudentsCSV = () => {
    // Generate CSV content with BOM for Excel compatibility in Arabic
    const headers = [
      'الرقم الجامعي',
      'الاسم واللقب',
      'البريد الإلكتروني',
      'المستوى الدراسي',
      'الشعبة',
      'التخصص',
      'الفوج',
      'نسبة الحضور',
      'المعدل الأكاديمي',
      'الواجبات المنجزة',
      'آخر نشاط'
    ];

    const rows = filteredStudents.map((s) => [
      s.universityId,
      s.name,
      s.email,
      s.level,
      s.branch,
      s.specialty || 'عام',
      s.groupNumber,
      `${s.attendanceRate}%`,
      `${s.averageGrade}%`,
      `${s.completedAssignments}/${s.totalAssignments}`,
      s.lastActive
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `قائمة_طلبة_${course.code}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateStudentReport = async (student: Student) => {
    setSelectedStudent(student);
    setIsGeneratingReport(true);
    setDiagnosticReport(null);

    // Simulate AI diagnostic analysis
    setTimeout(() => {
      setDiagnosticReport(`تقرير التحليل الأكاديمي للذكاء الاصطناعي للطالب (${student.name}):
- المستوى العام: متفوق (${student.averageGrade}%) مع التزام عالي بالحضور (${student.attendanceRate}%).
- التخصص والشعبة: ${student.level} - ${student.branch} (${student.groupNumber}).
- نقاط القوة: استيعاب مفاهيم اللسانيات وتحليل النصوص والتفاعل مع المحاضرات الرقمية.
- التوصيات التعليمية: تعزيز التدريبات على شواهد النحو التوليدي والتداولية.`);
      setIsGeneratingReport(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white">الطلبة والصفوف الأكاديمية</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            متابعة الطلبة المسجلين عن بُعد (ماستر 1 / سنة ثانية ليسانس)، نسب الحضور والواجبات
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportStudentsCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
            title="تصدير السجل إلى ملف Excel / CSV"
          >
            <Download className="w-4 h-4" />
            <span>تصدير القائمة (Excel / CSV)</span>
          </button>

          {currentRole === 'professor' && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition"
            >
              <Send className="w-4 h-4" />
              <span>إرسال إشعار جماعي للدفعة</span>
            </button>
          )}
        </div>
      </div>

      {/* Class Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-gray-800">
          <span className="text-xs text-gray-400">إجمالي الطلبة المسجلين</span>
          <div className="text-xl font-bold text-white mt-1">{students.length * 9 + 3} طالب</div>
          <span className="text-[11px] text-emerald-400">الشعبة 1 - بكالوريوس</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-gray-800">
          <span className="text-xs text-gray-400">متوسط درجات الدفعة</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">89.2%</div>
          <span className="text-[11px] text-gray-400">معدل مرتفع مقارنة بالفصل السابق</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-gray-800">
          <span className="text-xs text-gray-400">متوسط الحضور الفعلي</span>
          <div className="text-xl font-bold text-blue-400 mt-1">94.5%</div>
          <span className="text-[11px] text-blue-300">انتظام ممتاز</span>
        </div>

        <div className="glass-card p-4 rounded-xl border-gray-800">
          <span className="text-xs text-gray-400">معدل التفاعل مع الذكاء الاصطناعي</span>
          <div className="text-xl font-bold text-purple-400 mt-1">91%</div>
          <span className="text-[11px] text-purple-300">يستخدمون الوكيل في المذاكرة</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، الرقم الجامعي، التخصص، أو الفوج..."
            className="w-full bg-gray-900/80 border border-gray-800 focus:border-indigo-500 rounded-xl pr-9 pl-4 py-2.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Quick Level / Branch Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => { setSelectedLevelFilter('all'); setSelectedBranchFilter('all'); }}
            className={`px-3 py-1.5 rounded-xl border transition ${
              selectedLevelFilter === 'all' && selectedBranchFilter === 'all'
                ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold'
                : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            الكل ({students.length})
          </button>

          <button
            onClick={() => { setSelectedLevelFilter('ماستر 1'); setSelectedBranchFilter('all'); }}
            className={`px-3 py-1.5 rounded-xl border transition ${
              selectedLevelFilter === 'ماستر 1'
                ? 'bg-amber-600/30 border-amber-500 text-amber-200 font-bold'
                : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            ماستر 1 (لسانيات الخطاب)
          </button>

          <button
            onClick={() => { setSelectedLevelFilter('السنة الثانية ليسانس'); setSelectedBranchFilter('الشعبة الأدبية'); }}
            className={`px-3 py-1.5 rounded-xl border transition ${
              selectedBranchFilter === 'الشعبة الأدبية'
                ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            2 ليسانس (الشعبة الأدبية)
          </button>

          <button
            onClick={() => { setSelectedLevelFilter('السنة الثانية ليسانس'); setSelectedBranchFilter('الشعبة النقدية'); }}
            className={`px-3 py-1.5 rounded-xl border transition ${
              selectedBranchFilter === 'الشعبة النقدية'
                ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-bold'
                : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
            }`}
          >
            2 ليسانس (الشعبة النقدية)
          </button>
        </div>
      </div>

      {/* Students Directory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((std) => (
          <div
            key={std.id}
            className="glass-card glass-card-hover p-5 rounded-2xl border-gray-800 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={std.avatar}
                    alt={std.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{std.name}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        {std.level}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
                        {std.branch}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        {std.groupNumber}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <span>رقم التسجيل: {std.universityId}</span>
                      {std.specialty && <span>• تخصص: {std.specialty}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 bg-gray-950/60 p-3 rounded-xl border border-gray-800/80 text-center">
                <div>
                  <span className="text-[10px] text-gray-400 block">المعدل</span>
                  <span className="text-xs font-bold text-emerald-400">{std.averageGrade}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">الحضور</span>
                  <span className="text-xs font-bold text-blue-400">{std.attendanceRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">الواجبات</span>
                  <span className="text-xs font-bold text-amber-400">{std.completedAssignments}/{std.totalAssignments}</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 flex items-center justify-between">
                <span>آخر نشاط على المنصة:</span>
                <span className="text-gray-300 font-medium">{std.lastActive}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-800/80 flex items-center gap-2">
              <button
                onClick={() => handleGenerateStudentReport(std)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>تشخيص ذكي للأداء</span>
              </button>
              <button
                onClick={() => alert(`مراسلة الطالب: ${std.name}`)}
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                title="مراسلة"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Diagnostic Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border-indigo-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  التقرير التشخيصي الأكاديمي: {selectedStudent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingReport ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <p className="text-xs text-gray-300">يقوم وكيل الذكاء الاصطناعي بتحليل سجلات أداء الطالب...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800 text-xs text-gray-200 whitespace-pre-line leading-relaxed font-sans">
                  {diagnosticReport}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border-blue-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">إرسال إشعار أو تنبيه للدفعة</h3>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              سيصل الإشعار إلى جميع الطلبة المسجلين في المقرر ({course.title}).
            </p>

            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="اكتب نص الإشعار هنا..."
              rows={4}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-medium"
              >
                إلغاء
              </button>
              <button
                onClick={() => {
                  alert('تم إرسال الإشعار لجميع الطلبة بنجاح!');
                  setShowBroadcastModal(false);
                  setBroadcastMessage('');
                }}
                disabled={!broadcastMessage.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50 transition"
              >
                إرسال فوري
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
