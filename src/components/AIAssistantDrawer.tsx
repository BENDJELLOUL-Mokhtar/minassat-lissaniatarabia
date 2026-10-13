'use client';

import React, { useState } from 'react';
import { Lecture, Course, UserRole } from '@/types';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Maximize2, 
  BookOpen, 
  Copy, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import { askAITutor } from '@/lib/ai-service';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  currentLecture?: Lecture | null;
  onNavigateToStudio: () => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  course,
  currentLecture,
  onNavigateToStudio,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: `مرحباً بك! أنا مساعدك الأكاديمي الفوري في مساق "${course.title}". كيف يمكنني إرشادك الآن؟`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isLoading) return;

    setMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await askAITutor(q, currentLecture || undefined);
      setMessages((prev) => [...prev, { sender: 'assistant', text: res.answer }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 max-w-md w-full bg-[#0d1322] border-r border-indigo-500/30 shadow-2xl pointer-events-auto flex flex-col justify-between animate-slideRight">
        {/* Drawer Header */}
        <div className="p-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">الوكيل الأكاديمي السريع</h3>
              <p className="text-[10px] text-gray-400">
                {currentLecture ? `مرتبط بـ: ${currentLecture.titleAr}` : 'متصل بكامل المنهج'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onClose();
                onNavigateToStudio();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
              title="توسيع للمختبر الكامل"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-900/90 border border-gray-800 text-gray-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-850 text-xs text-gray-400 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>جارٍ التفكير وصياغة الشرح الأكاديمي...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestions & Input */}
        <div className="p-4 bg-gray-900/90 border-t border-gray-800 space-y-2.5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              'لخص أهم نقطة',
              'اختبرني بسؤال سريع',
              'كيف أحل التطبيق؟'
            ].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(tag)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-200 hover:bg-cyan-900/60 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اطرح استفسارك هنا..."
              className="flex-1 bg-gray-950 border border-gray-750 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
