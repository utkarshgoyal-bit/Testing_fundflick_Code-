import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { PendencyAction } from '@/lib/interfaces/pendency.interface';
import { IPendencyTable } from '@/lib/interfaces/tables';
import { ADD_PENDENCY, FETCH_CUSTOMER_FILES_DATA, FETCH_PENDENCY_DATA } from '@/redux/actions/types';
import { setActiveTab, setError } from '@/redux/slices/pendency';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* registerPendencySaga(action: PendencyAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ pendency: IPendencyTable[] }> = yield call(
      apiCaller,
      '/pendency',
      'POST',
      payload,
      true,
      {
        pending: 'Creating New Pendency...',
        success: 'Pendency created successfully',
        error: 'An error occurred while creating task',
      }
    );

    if (response.data) {
      yield put({ type: FETCH_PENDENCY_DATA, payload: { silent: false, loanApplicationNumber: payload.fileId } });
      yield put({ type: FETCH_CUSTOMER_FILES_DATA, payload: { silent: true } });
      yield put(setActiveTab('active'));
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

export default function* registerPendency() {
  yield takeEvery(ADD_PENDENCY, registerPendencySaga);
}
