import { create } from 'zustand';
import { getSetting, setSetting } from '@/persistence/db';

interface LessonProgress {
  completedStepIds: string[];
  completed: boolean;
}

interface CaseResult {
  score: number;
  completed: boolean;
  attempts: number;
}

interface LearningStore {
  lessonProgress: Record<string, LessonProgress>;
  caseResults: Record<string, CaseResult>;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  completeLessonStep: (lessonId: string, stepId: string, totalSteps: number) => void;
  completeLesson: (lessonId: string) => void;
  recordCaseResult: (caseId: string, score: number, completed: boolean) => void;
}

export const useLearningStore = create<LearningStore>((set, get) => ({
  lessonProgress: {},
  caseResults: {},
  hydrated: false,

  hydrate: async () => {
    const lessonProgress = await getSetting<Record<string, LessonProgress>>('lessonProgress', {});
    const caseResults = await getSetting<Record<string, CaseResult>>('caseResults', {});
    set({ lessonProgress, caseResults, hydrated: true });
  },

  completeLessonStep: (lessonId, stepId, totalSteps) => {
    const prev = get().lessonProgress[lessonId] ?? { completedStepIds: [], completed: false };
    const completedStepIds = prev.completedStepIds.includes(stepId)
      ? prev.completedStepIds
      : [...prev.completedStepIds, stepId];
    const completed = completedStepIds.length >= totalSteps;
    const lessonProgress = {
      ...get().lessonProgress,
      [lessonId]: { completedStepIds, completed },
    };
    set({ lessonProgress });
    void setSetting('lessonProgress', lessonProgress);
  },

  completeLesson: (lessonId) => {
    const prev = get().lessonProgress[lessonId] ?? { completedStepIds: [], completed: false };
    const lessonProgress = {
      ...get().lessonProgress,
      [lessonId]: { ...prev, completed: true },
    };
    set({ lessonProgress });
    void setSetting('lessonProgress', lessonProgress);
  },

  recordCaseResult: (caseId, score, completed) => {
    const prev = get().caseResults[caseId] ?? { score: 0, completed: false, attempts: 0 };
    const caseResults = {
      ...get().caseResults,
      [caseId]: {
        score: Math.max(prev.score, score),
        completed: completed || prev.completed,
        attempts: prev.attempts + 1,
      },
    };
    set({ caseResults });
    void setSetting('caseResults', caseResults);
  },
}));
