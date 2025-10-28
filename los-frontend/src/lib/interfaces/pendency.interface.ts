import { NavigateFunction } from "react-router-dom";

export interface PendencyAction {
  type: string;
  payload: {
    taskName: string;
    title: string;
    description: string;
    fileId: number;
  };
  navigation: NavigateFunction;
}
