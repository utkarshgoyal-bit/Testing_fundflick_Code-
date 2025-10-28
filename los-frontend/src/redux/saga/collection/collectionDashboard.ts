import { ERROR_MESSAGE } from '@/lib/enums';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { AxiosError } from 'axios';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { COLLECTION_DASHBOARD } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/collection/collectionDashboard';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';

function* collectionDashboardSaga() {
  yield put(setLoading({ loading: true, message: 'Fetching Collections' }));
  try {
    const {
      filters: { collectionDay, followupDay, branch },
    } = yield select((state: RootState) => state.collectionDashboard);
    const includeFullyPaidCollection = true;

    const response: ApiResponse<any> = yield call(
      apiCaller,
      `/collection/dashboard?collectionDay=${collectionDay}&followupDay=${followupDay}&includeFullyPaidCollection=${includeFullyPaidCollection}&branch=${branch}`,
      'GET'
    );
    if (response instanceof AxiosError) {
      throw response;
    }
    if (response.data) {
      yield put(setData(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      yield navigator.vibrate([200, 100, 200]);
      yield put(
        setError(
          error?.response?.data.result?.message || error?.response?.data.errorMessage || ERROR_MESSAGE.UNEXPECTED
        )
      );
    } else {
      yield put(setError(error?.toString() || ERROR_MESSAGE.UNEXPECTED));
    }
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchCollectionDashboardSaga() {
  yield takeEvery(COLLECTION_DASHBOARD, collectionDashboardSaga);
}
