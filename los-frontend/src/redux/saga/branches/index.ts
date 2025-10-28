import watchBlockBranches from './blockBranch.saga';
import watchDeleteBranchSaga from './deleteBranch.saga';
import watchEditBranches from './editBranch.saga';
import watchFetchBranchesDataById from './fetchBranchById.saga';
import watchFetchBranchesData from './fetchBranches.saga';
import watchRegisterBranches from './registerNewBranch.saga';
import watchUnlockBranches from './unblockBranch.saga';

export {
  watchBlockBranches,
  watchDeleteBranchSaga,
  watchEditBranches,
  watchFetchBranchesData,
  watchFetchBranchesDataById,
  watchRegisterBranches,
  watchUnlockBranches,
};
