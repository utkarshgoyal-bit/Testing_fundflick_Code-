import { Types } from 'mongoose';
import { firebaseMessaging } from '../firebase/firebaseAdmin';
import { default as Logger } from '../lib/logger';
import { UserSchema } from '../schema';
import NotificationModel from '../schema/notification';
import { ROLES } from '../shared/enums';

// Lazy imports to avoid circular dependency
let io: any;
let onlineUsers: any;

// Helper function to get socket dependencies at runtime
function getSocketDependencies() {
  if (!io || !onlineUsers) {
    const index = require('..');
    io = index.io;
    onlineUsers = index.onlineUsers;
  }
  return { io, onlineUsers };
}

interface Notification {
  creator: unknown;
  updater: {
    employeeId: string;
  };
  customerFileId: Types.ObjectId;
  message: {
    message: string;
    title: string;
  };
  loanApplicationNumber: number;
  organization: string;
}

export default async function CustomerFileStatusNotification({
  customerFileId,
  updater,
  creator,
  message,
  loanApplicationNumber,
  organization,
}: Notification) {
  try {
    const creatorUserBranch = await UserSchema.findOne({
      employeeId: creator,
      organization,
    }).populate('roleRef');
    const superAdmin = await UserSchema.findOne({ role: ROLES.SUPERADMIN, organization });

    const branchManagers = await UserSchema.find({
      branches: { $in: creatorUserBranch?.branches },
      roleRef: { $exists: true },
      organization,
    }).populate('roleRef');

    const receivers = [
      ...new Set([creatorUserBranch?.toObject(), ...branchManagers, superAdmin?.toObject()]),
    ];
    
    if (receivers.length > 0) {
      const { io: socketIO, onlineUsers: users } = getSocketDependencies();
      
      const notifications = await Promise.all(
        receivers.map(async receiver => {
          if (!receiver || receiver.employeeId.toString() === updater.employeeId) return null;

          if (receiver.fcmToken) {
            const messageData = {
              token: receiver.fcmToken || '',
              notification: {
                title: message.title,
                body: message.message,
              },
              android: {
                priority: 'high' as const,
                notification: {
                  sound: 'default',
                },
              },
              apns: {
                payload: {
                  aps: {
                    sound: 'default',
                  },
                },
              },
            };
            await firebaseMessaging
              .send(messageData)
              .then(response => {
                Logger.info('Successfully sent with response: ', response);
              })
              .catch(error => {
                Logger.error('Error sending message:', error);
              });
          }

          if (users[receiver.employeeId.toString()]) {
            socketIO.to(users[receiver.employeeId.toString()]).emit('notification', {
              user: new Types.ObjectId(receiver.employeeId),
              file: customerFileId,
              loanApplicationNumber,
              createdAt: new Date(),
              readStatus: false,
              ...message,
            });
          }

          return {
            employeeId: new Types.ObjectId(receiver.employeeId),
            file: customerFileId,
            loanApplicationNumber,
            organization,
            ...message,
          };
        })
      );
      await NotificationModel.insertMany(
        notifications.filter(notification => notification !== undefined)
      );
      return;
    }
  } catch (error) {
    Logger.error('error', error);
  }
}

export async function TasksUpdateNotification({
  message,
  users: userIds,
  loanApplicationNumber,
  organization,
}: {
  message: {
    message: string;
    title: string;
    taskId?: string | number;
  };
  users: (string | Types.ObjectId)[];
  loanApplicationNumber?: number | null;
  organization: string;
}) {
  try {
    const { io: socketIO, onlineUsers: users } = getSocketDependencies();
    const uniqueUsers = Array.from(new Set(userIds));
    
    for (const user of uniqueUsers) {
      const employeeId = typeof user === 'string' ? new Types.ObjectId(user) : user;
      const socketId = users[employeeId.toString()];
      
      if (socketId) {
        socketIO.to(socketId).emit('notification', {
          employeeId: employeeId,
          createdAt: new Date(),
          readStatus: false,
          loanApplicationNumber,
          ...message,
        });
      }

      await NotificationModel.create({
        employeeId: employeeId,
        createdAt: new Date(),
        readStatus: false,
        loanApplicationNumber,
        organization,
        ...message,
      });
    }
  } catch (error) {
    Logger.error('Notification error:', error);
  }
}
