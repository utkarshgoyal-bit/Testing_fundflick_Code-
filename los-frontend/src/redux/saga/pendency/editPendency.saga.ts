import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { PendencyAction } from '@/lib/interfaces/pendency.interface';
import { IPendencyTable } from '@/lib/interfaces/tables';
import { EDIT_PENDENCY } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/pendency';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editPendencySaga(action: PendencyAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ pendency: IPendencyTable[] }> = yield call(
      apiCaller,
      '/pendency',
      'PUT',
      payload,
      true,
      {
        pending: 'Updating Pendency...',
        success: 'Pendency updated successfully',
        error: 'An error occurred while updating task',
      }
    );
    if (response.data) {
      yield put(setData(response.data.pendency));
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

export default function* editPendency() {
  yield takeEvery(EDIT_PENDENCY, editPendencySaga);
}
