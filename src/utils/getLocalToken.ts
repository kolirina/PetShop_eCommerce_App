const getLocalToken = () =>
  localStorage.getItem('token') || localStorage.getItem('anonymous_token');

export default getLocalToken;
