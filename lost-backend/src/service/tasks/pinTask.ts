import { Types } from 'mongoose';
import { LoginUser } from '../../interfaces';
import { UserSchema } from '../../schema';
import { ERROR } from '../../shared/enums';

export default async function pinTask({
  loginUser,
  taskId,
}: {
  loginUser: LoginUser;
  taskId: string;
}) {
  const usersPinnedTask = await UserSchema.findOne({
    employeeId: new Types.ObjectId(loginUser.employeeId),
  });
  if (!usersPinnedTask) {
    throw ERROR.USER_NOT_FOUND;
  }
  if (usersPinnedTask.pinnedTask.includes(new Types.ObjectId(taskId))) {
    usersPinnedTask.pinnedTask = usersPinnedTask.pinnedTask.filter(
      task => task.toString() !== taskId
    );
    await usersPinnedTask.save();
    return true;
  }

  if (usersPinnedTask.pinnedTask.length >= 3) {
    throw ERROR.PINNED_TASK_LIMIT;
  }

  usersPinnedTask.pinnedTask.push(new Types.ObjectId(taskId));
  await usersPinnedTask.save();
  return true;
}
