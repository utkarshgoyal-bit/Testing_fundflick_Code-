import { PERMISSIONS } from '@/helpers/permissions';
import { APP_MODULES, COLLECTION_ROUTES, LOAN_MANAGEMENT_ROUTES, PROTECTED_ROUTES, ROLES_ENUM } from '@/lib/enums';
import { BranchForm } from '@/pages/branches/form';
import { EmployeeForm } from '@/pages/employee/form';
import CustomerDetailPage from '@/pages/files/view';
import OrganizationAdmin from '@/pages/organizationAdmin';
import { OrganizationForm } from '@/pages/organizationAdmin/form';
import Roles from '@/pages/roles';
import Client from '@/pages/task/clientService';
import AddClient from '@/pages/task/clientService/addClient';
import TaskDashboard from '@/pages/task/dashboard';
import TaskManager from '@/pages/task/taskManager';
import ManageTasks from '@/pages/task/taskManager/manageTasks';
import TelManagement from '@/pages/teleQuestions';
import { QuestionForm } from '@/pages/teleQuestions/form';
import { UserForm } from '@/pages/users/form';

import {
  BadgePercent,
  ChartColumnIncreasing,
  CopyCheck,
  Key,
  Layers,
  ListTodo,
  Phone,
  Plus,
  Split,
  UserCog,
  Users,
  MonitorCog,
  Building,
} from 'lucide-react';
import { lazy } from 'react';
import { MdCollections } from 'react-icons/md';
const CollectionDashboard = lazy(() => import('@/pages/collection/dashboard'));
const Credit = lazy(() => import('@/pages/files/credit'));
const BackOffice = lazy(() => import('@/pages/files/backOffice'));
const Paymentuserdata = lazy(() => import('@/pages/collection/DailyView/paymentuserdata'));
const Reports = lazy(() => import('@/pages/collection/reports/index').then((module) => ({ default: module.Reports })));
const LoanDetailsPage = lazy(() => import('@/pages/collection/loanDetails'));
const DailyView = lazy(() => import('@/pages/collection/DailyView'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const UserManagement = lazy(() => import('@/pages/users'));
const EmployeeManagement = lazy(() => import('@/pages/employee'));
const BranchManagement = lazy(() => import('@/pages/branches'));
const CustomerManagement = lazy(() => import('@/pages/files'));
const ProfilePage = lazy(() => import('@/pages/profile'));
const FileSteps = lazy(() => import('@/pages/files/steps'));
const Home = lazy(() => import('@/pages/collection/main'));
const PaymentDetails = lazy(() => import('@/pages/collection/PaymentDetails'));
const FollowUp = lazy(() => import('@/pages/collection/FollowUp'));
const LoanManagementSystem = lazy(() => import('@/pages/loanManangementSystem/'));
const FileDetails = lazy(() => import('@/pages/loanManangementSystem/FileDetails'));
const OrganizationConfig = lazy(() => import('@/pages/organizationConfig'));

const protectedRoutes = [
  {
    path: PROTECTED_ROUTES.ORGANIZATION_ADMIN,
    label: 'Organizations',
    icon: <Building size={19} />,
    group: 'organization',
    module: APP_MODULES.ORGANIZATION,
    permissionName: PERMISSIONS.ORGANIZATIONS_TAB,
    children: [
      {
        path: '',
        element: <OrganizationAdmin />,
        label: 'Organizations',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'create',
        element: <OrganizationForm />,
        label: 'Create Organization',
        icon: <Plus size={19} />,
      },
    ],
  },
  {
    path: PROTECTED_ROUTES.ORGANIZATION_CONFIG,
    label: 'OCM',
    icon: <MonitorCog size={19} />,
    group: 'organization',
    module: APP_MODULES.ORGANIZATION,
    permissionName: PERMISSIONS.ORGANIZATIONS_CONFIG,
    children: [
      {
        path: '',
        element: <OrganizationConfig />,
        label: 'Organizations',
        icon: <BadgePercent size={19} />,
      },
    ],
  },

  {
    path: PROTECTED_ROUTES.PROFILE,
    element: <ProfilePage />,
    label: 'Profile',
    group: 'common',
    module: APP_MODULES.COMMON,
    icon: <UserCog size={19} />,
    permissionName: ROLES_ENUM.ALL,
  },
  {
    path: PROTECTED_ROUTES.ROLES,
    element: <Roles />,
    label: 'Roles',
    group: 'admin',
    module: APP_MODULES.ADMIN,
    icon: <Key size={19} />,
    permissionName: ROLES_ENUM.SUPERADMIN,
  },
  {
    path: PROTECTED_ROUTES.EMPLOYEE_MANAGEMENT,
    label: 'Employees',
    group: 'admin',
    module: APP_MODULES.ADMIN,
    icon: <Layers size={19} />,
    children: [
      {
        path: '',
        element: <EmployeeManagement />,
        label: 'Employees Management',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'register',
        element: <EmployeeForm />,
        label: 'Employees',
        icon: <BadgePercent size={19} />,
      },
    ],
    permissionName: PERMISSIONS.EMPLOYEE_TAB,
  },
  {
    path: PROTECTED_ROUTES.USER_MANAGEMENT,
    label: 'Users',
    group: 'admin',
    module: APP_MODULES.ADMIN,
    icon: <Users size={19} />,
    children: [
      {
        path: '',
        element: <UserManagement />,
        label: 'Users',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'register',
        element: <UserForm />,
        label: 'Users',
        icon: <BadgePercent size={19} />,
      },
    ],
    permissionName: PERMISSIONS.USER_TAB,
  },
  {
    path: PROTECTED_ROUTES.TELEPHONE_MANAGEMENT,
    label: 'Telephone Questions',
    group: 'los',
    module: APP_MODULES.LOS,
    icon: <Phone size={19} />,
    children: [
      {
        path: '',
        element: <TelManagement />,
        label: 'Telephone Questions',
        icon: <Phone size={19} />,
      },
      {
        path: 'create',
        element: <QuestionForm />,
        label: 'Users',
        icon: <Phone size={19} />,
      },
    ],
    permissionName: PERMISSIONS.TELEPHONE_QUESTION_TAB,
  },
  {
    path: PROTECTED_ROUTES.DASHBOARD,
    element: <Dashboard />,
    label: 'Dashboard',
    icon: <ChartColumnIncreasing size={19} />,
    group: 'los',
    module: APP_MODULES.LOS,
    permissionName: PERMISSIONS.LOS_DASHBOARD_VIEW,
  },
  {
    path: PROTECTED_ROUTES.CUSTOMER_FILE_MANAGEMENT,
    label: 'Customer Files',
    group: 'los',
    module: APP_MODULES.LOS,
    icon: <CopyCheck size={19} />,
    children: [
      {
        path: '',
        element: <CustomerManagement />,
        label: 'Customer Files',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'register',
        element: <FileSteps />,
        label: 'Customer Files',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'view',
        element: <CustomerDetailPage />,
        label: 'Customer Files',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'credit',
        element: <Credit />,
        label: 'Credit',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'back_office',
        element: <BackOffice />,
        label: 'Back Office',
        icon: <BadgePercent size={19} />,
      },
    ],

    permissionName: PERMISSIONS.CUSTOMER_FILE_TAB,
  },
  {
    path: PROTECTED_ROUTES.BRANCH_MANAGEMENT,
    label: 'Branches',
    group: 'admin',
    module: APP_MODULES.ADMIN,
    icon: <Split size={19} />,
    children: [
      {
        path: '',
        element: <BranchManagement />,
        label: 'Branches',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'register',
        element: <BranchForm />,
        label: 'Branches',
        icon: <BadgePercent size={19} />,
      },
    ],
    permissionName: PERMISSIONS.BRANCH_TAB,
  },

  {
    path: PROTECTED_ROUTES.COLLECTION_DASHBOARD,
    element: <CollectionDashboard />,
    label: 'Dashboard',
    icon: <ChartColumnIncreasing size={19} />,
    group: 'collection',
    module: APP_MODULES.COLLECTION,
    permissionName: PERMISSIONS.COLLECTION_DASHBOARD_VIEW,
  },
  {
    path: LOAN_MANAGEMENT_ROUTES.LOAN_MANAGEMENT,
    label: 'Dashboard',
    icon: <ChartColumnIncreasing size={19} />,
    group: 'lms',
    module: APP_MODULES.LMS,
    permissionName: PERMISSIONS.LMS_DASHBOARD_VIEW,
    children: [
      {
        path: '',
        element: <LoanManagementSystem />,
        label: 'Home',
        icon: <BadgePercent size={19} />,
      },
      {
        path: LOAN_MANAGEMENT_ROUTES.FILE_DETAILS,
        element: <FileDetails />,
        label: 'File Details',
        icon: <BadgePercent size={19} />,
      },
    ],
  },
  {
    path: COLLECTION_ROUTES.COLLECTION_PATH,
    label: 'Collection',
    group: 'collection',
    module: APP_MODULES.COLLECTION,
    icon: <MdCollections size={19} />,
    children: [
      {
        path: '',
        element: <Home />,
        label: 'Home',
        icon: <BadgePercent size={19} />,
      },
      {
        path: COLLECTION_ROUTES.REPORTS,
        element: <Reports />,
        label: 'Reports',
        icon: <BadgePercent size={19} />,
      },
      {
        path: COLLECTION_ROUTES.DAILY_VIEW,
        element: <DailyView />,
        label: 'Collection ',
        icon: <BadgePercent size={19} />,
      },
      {
        path: COLLECTION_ROUTES.COLLECTION,
        element: <PaymentDetails />,
        label: 'Collection Details',
        icon: <BadgePercent size={19} />,
      },
      {
        path: COLLECTION_ROUTES.FOLLOWUP,
        element: <FollowUp />,
        label: 'Follow Up',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'loan-details/:caseNo',
        element: <LoanDetailsPage />,
        label: 'Loan Details',
        icon: <BadgePercent size={19} />,
      },
      {
        path: COLLECTION_ROUTES.USER_FETCH_FOLLOW_DATA,
        element: <Paymentuserdata />,
        label: 'User Details',
        icon: <BadgePercent size={19} />,
      },
    ],
    permissionName: PERMISSIONS.COLLECTION_TAB,
  },
  {
    path: PROTECTED_ROUTES.TASK_MANAGEMENT_DASHBOARD,
    label: 'Dashboard',
    group: 'task',
    module: APP_MODULES.TASK,
    icon: <ChartColumnIncreasing size={19} />,
    permissionName: PERMISSIONS.TASK_TAB,
    element: <TaskDashboard />,
  },
  {
    path: PROTECTED_ROUTES.TASK_MANAGEMENT,
    label: 'Tasks',
    group: 'task',
    module: APP_MODULES.TASK,
    icon: <ListTodo size={19} />,
    permissionName: PERMISSIONS.TASK_TAB,
    children: [
      {
        path: '',
        element: <TaskManager />,
        label: 'Task Manager',
        icon: <ListTodo size={19} />,
      },
    ],
  },

  {
    path: 'task-management/manage-tasks',
    element: <ManageTasks />,
    label: 'Manage Tasks',
    group: 'hidden',
    module: APP_MODULES.TASK,
    permissionName: PERMISSIONS.TASK_TAB,
  },
  {
    path: 'service-client',
    label: 'Client',
    icon: <BadgePercent size={19} />,
    group: 'task',
    module: APP_MODULES.TASK,
    permissionName: PERMISSIONS.CLIENT_TAB,
    children: [
      {
        path: '',
        element: <Client />,
        label: 'Client',
        icon: <BadgePercent size={19} />,
      },
      {
        path: 'addClient',
        element: <AddClient />,
        label: 'Add Client',
        icon: <BadgePercent size={19} />,
        hidden: true,
      },
    ],
  },
];

export default protectedRoutes;
