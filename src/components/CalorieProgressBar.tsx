
import { useCalorie } from '@/context/CalorieContext';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const CalorieProgressBar = () => {
  const { getTodaysCalories, dailyGoal } = useCalorie();
  
  const caloriesConsumed = getTodaysCalories();
  const percentage = Math.min(Math.round((caloriesConsumed / dailyGoal) * 100), 100);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Daily Progress</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress 
        value={percentage} 
        className={cn(
          "h-2.5",
          percentage > 100 ? "bg-destructive" : "bg-secondary"
        )}
      />
      <div className="flex justify-between items-center text-sm">
        <span>{caloriesConsumed} calories</span>
        <span className="text-gray-600">Goal: {dailyGoal} calories</span>
      </div>
    </div>
  );
};

export default CalorieProgressBar;
