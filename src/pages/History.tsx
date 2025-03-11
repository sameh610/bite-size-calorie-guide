
import { useState } from 'react';
import { useCalorie } from '@/context/CalorieContext';
import { format, subDays, addDays, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import EntryList from '@/components/EntryList';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const History = () => {
  const { entries } = useCalorie();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const filteredEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, selectedDate);
  });
  
  const goToPreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };
  
  const goToNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };
  
  const today = new Date();
  const isToday = isSameDay(selectedDate, today);
  const isFutureDate = selectedDate > today;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          View your past food entries and track your calorie history.
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" size="icon" onClick={goToPreviousDay}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous day</span>
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-auto justify-start text-left font-normal",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={goToNextDay}
              disabled={isFutureDate}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next day</span>
            </Button>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {isToday ? "Today's" : format(selectedDate, "MMMM d")}{" "}
              Food Entries
            </h2>
            <EntryList entries={filteredEntries} showDate={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
