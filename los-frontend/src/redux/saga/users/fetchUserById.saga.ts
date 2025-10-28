import { setError } from '@/redux/slices/users';
import { call, put, takeEvery } from 'redux-saga/effects';
import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { IUserTable } from '@/lib/interfaces/tables';
import { FETCH_USERS_DATA_BY_ID, REGISTER_USERS_DATA } from '@/redux/actions/types';
import { NavigateFunction } from 'react-router-dom';
import { setSelectedUser } from '@/redux/slices/users';
interface IRegisterUsersAction {
  type: typeof REGISTER_USERS_DATA;
  payload: {
    employeeId: string;
    role: string;
    branches: string[];
    id?: string;
  };
  navigation: NavigateFunction;
}
function* fetchUsersDataByIdSaga(action?: IRegisterUsersAction) {
  try {
    const response: ApiResponse<IUserTable[]> = yield call(apiCaller, `/user/${action?.payload.id}`);
    if (response.data) {
      yield put(setSelectedUser(response.data[0]));
    } else if (response.error) {
      yield put(setError(response.error));
    }
  } catch (error) {
    console.error('Fetch data failed', error);
    yield put(setError('An unexpected error occurred'));
  }
}
export default function* watchFetchUserDataById() {
  yield takeEvery(FETCH_USERS_DATA_BY_ID, fetchUsersDataByIdSaga);
}
