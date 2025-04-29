import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of our profile data
export interface ProfileData {
  fullName: string;
  email: string;
  username: string;
  bio: string;
  profileImage: string | null;
}

// Define the context shape with data and updater functions
interface ProfileContextType {
  profileData: ProfileData;
  updateProfileData: (data: Partial<ProfileData>) => void;
  updateProfileImage: (imageUrl: string | null) => void;
}

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  profileData: {
    fullName: "Johnny Test",
    email: "Test@example.com",
    username: "J-Test",
    bio: "Video Creator",
    profileImage: null
  },
  updateProfileData: () => {},
  updateProfileImage: () => {}
});

// Custom hook for using profile context
export const useProfile = () => useContext(ProfileContext);

// Provider component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state with default values
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "Johnny Test",
    email: "Test@example.com",
    username: "J-Test",
    bio: "Video Creator",
    profileImage: null
  });

  // Function to update specific profile fields
  const updateProfileData = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({
      ...prev,
      ...data
    }));
  };

  // Dedicated function for updating profile image
  const updateProfileImage = (imageUrl: string | null) => {
    setProfileData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
  };

  return (
    <ProfileContext.Provider value={{ 
      profileData, 
      updateProfileData,
      updateProfileImage 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};