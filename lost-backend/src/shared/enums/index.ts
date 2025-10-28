export const STATUS_CODE = {
  '200': 200,
  '201': 201,
  '400': 400,
  '401': 401,
  '500': 500,
  '403': 403,
  '404': 404,
  '406': 406,
};
export enum ROUTES {
  USER = '/user',
  AUTH = '/auth',
  CREDIT = '/credit',
  EMPLOYEE = '/employee',
  CUSTOMER_FILE = '/customer-file',
  SIGNED_URL = '/signed-url',
  IFSC = '/ifsc/:ifsc',
  OCR = '/ocr',
  LOGIN = '/login',
  LOGOUT = '/logout',
  FORGOT_PASSWORD = '/forgot-password',
  SIGNUP = '/signup',
  TASKS = '/tasks',
  PENDENCY = '/pendency',
  RESET_PASSWORD = '/reset-password',
  ROLE = '/role',
  BRANCH = '/branch',
  TELEPHONE_QUESTIONS = '/question',
  SUPERADMIN = '/superadmin',
  DEACTIVATE_USER = '/deactivate-user',
  REACTIVATE_USER = '/reactivate-user',
  DASHBOARD = '/dashboard',
  COLLECTION = '/collection',
  ORGANIZATION = '/organization',
}

export enum COMPONENTS {
  LOGIN = 'Login ',
  SIGNUP = 'Signup ',
  USER = 'User ',
  ROLE = 'Role ',
  BRANCH = 'Branch ',
  TELEPHONE_QUESTION = 'Telephone Question ',
}

export enum ERROR {
  NOT_FOUND = 'Not Found',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  INVALID_OPERATION = 'Invalid Operation please refresh and try again',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  INVALID_CREDENTIALS = 'Invalid Credentials',
  USER_ALREADY_EXISTS = 'User Already Exists',
  AADHAAR_ALREADY_EXISTS = 'Aadhaar Number Already Exists',
  ALREADY_EXISTS = 'Already Exists',
  USER_NOT_FOUND = 'User Not Found',
  USER_DEACTIVATED = 'User Deactivated',
  INVALID_TOKEN = 'Invalid Token',
  INVALID_PASSWORD = 'Invalid Password',
  INVALID_USER = 'Invalid User',
  INVALID_ROLE = "You don't have access to perform this action",
  INVALID_BRANCH = 'Invalid Branch',
  INVALID_USER_ROLE = 'Invalid User Role',
  PASSWORD_CANNOT_BE_EMPTY = 'Password field cannot be empty',
  USER_CANNOT_BE_CREATED = 'User cannot be created',
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_ALREADY_EXISTS = 'Email Already Exists',
}
export enum SUCCESS {
  RECEIVED_LEDGER_BALANCE = 'Received Ledger Balance',
  CREATED = 'Created Successfully',
  UPDATED = 'Updated Successfully',
  DELETED = 'Deleted Successfully',
  FETCHED = 'Fetched Successfully',
  USER_LOGIN = 'User Login Successfully',
  USER_LOGOUT = 'User Logout Successfully',
  USER_RESET_PASSWORD = 'User Reset Password Successfully',
  LOGIN_SUCCESS = 'Login Successfully',
  USER_DEACTIVATED = 'User Deactivated Successfully',
  USER_REACTIVATED = 'User Reactivated Successfully',
  USER_UPDATED = 'User Updated Successfully',
  USER_DELETED = 'User Deleted Successfully',
  USER_NOT_FOUND = 'User Not Found',
  ROLE_FETCHED = 'Role Fetched Successfully',
  BLOCKED = 'Blocked Successfully',
  UNBLOCKED = 'Unblocked Successfully',
}
export enum ROLES {
  CLUSTER_HEAD = 'Cluster Head',
  BRANCH_MANAGER = 'Branch Manager',
  SUPERADMIN = 'Super Admin',
  SALES_MAN = 'Sales Man',
  BACKOFFICER = 'Back Officer',
  COLLECTION = 'Collection',
  COLLECTION_HEAD = 'Collection Head',
  TELECALLER = 'Telecaller',
}

export enum STEPS_NAMES {
  CUSTOMER = 'Customer',
  ADDRESS = 'Address',
  ASSOCIATE = 'Associate',
  INCOME = 'Income',
  LIABILITY = 'Liability',
  COLLATERAL = 'Collateral',
  BANK = 'Bank',
  PHOTOS = 'Photos',
  END = 'End',
}

export enum CURRENCY_SYMBOLS {
  INR = '₹',
  DOLLAR = '$',
  EURO = '€',
}
export enum PAYMENT_MODE {
  CASH = 'cash',
  ONLINE = 'online',
  NEFT = 'neft',
  IMPS = 'imps',
}

export const ORGANIZATION_STATUS = ['ACTIVE', 'DELETED', 'PENDING', 'BLOCKED'];
export enum STATUS {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}
export enum COMMIT_STATUS_ORDER {
  expired = 1,
  pending = 2,
  fulfilled = 3,
}
