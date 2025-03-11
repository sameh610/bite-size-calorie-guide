
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Utensils } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  confidence: number;
}

interface FoodAnalyzerProps {
  onFoodDetected: (result: FoodAnalysisResult) => void;
}

const FoodAnalyzer = ({ onFoodDetected }: FoodAnalyzerProps) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageUrl);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        
        setIsCapturing(false);
        analyzeImage(imageUrl);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setUploadedImage(imageUrl);
          analyzeImage(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = (imageUrl: string) => {
    setIsAnalyzing(true);
    
    // Simulate API call to AI food detection service
    // In a real application, you would send the image to a server/API
    setTimeout(() => {
      // Simulating detection results
      const foods = [
        { name: 'Apple', calories: 95 },
        { name: 'Banana', calories: 105 },
        { name: 'Chicken Salad', calories: 350 },
        { name: 'Pizza', calories: 285 },
        { name: 'Burger', calories: 550 },
        { name: 'Pasta', calories: 320 },
        { name: 'Yogurt', calories: 150 },
        { name: 'Rice Bowl', calories: 400 },
        { name: 'Steak', calories: 420 },
        { name: 'Salmon', calories: 380 },
      ];
      
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      
      const result: FoodAnalysisResult = {
        foodName: randomFood.name,
        calories: randomFood.calories,
        confidence: Math.round(Math.random() * 30 + 70) // 70-100% confidence
      };
      
      onFoodDetected(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setUploadedImage(null);
    setIsAnalyzing(false);
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium flex items-center justify-center gap-2">
            <Utensils className="h-5 w-5" />
            Food Analyzer
          </h3>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image of your food to identify it
          </p>
        </div>
        
        <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3] flex items-center justify-center">
          {isCapturing && (
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured food" 
              className="w-full h-full object-contain"
            />
          )}
          
          {uploadedImage && (
            <img 
              src={uploadedImage} 
              alt="Uploaded food" 
              className="w-full h-full object-contain"
            />
          )}
          
          {!isCapturing && !capturedImage && !uploadedImage && (
            <div className="text-center p-8">
              <Utensils className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Take a photo or upload an image of your food
              </p>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <p className="text-white mb-2">Analyzing food...</p>
              <div className="space-y-2 w-2/3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {!isCapturing && !isAnalyzing && (
            <>
              <Button onClick={startCamera} className="gap-2">
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              
              <Button onClick={triggerFileUpload} variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </>
          )}
          
          {isCapturing && (
            <Button onClick={captureImage} className="col-span-2">Capture</Button>
          )}
          
          {(capturedImage || uploadedImage) && !isAnalyzing && (
            <Button onClick={resetCamera} variant="ghost" className="col-span-2">
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default FoodAnalyzer;
