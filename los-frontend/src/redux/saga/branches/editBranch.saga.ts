import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { BranchesAction } from '@/lib/interfaces/branch.interface';
import { IBranchTable } from '@/lib/interfaces/tables';
import { EDIT_BRANCH_DATA, FETCH_BRANCHES_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/branches';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* editBranchSaga(action: BranchesAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ branches: IBranchTable[] }> = yield call(apiCaller, '/branch', 'PUT', payload, true, {
      pending: 'Updating branch...',
      success: 'Branch updated successfully',
      error: 'An error occurred while updating branch',
    });
    if (response.data) {
      navigation(buildOrgRoute(ROUTES.BRANCH_MANAGEMENT));
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

export default function* editBranch() {
  yield takeEvery(EDIT_BRANCH_DATA, editBranchSaga);
}
