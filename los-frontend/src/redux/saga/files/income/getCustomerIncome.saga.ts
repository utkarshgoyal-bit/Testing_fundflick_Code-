/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { GET_CUSTOMER_INCOME_DATA } from '@/redux/actions/types';
import { setStepsData } from '@/redux/slices/files';
import { setData, setError } from '@/redux/slices/files/income';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getCustomerIncomeSaga() {
  yield put(setLoading({ loading: true }));
  const id = urlQueryParams('id');

  try {
    const response: ApiResponse<any> = yield call(apiCaller, `/customer-file/customer_income/${id}`, 'GET', {}, false);
    if (response.data) {
      yield put(setData(response.data));
      yield put(
        setStepsData({
          stepsDone: response.data.stepsDone,
          verifiedSteps: response.data.verifiedSteps,
        })
      );
    }
  } catch (error) {
    console.error('Failed to fetch customer file:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export default function* getCustomerIncome() {
  yield takeEvery(GET_CUSTOMER_INCOME_DATA, getCustomerIncomeSaga);
}
