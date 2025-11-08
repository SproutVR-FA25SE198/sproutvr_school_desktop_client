const routes = {
  home: '/',
  login: '/login',
  personal: '/personal/:tab?',
  lessons: '/lessons',
  lessonDetails: '/lessons/:id',
  lessonCreation: '/lessons/create',
  vrLessons: '/lessons/:id/:vrId',
  vrLessonDesign: '/vr-lessons-design',
  logout: '/logout',
  notFound: '*',
};

export default routes;
