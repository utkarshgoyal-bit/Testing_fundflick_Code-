import { NavigateFunction } from 'react-router-dom';

export interface EmployeesAction {
  type: string;
  payload: {
    employeeName: string;
    role: string;
    branches: string[];
  };
  navigation: NavigateFunction;
}
