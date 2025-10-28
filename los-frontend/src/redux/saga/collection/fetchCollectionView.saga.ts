import apiCaller from "@/helpers/apiHelper";
import { setPayments, setPaymentsError } from "@/redux/slices/collection/paymentUpdateDueEmiSlice";
import { setLoading } from "@/redux/slices/publicSlice";
import {
  FETCH_COLLECTION_VIEW,
} from "@/redux/store/actionTypes";
// } from "@/redux/actions/types";
import { call, put,  takeLatest } from "redux-saga/effects";


function* fetchCollectionViewSaga(action: any): Generator<any, void, any> {
  const { caseNo } = action.payload;
  yield put(setLoading({ loading: true }));
  try {
    const response = yield call(apiCaller, `/collection/payments?caseNo=${caseNo}`);

    console.log("API Response:", response);

    if (!response) {
      throw new Error("No response from API");
    }
    const data = yield response.data;
    if (data) {
      yield put(setPayments(data));
    } else {
      throw new Error("No payment data found");
    }
  } catch (error: any) {
    console.error("Error fetching payments:", error.message);
    yield put(setPaymentsError(error.message));
    yield put(setLoading({ loading: false }));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchFetchCollectionViewSaga() {
  yield takeLatest(FETCH_COLLECTION_VIEW, fetchCollectionViewSaga);
}


