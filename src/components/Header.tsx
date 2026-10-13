'use client';

import React from 'react';
import { UserRole, Course } from '@/types';
import { getAssetUrl } from '@/lib/utils';
import { 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  UserCheck, 
  Bot, 
  ChevronDown,
  Building,
  ScrollText,
  Bookmark
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onOpenAIAssistant: () => void;
  onOpenStudentReg?: () => void;
  onOpenProfessorReg?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  courses,
  selectedCourseId,
  onSelectCourse,
  onOpenAIAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-amber-900/30 bg-[#080d1a]/95 backdrop-blur-md transition-all">
      {/* Top Academic Affiliation Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/60 border-b border-amber-600/20 px-4 sm:px-8 py-2 text-center text-xs">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-amber-200/90 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            جامعة ابن خلدون تيارت — كلية الآداب واللغات — قسم اللغة والأدب العربي
          </span>
          <span className="hidden md:inline text-amber-600/60">•</span>
          <span className="flex items-center gap-1.5 text-cyan-200/90 font-medium">
            <ScrollText className="w-3.5 h-3.5 text-cyan-400" />
            مخبر الدراسات النحوية واللغوية بين التراث والحداثة في الجزائر
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Professor & Platform Branding with Official Emblem Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-amber-500/50 shadow-lg shadow-amber-950/40 bg-white/5 p-0.5 shrink-0">
            <img
              src={getAssetUrl('/logo.png')}
              alt="شعار الأستاذ الدكتور بن جلول مختار"
              className="w-full h-full object-cover rounded-xl"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-[#080d1a]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                المنصة التعليمية للأستاذ الدكتور بن جلول مختار
              </h1>
              <span className="hidden lg:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                أكاديمية رسمية
              </span>
            </div>
            <p className="text-xs text-amber-200/70 hidden sm:block">
              اللسانيات العربية • الصرف العربي • النحو العربي
            </p>
          </div>
        </div>

        {/* Course Selector Dropdown */}
        <div className="hidden xl:flex items-center">
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => onSelectCourse(e.target.value)}
              className="appearance-none bg-gray-900/90 border border-amber-500/30 hover:border-amber-400 rounded-xl px-4 py-2 pr-9 pl-4 text-xs font-medium text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition cursor-pointer min-w-[260px]"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="bg-gray-900 text-gray-200">
                  {course.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* AI Tutor Quick Button */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600/90 to-blue-700/90 hover:from-cyan-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all transform active:scale-95 group"
            title="فتح المساعد اللساني والنحوي الذكي"
          >
            <Bot className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">الوكيل اللساني الذكي</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          {/* Role Switcher Pill */}
          <div className="flex items-center p-1 rounded-xl bg-gray-900/90 border border-gray-800 text-xs">
            <button
              onClick={() => onRoleChange('professor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentRole === 'professor'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>أستاذ</span>
            </button>
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                currentRole === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>طالب</span>
            </button>
          </div>

          {/* Profile Identity Avatar */}
          <div className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl bg-gray-900/60 border border-gray-800">
            <img
              src={
                currentRole === 'professor'
                  ? getAssetUrl('/professor-bendjelloul.png')
                  : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
              }
              alt="أ.د. بن جلول مختار"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-500/50 shadow-md"
            />
            <div className="text-right hidden 2xl:block">
              <p className="text-xs font-semibold text-gray-200 leading-tight">
                {currentRole === 'professor' ? 'أ.د. بن جلول مختار' : 'عبد القادر بن عيسى'}
              </p>
              <p className="text-[10px] text-amber-300">
                {currentRole === 'professor' ? 'أستاذ التعليم العالي ومدير المخبر' : 'طالب ماستر 1'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
