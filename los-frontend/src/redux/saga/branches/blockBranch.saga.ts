import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { BranchesAction } from '@/lib/interfaces/branch.interface';
import { IBranchTable } from '@/lib/interfaces/tables';
import { BLOCK_BRANCH_DATA, FETCH_BRANCHES_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/branches';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* blockBranchSaga(action: BranchesAction) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;
  try {
    const response: ApiResponse<{ branches: IBranchTable[] }> = yield call(
      apiCaller,
      '/branch/block',
      'DELETE',
      payload,
      true,
      {
        pending: 'Blocking branch...',
        success: 'Branch blocked successfully',
        error: 'An error occurred while blocking branch',
      }
    );
    if (response.data) {
      yield put({ type: FETCH_BRANCHES_DATA });
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

export default function* blockBranches() {
  yield takeEvery(BLOCK_BRANCH_DATA, blockBranchSaga);
}
