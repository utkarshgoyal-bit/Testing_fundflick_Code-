import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import urlQueryParams from '@/helpers/urlQueryParams';
import { EDIT_CREDIT_INCOME_DETAILS, GET_CREDIT_INCOME_DETAILS } from '@/redux/actions/types';
import { setError } from '@/redux/slices/credit';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editIncomeDetails(action: { type: string; payload: any }) {
  yield put(setLoading({ loading: true }));
  try {
    const fileId = urlQueryParams('id');
    const response: ApiResponse<any> = yield call(
      apiCaller,
      `/credit/income/${fileId}?id=${action.payload.id}`,
      'PUT',
      action.payload,
      true,
      {
        pending: 'Adding Details...',
        success: 'Details edited successfully',
        error: 'An error occurred while updating details',
      }
    );
    if (response.data) {
      yield put({ type: GET_CREDIT_INCOME_DETAILS });
    } else if (response.error) {
      //   yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* editCreditIncomeSaga() {
  yield takeEvery(EDIT_CREDIT_INCOME_DETAILS, editIncomeDetails);
}
