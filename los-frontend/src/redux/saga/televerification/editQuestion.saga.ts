import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { ICreateQuestionsAction } from '@/lib/interfaces';
import { ITelephoneTable } from '@/lib/interfaces/tables';
import { EDIT_QUESTION } from '@/redux/actions/types';
import { setLoading } from '@/redux/slices/publicSlice';
import { setError } from '@/redux/slices/teleVerification';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editQuestionSaga(action: ICreateQuestionsAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ questions: ITelephoneTable[] }> = yield call(
      apiCaller,
      '/question',
      'PUT',
      payload,
      true,
      {
        pending: 'Updating question...',
        success: 'Question updated successfully',
        error: 'An error occurred while updating question',
      }
    );
    if (response.data) {
      navigation(buildOrgRoute(ROUTES.TELEPHONE_MANAGEMENT));
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

export default function* editQuestion() {
  yield takeEvery(EDIT_QUESTION, editQuestionSaga);
}
