import { call, put, select, takeLatest } from 'redux-saga/effects';
import apiCaller from '@/helpers/apiHelper';
import {
  fetchCaseRequest,
  fetchCaseSuccess,
  fetchCaseFailure,
  submitCaseSuccess,
  submitCaseFailure,
  setPromiseToPayTableData,
} from '@/redux/slices/collection/paymentSliceCollection';
import {
  EXPORT_COLLECTION_PAYMENT_BY_DATE,
  FETCH_COLLECTION_PAYMENT_BY_DATE,
  FETCH_COLLECTION_PAYMENT_CASE_ID,
  FETCH_COLLECTION_PAYMENT_DATA,
} from '@/redux/actions/types';
import { ROUTES } from '@/lib/enums';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';
import { jsonToCsv } from '@/helpers/jsonTocsv';
import { toast } from 'react-toastify';
import moment from 'moment';
import { toFormatDate } from '@/helpers/dateFormater';
import { buildOrgRoute } from '@/helpers/routeHelper';

function* getCaseId(caseId: string): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));

    const response = yield call(apiCaller, `/collection/case/${caseId}`);
    if (response.data) {
      yield put(
        fetchCaseSuccess({
          refCaseId: response.data._id,
          dueEmiAmount: response.data.dueEmiAmount,
        })
      );
    } else {
      yield put(fetchCaseFailure('Invalid response data'));
    }
  } catch (error) {
    console.error('Error in getCaseId:', error);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* fetchCaseSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));

    const response = yield call(getCaseId, action.payload);

    if (response) {
      yield put(
        fetchCaseSuccess({
          refCaseId: response.data._id,
          dueEmiAmount: response.data.dueEmiAmount,
        })
      );
    } else {
      yield put(fetchCaseFailure('No data received'));
    }
  } catch (error: any) {
    console.error('Error in fetchCaseSaga:', error);
    yield put(fetchCaseFailure(error.message));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* submitCaseSaga(action: {
  type: string;
  payload?: { data: any; caseIdParams: string | any; navigation: any };
}): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));

    if (!action.payload) {
      throw new Error('Payload is undefined');
    }
    const { data, caseIdParams, navigation } = action.payload;

    const response = yield call(
      apiCaller,
      `collection/updateCasePayment/${caseIdParams}`,
      'POST',
      data,
      true,
      {
        pending: 'Creating payment...',
        success: 'Payment created successfully',
        error: 'An error occurred while creating payment',
      },
      {
        'Content-Type': 'multipart/form-data',
      }
    );

    if (!response.error) {
      yield put(submitCaseSuccess());
      if (navigation) {
        navigation({ pathname: buildOrgRoute(ROUTES.COLLECTION) });
      }
    } else {
      yield put(submitCaseFailure('No response from server'));
    }

    yield put(fetchCaseRequest(caseIdParams));
  } catch (error: any) {
    yield put(submitCaseFailure(error.message));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

function* getPromiseToPayByDate(): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));

    const {
      tableConfiguration: { filters, page },
    } = yield select((state: RootState) => state.collectionPayment);
    const queryParams = new URLSearchParams(filters).toString();

    const response = yield call(apiCaller, `/collection/dailyReports/payments?${queryParams}&page=${page}`);
    if (response.data) {
      yield put(
        setPromiseToPayTableData({
          data: response.data.data,
          total: response.data?.total?.count,
          totalAmount: response.data?.total?.totalAmount,
        })
      );
    } else {
      yield put(submitCaseFailure('Invalid response data'));
    }
  } catch (error) {
    console.error('Error in getCaseId:', error);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
function* exportPromiseToPayByDate(): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true }));

    const {
      tableConfiguration: { filters, page },
    } = yield select((state: RootState) => state.collectionPayment);
    const queryParams = new URLSearchParams(filters).toString();

    const response = yield call(
      apiCaller,
      `/collection/dailyReports/payments?${queryParams}&page=${page}&export=true`
    ) || { data: { data: [] } };

    if (response.data && Array.isArray(response.data.data) && response.data.data.length) {
      const mappedCsvData = response.data.data.map(
        ({
          address,
          amount,
          caseNo,
          collectedBy,
          customer,
          date,
          extraCharges,
          paymentMode,
          remarks,
          updatedAtTimeStamp,
          branchName,
        }: {
          address: string;
          amount: number;
          caseNo: string;
          collectedBy: string;
          customer: string;
          date: string;
          extraCharges: number;
          paymentMode: string;
          remarks: string;
          updatedAtTimeStamp: number;
          branchName: string;
        }) => ({
          'Case No': caseNo,
          Customer: customer,
          Amount: amount,
          'Branch Name': branchName,
          'Extra Charges': extraCharges,
          'Payment Mode': paymentMode.toUpperCase(),
          'Collected By': collectedBy,
          'Date Of Receipt': moment(date).format('DD/MM/YYYY'),
          'Date Of Entry': toFormatDate({ date: updatedAtTimeStamp }),
          Remarks: remarks,
          Address: address,
        })
      );
      // Convert JSON data to CSV
      const csvData = jsonToCsv(mappedCsvData);

      // Create a Blob for CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cases.csv';
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

export function* watchCollectionSaga() {
  yield takeLatest(FETCH_COLLECTION_PAYMENT_CASE_ID, fetchCaseSaga);
  yield takeLatest(FETCH_COLLECTION_PAYMENT_DATA, submitCaseSaga);
  yield takeLatest(FETCH_COLLECTION_PAYMENT_BY_DATE, getPromiseToPayByDate);
  yield takeLatest(EXPORT_COLLECTION_PAYMENT_BY_DATE, exportPromiseToPayByDate);
}
