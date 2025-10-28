const enum PROTECTED_ROUTES {
  DASHBOARD = 'dashboard',
  COLLECTION_DASHBOARD = 'collection-dashboard',
  EMPLOYER = 'employer',
  TASK_MANAGEMENT = 'task-management',
  TASK_MANAGEMENT_DASHBOARD = 'task-management-dashboard',
  USER_MANAGEMENT = 'user-management',
  TELEPHONE_MANAGEMENT = 'telephone-management',
  EMPLOYEE_MANAGEMENT = 'employee-management',
  CUSTOMER_FILE_MANAGEMENT = 'customer-files-management',
  BRANCH_MANAGEMENT = 'branch-management',
  REGISTER = 'register',
  PROFILE = 'profile',
  ROLES = 'roles',
  ORGANIZATION_ADMIN = 'organization-admin',
  ORGANIZATION_CONFIG = 'organization-config',
}

const enum LOAN_MANAGEMENT_ROUTES {
  LOAN_MANAGEMENT = 'loan-management',
  FILE_DETAILS = 'file-details/:fileId',
}

const enum COLLECTION_ROUTES {
  COLLECTION_PATH = 'collection',
  COMPLETED_LOANS = 'completed-loans',
  COLLECTION = 'collection/:caseNo',
  FOLLOWUP = 'followUp/:caseNo',
  LOAN_DETAILS_PAGE = 'loan-details/:caseNo',
  DAILY_VIEW = 'daily-views',
  USER_FETCH_FOLLOW_DATA = 'userfollowdata/:userId',
  REPORTS = 'reports',
}

export { PROTECTED_ROUTES, COLLECTION_ROUTES, LOAN_MANAGEMENT_ROUTES };
