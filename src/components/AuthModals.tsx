'use client';

import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  UserCheck, 
  Mail, 
  User, 
  Lock, 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Layers,
  Users
} from 'lucide-react';

import { Student, Professor } from '@/types';

interface AuthModalsProps {
  type: 'student-reg' | 'professor-reg' | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onRegisterStudent?: (student: Student) => void;
  onRegisterProfessor?: (professor: Professor) => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  type,
  onClose,
  onSuccess,
  onRegisterStudent,
  onRegisterProfessor,
}) => {
  // Student registration states
  const [studentLevel, setStudentLevel] = useState<'master' | 'licence2'>('master');
  const [masterBranch] = useState('الدراسات اللغوية');
  const [masterSpecialty] = useState('لسانيات الخطاب');
  const [masterGroup, setMasterGroup] = useState('الفوج 1');

  const [licenceBranch, setLicenceBranch] = useState<'الشعبة الأدبية' | 'الشعبة النقدية'>('الشعبة الأدبية');
  const [licenceGroup, setLicenceGroup] = useState('الفوج 1');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    universityId: '',
    department: 'قسم اللغة والأدب العربي',
    faculty: 'كلية الآداب واللغات - جامعة ابن خلدون تيارت',
    academicRank: 'أستاذ محاضر',
    specialty: 'الدراسات النحوية واللسانية',
    phone: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!type) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      if (type === 'student-reg') {
        const levelText = studentLevel === 'master' 
          ? `ماستر 1 (شعبة: ${masterBranch} - تخصص: ${masterSpecialty} - ${masterGroup})`
          : `السنة الثانية ليسانس (${licenceBranch} - ${licenceGroup})`;

        const newStudent: Student = {
          id: `std-${Date.now()}`,
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          universityId: formData.universityId.trim() || `UNIV-${Math.floor(100000 + Math.random() * 900000)}`,
          major: studentLevel === 'master' ? 'لسانيات الخطاب' : licenceBranch,
          level: studentLevel === 'master' ? 'ماستر 1' : 'السنة الثانية ليسانس',
          branch: studentLevel === 'master' ? masterBranch : licenceBranch,
          specialty: studentLevel === 'master' ? masterSpecialty : undefined,
          groupNumber: studentLevel === 'master' ? masterGroup : licenceGroup,
          enrolledCourseIds: ['course-1', 'course-2', 'course-3'],
          attendanceRate: 100,
          averageGrade: 16.5,
          completedAssignments: 0,
          totalAssignments: 14,
          lastActive: 'مسجل حديثاً (عن بُعد)'
        };

        try {
          const existing = JSON.parse(localStorage.getItem('academiq_registered_students') || '[]');
          localStorage.setItem('academiq_registered_students', JSON.stringify([newStudent, ...existing]));
        } catch (err) {
          console.error(err);
        }

        if (onRegisterStudent) {
          onRegisterStudent(newStudent);
        }

        onSuccess(`تم تسجيل وانضمام الطالب (${formData.fullName}) بنجاح في: ${levelText}. أهلاً بك في منصة أ.د. بن جلول مختار!`);
      } else {
        const newProf: Professor = {
          id: `prof-${Date.now()}`,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          university: 'جامعة ابن خلدون تيارت',
          faculty: formData.faculty.trim() || 'كلية الآداب واللغات',
          department: formData.department.trim() || 'قسم اللغة والأدب العربي',
          academicRank: formData.academicRank || 'أستاذ محاضر',
          specialty: formData.specialty || 'الدراسات النحوية واللسانية',
          phone: formData.phone,
          registeredAt: new Date().toISOString().split('T')[0],
          status: 'active'
        };

        try {
          const existingProf = JSON.parse(localStorage.getItem('academiq_registered_professors') || '[]');
          localStorage.setItem('academiq_registered_professors', JSON.stringify([newProf, ...existingProf]));
        } catch (err) {
          console.error(err);
        }

        if (onRegisterProfessor) {
          onRegisterProfessor(newProf);
        }

        onSuccess(`تم تسجيل الأستاذ الباحث (${formData.fullName}) بنجاح. مرحباً بكم في رحاب مخبر الدراسات النحوية واللغوية بجامعة ابن خلدون تيارت.`);
      }
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-xl p-6 sm:p-8 rounded-3xl border-amber-500/40 shadow-2xl space-y-5 my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-gray-400 hover:text-white transition p-1.5 rounded-xl hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 p-0.5 bg-white/5 shadow-lg shrink-0">
            <img src="/logo.png" alt="شعار الأستاذ الدكتور بن جلول مختار" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {type === 'student-reg' ? 'طلب الانضمام كطالب بالمنصة' : 'طلب الانضمام كأستاذ باحث بالمنصة'}
            </h3>
            <p className="text-xs text-amber-200/90 font-medium">
              جامعة ابن خلدون تيارت — كلية الآداب واللغات — قسم اللغة والأدب العربي
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Student Specific Level Selector */}
          {type === 'student-reg' && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3">
              <label className="text-amber-200 font-bold block">
                اختر المستوى الدراسي الجامعي:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setStudentLevel('master')}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    studentLevel === 'master'
                      ? 'bg-amber-600/30 border-amber-500 text-white font-bold shadow-md'
                      : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:bg-gray-850'
                  }`}
                >
                  <div>
                    <span className="block text-xs">ماستر 1</span>
                    <span className="text-[10px] text-amber-200/70 block">شعبة الدراسات اللغوية</span>
                  </div>
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setStudentLevel('licence2')}
                  className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                    studentLevel === 'licence2'
                      ? 'bg-amber-600/30 border-amber-500 text-white font-bold shadow-md'
                      : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:bg-gray-850'
                  }`}
                >
                  <div>
                    <span className="block text-xs">السنة الثانية ليسانس</span>
                    <span className="text-[10px] text-amber-200/70 block">الشعبة الأدبية أو النقدية</span>
                  </div>
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Conditional Fields based on Level */}
              {studentLevel === 'master' ? (
                /* Master 1 Branch, Specialty, and Group */
                <div className="pt-2 border-t border-amber-500/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">الشعبة:</span>
                      <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 text-amber-300 font-bold">
                        الدراسات اللغوية
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-gray-400 block mb-1">التخصص:</span>
                      <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 text-amber-300 font-bold">
                        لسانيات الخطاب
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-200 font-semibold block mb-1">
                      رقم الفوج (Groupe) - ماستر 1:
                    </label>
                    <select
                      value={masterGroup}
                      onChange={(e) => setMasterGroup(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 font-medium focus:outline-none"
                    >
                      <option value="الفوج 1">الفوج 1 (Groupe 01)</option>
                      <option value="الفوج 2">الفوج 2 (Groupe 02)</option>
                      <option value="الفوج 3">الفوج 3 (Groupe 03)</option>
                    </select>
                  </div>
                </div>
              ) : (
                /* 2nd Year Licence Branch & Group */
                <div className="pt-2 border-t border-amber-500/20 space-y-3">
                  <div>
                    <label className="text-gray-200 font-semibold block mb-1">
                      الشعبة (اختر الشعبة المقيد بها):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLicenceBranch('الشعبة الأدبية')}
                        className={`py-2 px-3 rounded-xl border text-center transition ${
                          licenceBranch === 'الشعبة الأدبية'
                            ? 'bg-amber-600/40 border-amber-400 text-white font-bold'
                            : 'bg-gray-950 border-gray-800 text-gray-400'
                        }`}
                      >
                        الشعبة الأدبية
                      </button>
                      <button
                        type="button"
                        onClick={() => setLicenceBranch('الشعبة النقدية')}
                        className={`py-2 px-3 rounded-xl border text-center transition ${
                          licenceBranch === 'الشعبة النقدية'
                            ? 'bg-amber-600/40 border-amber-400 text-white font-bold'
                            : 'bg-gray-950 border-gray-800 text-gray-400'
                        }`}
                      >
                        الشعبة النقدية
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-200 font-semibold block mb-1">
                      رقم الفوج (Groupe) - السنة الثانية ليسانس:
                    </label>
                    <select
                      value={licenceGroup}
                      onChange={(e) => setLicenceGroup(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 font-medium focus:outline-none"
                    >
                      <option value="الفوج 1">الفوج 1 (Groupe 01)</option>
                      <option value="الفوج 2">الفوج 2 (Groupe 02)</option>
                      <option value="الفوج 3">الفوج 3 (Groupe 03)</option>
                      <option value="الفوج 4">الفوج 4 (Groupe 04)</option>
                      <option value="الفوج 5">الفوج 5 (Groupe 05)</option>
                      <option value="الفوج 6">الفوج 6 (Groupe 06)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student / Professor Personal Information */}
          <div>
            <label className="text-gray-200 font-semibold block mb-1">الاسم واللقب كاملاً:</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="مثال: عبد القادر بن عيسى"
              className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-200 font-semibold block mb-1">البريد الإلكتروني الجامعي:</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@univ-tiaret.dz"
                className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="text-gray-200 font-semibold block mb-1">اسم المستخدم المطلوب للدخول:</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
                className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none text-left"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-gray-200 font-semibold block mb-1">كلمة المرور:</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none"
              />
            </div>

            {type === 'student-reg' ? (
              <div>
                <label className="text-gray-200 font-semibold block mb-1">رقم التسجيل الجامعي (الباكالوريا):</label>
                <input
                  type="text"
                  required
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  placeholder="2023380xxxxx"
                  className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>
            ) : (
              <div>
                <label className="text-gray-200 font-semibold block mb-1">الرتبة الأكاديمية:</label>
                <select
                  value={formData.academicRank}
                  onChange={(e) => setFormData({ ...formData, academicRank: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-750 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none"
                >
                  <option value="أستاذ التعليم العالي">أستاذ التعليم العالي (Professeur)</option>
                  <option value="أستاذ محاضر أ">أستاذ محاضر أ (MCA)</option>
                  <option value="أستاذ محاضر ب">أستاذ محاضر ب (MCB)</option>
                  <option value="أستاذ مساعد أ">أستاذ مساعد أ (MAA)</option>
                  <option value="باحث دكتوراه">باحث دكتوراه (Doctorant)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg transition ${
                type === 'student-reg'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-700/25'
                  : 'bg-amber-700 hover:bg-amber-600 shadow-amber-800/25'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>جارٍ معالجة الطلب...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد إرسال طلب الانضمام</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
