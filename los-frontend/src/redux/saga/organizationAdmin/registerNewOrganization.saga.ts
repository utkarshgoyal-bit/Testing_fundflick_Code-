import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { ICreateOrganizationsAction } from '@/lib/interfaces';
import { IOrganizationAdmin } from '@/lib/interfaces/tables';
import { CREATE_NEW_ORGANIZATION, FETCH_ORGANIZATION_DATA, FETCH_PERMISSIONS_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/organizationAdmin';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* registerNewOrganizationSaga(action: ICreateOrganizationsAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ questions: IOrganizationAdmin[] }> = yield call(
      apiCaller,
      '/organization',
      'POST',
      payload,
      true,
      {
        pending: 'Creating organization...',
        success: 'Organization created successfully',
        error: 'An error occurred while creating organization',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_PERMISSIONS_DATA, payload: { silent: false } });
      yield put({ type: FETCH_ORGANIZATION_DATA, payload: { silent: false } });
      navigation(buildOrgRoute(ROUTES.ORGANIZATION_ADMIN));
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

export default function* registerNewOrganization() {
  yield takeEvery(CREATE_NEW_ORGANIZATION, registerNewOrganizationSaga);
}
