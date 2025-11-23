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
import MyBundlesPage from '@/features/school-admin/bundles/pages/BundlesList';
import BundleDetailsPage from '@/features/school-admin/bundles/pages/BundleDetails';
import ResourcesPage from '@/features/school-admin/resources/pages/ResourcesPage';
import MasterSubjectDetail from '@/features/school-admin/resources/pages/MasterSubjectDetail';
import SubjectDetail from '@/features/school-admin/resources/pages/SubjectDetail';
import MapDetail from '@/features/school-admin/resources/pages/MapDetail';
import LessonDetail from '@/features/school-admin/resources/pages/LessonDetail';
import VRLessonDetail from '@/features/school-admin/resources/pages/VRLessonDetail';
import CreateSessionPage from '@/features/learning-sessions/pages/CreateSessionPage';
import MonitoringPage from '@/features/learning-sessions/pages/MonitoringPage';
import SessionListPage from '@/features/learning-sessions/pages/SessionListPage';
import Dashboard from '@/features/school-admin/dashboard/pages/Dashboard';
import LoginPage from '@/features/auth/pages/Login';
import AuthGuard from '../guards/AuthGuard';
import AdminGuard from '../guards/AdminGuard';
import AdminSessionList from '@/features/school-admin/sessions/pages/AdminSessionList';
import SessionDetailPage from '@/features/school-admin/sessions/pages/AdminSessionDetail';
import SessionDetailsPage from '@/features/learning-sessions/pages/SessionDetailsPage';
import DeviceSummaryDetailsPage from '@/features/vr-device-session-summaries/pages/DeviceSummaryDetailsPage';

export const AppRouter = () => (
  <Router>
    <Routes>
      <Route path={routes.login} element={<LoginPage />} />
      <Route element={<AuthGuard />}>
        <Route element={<TeacherSideLayout />}>
          <Route path={routes.home} element={<LessonsPage />} />
          <Route path={routes.lessonDetails} element={<LessonDetailsPage />} />
          <Route path={routes.sessionList} element={<SessionListPage />} />
          <Route path={routes.sessionDetails} element={<SessionDetailsPage />} />
          <Route path={routes.deviceSummaryDetails} element={<DeviceSummaryDetailsPage />} />
        </Route>

        <Route element={<TeacherDesignLayout />}>
          <Route path={routes.vrSessionCreate} element={<CreateSessionPage />} />
          <Route path={routes.vrLessonDesign} element={<VrLessonDesignPage />} />
          <Route path={routes.learningSessionMonitoring} element={<MonitoringPage />} />
          <Route path={routes.lessonCreation} element={<LessonCreationPage />} />
        </Route>
      </Route>
      <Route element={<AdminGuard />}>
        <Route element={<AdminSideLayout />}>
          <Route path={routes.vrDevices} element={<VRDeviceList />} />
          <Route path={routes.vrDeviceDetail} element={<VRDeviceDetail />} />
          <Route path={routes.myBundles} element={<MyBundlesPage />} />
          <Route path={routes.bundleImport} element={<BundleDetailsPage />} />
          <Route path={routes.accounts} element={<AccountList />} />
          <Route path={routes.accountDetail} element={<AccountDetail />} />
          <Route path={routes.resources} element={<ResourcesPage />} />
          <Route path={routes.rsMasterSubjectDetail} element={<MasterSubjectDetail />} />
          <Route path={routes.rsSubjectDetail} element={<SubjectDetail />} />
          <Route path={routes.rsMapDetail} element={<MapDetail />} />
          <Route path={routes.rsLessonDetail} element={<LessonDetail />} />
          <Route path={routes.rsVrLessonDetail} element={<VRLessonDetail />} />
          <Route path={routes.adminDashboard} element={<Dashboard />} />
          <Route path={routes.adminSessions} element={<AdminSessionList />} />
          <Route path={routes.adminSessionDetail} element={<SessionDetailPage />} />
        </Route>
      </Route>
    </Routes>
  </Router>
);
