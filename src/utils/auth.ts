import Cookies from 'js-cookie'

const isLogin = () => {
  return !!Cookies.get('token');
};

const getToken = () => {
  return <string>Cookies.get('token');
};

const setToken = (token: string) => {
  Cookies.set('token', token);
};

const clearToken = () => {
  Cookies.remove('token');
};

export { isLogin, getToken, setToken, clearToken };
