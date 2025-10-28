import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IPendencyTable } from '@/lib/interfaces/tables';
import { FETCH_PENDENCY_DATA } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/pendency';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';
import { call, put, select, takeEvery } from 'redux-saga/effects';
function* fetchPendencySaga(payload?: any) {
  const { silent, loanApplicationNumber } = payload;
  if (!silent) {
    yield put(setLoading({ loading: true }));
  }
  try {
    const { activeTab } = yield select((state: RootState) => state.pendency);
    const response: ApiResponse<IPendencyTable[]> = yield call(
      apiCaller,
      `/pendency?active=${activeTab === 'active'}&fileId=${loanApplicationNumber}`
    );
    if (response.data) {
      yield put(setData(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    if (!silent) {
      yield put(setLoading({ loading: false }));
    }
  }
}

export default function* fetchPendency() {
  yield takeEvery(FETCH_PENDENCY_DATA, fetchPendencySaga);
}
