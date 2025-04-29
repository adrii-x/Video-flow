import React, { ReactNode } from 'react';
import { ProfileProvider } from './ProfileContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ProfileProvider>
      {children}
    </ProfileProvider>
  );
};

export default AppLayout;