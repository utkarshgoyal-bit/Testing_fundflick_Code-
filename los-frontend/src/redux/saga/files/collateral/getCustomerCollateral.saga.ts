/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import {
    GET_CUSTOMER_COLLATERAL_DATA
} from '@/redux/actions/types';
import { setStepsData } from '@/redux/slices/files';
import { setData, setError } from '@/redux/slices/files/collateral';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getCustomerCollateralSaga() {
  yield put(setLoading({ loading: true }));
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  try {
    const response: ApiResponse<any> = yield call(
      apiCaller,
      `/customer-file/customer_collateral/${id}`,
      'GET',
      {},
      false
    );
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

export default function* getCustomerCollateral() {
  yield takeEvery(GET_CUSTOMER_COLLATERAL_DATA, getCustomerCollateralSaga);
}
