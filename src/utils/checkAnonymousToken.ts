import { refreshAnonymousToken } from '../api/SDK';
import { TEN_MINS_IN_MS } from '../constants';

function checkAnonymousToken() {
  const tokenTime = localStorage.getItem('anonymous_token_time');
  if (tokenTime) {
    const timeLeft = Number(tokenTime) - Date.now();
    if (timeLeft < TEN_MINS_IN_MS && timeLeft > 0) {
      refreshAnonymousToken();
    }
    if (timeLeft <= 0) {
      localStorage.clear();
    }
  }
}

export default checkAnonymousToken;
