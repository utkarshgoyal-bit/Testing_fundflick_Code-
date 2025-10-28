/* eslint-disable @typescript-eslint/no-explicit-any */
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { ERROR_MESSAGE } from '@/lib/enums';
import { ISagaProps } from '@/lib/interfaces/shared';
import { EDIT_EXISTING_LOAN_DATA, GET_CUSTOMER_LIABILITY_DATA } from '@/redux/actions/types';
import { setLiabilityDialogEdit } from '@/redux/slices/files';
import { setError } from '@/redux/slices/files/liability';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editExistingLoanSaga(action: ISagaProps) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  const fileId = urlQueryParams('id');

  try {
    const response: ApiResponse<{ data: any }> = yield call(
      apiCaller,
      `/customer-file/customer_liability/${fileId}/existing-loans`,
      'PUT',
      { ...payload },
      true,
      {
        pending: 'Saving data...',
        success: 'Data saved successfully',
        error: 'Failed to save data',
      },
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    if (response.data) {
      yield put({ type: GET_CUSTOMER_LIABILITY_DATA });

      yield put(setLiabilityDialogEdit(false));
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* editExistingLoan() {
  yield takeEvery(EDIT_EXISTING_LOAN_DATA, editExistingLoanSaga);
}
