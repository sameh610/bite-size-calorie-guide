
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const SignOutButton = () => {
  const { signOut } = useAuth();

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-gray-600 hover:text-gray-900 mt-auto" 
      onClick={signOut}
    >
      <LogOut className="h-5 w-5 mr-2" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
