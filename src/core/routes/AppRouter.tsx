// src/core/routes/AppRouter.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import VrLessonDesign from '../../features/vr-lessons/pages/VrLessonDesign';
import routes from '../configs/routes';
import TeacherSideLayout from '../layouts/teacher-side/teacher-side-layout';

export const AppRouter = () => (
  <Router>
    <TeacherSideLayout>
      <Routes>
        <Route path={routes.home} element={<VrLessonDesign />} />
      </Routes>
    </TeacherSideLayout>
  </Router>
);
