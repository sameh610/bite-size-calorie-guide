
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, RefreshCw } from 'lucide-react';

interface HeightEstimatorProps {
  onHeightEstimated: (height: number) => void;
  onCancel: () => void;
}

const HeightEstimator = ({ onHeightEstimated, onCancel }: HeightEstimatorProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [estimatedHeight, setEstimatedHeight] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image URL
        const imageUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageUrl);
        
        // Stop camera stream
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        
        setIsCapturing(false);
        
        // Simulate AI estimation
        // In a real app, you would send the image to an AI service
        setTimeout(() => {
          // Random height between 160-190cm
          const simulatedHeight = Math.floor(160 + Math.random() * 30);
          setEstimatedHeight(simulatedHeight);
        }, 1500);
      }
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setEstimatedHeight(null);
    setIsCapturing(false);
  };

  const confirmHeight = () => {
    if (estimatedHeight) {
      onHeightEstimated(estimatedHeight);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Height Estimation</h3>
        <p className="text-sm text-muted-foreground">
          Stand against a wall and take a full-body photo to estimate your height
        </p>
      </div>
      
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/4] flex items-center justify-center">
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
            alt="Captured" 
            className="w-full h-full object-contain"
          />
        )}
        
        {!isCapturing && !capturedImage && (
          <div className="text-center p-8">
            <Camera className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Press "Start Camera" to begin
            </p>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {estimatedHeight && (
        <Alert>
          <AlertDescription>
            Estimated height: <strong>{estimatedHeight} cm</strong>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col space-y-2">
        {!isCapturing && !capturedImage && (
          <Button onClick={startCamera} className="gap-2">
            <Camera className="h-4 w-4" />
            Start Camera
          </Button>
        )}
        
        {isCapturing && (
          <Button onClick={captureImage}>Take Photo</Button>
        )}
        
        {capturedImage && !estimatedHeight && (
          <div className="flex justify-center">
            <span>Estimating your height...</span>
          </div>
        )}
        
        {capturedImage && estimatedHeight && (
          <>
            <Button onClick={confirmHeight} className="gap-2">
              Use {estimatedHeight} cm
            </Button>
            <Button variant="outline" onClick={resetCapture} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </>
        )}
        
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
};

export default HeightEstimator;
