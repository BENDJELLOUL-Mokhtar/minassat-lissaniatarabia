'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, Course, Lecture, Exercise, Student, Announcement } from '@/types';
import { 
  initialCourses, 
  initialLectures, 
  initialExercises, 
  initialStudents, 
  initialAnnouncements 
} from '@/data/mockData';
import { Header } from '@/components/Header';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { LecturesView } from '@/components/LecturesView';
import { ExercisesView } from '@/components/ExercisesView';
import { StudentsView } from '@/components/StudentsView';
import { AIAgentsStudio } from '@/components/AIAgentsStudio';
import { AnalyticsView } from '@/components/AnalyticsView';
import { AIAssistantDrawer } from '@/components/AIAssistantDrawer';
import { AuthModals } from '@/components/AuthModals';
import { CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('professor');
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourses[0].id);

  const [lectures, setLectures] = useState<Lecture[]>(initialLectures);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [lectureForAI, setLectureForAI] = useState<Lecture | null>(null);

  // Load registered students from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('academiq_registered_students');
      if (saved) {
        const parsed: Student[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setStudents((prev) => {
            const existingIds = new Set(prev.map(p => p.id));
            const newOnes = parsed.filter(p => !existingIds.has(p.id));
            return [...newOnes, ...prev];
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleRegisterStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  // Auth Modals state
  const [authModalType, setAuthModalType] = useState<'student-reg' | 'professor-reg' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleOpenAITutorWithLecture = (lec: Lecture) => {
    setLectureForAI(lec);
    setActiveTab('ai-studio');
  };

  const handleAddNewLecture = (newLec: Lecture) => {
    setLectures((prev) => {
      const existsIndex = prev.findIndex(l => l.courseId === newLec.courseId && l.weekNumber === newLec.weekNumber);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = newLec;
        return updated;
      }
      return [newLec, ...prev];
    });
  };

  const handleAskAIQuick = (question: string) => {
    setIsAIDrawerOpen(true);
  };

  const handleAuthSuccess = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1a] text-gray-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs shadow-2xl flex items-center gap-2.5 animate-fadeIn max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
        onOpenAIAssistant={() => setIsAIDrawerOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          currentRole={currentRole}
          pendingExercisesCount={1}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {activeTab === 'overview' && (
            <DashboardOverview
              currentRole={currentRole}
              courses={courses}
              selectedCourseId={selectedCourseId}
              onSelectCourse={setSelectedCourseId}
              course={currentCourse}
              lectures={lectures.filter(l => l.courseId === currentCourse.id)}
              exercises={exercises.filter(e => e.courseId === currentCourse.id)}
              students={students}
              announcements={announcements.filter(a => a.courseId === currentCourse.id)}
              onNavigateTab={setActiveTab}
              onSelectLecture={(lec) => {
                setSelectedLecture(lec);
                setActiveTab('lectures');
              }}
              onSelectExercise={(ex) => {
                setSelectedExercise(ex);
                setActiveTab('exercises');
              }}
              onAskAIQuick={handleAskAIQuick}
              onOpenStudentReg={() => setAuthModalType('student-reg')}
              onOpenProfessorReg={() => setAuthModalType('professor-reg')}
            />
          )}

          {activeTab === 'lectures' && (
            <LecturesView
              currentRole={currentRole}
              course={currentCourse}
              lectures={lectures.filter(l => l.courseId === currentCourse.id)}
              selectedLecture={selectedLecture}
              onSelectLecture={setSelectedLecture}
              onOpenAITutorWithLecture={handleOpenAITutorWithLecture}
              onAddNewLecture={handleAddNewLecture}
            />
          )}

          {activeTab === 'exercises' && (
            <ExercisesView
              currentRole={currentRole}
              course={currentCourse}
              exercises={exercises.filter(e => e.courseId === currentCourse.id)}
              selectedExercise={selectedExercise}
              onSelectExercise={setSelectedExercise}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              currentRole={currentRole}
              course={currentCourse}
              students={students}
            />
          )}

          {activeTab === 'ai-studio' && (
            <AIAgentsStudio
              currentRole={currentRole}
              course={currentCourse}
              lectures={lectures.filter(l => l.courseId === currentCourse.id)}
              initialLectureContext={lectureForAI}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              currentRole={currentRole}
              course={currentCourse}
              students={students}
              lectures={lectures.filter(l => l.courseId === currentCourse.id)}
              exercises={exercises.filter(e => e.courseId === currentCourse.id)}
            />
          )}
        </main>
      </div>

      {/* Global AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        course={currentCourse}
        currentLecture={selectedLecture}
        onNavigateToStudio={() => {
          setIsAIDrawerOpen(false);
          setActiveTab('ai-studio');
        }}
      />

      {/* Registration Modals */}
      <AuthModals
        type={authModalType}
        onClose={() => setAuthModalType(null)}
        onSuccess={handleAuthSuccess}
        onRegisterStudent={handleRegisterStudent}
      />
    </div>
  );
}
