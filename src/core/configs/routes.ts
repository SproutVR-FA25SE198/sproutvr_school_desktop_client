const routes = {
  home: '/',
  login: '/login',
  personal: '/personal/:tab?',
  lessons: '/lessons',
  lessonDetails: '/lessons/:id',
  lessonCreation: '/lessons/create',
  vrLessons: '/lessons/:id/:vrId',
  vrLessonList: '/vr-lessons',
  vrLessonDesign: '/vr-lessons-design',
  vrSessionCreate: '/vr-sessions-create',
  vrDevices: '/vr-devices',
  vrDeviceDetail: '/vr-devices/:id',
  activation: '/activation',
  myBundles: '/my-bundles',
  bundleImport: '/my-bundles/:orderId',
  accounts: '/accounts',
  accountDetail: '/accounts/:id',
  resources: '/resources',
  logout: '/logout',
  notFound: '*',
};

export default routes;
