import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const verifyClerkToken = async (token) => {
  try {
    const session = await clerk.sessions.verifySession(token);
    return session;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
};

export const getClerkUser = async (userId) => {
  try {
    const user = await clerk.users.getUser(userId);
    return user;
  } catch (error) {
    throw new Error('User not found');
  }
};

export default clerk;
