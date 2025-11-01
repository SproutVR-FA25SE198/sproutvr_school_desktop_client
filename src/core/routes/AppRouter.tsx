// src/core/routes/AppRouter.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { VrLessonDesignPage } from '../../features/vr-lessons/pages/VrLessonDesign';
import routes from '../configs/routes';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route path={routes.home} element={<VrLessonDesignPage />} />
    </Routes>
  </Router>
);
