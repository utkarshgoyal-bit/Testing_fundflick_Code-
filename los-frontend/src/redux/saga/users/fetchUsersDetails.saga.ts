import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { FETCH_ORGANIZATION_CONFIGS, FETCH_PERMISSIONS_DATA, FETCH_USERS_DETAILS } from '@/redux/actions/types';
import { setOrganizations, setRole } from '@/redux/slices/login';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/users';
import fetchFCMToken from '@/utils/fcmToken';
import { call, put, takeEvery } from 'redux-saga/effects';
function* fetchUsersDetailsSaga(action: { type: string; payload: { silent?: boolean } }) {
  try {
    const response: ApiResponse<{
      role: string;
      organizations: {
        _id: string;
        name: string;
        isActive: boolean;
        status: string;
      }[];
    }> = yield call(apiCaller, '/user/details');
    if (response.data) {
      const orgId = response.data.organizations[0]?._id;
      if (!orgId) throw new Error('No organization found');
      yield put(setRole(response.data.role));
      yield put(setOrganizations(response.data.organizations));
      yield put({ type: FETCH_PERMISSIONS_DATA, payload: { silent: false } });
      yield put({ type: FETCH_ORGANIZATION_CONFIGS, payload: { orgId } });
      yield call(fetchFCMToken);
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error: any) {
    console.error('Fetch data failed', error);
    yield put(setError(error.message || 'Fetch data failed'));
  } finally {
    if (!action.payload?.silent) {
      yield put(setLoading({ loading: false }));
    }
  }
}

export default function* fetchUserData() {
  yield takeEvery(FETCH_USERS_DETAILS, fetchUsersDetailsSaga);
}
