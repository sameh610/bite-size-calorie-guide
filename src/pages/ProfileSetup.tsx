
import { useState } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { useCalorie } from '@/context/CalorieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import HeightEstimator from '@/components/HeightEstimator';

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup = ({ onComplete }: ProfileSetupProps) => {
  const { setProfile, calculateDailyCalories } = useUserProfile();
  const { setDailyGoal } = useCalorie();
  
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [showHeightEstimator, setShowHeightEstimator] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const profile = {
      height,
      weight,
      age,
      gender,
      activityLevel,
      lastUpdated: new Date(),
    };
    
    setProfile(profile);
    
    // Calculate and set recommended calorie goal
    const recommendedCalories = calculateDailyCalories();
    setDailyGoal(recommendedCalories);
    
    // Notify parent component that profile setup is complete
    onComplete();
  };

  const handleEstimatedHeight = (estimatedHeight: number) => {
    setHeight(estimatedHeight);
    setShowHeightEstimator(false);
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to Calorie Tracker</CardTitle>
          <CardDescription>
            Let's set up your profile to get personalized recommendations
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {showHeightEstimator ? (
            <HeightEstimator onHeightEstimated={handleEstimatedHeight} onCancel={() => setShowHeightEstimator(false)} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert>
                <AlertTitle>Let's get to know you better</AlertTitle>
                <AlertDescription>
                  Your measurements help us calculate a personalized daily calorie goal.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowHeightEstimator(true)}
                    >
                      Estimate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="activityLevel">Activity Level</Label>
                  <Select 
                    value={activityLevel} 
                    onValueChange={(value) => setActivityLevel(value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very-active">Very Active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button type="submit" className="w-full">Complete Setup</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;
