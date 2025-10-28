import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { ICreateQuestionsAction } from '@/lib/interfaces';
import { ITelephoneTable } from '@/lib/interfaces/tables';
import { CREATE_NEW_QUESTION } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setData, setError } from '@/redux/slices/teleVerification';
import { call, put, takeEvery } from 'redux-saga/effects';

function* registerNewQuestionSaga(action: ICreateQuestionsAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ questions: ITelephoneTable[] }> = yield call(
      apiCaller,
      '/question',
      'POST',
      payload,
      true,
      {
        pending: 'Creating question...',
        success: 'Question created successfully',
        error: 'An error occurred while creating question',
      }
    );
    if (response.data) {
      yield put(setData(response.data.questions));
      navigation(buildOrgRoute(ROUTES.TELEPHONE_MANAGEMENT));
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

export default function* registerNewQuestion() {
  yield takeEvery(CREATE_NEW_QUESTION, registerNewQuestionSaga);
}
