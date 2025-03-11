
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserProfile } from '@/types/food';

interface UserProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  calculateDailyCalories: () => number;
  shouldPromptUpdate: () => boolean;
}

const defaultProfile: UserProfile = {
  height: 170,
  weight: 70,
  age: 30,
  gender: 'male',
  activityLevel: 'moderate',
  lastUpdated: new Date(),
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        // Convert stored date string back to Date object
        setProfileState({
          ...parsedProfile,
          lastUpdated: new Date(parsedProfile.lastUpdated)
        });
      } catch (error) {
        console.error('Error parsing saved profile', error);
        toast.error('Failed to load your profile');
      }
    }
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  }, [profile]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    toast.success('Profile updated successfully');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState(prev => {
      if (!prev) return defaultProfile;
      return { 
        ...prev, 
        ...updates,
        lastUpdated: new Date()
      };
    });
    toast.success('Profile updated successfully');
  };

  // Mifflin-St Jeor Equation for BMR calculation
  const calculateDailyCalories = () => {
    if (!profile) return 2000; // Default value
    
    let bmr = 0;
    
    // Calculate BMR based on gender
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }
    
    // Apply activity multiplier
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    return Math.round(bmr * activityMultipliers[profile.activityLevel]);
  };

  // Check if we should prompt for profile update (daily)
  const shouldPromptUpdate = () => {
    if (!profile) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastUpdated = new Date(profile.lastUpdated);
    lastUpdated.setHours(0, 0, 0, 0);
    
    return lastUpdated.getTime() < today.getTime();
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        calculateDailyCalories,
        shouldPromptUpdate,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
