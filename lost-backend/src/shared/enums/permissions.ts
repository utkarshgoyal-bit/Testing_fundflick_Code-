export enum PERMISSIONS {
  //organization
  ORGANIZATION_TAB = 'organization_tab',

  // General
  ORGANIZATIONS_ADMIN = 'organizations_admin',
  ORGANIZATIONS_TAB = 'organizations_tab',

  // Credit
  CREDIT_VIEW = 'credit_view',
  CREDIT_UPDATE = 'credit_update',

  // Dashboard
  LOS_DASHBOARD_VIEW = 'los_dashboard_view',
  COLLECTION_DASHBOARD_VIEW = 'collection_dashboard_view',
  DASHBOARD_VIEW_SELF = 'dashboard_view_self',

  // Employee
  EMPLOYEE_TAB = 'employee_tab',
  EMPLOYEE_VIEW = 'employee_view',
  EMPLOYEE_VIEW_SELF = 'employee_view_self',
  EMPLOYEE_VIEW_OTHERS = 'employee_view_others',
  EMPLOYEE_VIEW_BRANCH = 'employee_view_branch',
  EMPLOYEE_CREATE = 'employee_create',
  EMPLOYEE_UPDATE = 'employee_update',
  EMPLOYEE_BLOCK = 'employee_block',
  EMPLOYEE_UNBLOCK = 'employee_unblock',

  // User
  USER_TAB = 'user_tab',
  USER_VIEW = 'user_view',
  USER_VIEW_SELF = 'user_view_self',
  USER_VIEW_OTHERS = 'user_view_others',
  USER_VIEW_BRANCH = 'user_view_branch',
  USER_CREATE = 'user_create',
  USER_UPDATE = 'user_update',
  USER_DELETE = 'user_delete',
  USER_BLOCK = 'user_block',
  USER_UNBLOCK = 'user_unblock',

  // Branch
  BRANCH_TAB = 'branch_tab',
  BRANCH_VIEW = 'branch_view',
  BRANCH_VIEW_SELF = 'branch_view_self',
  BRANCH_VIEW_OTHERS = 'branch_view_others',
  BRANCH_CREATE = 'branch_create',
  BRANCH_UPDATE = 'branch_update',
  BRANCH_DELETE = 'branch_delete',
  BRANCH_BLOCK = 'branch_block',
  BRANCH_UNBLOCK = 'branch_unblock',

  // Telephone Questions
  TELEPHONE_QUESTION_TAB = 'telephone_question_tab',
  TELEPHONE_QUESTION_VIEW = 'telephone_question_view',
  TELEPHONE_QUESTION_VIEW_SELF = 'telephone_question_view_self',
  TELEPHONE_QUESTION_VIEW_OTHERS = 'telephone_question_view_others',
  TELEPHONE_QUESTION_CREATE = 'telephone_question_create',
  TELEPHONE_QUESTION_UPDATE = 'telephone_question_update',
  TELEPHONE_QUESTION_DELETE = 'telephone_question_delete',
  TELEPHONE_QUESTION_BLOCK = 'telephone_question_block',
  TELEPHONE_QUESTION_UNBLOCK = 'telephone_question_unblock',
  TELEPHONE_VERIFICATION = 'telephone_verification',

  // Customer Files
  CUSTOMER_FILE_TAB = 'customer_file_tab',
  CUSTOMER_FILE_VIEW = 'customer_file_view',
  CUSTOMER_FILE_VIEW_SELF = 'customer_file_view_self',
  CUSTOMER_FILE_VIEW_BRANCH = 'customer_file_view_branch',
  CUSTOMER_FILE_VIEW_OTHERS = 'customer_file_view_others',
  CUSTOMER_FILE_CREATE = 'customer_file_create',
  CUSTOMER_FILE_UPDATE = 'customer_file_update',
  CUSTOMER_FILE_UPDATE_AFTER_PENDING = 'customer_file_update_after_pending',
  CUSTOMER_FILE_STAGE_REPORT = 'customer_file_stage_report',
  CUSTOMER_FILE_FEES = 'customer_file_fees',
  CUSTOMER_FILE_COMMENT = 'customer_file_comment',
  CUSTOMER_FILE_VERIFY_STEP = 'customer_file_verify_step',
  CUSTOMER_FILE_BACK_OFFICE = 'customer_file_back_office',
  CUSTOMER_FILE_SEND_REVIEW = 'customer_file_send_review',
  CUSTOMER_FILE_TASK_PENDING = 'customer_file_task_pending',
  CUSTOMER_FILE_TASK_APPROVED = 'customer_file_task_approved',
  CUSTOMER_FILE_TASK_REJECTED = 'customer_file_task_rejected',
  CUSTOMER_APPROVED_FILE_EDIT = 'customer_approved_file_edit',
  CUSTOMER_APPROVED_FILE_VIEW = 'customer_approved_file_view',

  // Pendency
  PENDENCY_TAB = 'pendency_tab',
  PENDENCY_VIEW = 'pendency_view',
  PENDENCY_VIEW_SELF = 'pendency_view_self',
  PENDENCY_VIEW_OTHERS = 'pendency_view_others',
  PENDENCY_CREATE = 'pendency_create',
  PENDENCY_COMPLETE = 'pendency_complete',
  PENDENCY_REACTIVATE = 'pendency_reactivate',
  VERIFY_STEP = 'verify_step',
  PENDENCY_UPDATE = 'pendency_update',
  PENDENCY_DELETE = 'pendency_delete',

  // Task
  TASK_TAB = 'task_tab',
  TASK_VIEW = 'task_view',
  TASK_VIEW_SELF = 'task_view_self',
  TASK_CREATE = 'task_create',
  TASK_UPDATE = 'task_update',
  TASK_DELETE = 'task_delete',
  TASK_BLOCK = 'task_block',
  TASK_UNBLOCK = 'task_unblock',
  TASK_COMMENT = 'task_comment',
  TASK_REPEAT = 'task_repeat',

  // Collection
  COLLECTION_TAB = 'collection_tab',
  COLLECTION_VIEW = 'collection_view',
  COLLECTION_VIEW_SELF = 'collection_view_self',
  COLLECTION_VIEW_ASSIGNED = 'collection_view_assigned',
  COLLECTION_VIEW_AREA = 'collection_view_area',
  COLLECTION_VIEW_OTHER = 'collection_view_others',

  COLLECTION_UPDATE_LOCATION = 'collection_update_location',
  COLLECTION_EXPORT_CASES = 'collection_export_cases',
  COLLECTION_UPLOAD = 'collection_upload',
  COLLECTION_FOLLOWUP = 'collection_followup',
  COLLECTION_PAYMENT = 'collection_payment',
  COLLECTION_ASSIGN_CASE = 'collection_assign_case',
  COLLECTION_UNASSIGN_CASE = 'collection_unassign_case',

  COLLECTION_VIEW_DAILY = 'collection_view_daily',
  COLLECTION_VIEW_DAILY_PAYMENTS = 'collection_view_daily_payments',
  COLLECTION_VIEW_DAILY_PAYMENTS_BRANCH = 'collection_view_daily_payments_branch',
  COLLECTION_VIEW_DAILY_PAYMENTS_ASSIGNED = 'collection_view_daily_payments_assigned',
  COLLECTION_VIEW_DAILY_PAYMENTS_OTHERS = 'collection_view_daily_payments_others',

  COLLECTION_VIEW_DAILY_FOLLOWUPS = 'collection_view_daily_followups',
  COLLECTION_VIEW_DAILY_FOLLOWUPS_BRANCH = 'collection_view_daily_followups_branch',
  COLLECTION_VIEW_DAILY_FOLLOWUPS_ASSIGNED = 'collection_view_daily_followups_assigned',
  COLLECTION_VIEW_DAILY_FOLLOWUPS_OTHERS = 'collection_view_daily_followups_others',

  COLLECTION_EXPORT_DATA = 'collection_export_data',
  COLLECTION_BLOCK = 'collection_block',
  COLLECTION_UNBLOCK = 'collection_unblock',
  COLLECTION_UPDATE_BRANCH = 'collection_update_branch',

  // Roles
  ROLE_VIEW = 'role_view',
  ROLE_CREATE = 'role_create',
  ROLE_UPDATE = 'role_update',
  ROLE_DELETE = 'role_delete',
}
