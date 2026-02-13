import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, title, message, relatedId, relatedModel }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

export const deleteNotificationsByRelatedId = async (relatedId) => {
  try {
    await Notification.deleteMany({ relatedId });
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
};
