'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCode2, 
  Users, 
  Bot, 
  BarChart3, 
  Sparkles,
  Award,
  Clock,
  Compass
} from 'lucide-react';
import { UserRole } from '@/types';
import { getAssetUrl } from '@/lib/utils';

export type NavTab = 'overview' | 'lectures' | 'exercises' | 'students' | 'ai-studio' | 'analytics';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentRole: UserRole;
  pendingExercisesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  pendingExercisesCount,
}) => {
  const menuItems = [
    {
      id: 'overview' as NavTab,
      label: 'نظرة عامة',
      sublabel: 'اللوحة الأكاديمية',
      icon: LayoutDashboard,
    },
    {
      id: 'lectures' as NavTab,
      label: 'المحاضرات والدروس',
      sublabel: 'المواد والمحتوى العلمي',
      icon: BookOpen,
      badge: '10 محاضرات',
    },
    {
      id: 'exercises' as NavTab,
      label: 'التطبيقات العملية',
      sublabel: 'التمارين والتقييم الذاتي',
      icon: FileCode2,
      badge: pendingExercisesCount > 0 ? `${pendingExercisesCount} مطلوب` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'students' as NavTab,
      label: 'الطلبة والصفوف',
      sublabel: 'المجتمع الأكاديمي',
      icon: Users,
    },
    {
      id: 'ai-studio' as NavTab,
      label: 'مختبر وكلاء الذكاء',
      sublabel: 'المساعد والوكلاء الأذكياء',
      icon: Bot,
      highlight: true,
      badge: 'متصل 24/7',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'analytics' as NavTab,
      label: 'التقارير والإحصائيات',
      sublabel: 'مؤشرات الأداء الأكاديمي',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 glass-panel border-l border-gray-800 bg-[#0d1322]/80 lg:min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between">
      <div className="space-y-5">
        {/* Professor Mini Profile Card with Photo & Logo */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-950/40 via-gray-900/80 to-gray-950 border border-amber-600/30 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={getAssetUrl('/professor-bendjelloul.png')}
                alt="أ.د. بن جلول مختار"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500/40"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white truncate">أ.د. بن جلول مختار</h3>
              <p className="text-[10px] text-amber-300 font-medium">أستاذ التعليم العالي</p>
              <p className="text-[9px] text-gray-400 truncate">مخبر الدراسات النحوية واللغوية</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-amber-400/40 shrink-0 bg-white/5 p-0.5" title="شعار جامعة ابن خلدون تيارت - لسانيات عربية">
            <img src={getAssetUrl('/logo.png')} alt="شعار" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            القائمة الرئيسية
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-right transition-all group ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                        : 'bg-gray-800/90 text-white font-medium border border-gray-700/60 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-gray-800/60 text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm block">{item.label}</span>
                      <span className={`text-[10px] block ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                        {item.sublabel}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white border-white/20' : 'bg-gray-800 text-gray-300 border-gray-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Quick AI Widget Box in Sidebar Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800/70">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>وكيل الدعم الأكاديمي النشط</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {currentRole === 'student'
              ? 'جاهز للإجابة على أي تساؤل في المحاضرات، حل الألغاز وتصحيح التمارين فورياً.'
              : 'جاهز لتوليد المحاضرات واقتراح أسئلة الاختبارات والمساعدة في تصحيح إجابات الطلبة.'}
          </p>
          <button
            onClick={() => onTabChange('ai-studio')}
            className="mt-3 w-full py-1.5 px-3 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/30 text-indigo-200 hover:text-white text-[11px] font-medium transition text-center"
          >
            فتح بيئة الوكلاء الأذكياء ←
          </button>
        </div>
      </div>
    </aside>
  );
};
