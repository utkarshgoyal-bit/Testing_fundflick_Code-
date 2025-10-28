import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ICreateQuestionsAction } from '@/lib/interfaces';
import { ITelephoneTable } from '@/lib/interfaces/tables';
import { DELETE_QUESTION, FETCH_QUESTIONS_DATA } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/teleVerification';
import { call, put, takeEvery } from 'redux-saga/effects';

function* deleteQuestionSaga(action: ICreateQuestionsAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ questions: ITelephoneTable[] }> = yield call(
      apiCaller,
      '/question',
      'DELETE',
      payload,
      true,
      {
        pending: 'Deleting question...',
        success: 'Question deleted successfully',
        error: 'An error occurred while deleting question',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_QUESTIONS_DATA, payload: { silent: false } });
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

export default function* deleteQuestion() {
  yield takeEvery(DELETE_QUESTION, deleteQuestionSaga);
}
