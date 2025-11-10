// src/core/routes/AppRouter.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { VrLessonDesignPage } from '../../features/vr-lessons/pages/VrLessonDesign';
import routes from '../configs/routes';
import TeacherSideLayout from '../layouts/teacher-side/teacher-side-layout';
import LessonsPage from '@/features/lessons/pages/LessonList';
import LessonDetailsPage from '@/features/lessons/pages/LessonDetails';
import LessonCreationPage from '@/features/lessons/pages/LessonCreation';
import TeacherDesignLayout from '../layouts/teacher-side/teacher-design-layout';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<TeacherSideLayout />}>
        <Route path={routes.home} element={<LessonsPage />} />
        <Route path={routes.lessonDetails} element={<LessonDetailsPage />} />
      </Route>

      <Route element={<TeacherDesignLayout />}>
        <Route path={routes.vrLessonDesign} element={<VrLessonDesignPage />} />
        <Route path={routes.lessonCreation} element={<LessonCreationPage />} />
      </Route>
    </Routes>
  </Router>
);
