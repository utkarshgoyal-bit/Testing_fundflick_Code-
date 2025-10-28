import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { IFSCCodeResponse } from '@/lib/interfaces/apisResponse.interface';
import { CUSTOMER_IFSC_VALIDATION } from '@/redux/actions/types';
import { setBankDetails, setError } from '@/redux/slices/files';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

function* FileIFSCSaga(action: any) {
  const { bankIFSCCode, index } = action.payload;
  try {
    const response: ApiResponse<IFSCCodeResponse> = yield call(apiCaller, `/ifsc/${bankIFSCCode}`, 'GET', {}, true, {
      error: ERROR_MESSAGE.UNEXPECTED,
      success: 'Bank details loaded successfully',
      pending: 'Fetching bank details...',
    });
    if (response instanceof AxiosError) throw response;
    const data = response.data;
    if (data) {
      yield put(
        setBankDetails({
          data: {
            bankName: data?.BANK,
            bankBranchLocation: data?.ADDRESS,
            city: data?.CITY,
            state: data?.STATE,
            district: data?.DISTRICT,
            bankIFSCCode: data?.IFSC,
          },
          index,
        })
      );
    }
  } catch (error) {
    console.error('Failed to fetch bank details:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  }
}

export default function* FileIFSC() {
  yield takeEvery(CUSTOMER_IFSC_VALIDATION, FileIFSCSaga);
}
