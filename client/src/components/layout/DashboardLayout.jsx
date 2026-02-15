import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import api from '@services/api';
import UserSyncContext from '@context/UserSyncContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userSynced, setUserSynced] = useState(false);
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const hasSynced = useRef(false);

  // Sync Clerk user to backend database on first load
  useEffect(() => {
    const syncUserToBackend = async () => {
      if (!isSignedIn || !user || hasSynced.current) return;
      try {
        const token = await getToken();
        if (!token) return;
        await api.syncUser(
          {
            clerkId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmailAddress?.emailAddress,
            profilePicture: user.imageUrl,
          },
          token
        );
        hasSynced.current = true;
        setUserSynced(true);
      } catch (err) {
        // Even if sync fails (e.g., user already exists), mark as synced
        // so the rest of the app can proceed with API calls
        hasSynced.current = true;
        setUserSynced(true);
        console.error('Failed to sync user:', err);
      }
    };
    syncUserToBackend();
  }, [isSignedIn, user, getToken]);

  return (
    <UserSyncContext.Provider value={userSynced}>
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-950">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </UserSyncContext.Provider>
  );
};

export default DashboardLayout;
