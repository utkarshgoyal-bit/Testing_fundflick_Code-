import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { FETCH_ORGANIZATION_DATA } from '@/redux/actions/types';
import { OrganizationsAdminState, setData, setError } from '@/redux/slices/organizationAdmin';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchOrganizationSaga(action: any) {
  if (!action.payload?.silent) {
    yield put(setLoading({ loading: true }));
  }
  try {
    const response: ApiResponse<OrganizationsAdminState['tableConfiguration']> = yield call(apiCaller, '/organization');
    if (response.data) {
      yield put(setData(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* fetchOrganization() {
  yield takeEvery(FETCH_ORGANIZATION_DATA, fetchOrganizationSaga);
}
