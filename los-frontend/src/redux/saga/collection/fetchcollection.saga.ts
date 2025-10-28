import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ICollectionTable } from '@/lib/interfaces/tables';
import { setPage, setTotal, setCollectionData, setMeta } from '@/redux/slices/collection';
import { setData } from '@/redux/slices/collection/collectionDashboard';
import { setError } from '@/redux/slices/collection/uplodefileSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';
import { FETCH_COLLECTION } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { call, put, select, takeLatest } from 'redux-saga/effects';

function* fetchCollectionSaga(): Generator<any, void, any> {
  try {
    yield put(setLoading({ loading: true, message: 'Fetching Collection' }));
    const { filters, page } = yield select((state: RootState) => state.collectionData.tableConfiguration);
    const response: ApiResponse<{
      data: ICollectionTable[];
      total: number;
      branches: [];
      completedCases: [];
      loanTypeSummary: [];
    }> = yield call(
      apiCaller,
      `/collection?page=${page}&filters=${JSON.stringify(filters)}&includeFullyPaidCollection=true`
    );
    if (response.data) {
      yield put(setCollectionData(response.data));
      yield put(setData(response.data.data));
      yield put(setTotal(response.data.total));
      yield put(
        setMeta({
          completedCases: response.data.completedCases,
          loanTypeSummary: response.data.loanTypeSummary,
        })
      );
    } else if (response.error) {
      yield put(setError(response.error));
      yield put(setTotal(0));
      yield put(setPage(0));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}
export function* watchFetchCollectionSaga() {
  yield takeLatest(FETCH_COLLECTION, fetchCollectionSaga);
}
