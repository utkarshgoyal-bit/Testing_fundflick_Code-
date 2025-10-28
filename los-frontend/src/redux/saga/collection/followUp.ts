import { ROUTES } from '@/lib/enums';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { RootState } from '@/redux/store';
import { setFollowUpTableData } from '@/redux/slices/collection/folllowUpSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { NavigateFunction } from 'react-router-dom';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  EXPORT_COLLECTION_FOLLOWUP_BY_DATE,
  FETCH_COLLECTION_FOLLOWUP_BY_DATE,
  FETCH_COLLECTION_FOLLOWUP_CASE_ID,
  FETCH_COLLECTION_FOLLOWUP_DATA,
  FETCH_COLLECTION_PAYMENT_DATA,
} from '@/redux/actions/types';
import {
  fetchFolloUpFailure,
  fetchfolloupSuccess,
  fetchFollowUpRequest,
  submitFollowUpFailure,
  submitFollowUpRequest,
  submitFollowUpSuccess,
} from '@/redux/slices/collection/followUpdateDataSlice';
import { jsonToCsv } from '@/helpers/jsonTocsv';
import { toast } from 'react-toastify';
import { buildOrgRoute } from '@/helpers/routeHelper';

function* getfollowUpId(caseId: string): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const response = yield call(apiCaller, `/collection/casess/${caseId}`);
    if (response.data) {
      yield put(fetchfolloupSuccess({ refCaseId: response.data._id }));
    } else {
      yield put(fetchFolloUpFailure('Invalid response data'));
    }
  } catch (error) {
    console.error('Error in getCaseId:', error);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* fetchFollowUpSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const response = yield call(getfollowUpId, action.payload);
    if (response) {
      yield put(fetchfolloupSuccess({ refCaseId: response.data._id }));
    } else {
      yield put(fetchFolloUpFailure('No data received'));
    }
  } catch (error: any) {
    console.error('Error in fetchCaseSaga:', error);
    yield put(fetchFolloUpFailure(error.message));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* handleFollowUpSubmission(action: {
  type: string;
  payload?: {
    data: any;
    caseIdParams: string;
    navigation: NavigateFunction;
    casePaymentData?: any;
    isDonotNavigate?: boolean;
  };
}) {
  try {
    yield put(setLoading({ loading: true }));

    if (!action.payload) {
      throw new Error('Payload is undefined');
    }
    const { data, caseIdParams, navigation, isDonotNavigate } = action.payload;
    const response: ApiResponse<any> = yield call(
      apiCaller,
      `/collection/updateCaseFollowUp/${caseIdParams}`,
      'POST',
      data,
      true,
      {
        pending: 'Creating FollowUp...',
        success: 'FollowUp created successfully',
        error: 'An error occurred while creating FollowUp',
      },
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    if (response) {
      yield put(submitFollowUpSuccess());
      if (data.casePaymentData) {
        yield put({
          type: FETCH_COLLECTION_PAYMENT_DATA,
          payload: {
            data: { ...data.casePaymentData, refCaseId: response.data.addFollowUpData.refCaseId },
            caseIdParams,
            navigation,
          },
        });
      }

      if (!isDonotNavigate) {
        yield call(() => navigation({ pathname: buildOrgRoute(ROUTES.COLLECTION) }));
      }
    } else {
      yield put(submitFollowUpFailure('No response from server'));
    }

    yield put(fetchFollowUpRequest(caseIdParams));
  } catch (error: any) {
    console.error('Error in submitCaseSaga:', error);
    yield put(submitFollowUpRequest(error.message));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* getFollowupsByDate(action: { type: string; payload?: { userId: string } }): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const userId = action?.payload?.userId;
    const {
      tableConfiguration: { filters, page },
    } = yield select((state: RootState) => state.FollowUpsliceDetails);

    let queryParams = new URLSearchParams(filters).toString();
    if (userId) {
      queryParams += `&createdBy=${userId}`;
    }
    const response = yield call(apiCaller, `/collection/dailyReports/follow-up?page=${page}&${queryParams}`);
    if (response.data) {
      yield put(
        setFollowUpTableData({
          data: response.data.data,
          total: response.data.total,
        })
      );
    } else {
      yield put(fetchFolloUpFailure('Invalid response data'));
    }
  } catch (error) {
    console.error('Error in getCaseId:', error);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* exportFollowupsByDate(): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));
    const {
      tableConfiguration: { filters, page },
    } = yield select((state: RootState) => state.FollowUpsliceDetails);
    const queryParams = new URLSearchParams(filters).toString();
    const response = yield call(
      apiCaller,
      `/collection/dailyReports/follow-up?page=${page}&${queryParams}&export=true`
    );
    if (response.data.data.length) {
      // Convert JSON data to CSV
      const csvData = jsonToCsv(response.data.data);

      // Create a Blob for CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cases.csv'; // Set the filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      toast.error('No data found');
    }
  } catch (error) {
    console.error('Error in getCaseId:', error);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchFollowUpDataSaga() {
  yield takeLatest(FETCH_COLLECTION_FOLLOWUP_CASE_ID, fetchFollowUpSaga);
  yield takeLatest(FETCH_COLLECTION_FOLLOWUP_DATA, handleFollowUpSubmission);
  yield takeLatest(FETCH_COLLECTION_FOLLOWUP_BY_DATE, getFollowupsByDate);
  yield takeLatest(EXPORT_COLLECTION_FOLLOWUP_BY_DATE, exportFollowupsByDate);
}
