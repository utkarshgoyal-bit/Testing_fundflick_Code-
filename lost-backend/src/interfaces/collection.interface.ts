export interface CollectionFilters {
  search?: string;
  dueEmi?:
    | string
    | {
        start?: number;
        end?: number;
      };
  branch: string;
  dueEmiAmount?: {
    start?: number;
    end?: number;
  };
  loanType: string;
  customer: string;
  lastPaymentDetail: {
    start?: number;
    end?: number;
  };
}
export interface GetCollectionCaseQuery {
  page: number;
  limit: number;
  includeFullyPaidCollection?: string;
  filters?: CollectionFilters | string;
  sort?: string;
  search?: string;
}
