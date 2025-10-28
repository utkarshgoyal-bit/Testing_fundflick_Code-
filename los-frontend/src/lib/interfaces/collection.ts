import { UPDATE_BRANCH_REQUEST } from "@/redux/actions/types";

export interface IUpdateBranchAction {
  type: typeof UPDATE_BRANCH_REQUEST;
  payload: { caseNo: string; newBranch: string };
}