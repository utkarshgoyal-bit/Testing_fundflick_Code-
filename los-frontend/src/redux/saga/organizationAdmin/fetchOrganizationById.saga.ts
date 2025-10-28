import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IOrganizationAdmin } from '@/lib/interfaces/tables';
import { call, put, takeEvery } from 'redux-saga/effects';
import { FETCH_ORGANIZATION_BY_ID } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError, setSelectedOrganization } from '@/redux/slices/organizationAdmin';
import { ICreateOrganizationsAction } from '@/lib/interfaces';

function* fetchOrganizationByIdData(action: ICreateOrganizationsAction) {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<IOrganizationAdmin> = yield call(apiCaller, `/organization/${action.payload._id}`);
    if (response.data) {
      yield put(setSelectedOrganization(response.data));
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

export default function* watchFetchOrganizationById() {
  yield takeEvery(FETCH_ORGANIZATION_BY_ID, fetchOrganizationByIdData);
}
