
import { useState } from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Goal } from 'lucide-react';

const DailyGoalSetting = () => {
  const { dailyGoal, setDailyGoal } = useCalorie();
  const [newGoal, setNewGoal] = useState(dailyGoal);
  const [open, setOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal > 0) {
      setDailyGoal(newGoal);
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Goal className="h-4 w-4" />
          <span>Set Daily Goal</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Daily Calorie Goal</DialogTitle>
          <DialogDescription>
            Set your target daily calorie intake.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
              <Input
                id="calorieGoal"
                type="number"
                min="1"
                value={newGoal}
                onChange={(e) => setNewGoal(Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailyGoalSetting;
