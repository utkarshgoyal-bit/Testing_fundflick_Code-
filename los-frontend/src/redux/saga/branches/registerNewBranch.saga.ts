import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { buildOrgRoute } from '@/helpers/routeHelper';
import { ROUTES } from '@/lib/enums';
import { BranchesAction } from '@/lib/interfaces/branch.interface';
import { IBranchTable } from '@/lib/interfaces/tables';
import { FETCH_BRANCHES_DATA, REGISTER_BRANCH_DATA } from '@/redux/actions/types';
import { setError } from '@/redux/slices/branches';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* registerNewBranchSaga(action: BranchesAction) {
  yield put(setLoading({ loading: true }));
  const { payload, navigation } = action;
  try {
    const response: ApiResponse<{ branches: IBranchTable[] }> = yield call(
      apiCaller,
      '/branch',
      'POST',
      payload,
      true,
      {
        pending: 'Creating branch...',
        success: 'Branch created successfully',
        error: 'An error occurred while creating branch',
      }
    );
    if (response.data) {
      navigation(buildOrgRoute(ROUTES.BRANCH_MANAGEMENT));
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

export default function* registerNewBranch() {
  yield takeEvery(REGISTER_BRANCH_DATA, registerNewBranchSaga);
}
