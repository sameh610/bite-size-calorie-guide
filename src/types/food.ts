
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}
