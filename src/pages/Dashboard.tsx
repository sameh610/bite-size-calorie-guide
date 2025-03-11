
import { useCalorie } from '@/context/CalorieContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailySummary from '@/components/DailySummary';
import EntryList from '@/components/EntryList';
import DailyGoalSetting from '@/components/DailyGoalSetting';

const Dashboard = () => {
  const { getTodaysEntries } = useCalorie();
  const todaysEntries = getTodaysEntries();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your daily calorie intake and monitor your progress.
          </p>
        </div>
        <DailyGoalSetting />
      </div>
      
      <DailySummary />
      
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today">Today's Entries</TabsTrigger>
          <TabsTrigger value="stats">Meal Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Today's Food Entries</h2>
          <EntryList entries={todaysEntries} showDate={false} />
        </TabsContent>
        <TabsContent value="stats" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Calories by Meal Type</h2>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-muted-foreground">
              Meal breakdown visualization will be implemented in the next version.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
