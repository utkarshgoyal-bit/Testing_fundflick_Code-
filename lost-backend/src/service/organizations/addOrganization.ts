import moment from 'moment-timezone';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '../../helper/encrypt';
import { LoginUser } from '../../interfaces';
import { EmployeeSchema, UserSchema } from '../../schema';
import OrganizationSchema from '../../schema/organization';
import { ERROR, ROLES, STATUS } from '../../shared/enums';
export const generateUniqueOrgId = async (name: string): Promise<string> => {
  const baseId = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s_-]+|[\s_]+/g, match => (match.match(/[\s_]+/) ? '-' : ''));

  const isBaseIdTaken = await OrganizationSchema.exists({ id: baseId });
  if (!isBaseIdTaken) return baseId;

  const regex = new RegExp(`^${baseId}-(\\d+)$`);
  const existingOrgs = await OrganizationSchema.find({ id: regex }, { id: 1 })
    .sort({ id: -1 })
    .limit(1);

  if (!existingOrgs.length) return `${baseId}-1`;

  const lastSuffix = parseInt(existingOrgs[0].id.split('-').pop() || '0', 10);
  return `${baseId}-${lastSuffix + 1}`;
};

const addOrganization = async ({
  data,
  loginUser,
}: {
  data: {
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    addressLine1?: string;
    country?: string;
    state?: string;
    mobile?: string;
    status: STATUS;
    modules: string[];
    dob?: number;
  };
  loginUser: LoginUser;
}) => {
  if (!data.name || !data.email) throw ERROR.BAD_REQUEST;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingEmployee = await EmployeeSchema.findOne({ email: data.email }, null, { session });
    if (existingEmployee) throw ERROR.EMAIL_ALREADY_EXISTS;
    const organizationId = await generateUniqueOrgId(data.name);
    const organizationPayload = {
      id: organizationId,
      name: data.name,
      status: data.status,
      modules: data.modules,
      isActive: data.status === STATUS.ACTIVE,
      createdBy: loginUser.employeeId,
      email: data.email,
    };

    const organization = await OrganizationSchema.create([organizationPayload], { session });

    const employeePayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      eId: uuidv4(),
      email: data.email,
      organization: organization[0]._id,
      createdBy: loginUser.employeeId,
      role: ROLES.SUPERADMIN,
      sex: 'Other',
      dob: data.dob ? moment(data.dob).unix() : null,
      maritalStatus: 'Single',
      addressLine1: data.addressLine1,
      country: data.country,
      state: data.state,
      mobile: data.mobile,
      joiningDate: moment().unix(),
    };

    const [employee] = await EmployeeSchema.create([employeePayload], {
      session,
    });

    const userPayload = {
      employeeId: employee._id,
      password: await encrypt(process.env.DEFAULT_PASSWORD || 'OrgAdmin@123'),
      role: ROLES.SUPERADMIN,
      organizations: [organization[0]._id],
      isActive: true,
      createdBy: loginUser.employeeId,
    };

    await UserSchema.create([userPayload], { session });

    await session.commitTransaction();
    session.endSession();

    return organization[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export default addOrganization;
