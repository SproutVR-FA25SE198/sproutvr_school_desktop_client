import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import routes from '../configs/routes';
import Loading from '@/common/components/loading';

// Layouts
import TeacherSideLayout from '../layouts/teacher-side/teacher-side-layout';
import TeacherDesignLayout from '../layouts/teacher-side/teacher-design-layout';
import AdminSideLayout from '../layouts/admin-side/admin-side-layout';

// Guards
import AuthGuard from '../guards/AuthGuard';
import AdminGuard from '../guards/AdminGuard';

// Lazy loaded pages
const LoginPage = lazy(() => import('@/features/auth/pages/Login'));
const ProfilePage = lazy(() => import('@/features/auth/pages/Profile'));

// Teacher pages
const LessonsPage = lazy(() => import('@/features/lessons/pages/LessonList'));
const LessonDetailsPage = lazy(() => import('@/features/lessons/pages/LessonDetails'));
const LessonCreationPage = lazy(() => import('@/features/lessons/pages/LessonCreation'));
const SessionListPage = lazy(() => import('@/features/learning-sessions/pages/SessionListPage'));
const SessionDetailsPage = lazy(() => import('@/features/learning-sessions/pages/SessionDetailsPage'));
const DeviceSummaryDetailsPage = lazy(
  () => import('@/features/vr-device-session-summaries/pages/DeviceSummaryDetailsPage'),
);
const VrLessonDetailsPage = lazy(() => import('@/features/vr-lessons/pages/VrLessonDetailsPage'));
const VrLessonDesignPage = lazy(() =>
  import('@/features/vr-lessons/pages/VrLessonDesign').then((m) => ({ default: m.VrLessonDesignPage })),
);
const CreateSessionPage = lazy(() => import('@/features/learning-sessions/pages/CreateSessionPage'));
const MonitoringPage = lazy(() => import('@/features/learning-sessions/pages/MonitoringPage'));

// Admin pages
const VRDeviceList = lazy(() => import('@/features/school-admin/vr-devices/pages/VRDeviceList'));
const VRDeviceDetail = lazy(() => import('@/features/school-admin/vr-devices/pages/VRDeviceDetail'));
const AccountList = lazy(() => import('@/features/school-admin/accounts/pages/AccountList'));
const AccountDetail = lazy(() => import('@/features/school-admin/accounts/pages/AccountDetail'));
const MyBundlesPage = lazy(() => import('@/features/school-admin/bundles/pages/BundlesList'));
const BundleDetailsPage = lazy(() => import('@/features/school-admin/bundles/pages/BundleDetails'));
const ResourcesPage = lazy(() => import('@/features/school-admin/resources/pages/ResourcesPage'));
const MasterSubjectDetail = lazy(() => import('@/features/school-admin/resources/pages/MasterSubjectDetail'));
const SubjectDetail = lazy(() => import('@/features/school-admin/resources/pages/SubjectDetail'));
const MapDetail = lazy(() => import('@/features/school-admin/resources/pages/MapDetail'));
const LessonDetail = lazy(() => import('@/features/school-admin/resources/pages/LessonDetail'));
const VRLessonDetail = lazy(() => import('@/features/school-admin/resources/pages/VRLessonDetail'));
const Dashboard = lazy(() => import('@/features/school-admin/dashboard/pages/Dashboard'));
const AdminSessionList = lazy(() => import('@/features/school-admin/sessions/pages/AdminSessionList'));
const SessionDetailPage = lazy(() => import('@/features/school-admin/sessions/pages/AdminSessionDetail'));

export const AppRouter = () => (
  <Router>
    <Suspense fallback={<Loading isLoading={true} />}>
      <Routes>
        <Route path={routes.login} element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<TeacherSideLayout />}>
            <Route path={routes.profile} element={<ProfilePage />} />
            <Route path={routes.home} element={<LessonsPage />} />
            <Route path={routes.lessonDetails} element={<LessonDetailsPage />} />
            <Route path={routes.sessionList} element={<SessionListPage />} />
            <Route path={routes.sessionDetails} element={<SessionDetailsPage />} />
            <Route path={routes.deviceSummaryDetails} element={<DeviceSummaryDetailsPage />} />
            <Route path={routes.vrLessonDetails} element={<VrLessonDetailsPage />} />
            <Route path={routes.lessonCreation} element={<LessonCreationPage />} />
            <Route path={routes.vrSessionCreate} element={<CreateSessionPage />} />
            <Route path={routes.vrLessonDesign} element={<VrLessonDesignPage />} />
          </Route>

          <Route element={<TeacherDesignLayout />}>
            <Route path={routes.learningSessionMonitoring} element={<MonitoringPage />} />
          </Route>
        </Route>
        <Route element={<AdminGuard />}>
          <Route element={<AdminSideLayout />}>
            <Route path={routes.adminProfile} element={<ProfilePage />} />
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
    </Suspense>
  </Router>
);
