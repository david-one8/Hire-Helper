import { createContext, useContext } from 'react';

const UserSyncContext = createContext(false);

export const useUserSynced = () => useContext(UserSyncContext);

export default UserSyncContext;
