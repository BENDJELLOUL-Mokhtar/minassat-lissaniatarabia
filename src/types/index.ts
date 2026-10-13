export type UserRole = 'student' | 'professor';

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  universityId: string;
  major: string;
  level: string; // 'ماستر 1' | 'السنة الثانية ليسانس'
  branch: string; // 'الدراسات اللغوية' | 'الشعبة الأدبية' | 'الشعبة النقدية'
  specialty?: string; // 'لسانيات الخطاب'
  groupNumber: string; // 'الفوج 1' | 'الفوج 2' ...
  enrolledCourseIds: string[];
  attendanceRate: number;
  averageGrade: number;
  completedAssignments: number;
  totalAssignments: number;
  lastActive: string;
}

export interface LectureMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'slides' | 'code';
  url: string;
  size?: string;
  duration?: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  weekNumber: number;
  title: string;
  titleAr: string;
  summary: string;
  duration: string;
  videoUrl?: string;
  content: string; // Detailed lecture content for RAG & AI Reading
  keyConcepts: string[];
  materials: LectureMaterial[];
  aiSummary?: string;
  hasExercises: boolean;
  dateAdded: string;
  isUploaded?: boolean;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  uploadedFileDate?: string;
  googleDriveUrl?: string;
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  status: 'submitted' | 'graded' | 'needs_revision';
  grade?: number; // 0-100
  aiFeedback?: {
    score: number;
    strengths: string[];
    improvements: string[];
    detailedAnalysis: string;
    evaluatedAt: string;
  };
  professorFeedback?: string;
}

export interface Exercise {
  id: string;
  courseId: string;
  lectureId: string;
  title: string;
  description: string;
  type: 'code' | 'quiz' | 'essay' | 'project';
  difficulty: 'سهل' | 'متوسط' | 'متقدم';
  maxScore: number;
  dueDate: string;
  instructions: string[];
  sampleSolution?: string;
  starterCode?: string;
  submissionsCount: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  instructorName: string;
  description: string;
  thumbnail: string;
  totalStudents: number;
  lecturesCount: number;
  exercisesCount: number;
  term: string;
  color: string;
  googleDriveUrl?: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  role?: string;
  content: string;
  timestamp: string;
  lectureContext?: string;
  suggestedPrompts?: string[];
  agentType?: 'tutor' | 'grader' | 'course_builder';
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  author: string;
  date: string;
  isImportant: boolean;
}

export interface Professor {
  id: string;
  fullName: string;
  email: string;
  university: string;
  faculty: string;
  department: string;
  academicRank: string;
  specialty: string;
  phone?: string;
  registeredAt: string;
  status: 'active' | 'pending';
}
