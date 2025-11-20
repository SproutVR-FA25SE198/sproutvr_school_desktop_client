import { Cookies } from 'react-cookie';

const cookies = new Cookies(null, { path: '/' });

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const setCookie = (name: string, value: string, expires?: Date) => {
  cookies.set(name, value, { expires: expires });
};

export const removeCookie = (name: string) => {
  cookies.remove(name);
};

// Access token
export const getAccessToken = () => {
  return getCookie('accessToken');
};

export const setAccessToken = (token: string) => {
  setCookie('accessToken', token, new Date(new Date().setMinutes(new Date().getMinutes() + 120)));
};

export const removeAccessToken = () => {
  removeCookie('accessToken');
};
