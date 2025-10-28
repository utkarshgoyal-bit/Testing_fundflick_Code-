import { NavigateFunction } from "react-router-dom";
export interface ICreateQuestionsAction {
  type: string;
  payload: {
    id?: string;
    question?: string;
    description?: string;
    silent?: boolean;
  };
  navigation: NavigateFunction;
}
