import apiCaller from '@/helpers/apiHelper';
import { setError } from '@/redux/slices/collection/uplodefileSlice';
import { setLoading } from '@/redux/slices/publicSlice';
import { RootState } from '@/redux/store';
import { UPLOAD_COLLECTION } from '@/redux/store/actionTypes';
// } from "@/redux/actions/types";
import { FETCH_COLLECTION } from '@/redux/actions/types';
import { toast } from 'react-toastify';
import { call, put, select, takeEvery } from 'redux-saga/effects';

function* uploadCollectionSaga(action: any): Generator<any, void, any> {
  yield put(setLoading({ loading: true }));
  const activeUploadSection = yield select((state: RootState) => state.collectionData.activeUploadSection);
  try {
    const formData = new FormData();
    formData.append('excelFile', action.payload.file);
    formData.append('fileType', activeUploadSection);

    const response = yield call(
      apiCaller,
      '/collection/upload',
      'POST',
      formData,
      true,
      {
        pending: 'Uploading file...',
        success: 'File uploaded successfully',
        error: 'Failed to upload file',
      },
      {
        'Content-Type': 'multipart/form-data',
      }
    );

    if (response?.data?.success) {
      yield put({ type: FETCH_COLLECTION });
    } else {
      toast.error(response.data?.message || 'File upload failed!');
    }
  } catch (error) {
    console.error('An error occurred while uploading the file', error);
    yield put(setError('An error occurred while uploading the file.'));
  } finally {
    yield put(setLoading({ loading: false }));
  }
}

export function* watchUploadCollectionSaga() {
  yield takeEvery(UPLOAD_COLLECTION, uploadCollectionSaga);
}
