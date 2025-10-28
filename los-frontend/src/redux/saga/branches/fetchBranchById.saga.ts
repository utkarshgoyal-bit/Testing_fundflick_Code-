import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { BranchesAction } from '@/lib/interfaces/branch.interface';
import { IBranchTable } from '@/lib/interfaces/tables';
import { FETCH_BRANCHES_DATA_BY_ID } from '@/redux/actions/types';
import { setError, setSelectedBranch } from '@/redux/slices/branches';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchBranchByIdSaga(action: BranchesAction) {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<IBranchTable> = yield call(apiCaller, `/branch/${action.payload.id}`);
    if (response.data) {
      yield put(setSelectedBranch(response.data));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* fetchBranchesById() {
  yield takeEvery(FETCH_BRANCHES_DATA_BY_ID, fetchBranchByIdSaga);
}
