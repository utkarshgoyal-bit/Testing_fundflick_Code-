import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { FETCH_PERMISSIONS_DATA } from '@/redux/actions/types';
import { setData, setModules, setOrganizations, setPermissions, setRole } from '@/redux/slices/login';
import { setAuthenticated, setAuthLoading, setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/roles';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchPermissionsSaga() {
  yield put(setLoading({ loading: true, message: 'Fetching Permissions' }));
  yield put(setAuthLoading({ loading: true, message: 'Fetching Auth Permissions' }));
  try {
    const response: ApiResponse<{
      permissions: [];
      role: string;
      user: any;
      employment: any;
      branches: string[];
      modules: string[];
      organizations: {
        _id: string;
        name: string;
        isActive: boolean;
        status: string;
      }[];
    }> = yield call(apiCaller, `/role/permissions`, 'GET', {}, false);
    if (response.data) {
      yield put(setPermissions(response.data.permissions));
      yield put(setRole(response.data.role));
      yield put(setOrganizations(response.data.organizations));
      yield put(
        setData({ user: response.data.user, employment: response.data.employment, branches: response.data.branches })
      );

      yield put(setModules(response.data.modules));
      // yield put(setAuthenticated({loading:true}));
      localStorage.setItem('LOS', 'true');
    }
    if (response.error) {
      yield put(setAuthenticated({ loading: false }));
      yield put(setError(response.error));
      localStorage.setItem('LOS', 'false');
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
    yield put(setAuthLoading({ loading: false }));
  }
}

export default function* fetchPermissions() {
  yield takeEvery(FETCH_PERMISSIONS_DATA, fetchPermissionsSaga);
}
