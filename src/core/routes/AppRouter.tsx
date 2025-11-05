// src/core/routes/AppRouter.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { VrLessonDesignPage } from '../../features/vr-lessons/pages/VrLessonDesign';
import routes from '../configs/routes';
import TeacherSideLayout from '../layouts/teacher-side/teacher-side-layout';
import LessonsPage from '@/features/lessons/pages/LessonList';
import LessonDetailsPage from '@/features/lessons/pages/LessonDetails';

export const AppRouter = () => (
  <Router>
    <TeacherSideLayout>
      <Routes>
        <Route path={routes.home} element={<LessonsPage />} />
        <Route path={routes.lessonDetails} element={<LessonDetailsPage />} />
        <Route path={routes.vrLessonDesign} element={<VrLessonDesignPage />} />
      </Routes>
    </TeacherSideLayout>
  </Router>
);
