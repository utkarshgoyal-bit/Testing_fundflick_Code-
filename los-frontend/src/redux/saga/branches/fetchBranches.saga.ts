import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IBranchTable } from '@/lib/interfaces/tables';
import { FETCH_BRANCHES_DATA } from '@/redux/actions/types';
import { setData, setError } from '@/redux/slices/branches';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchBranchesSaga(action: {
  type: string;
  filter?: {
    isRoot?: boolean;
  };
}) {
  yield put(setLoading({ loading: true }));
  try {
    const response: ApiResponse<IBranchTable[]> = yield call(
      apiCaller,
      `/branch${action.filter?.isRoot ? '?isRoot=true' : ''}`
    );
    if (response.data) {
      yield put(setData(response.data));
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

export default function* fetchBranches() {
  yield takeEvery(FETCH_BRANCHES_DATA, fetchBranchesSaga);
}
