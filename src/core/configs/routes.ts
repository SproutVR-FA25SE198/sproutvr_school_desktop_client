const routes = {
  home: '/',
  login: '/login',
  personal: '/personal/:tab?',
  lessons: '/lessons',
  lessonDetails: '/lessons/:id',
  lessonCreation: '/lessons/create',
  vrLessons: '/lessons/:id/:vrId',
  vrLessonDesign: '/vr-lessons-design',
  vrDevices: '/vr-devices',
  vrDeviceDetail: '/vr-devices/:id',
  learningSessionMonitoring: '/learning-sessions/monitoring/:id',
  activation: '/activation',
  myBundles: '/my-bundles',
  bundleImport: '/my-bundles/:orderId',
  accounts: '/accounts',
  accountDetail: '/accounts/:id',
  logout: '/logout',
  notFound: '*',
};

export default routes;
