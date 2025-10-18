const routes = {
  home: '/',
  login: '/login',
  personal: '/personal/:tab?',
  lessons: '/lessons',
  lessonDetails: '/lessons/:id',
  vrLessons: '/lessons/:id/:vrId',
  logout: '/logout',
  notFound: '*',
};

export default routes;
