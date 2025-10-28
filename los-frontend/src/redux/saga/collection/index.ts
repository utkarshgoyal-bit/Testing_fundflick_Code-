import { watchCaseCollectionSaga } from './case/caseLocation.saga';
import { watchCreateCaseRemark } from './case/createCaseRemark.saga';
import { watchdeleteRemarkSaga } from './case/deleteCaseRemark.saga';
import { watchUnassignCaseSaga } from './case/unassignCase.saga';
import { watchUserAssignCaseSaga } from './case/userAssignCase.saga';
import { watchEXportCaseSaga } from './exportCase.saga';
import { watchFetchCasesaga } from './fetchCase.saga';
import { watchFetchCollectionSaga } from './fetchcollection.saga';
import { watchFetchCollectionViewSaga } from './fetchCollectionView.saga';
import { watchFetchFollowUpByView } from './fetchFollowUpByView.saga';
import { watchUpdateBranchSaga } from './updateBranch.saga';
import { watchUpdateCaseContactNoSaga } from './updateCaseContactNo.saga';
import { watchUploadCollectionSaga } from './uploadCollection.saga';
import { watchCollectionDashboardReportsSaga } from './collectionDashboardReports.saga';
import { watchFlagCaseSaga } from './flagCase.saga';
export {
  watchCaseCollectionSaga,
  watchCreateCaseRemark,
  watchdeleteRemarkSaga,
  watchUnassignCaseSaga,
  watchUserAssignCaseSaga,
  watchFetchCasesaga,
  watchFetchCollectionSaga,
  watchFetchCollectionViewSaga,
  watchFetchFollowUpByView,
  watchEXportCaseSaga,
  watchUpdateBranchSaga,
  watchUpdateCaseContactNoSaga,
  watchUploadCollectionSaga,
  watchCollectionDashboardReportsSaga,
  watchFlagCaseSaga,
};
