
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import SocialAuthButtons from '@/components/SocialAuthButtons';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call (would be replaced with actual auth API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the auth state in localStorage
      localStorage.setItem('authUser', JSON.stringify({ email, isAuthenticated: true }));
      
      // Check if user has a profile already
      const profileKey = `userProfile_${email}`;
      const hasProfile = localStorage.getItem(profileKey);
      
      toast.success('Signed in successfully');
      
      // Always redirect to profile setup if no profile exists
      if (!hasProfile) {
        navigate('/profile-setup');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to sign in');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your CalTracker account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6">
            <SocialAuthButtons isLoading={isLoading} />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" className="p-0" onClick={navigateToSignUp}>
              Sign Up
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
