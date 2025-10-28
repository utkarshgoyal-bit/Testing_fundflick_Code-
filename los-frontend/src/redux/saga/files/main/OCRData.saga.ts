import apiCaller, { ApiResponse } from '@/helpers/apiHelper';
import { ERROR_MESSAGE } from '@/lib/enums';
import { OCR_DATA } from '@/redux/actions/types';
import { setError, setStepsData } from '@/redux/slices/files';
import { setLoading } from '@/redux/slices/publicSlice';
import { call, put, takeEvery } from 'redux-saga/effects';

function* OCRDataSaga(action: any) {
  yield put(setLoading({ loading: true }));
  const { payload } = action;

  // Create a FormData object
  const formData = new FormData();

  // Assuming payload contains the file, append the file to FormData
  formData.append('file', payload.file); // Replace 'file' with the actual key name

  try {
    // Make the API call with FormData
    const response: ApiResponse<{
      aadhaarNumber: string;
      dob: string;
    }> = yield call(
      apiCaller,
      '/ocr',
      'POST',
      formData,
      true,
      {
        pending: 'Getting aadhaar number and dob ...',
        success: 'Data fetched successfully',
        error: 'Failed to save data',
      },
      {
        'Content-Type': 'multipart/form-data', // Ensure this header is correct
      }
    );
    console.log(response);
    if (response.data) {
      yield put(
        setStepsData({
          aadhaarNumber: response.data?.aadhaarNumber.split(' ').join('-'),
          dob: response.data.dob,
        })
      );
    }
  } catch (error) {
    console.error('Data submission failed:', error);
    yield put(setError(ERROR_MESSAGE.UNEXPECTED));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export default function* OCRData() {
  yield takeEvery(OCR_DATA, OCRDataSaga);
}
