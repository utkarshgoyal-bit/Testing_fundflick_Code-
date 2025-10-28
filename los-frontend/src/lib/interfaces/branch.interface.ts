import { NavigateFunction } from 'react-router-dom';

export interface BranchesAction {
  type: string;
  payload: {
    branchName: string;
    parentBranch: string;
    isRoot: boolean;
    id: string;
  };
  navigation: NavigateFunction;
}
