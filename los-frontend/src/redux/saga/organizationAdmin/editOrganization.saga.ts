import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ROUTES } from '@/lib/enums';
import { ICreateOrganizationsAction } from '@/lib/interfaces';
import { ITelephoneTable } from '@/lib/interfaces/tables';
import { EDIT_ORGANIZATION, FETCH_ORGANIZATION_DATA, FETCH_PERMISSIONS_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/organizationAdmin';
import { call, put, takeEvery } from 'redux-saga/effects';
import { buildOrgRoute } from '@/helpers/routeHelper';

function* editOrganizationSaga(action: ICreateOrganizationsAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ organizations: ITelephoneTable[] }> = yield call(
      apiCaller,
      '/organization/' + payload._id,
      'PUT',
      payload,
      true,
      {
        pending: 'Updating organization...',
        success: 'Organization updated successfully',
        error: 'An error occurred while updating organization',
      }
    );
    if (response.data) {
      navigation(buildOrgRoute(ROUTES.ORGANIZATION_ADMIN));
      yield put({ type: FETCH_ORGANIZATION_DATA, payload: { silent: false } });
      yield put({ type: FETCH_PERMISSIONS_DATA, payload: { silent: false } });
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

export default function* editOrganization() {
  yield takeEvery(EDIT_ORGANIZATION, editOrganizationSaga);
}
