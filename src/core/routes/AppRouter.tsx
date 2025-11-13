// src/core/routes/AppRouter.tsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { VrLessonDesignPage } from '../../features/vr-lessons/pages/VrLessonDesign';
import VRDeviceList from '../../features/school-admin/vr-devices/pages/VRDeviceList';
import VRDeviceDetail from '../../features/school-admin/vr-devices/pages/VRDeviceDetail';
import AccountList from '../../features/school-admin/accounts/pages/AccountList';
import AccountDetail from '@/features/school-admin/accounts/pages/AccountDetail';
import routes from '../configs/routes';
import TeacherSideLayout from '../layouts/teacher-side/teacher-side-layout';
import LessonCreationPage from '@/features/lessons/pages/LessonCreation';
import TeacherDesignLayout from '../layouts/teacher-side/teacher-design-layout';
import LessonDetailsPage from '@/features/lessons/pages/LessonDetails';
import LessonsPage from '@/features/lessons/pages/LessonList';
import AdminSideLayout from '../layouts/admin-side/admin-side-layout';
import ActivationPage from '@/features/school-admin/bundles/pages/KeyValidation';
import MyBundlesPage from '@/features/school-admin/bundles/pages/BundlesList';
import BundleDetailsPage from '@/features/school-admin/bundles/pages/BundleDetails';
import ResourcesPage from '@/features/school-admin/resources/pages/ResourcesPage';

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

      <Route element={<AdminSideLayout />}>
        <Route path={routes.vrDevices} element={<VRDeviceList />} />
        <Route path={routes.vrDeviceDetail} element={<VRDeviceDetail />} />
        <Route path={routes.activation} element={<ActivationPage />} />
        <Route path={routes.myBundles} element={<MyBundlesPage />} />
        <Route path={routes.bundleImport} element={<BundleDetailsPage />} />
        <Route path={routes.accounts} element={<AccountList />} />
        <Route path={routes.accountDetail} element={<AccountDetail />} />
        <Route path={routes.resources} element={<ResourcesPage />} />
      </Route>
    </Routes>
  </Router>
);
