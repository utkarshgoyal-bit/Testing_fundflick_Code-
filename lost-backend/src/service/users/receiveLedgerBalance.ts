import { Types } from 'mongoose';
import UserSchema from '../../schema/auth';
const receiveLedgerBalance = async ({
  body,
  loginUser,
}: {
  body: {
    amount: number;
    _id: string;
  };
  loginUser: any;
}) => {
  const user = await UserSchema.findOne({
    _id: new Types.ObjectId(body._id),
    organizations: loginUser.organization._id,
  });
  if (user?.ledgerBalance && user?.ledgerBalance > 0 && user?.ledgerBalance >= body.amount) {
    user.ledgerBalance = user.ledgerBalance - body.amount;
    user.ledgerBalanceHistory.push({
      date: new Date(),
      ledgerBalance: body.amount,
      type: 'credit',
      remarks: `Rs. ${body.amount} received in organization balance`,
    });
    await user.save();
    return user;
  }
};

export default receiveLedgerBalance;
