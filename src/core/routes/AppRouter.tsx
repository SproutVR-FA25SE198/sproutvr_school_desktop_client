// src/core/routes/AppRouter.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { VrLessonDesignPage } from '../../features/vr-lessons/pages/VrLessonDesign';
import VRDeviceList from '../../features/vr-devices/pages/VRDeviceList';
import VRDeviceDetail from '../../features/vr-devices/pages/VRDeviceDetail';
import routes from '../configs/routes';
import TeacherSideLayout from '../layouts/teacher-side/teacher-side-layout';
import AdminSideLayout from '../layouts/admin-side/admin-side-layout';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<TeacherSideLayout />}>
        <Route path={routes.home} element={<VrLessonDesignPage />} />
      </Route>

      <Route element={<AdminSideLayout />}>
        <Route path={routes.vrDevices} element={<VRDeviceList />} />
        <Route path={routes.vrDeviceDetail} element={<VRDeviceDetail />} />
      </Route>
    </Routes>
  </Router>
);
