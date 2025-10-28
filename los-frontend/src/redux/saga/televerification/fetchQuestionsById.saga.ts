import apiCaller, { ApiResponse } from "@/helpers/apiHelper";
import { ITelephoneTable } from "@/lib/interfaces/tables";
import { call, put, takeEvery } from "redux-saga/effects";
import { FETCH_QUESTION_BY_ID } from "@/redux/actions/types";
import { setLoading } from "@/redux/slices/publicSlice";
import { setError, setSelectedQuestion } from "@/redux/slices/teleVerification";
import { ICreateQuestionsAction } from "@/lib/interfaces";

function* fetchQuestionByIdData(action: ICreateQuestionsAction) {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<ITelephoneTable> = yield call(
      apiCaller,
      `/question/${action.payload.id}`
    );
    if (response.data) {
      yield put(setSelectedQuestion(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error("Fetch data failed", error);
    yield put(setError("An unexpected error occurred"));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* watchFetchQuestionById() {
  yield takeEvery(FETCH_QUESTION_BY_ID, fetchQuestionByIdData);
}
