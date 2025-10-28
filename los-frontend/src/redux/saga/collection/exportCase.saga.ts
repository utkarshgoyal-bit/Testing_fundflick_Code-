import apiCaller, { ApiResponse } from "@/helpers/apiHelper";
import { jsonToCsv } from "@/helpers/jsonTocsv";
import { updateBranchFailure} from "@/redux/slices/collection/branchUpdate";
import { setLoading } from "@/redux/slices/publicSlice";
import {
  EXPORT_CASES,
} from "@/redux/store/actionTypes";
// } from "@/redux/actions/types";
import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
function* exportCaseSaga(action: { type: string; payload: { startDate: string; endDate: string } }) {
  try {
    yield put(setLoading({ loading: true }));
    const data: ApiResponse<any> = yield call(apiCaller, "/collection/case/export", "POST", action.payload, true, {
      pending: "Exporting...",
      success: "Data exported successfully",
      error: "Failed to save data",
    });

    if (!data.data.length) {
      toast.error("No data found");
    }
    if (data.data) {
      const csvData = jsonToCsv(data.data);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cases.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error: any) {
    yield put(updateBranchFailure(error.response?.data?.error || "Error updating branch"));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchEXportCaseSaga() {
  yield takeLatest(EXPORT_CASES, exportCaseSaga);
}
