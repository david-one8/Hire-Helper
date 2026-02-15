import { Clerk } from '@clerk/clerk-sdk-node';

let clerkInstance = null;

const getClerk = () => {
  if (!clerkInstance) {
    clerkInstance = Clerk({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }
  return clerkInstance;
};

export const verifyClerkToken = async (token) => {
  try {
    const payload = await getClerk().verifyToken(token);
    return payload;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
};

export const getClerkUser = async (userId) => {
  try {
    const user = await getClerk().users.getUser(userId);
    return user;
  } catch (error) {
    throw new Error('User not found');
  }
};

export default getClerk;
