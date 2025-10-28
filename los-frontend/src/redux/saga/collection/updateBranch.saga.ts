import apiCaller from "@/helpers/apiHelper";
import { IUpdateBranchAction } from "@/lib/interfaces/collection";
import { updateBranchFailure, updateBranchSuccess } from "@/redux/slices/collection/branchUpdate";
import { setLoading } from "@/redux/slices/publicSlice";
import {
  UPDATE_BRANCH_REQUEST,
} from "@/redux/store/actionTypes";
// } from "@/redux/actions/types";
import { call, put,  takeLatest } from "redux-saga/effects";


function* updateBranchSaga(action: IUpdateBranchAction) {
  try {
    yield put(setLoading({ loading: true }));

    const { caseNo, newBranch } = action.payload;
    yield call(apiCaller, "/collection/update-branch", "PUT", {
      caseNo,
      newBranch,
    });

    yield put(updateBranchSuccess());
  } catch (error: any) {
    yield put(updateBranchFailure(error.response?.data?.error || "Error updating branch"));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchUpdateBranchSaga() {

  yield takeLatest(UPDATE_BRANCH_REQUEST, updateBranchSaga);

}
