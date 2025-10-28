import { RESET_CUSTOMER_FORM } from '@/redux/actions/types';
import { resetAddress } from '@/redux/slices/files/address';
import { resetAssociates } from '@/redux/slices/files/associates';
import { resetBank } from '@/redux/slices/files/bank';
import { resetCollateral } from '@/redux/slices/files/collateral';
import { resetCustomerDetails } from '@/redux/slices/files/customerDetails';
import { resetIncome } from '@/redux/slices/files/income';
import { resetLiability } from '@/redux/slices/files/liability';
import { resetPhotos } from '@/redux/slices/files/photos';
import { put, takeEvery } from 'redux-saga/effects';

function* resetAllStepsStatesSaga() {
  yield put(resetAddress());
  yield put(resetAssociates());
  yield put(resetBank());
  yield put(resetCollateral());
  yield put(resetCustomerDetails());
  yield put(resetIncome());
  yield put(resetLiability());
  yield put(resetPhotos());
}

export default function* resetAllStepsStates() {
  yield takeEvery(RESET_CUSTOMER_FORM, resetAllStepsStatesSaga);
}
