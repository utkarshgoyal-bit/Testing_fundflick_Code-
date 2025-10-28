/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ColumnDef,
  ColumnPinningState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { NavigateFunction } from "react-router-dom";

export interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  total: number;
  tableView?: VisibilityState;
  page: number;
  handlePageChange: (page: number) => void;
  sort?: SortingState;
  handleSortingChange?: (sort: SortingState) => void;
  rowSelection?: any;
  handleRowSelection?: (row: any) => void;
  pinnedColumns?: ColumnPinningState;
  customFooter?: any;
  getRowClass?:(row: TData) => string;
}

export interface ISagaProps {
  type: string;
  payload: { [key: string]: unknown };
  navigation?: NavigateFunction;
}
