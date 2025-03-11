
import { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { useCalorie } from '@/context/CalorieContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FoodEntry } from '@/types/food';
import FoodEntryForm from './FoodEntryForm';

interface EntryListProps {
  entries: FoodEntry[];
  showDate?: boolean;
}

const EntryList = ({ entries, showDate = true }: EntryListProps) => {
  const { deleteEntry } = useCalorie();
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<FoodEntry | null>(null);
  
  const getMealTypeColor = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-blue-100 text-blue-800';
      case 'lunch':
        return 'bg-green-100 text-green-800';
      case 'dinner':
        return 'bg-purple-100 text-purple-800';
      case 'snack':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDelete = () => {
    if (deletingEntry) {
      deleteEntry(deletingEntry.id);
      setDeletingEntry(null);
    }
  };
  
  if (entries.length === 0) {
    return (
      <Alert>
        <AlertTitle>No entries found</AlertTitle>
        <AlertDescription>
          You haven't added any food entries yet. Add your first meal to start tracking!
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <Card key={entry.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-medium">{entry.name}</h3>
                {showDate && (
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), 'MMMM d, yyyy')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getMealTypeColor(entry.mealType)}`}>
                  {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
                </span>
                <span className="font-medium">{entry.calories} cal</span>
              </div>
            </div>
            <div className="p-2 flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingEntry(entry)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDeletingEntry(entry)}
                className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Edit Entry Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Food Entry</DialogTitle>
            <DialogDescription>
              Make changes to your food entry.
            </DialogDescription>
          </DialogHeader>
          {editingEntry && (
            <FoodEntryForm 
              editMode 
              existingEntry={editingEntry} 
              onSuccess={() => setEditingEntry(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingEntry} onOpenChange={(open) => !open && setDeletingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeletingEntry(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntryList;
