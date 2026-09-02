import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { LabPage } from '@/features/lab/LabPage';
import { LearnPage } from '@/features/learn/LearnPage';
import { LessonPage } from '@/features/learn/LessonPage';
import { ComponentsPage } from '@/features/components/ComponentsPage';
import { ComponentDetailPage } from '@/features/components/ComponentDetailPage';
import { CasesPage } from '@/features/cases/CasesPage';
import { CaseDetailPage } from '@/features/cases/CaseDetailPage';
import { CoursesPage } from '@/features/courses/CoursesPage';
import { CourseDetailPage } from '@/features/courses/CourseDetailPage';
import { CourseLessonPage } from '@/features/courses/CourseLessonPage';
import { PartsGalleryPage } from '@/features/parts/PartsGalleryPage';
import { InventoryPage } from '@/features/inventory/InventoryPage';
import { ComparePage } from '@/features/compare/ComparePage';
import { DataFlowPage } from '@/features/dataFlow/DataFlowPage';
import { VariantsPage } from '@/features/variants/VariantsPage';
import { AboutModelPage } from '@/features/aboutModel/AboutModelPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LabPage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'learn/:lessonId', element: <LessonPage /> },
      { path: 'components', element: <ComponentsPage /> },
      { path: 'components/:componentId', element: <ComponentDetailPage /> },
      { path: 'cases', element: <CasesPage /> },
      { path: 'cases/:caseId', element: <CaseDetailPage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'courses/:courseId', element: <CourseDetailPage /> },
      { path: 'courses/:courseId/lessons/:lessonId', element: <CourseLessonPage /> },
      { path: 'parts', element: <PartsGalleryPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'data-flow', element: <DataFlowPage /> },
      { path: 'variants', element: <VariantsPage /> },
      { path: 'about-model', element: <AboutModelPage /> },
    ],
  },
]);
