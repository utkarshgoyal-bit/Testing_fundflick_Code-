import { call, put, takeLatest } from "redux-saga/effects";
import {
  DOWNLOAD_COMPANY_NOTICE_REQUEST,
  DOWNLOAD_LEGAL_NOTICE_REQUEST,
} from "@/redux/actions/types";
import {
  downloadCompanyNoticeFailure,
  downloadCompanyNoticeSuccess,
  downloadLegalNoticeFailure,
  downloadLegalNoticeSuccess,
} from "@/redux/slices/collection/noticeSlice";

interface DownloadAction {
  type: string;
  payload: Record<string, any>;
}

import axios from "axios";
import { setLoading } from "@/redux/slices/publicSlice";
import { toast } from "react-toastify";

function* downloadFile(
  action: DownloadAction,
  endpoint: string,
  successAction: () => any,
  failureAction: (error: string) => any
): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const response = yield call(
      axios.post,
      `${import.meta.env.VITE_SERVER_BASE_URI}/collection/${endpoint}`,
      action.payload,
      {
        responseType: "blob", // Set response type to blob for file downloads
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response || !response.data) {
      throw new Error("No response from API");
    }

    // Create blob from response data
    const blob = new Blob([response.data], { type: "application/pdf" });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${endpoint}.pdf`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    yield put(successAction());
    toast.success("File downloaded successfully!");
  } catch (error: any) {
    console.error("Download failed:", error);
    yield put(failureAction(error.message));
    toast.error(error.message);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* downloadLegalNoticeSaga(action: DownloadAction) {
  yield downloadFile(
    action,
    "edit-legalNotice",
    downloadLegalNoticeSuccess,
    downloadLegalNoticeFailure
  );
}

function* downloadCompanyNoticeSaga(action: DownloadAction) {
  yield downloadFile(
    action,
    "edit-companyNotice",
    downloadCompanyNoticeSuccess,
    downloadCompanyNoticeFailure
  );
}

export function* watchNoticesSaga() {
  yield takeLatest(DOWNLOAD_LEGAL_NOTICE_REQUEST, downloadLegalNoticeSaga);
  yield takeLatest(DOWNLOAD_COMPANY_NOTICE_REQUEST, downloadCompanyNoticeSaga);
}
