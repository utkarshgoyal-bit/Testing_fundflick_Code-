import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { call, put, takeEvery } from 'redux-saga/effects';
import { IBranchTable } from '@/lib/interfaces/tables';
import { setLoading } from '@/redux/slices/publicSlice';
import { FETCH_BRANCHES_DATA, DELETE_BRANCH } from '@/redux/actions/types';
import { setError } from '@/redux/slices/branches';
import debug from 'debug';
import { BranchesAction } from '@/lib/interfaces/branch.interface';

debug('app:deleteBranchSaga');
function* deleteBranchSaga(action: BranchesAction) {
  const { id = '' } = action.payload;
  yield put(setLoading({ loading: true }));
  debug('called');
  try {
    const response: ApiResponse<IBranchTable> = yield call(apiCaller, `/branch/${id}`, 'DELETE', {}, false);
    if (!response.data) {
      yield put(setLoading({ loading: false }));
      setError('An unexpected error occurred');
    } else {
      yield put({
        type: FETCH_BRANCHES_DATA,
      });
    }
  } catch (error) {
    setError('An unexpected error occurred');
    console.error('Delete branch failed', error);
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* DeleteBranch() {
  yield takeEvery(DELETE_BRANCH, deleteBranchSaga);
}
