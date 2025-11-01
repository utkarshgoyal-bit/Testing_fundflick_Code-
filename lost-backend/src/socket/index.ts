import { Types } from 'mongoose';
import { io, onlineUsers } from '..';
import { default as Logger, default as logger } from '../lib/logger';
import NotificationModel from '../schema/notification';

export default function setupSocketServer() {
  io.on('connection', socket => {
    socket.on(
      'join',
      async ({ employeeId, organization }: { employeeId: string; organization: string }) => {
        if (!employeeId || !employeeId.length) {
          return;
        }
        onlineUsers[employeeId] = socket.id;

        try {
          const notifications = await NotificationModel.find({
            employeeId: new Types.ObjectId(employeeId),
            organization: new Types.ObjectId(organization),
          }).sort({ createdAt: -1 });
          socket.emit('getAllNotifications', notifications);
        } catch (error) {
          logger.error('error in getAllNotifications :', error);
        }
      }
    );

    socket.on('markAsRead', async ({ _id }: { _id: string }) => {
      try {
        await NotificationModel.updateOne(
          { _id: new Types.ObjectId(_id) },
          { $set: { readStatus: true } },
          { upsert: false }
        );
      } catch (error) {
        logger.error('error in markAsRead:', error);
      }
    });
    socket.on('disconnect', () => {
      Logger.info('A user disconnected:', socket.id);
      const email = Object.keys(onlineUsers).find(id => onlineUsers[id] === socket.id);
      if (email) {
        delete onlineUsers[email];
      }
    });
  });
}
