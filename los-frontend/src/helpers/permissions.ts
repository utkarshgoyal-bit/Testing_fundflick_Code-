export enum PERMISSIONS {
  // General
  ORGANIZATIONS_ADMIN = 'organizations_admin',
  ORGANIZATIONS_TAB = 'organizations_tab',
  ORGANIZATIONS_CONFIG = 'organizations_config',

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

  // Client
  CLIENT_TAB = 'client_tab',
  CLIENT_VIEW = 'client_view',
  CLIENT_CREATE = 'client_create',
  CLIENT_UPDATE = 'client_update',
  CLIENT_DELETE = 'client_delete',

  // Task For CA
  TASK_FOR_CA_TAB = 'task_for_ca_tab',
  TASK_FOR_CA_VIEW = 'task_for_ca_view',
  TASK_FOR_CA_CREATE = 'task_for_ca_create',
  TASK_FOR_CA_UPDATE = 'task_for_ca_update',
  TASK_FOR_CA_DELETE = 'task_for_ca_delete',

  // LMS
  LMS_DASHBOARD_VIEW = 'lms_dashboard_view',
}

type IPermissions = {
  [key: string]: object;
};

export const permissions: IPermissions = {
  LOS: {
    Dashboard: [{ key: PERMISSIONS.LOS_DASHBOARD_VIEW, label: 'View LOS Dashboard' }],
    TelephoneQuestions: [
      { key: PERMISSIONS.TELEPHONE_QUESTION_TAB, label: 'Access Telephone Questions Tab' },
      {
        key: PERMISSIONS.TELEPHONE_QUESTION_VIEW,
        label: 'View Telephone Questions',
        children: [
          { key: PERMISSIONS.TELEPHONE_QUESTION_VIEW_SELF, label: 'View Own Telephone Questions' },
          { key: PERMISSIONS.TELEPHONE_QUESTION_VIEW_OTHERS, label: "View Others' Telephone Questions" },
        ],
      },
      { key: PERMISSIONS.TELEPHONE_QUESTION_CREATE, label: 'Create Telephone Question' },
      { key: PERMISSIONS.TELEPHONE_QUESTION_UPDATE, label: 'Update Telephone Question' },
      { key: PERMISSIONS.TELEPHONE_QUESTION_DELETE, label: 'Delete Telephone Question' },
      { key: PERMISSIONS.TELEPHONE_QUESTION_BLOCK, label: 'Block Telephone Question' },
      { key: PERMISSIONS.TELEPHONE_QUESTION_UNBLOCK, label: 'Unblock Telephone Question' },
    ],
    CustomerFiles: [
      { key: PERMISSIONS.CUSTOMER_FILE_TAB, label: 'Access Customer Files Tab' },
      {
        key: PERMISSIONS.CUSTOMER_FILE_VIEW,
        label: 'View Customer Files',
        children: [
          { key: PERMISSIONS.CUSTOMER_FILE_VIEW_SELF, label: 'View Own Customer Files' },
          { key: PERMISSIONS.CUSTOMER_FILE_VIEW_BRANCH, label: "View Branch's Customer Files" },
          { key: PERMISSIONS.CUSTOMER_FILE_VIEW_OTHERS, label: "View Others' Customer Files" },
        ],
      },
      { key: PERMISSIONS.CUSTOMER_FILE_CREATE, label: 'Create Customer File' },
      { key: PERMISSIONS.CUSTOMER_FILE_UPDATE, label: 'Update Customer File' },
      { key: PERMISSIONS.CUSTOMER_FILE_VERIFY_STEP, label: 'Verify Customer File Step' },
      { key: PERMISSIONS.CUSTOMER_FILE_STAGE_REPORT, label: 'View Customer File Stage Report' },
      { key: PERMISSIONS.CUSTOMER_FILE_FEES, label: 'Manage Customer File Fees' },
      { key: PERMISSIONS.CUSTOMER_FILE_COMMENT, label: 'Comment on Customer File' },
      { key: PERMISSIONS.CUSTOMER_FILE_BACK_OFFICE, label: 'Access Customer File Back Office' },
      { key: PERMISSIONS.CUSTOMER_FILE_SEND_REVIEW, label: 'Send Customer File for Review' },
      { key: PERMISSIONS.CUSTOMER_FILE_TASK_PENDING, label: 'Mark Customer File as Pending' },
      { key: PERMISSIONS.CUSTOMER_FILE_TASK_APPROVED, label: 'Mark Customer File as Approved' },
      { key: PERMISSIONS.CUSTOMER_FILE_TASK_REJECTED, label: 'Mark Customer File as Rejected' },
      { key: PERMISSIONS.CREDIT_UPDATE, label: 'Update Credit Information' },
      { key: PERMISSIONS.CREDIT_VIEW, label: 'View Credit Information' },
    ],
    Pendencies: [
      { key: PERMISSIONS.PENDENCY_TAB, label: 'Access Pendency Tab' },
      {
        key: PERMISSIONS.PENDENCY_VIEW,
        label: 'View Pendencies',
        children: [
          { key: PERMISSIONS.PENDENCY_VIEW_SELF, label: 'View Own Pendencies' },
          { key: PERMISSIONS.PENDENCY_VIEW_OTHERS, label: "View Others' Pendencies" },
        ],
      },
      { key: PERMISSIONS.PENDENCY_CREATE, label: 'Create Pendency' },
      { key: PERMISSIONS.PENDENCY_COMPLETE, label: 'Complete Pendency' },
      { key: PERMISSIONS.PENDENCY_REACTIVATE, label: 'Reactivate Pendency' },
    ],
  },

  Admin: {
    Employees: [
      { key: PERMISSIONS.EMPLOYEE_TAB, label: 'Access Employee Tab' },
      {
        key: PERMISSIONS.EMPLOYEE_VIEW,
        label: 'View Employees',
      },
      { key: PERMISSIONS.EMPLOYEE_CREATE, label: 'Create Employee' },
      { key: PERMISSIONS.EMPLOYEE_UPDATE, label: 'Update Employee' },
      { key: PERMISSIONS.EMPLOYEE_BLOCK, label: 'Block Employee' },
      { key: PERMISSIONS.EMPLOYEE_UNBLOCK, label: 'Unblock Employee' },
    ],
    Users: [
      { key: PERMISSIONS.USER_TAB, label: 'Access User Tab' },
      {
        key: PERMISSIONS.USER_VIEW,
        label: 'View Users',
        children: [
          { key: PERMISSIONS.USER_VIEW_BRANCH, label: "View Branch's Users" },
          { key: PERMISSIONS.USER_VIEW_OTHERS, label: "View Others' Users" },
        ],
      },
      { key: PERMISSIONS.USER_CREATE, label: 'Create User' },
      { key: PERMISSIONS.USER_UPDATE, label: 'Update User' },
      { key: PERMISSIONS.USER_DELETE, label: 'Delete User' },
      { key: PERMISSIONS.USER_BLOCK, label: 'Block User' },
      { key: PERMISSIONS.USER_UNBLOCK, label: 'Unblock User' },
    ],
    Branches: [
      { key: PERMISSIONS.BRANCH_TAB, label: 'Access Branch Tab' },
      {
        key: PERMISSIONS.BRANCH_VIEW,
        label: 'View Branches',
      },
      { key: PERMISSIONS.BRANCH_CREATE, label: 'Create Branch' },
      { key: PERMISSIONS.BRANCH_UPDATE, label: 'Update Branch' },
      { key: PERMISSIONS.BRANCH_DELETE, label: 'Delete Branch' },
      { key: PERMISSIONS.BRANCH_BLOCK, label: 'Block Branch' },
      { key: PERMISSIONS.BRANCH_UNBLOCK, label: 'Unblock Branch' },
    ],
  },

  Tasks: [
    { key: PERMISSIONS.TASK_TAB, label: 'Access Task Tab' },
    { key: PERMISSIONS.TASK_VIEW, label: 'View Tasks' },
    { key: PERMISSIONS.TASK_CREATE, label: 'Create Task' },
    { key: PERMISSIONS.TASK_DELETE, label: 'Delete Task' },
    { key: PERMISSIONS.TASK_COMMENT, label: 'Comment on Task' },
    { key: PERMISSIONS.TASK_REPEAT, label: 'Repeat Task' },
  ],

  Collections: [
    { key: PERMISSIONS.COLLECTION_TAB, label: 'Access Collection Tab' },
    { key: PERMISSIONS.COLLECTION_DASHBOARD_VIEW, label: 'View Collection Dashboard' },
    {
      key: PERMISSIONS.COLLECTION_VIEW,
      label: 'View Collections',
      children: [
        { key: PERMISSIONS.COLLECTION_VIEW_ASSIGNED, label: 'View Assigned Collections' },
        { key: PERMISSIONS.COLLECTION_VIEW_AREA, label: 'View Collections by Area' },
        { key: PERMISSIONS.COLLECTION_VIEW_OTHER, label: 'View Other Collections' },
      ],
    },
    {
      key: PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS,
      label: 'View Daily Follow-ups',
      children: [
        { key: PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS_BRANCH, label: 'View Daily Follow-ups by Branch' },
        { key: PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS_ASSIGNED, label: 'View Daily Follow-ups (Assigned Only)' },
        { key: PERMISSIONS.COLLECTION_VIEW_DAILY_FOLLOWUPS_OTHERS, label: 'View Daily Follow-ups (Others Also)' },
      ],
    },
    {
      key: PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS,
      label: 'View Daily Payments',
      children: [
        { key: PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS_BRANCH, label: 'View Daily Payments by Branch' },
        { key: PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS_ASSIGNED, label: 'View Daily Payments (Assigned Only)' },
        { key: PERMISSIONS.COLLECTION_VIEW_DAILY_PAYMENTS_OTHERS, label: 'View Daily Payments (Others Also)' },
      ],
    },
    { key: PERMISSIONS.COLLECTION_VIEW_DAILY, label: 'View Daily Collections Tab' },
    { key: PERMISSIONS.COLLECTION_UPDATE_LOCATION, label: 'Update Case Location' },
    { key: PERMISSIONS.COLLECTION_EXPORT_CASES, label: 'Export Collection Cases' },
    { key: PERMISSIONS.COLLECTION_UPLOAD, label: 'Upload Collection Data' },
    { key: PERMISSIONS.COLLECTION_FOLLOWUP, label: 'Manage Collection Follow-ups' },
    { key: PERMISSIONS.COLLECTION_PAYMENT, label: 'Manage Collection Payments' },

    { key: PERMISSIONS.COLLECTION_EXPORT_DATA, label: 'Export Collection Data' },
    { key: PERMISSIONS.COLLECTION_BLOCK, label: 'Block Collection' },
    { key: PERMISSIONS.COLLECTION_UNBLOCK, label: 'Unblock Collection' },
    { key: PERMISSIONS.COLLECTION_UPDATE_BRANCH, label: 'Update Collection Branch' },
    { key: PERMISSIONS.COLLECTION_ASSIGN_CASE, label: 'Assign Collection Cases' },
    { key: PERMISSIONS.COLLECTION_UNASSIGN_CASE, label: 'Unassign Collection Cases' },
  ],
  Clients: [
    { key: PERMISSIONS.CLIENT_TAB, label: 'Access Client Tab' },
    { key: PERMISSIONS.CLIENT_VIEW, label: 'View Clients' },
    { key: PERMISSIONS.CLIENT_CREATE, label: 'Create Client' },
    { key: PERMISSIONS.CLIENT_UPDATE, label: 'Update Client' },
    { key: PERMISSIONS.CLIENT_DELETE, label: 'Delete Client' },
  ],
  TaskForCA: [
    { key: PERMISSIONS.TASK_FOR_CA_TAB, label: 'Access Task For CA Tab' },
    { key: PERMISSIONS.TASK_FOR_CA_VIEW, label: 'View Task For CA' },
    { key: PERMISSIONS.TASK_FOR_CA_CREATE, label: 'Create Task For CA' },
    { key: PERMISSIONS.TASK_FOR_CA_UPDATE, label: 'Update Task For CA' },
    { key: PERMISSIONS.TASK_FOR_CA_DELETE, label: 'Delete Task For CA' },
  ],
  Roles: [
    { key: PERMISSIONS.ROLE_CREATE, label: 'Role Create' },
    { key: PERMISSIONS.ROLE_DELETE, label: 'Role Delete' },
    { key: PERMISSIONS.ROLE_UPDATE, label: 'Role Update' },
    { key: PERMISSIONS.ROLE_VIEW, label: 'Role View' },
  ],
};

export const moduleWisePermissionsGroup = {
  Dashboard: 'LOS',
  CustomerFile: 'LOS',
  TelephoneQuestion: 'LOS',
  Pendency: 'LOS',
  Collection: 'COLLECTION',
  Task: 'TASK',
  User: 'ADMIN',
  Branch: 'ADMIN',
  Employee: 'ADMIN',
  Client: 'ADMIN',
  TaskForCA: 'ADMIN',
};
