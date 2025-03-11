
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FoodEntry } from '@/types/food';

interface CalorieContextType {
  entries: FoodEntry[];
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  addEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  editEntry: (id: string, entry: Partial<FoodEntry>) => void;
  deleteEntry: (id: string) => void;
  getTodaysEntries: () => FoodEntry[];
  getTodaysCalories: () => number;
}

const CalorieContext = createContext<CalorieContextType | undefined>(undefined);

export const CalorieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [dailyGoal, setDailyGoal] = useState<number>(2000);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('calorieEntries');
    const savedGoal = localStorage.getItem('dailyGoal');
    
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        // Convert stored date strings back to Date objects
        const entriesWithDates = parsedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        setEntries(entriesWithDates);
      } catch (error) {
        console.error('Error parsing saved entries', error);
        toast.error('Failed to load your saved food entries');
      }
    }
    
    if (savedGoal) {
      try {
        setDailyGoal(Number(savedGoal));
      } catch (error) {
        console.error('Error parsing saved goal', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calorieEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  const addEntry = (entry: Omit<FoodEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    
    setEntries((prevEntries) => [...prevEntries, newEntry]);
    toast.success('Food entry added successfully');
  };

  const editEntry = (id: string, updatedEntry: Partial<FoodEntry>) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
    toast.success('Food entry updated successfully');
  };

  const deleteEntry = (id: string) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
    toast.success('Food entry deleted successfully');
  };

  const getTodaysEntries = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });
  };

  const getTodaysCalories = () => {
    return getTodaysEntries().reduce((total, entry) => total + entry.calories, 0);
  };

  return (
    <CalorieContext.Provider
      value={{
        entries,
        dailyGoal,
        setDailyGoal,
        addEntry,
        editEntry,
        deleteEntry,
        getTodaysEntries,
        getTodaysCalories,
      }}
    >
      {children}
    </CalorieContext.Provider>
  );
};

export const useCalorie = (): CalorieContextType => {
  const context = useContext(CalorieContext);
  if (context === undefined) {
    throw new Error('useCalorie must be used within a CalorieProvider');
  }
  return context;
};
