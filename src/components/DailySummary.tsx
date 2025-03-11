
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCalorie } from '@/context/CalorieContext';
import CalorieProgressBar from './CalorieProgressBar';
import { BarChart3, Goal } from 'lucide-react';

const DailySummary = () => {
  const { getTodaysCalories, dailyGoal } = useCalorie();
  
  const caloriesConsumed = getTodaysCalories();
  const caloriesRemaining = Math.max(dailyGoal - caloriesConsumed, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calories Consumed</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{caloriesConsumed}</div>
          <p className="text-xs text-muted-foreground">Today's intake</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calories Remaining</CardTitle>
          <Goal className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{caloriesRemaining}</div>
          <p className="text-xs text-muted-foreground">Left for today</p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Daily Progress</CardTitle>
          <CardDescription>Your calorie intake progress for today</CardDescription>
        </CardHeader>
        <CardContent>
          <CalorieProgressBar />
        </CardContent>
      </Card>
    </div>
  );
};

export default DailySummary;
