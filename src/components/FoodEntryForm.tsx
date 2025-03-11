
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useCalorie } from '@/context/CalorieContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { FoodEntry } from '@/types/food';

const formSchema = z.object({
  name: z.string().min(2, 'Food name must be at least 2 characters.'),
  calories: z.coerce.number().positive('Calories must be a positive number.'),
  date: z.date(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
});

type FormData = z.infer<typeof formSchema>;

interface FoodEntryFormProps {
  editMode?: boolean;
  existingEntry?: FoodEntry;
  onSuccess?: () => void;
}

const FoodEntryForm = ({ editMode = false, existingEntry, onSuccess }: FoodEntryFormProps) => {
  const { addEntry, editEntry } = useCalorie();
  const navigate = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: editMode && existingEntry
      ? {
          name: existingEntry.name,
          calories: existingEntry.calories,
          date: new Date(existingEntry.date),
          mealType: existingEntry.mealType,
        }
      : {
          name: '',
          calories: undefined,
          date: new Date(),
          mealType: 'breakfast',
        },
  });

  const onSubmit = (data: FormData) => {
    if (editMode && existingEntry) {
      editEntry(existingEntry.id, data);
    } else {
      addEntry(data);
    }
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Apple, Chicken Salad" {...field} />
              </FormControl>
              <FormDescription>
                Enter the name of the food you consumed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g., 250" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                Enter the number of calories.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of meal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date you consumed this food.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto">
          {editMode ? 'Update Entry' : 'Add Entry'}
        </Button>
      </form>
    </Form>
  );
};

export default FoodEntryForm;
