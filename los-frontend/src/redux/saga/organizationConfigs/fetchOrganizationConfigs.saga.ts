import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { FETCH_ORGANIZATION_CONFIGS } from '@/redux/actions/types';
import { IOrganizationConfig } from '@/lib/interfaces/tables';
import {
  setOrganizationConfigsError,
  setOrganizationConfigSettings,
} from '@/redux/slices/organizationConfigs/fetchOrganizationConfigs';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchOrganizationConfigsSaga(action: { type: string; payload: { orgId: string } }) {
  try {
    const { orgId } = action.payload;
    const response: ApiResponse<IOrganizationConfig> = yield call(
      apiCaller,
      `/organization-configs/${orgId}/configs`,
      'GET'
    );
    if (response.data) {
      const organizationSettings = response.data.settings;
      yield put(setOrganizationConfigSettings(organizationSettings));
    } else if (response.error) {
      yield put(setOrganizationConfigsError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setOrganizationConfigsError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false, message: 'Fetching Organization Configs...' }));
  }
}

export default function* fetchOrganizationConfigs() {
  yield takeEvery(FETCH_ORGANIZATION_CONFIGS, fetchOrganizationConfigsSaga);
}
