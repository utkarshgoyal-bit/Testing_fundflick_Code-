import { LOGOUT } from '@/redux/actions/types';
import { call, takeEvery } from 'redux-saga/effects';
import Debug from 'debug';

const debug = Debug('ta:commerce-sdk:saga:logout');

function* clearBrowserStorage() {
  try {
    // Clear localStorage and sessionStorage
    yield call([localStorage, 'clear']);
    yield call([sessionStorage, 'clear']);

    // Clear authentication cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
      }
    }

    debug('Browser storage cleared successfully');
  } catch (error) {
    debug('Error clearing browser storage:', error);
  }
}

function* logoutSaga(action: any) {
  debug('Logout saga called', action);

  try {
    yield call(clearBrowserStorage);

    yield call(() => {
      window.location.href = '/login';
    });

    debug('User logged out successfully');
  } catch (error) {
    debug('Logout error:', error);

    yield call(() => {
      window.location.href = '/login';
    });
  }
}

export default function* logout() {
  yield takeEvery(LOGOUT, logoutSaga);
}
