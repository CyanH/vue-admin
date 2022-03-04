const isLogin = () => {
  return !!localStorage.getItem('token');
};

const getToken = () => {
  return <string>localStorage.getItem('token');
};

const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const clearToken = () => {
  localStorage.removeItem('token');
};

export { isLogin, getToken, setToken, clearToken };
