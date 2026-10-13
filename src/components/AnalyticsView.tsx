'use client';

import React from 'react';
import { Course, Lecture, Exercise, Student, UserRole } from '@/types';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Users, 
  Bot, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

interface AnalyticsViewProps {
  currentRole: UserRole;
  course: Course;
  students: Student[];
  lectures: Lecture[];
  exercises: Exercise[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentRole,
  course,
  students,
  lectures,
  exercises,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">التقارير ومؤشرات الأداء الأكاديمي</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          رؤى شاملة حول تقدم الطلبة، كفاءة الاستيعاب، ومعدلات تفاعل وكلاء الذكاء الاصطناعي
        </p>
      </div>

      {/* Top 4 Insight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs">متوسط استيعاب المنهج</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">88.4%</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <span>+4.2% مقارنة بالشهر السابق</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs">استفسارات وكيل الذكاء</span>
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">512 سؤال</div>
          <div className="text-[11px] text-cyan-300 mt-1">
            <span>معدل حل فوري 96%</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs">تسليم التطبيقات العملية</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">92.8%</div>
          <div className="text-[11px] text-blue-300 mt-1">
            <span>أعلى نسبة التزام فصلي</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs">ساعات الحضور والتفاعل</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">142 ساعة</div>
          <div className="text-[11px] text-amber-300 mt-1">
            <span>متوسط 2.9 ساعة/طالب أسبوعياً</span>
          </div>
        </div>
      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Comprehension Breakdown */}
        <div className="glass-card p-5 rounded-2xl border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>معدل إتقان الطلبة حسب موضوعات المنهج</span>
          </h2>

          <div className="space-y-3 pt-2">
            {[
              { topic: 'مدخل للذكاء الاصطناعي وبنية الوكلاء (PEAS)', score: 94, color: 'bg-emerald-500' },
              { topic: 'خوارزميات البحث التجريبي و A* Search', score: 86, color: 'bg-blue-500' },
              { topic: 'الشبكات العصبية والانتشار العكسي Backpropagation', score: 79, color: 'bg-purple-500' },
              { topic: 'دوال التنشيط ومعالجة الانحدار والتلاشي', score: 82, color: 'bg-cyan-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">{item.topic}</span>
                  <span className="text-gray-100 font-bold">{item.score}%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all`} style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Impact & Metrics */}
        <div className="glass-card p-5 rounded-2xl border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span>أكثر المحاور استفساراً من وكيل الذكاء الاصطناعي</span>
          </h2>

          <div className="space-y-2.5 pt-2">
            {[
              { question: 'شرح دالة Heuristic ومقبولية خوارزمية A*', count: '142 استفسار', percentage: '28%' },
              { question: 'الفرق بين دالة التنشيط Sigmoid و ReLU', count: '110 استفسار', percentage: '22%' },
              { question: 'تحليل بيئة الوكيل في نموذج PEAS وتصنيف العشوائية', count: '98 استفسار', percentage: '19%' },
              { question: 'خطوات خوارزمية Backpropagation وتحديث الأوزان', count: '85 استفسار', percentage: '17%' },
              { question: 'طريقة تجنب فرط الملاءمة (Overfitting)', count: '72 استفسار', percentage: '14%' },
            ].map((faq, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5 max-w-[75%]">
                  <p className="text-gray-200 font-medium">{faq.question}</p>
                  <span className="text-[10px] text-cyan-400">{faq.count}</span>
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded-lg">
                  {faq.percentage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
