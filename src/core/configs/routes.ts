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
  activation: '/activation',
  bundle: '/bundles',
  logout: '/logout',
  notFound: '*',
};

export default routes;
