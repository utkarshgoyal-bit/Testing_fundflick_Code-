import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { PendencyAction } from '@/lib/interfaces/pendency.interface';
import { IPendencyTable } from '@/lib/interfaces/tables';
import { FETCH_PENDENCY_DATA, MARK_AS_COMPLETED_PENDENCY } from '@/redux/actions/types';
import { setError } from '@/redux/slices/pendency';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* markPendencyAsCompletedSaga(action: PendencyAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ pendency: IPendencyTable[] }> = yield call(
      apiCaller,
      '/pendency/completed',
      'PATCH',
      payload,
      true,
      {
        pending: 'Completing Pendency...',
        success: 'Pendency completed successfully',
        error: 'An error occurred while completing task',
      }
    );
    if (response.data) {
      yield put({
        type: FETCH_PENDENCY_DATA,
        payload: {
          silent: false,
          loanApplicationNumber: payload.fileId,
        },
      });
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

export default function* markPendencyAsCompleted() {
  yield takeEvery(MARK_AS_COMPLETED_PENDENCY, markPendencyAsCompletedSaga);
}
