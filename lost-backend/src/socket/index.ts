import { Types } from 'mongoose';
import { io, onlineUsers } from '..';
import { default as Logger, default as logger } from '../lib/logger';
import NotificationModel from '../models/notification';

export default function setupSocketServer() {
  io.on('connection', socket => {
    socket.on(
      'join',
      async ({ userId, organization }: { userId: string; organization: string }) => {
        if (!userId || !userId.length) {
          return;
        }
        onlineUsers[userId] = socket.id;

        try {
          const notifications = await NotificationModel.find({
            employeeId: new Types.ObjectId(userId),
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
          { upsert: false, new: true }
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
