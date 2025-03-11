
import { Button } from "@/components/ui/button";
import { Apple, Github, Google } from "lucide-react";

interface SocialAuthButtonsProps {
  isLoading: boolean;
}

const SocialAuthButtons = ({ isLoading }: SocialAuthButtonsProps) => {
  const handleGoogleSignIn = () => {
    // This would be connected to a real Google auth provider
    console.log("Google sign-in clicked");
  };

  const handleAppleSignIn = () => {
    // This would be connected to a real Apple auth provider
    console.log("Apple sign-in clicked");
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="h-10"
        >
          <Google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleAppleSignIn}
          className="h-10"
        >
          <Apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
