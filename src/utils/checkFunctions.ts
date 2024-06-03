function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('token') && localStorage.getItem('id'));
}
export default isLoggedIn;
