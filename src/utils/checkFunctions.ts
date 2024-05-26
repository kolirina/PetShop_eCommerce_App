function isLoggedIn() {
  return localStorage.getItem('token') && localStorage.getItem('id');
}
export default isLoggedIn;
