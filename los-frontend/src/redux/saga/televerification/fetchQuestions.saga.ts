import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ITelephoneTable } from '@/lib/interfaces/tables';
import { FETCH_QUESTIONS_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/teleVerification';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchQuestionsSaga(action: any) {
  if (!action.payload?.silent) {
    yield put(setLoading({ loading: true }));
  }
  try {
    const response: ApiResponse<ITelephoneTable[]> = yield call(apiCaller, '/question');
    if (response.data) {
      yield put(setData(response.data));
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

export default function* fetchQuestions() {
  yield takeEvery(FETCH_QUESTIONS_DATA, fetchQuestionsSaga);
}
