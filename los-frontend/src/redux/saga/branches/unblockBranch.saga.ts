import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { BranchesAction } from '@/lib/interfaces/branch.interface';
import { IBranchTable } from '@/lib/interfaces/tables';
import { FETCH_BRANCHES_DATA, UNBLOCK_BRANCH_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/branches';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* unblockBranchSaga(action: BranchesAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ branches: IBranchTable[] }> = yield call(
      apiCaller,
      '/branch/unblock',
      'PATCH',
      payload,
      true,
      {
        pending: 'Unblocking branch...',
        success: 'Branch unblocked successfully',
        error: 'An error occurred while unblocking branch',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_BRANCHES_DATA });
    }
    if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* unlockBranch() {
  yield takeEvery(UNBLOCK_BRANCH_DATA, unblockBranchSaga);
}
