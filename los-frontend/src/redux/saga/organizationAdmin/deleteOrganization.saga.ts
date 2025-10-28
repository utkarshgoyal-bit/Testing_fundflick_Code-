import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ICreateOrganizationsAction } from '@/lib/interfaces';
import { IOrganizationAdmin } from '@/lib/interfaces/tables';
import { DELETE_ORGANIZATION, FETCH_ORGANIZATION_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/organizationAdmin';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteOrganizationSaga(action: ICreateOrganizationsAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ Organizations: IOrganizationAdmin[] }> = yield call(
      apiCaller,
      '/organization/' + payload._id,
      'DELETE',
      payload,
      true,
      {
        pending: 'Deleting organization...',
        success: 'Organization deleted successfully',
        error: 'An error occurred while deleting organization',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_ORGANIZATION_DATA, payload: { silent: false } });
    }
    if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* deleteOrganization() {
  yield takeEvery(DELETE_ORGANIZATION, deleteOrganizationSaga);
}
