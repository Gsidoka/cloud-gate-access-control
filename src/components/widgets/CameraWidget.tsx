
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Maximize } from "lucide-react";

interface CameraWidgetProps {
  onExpand: () => void;
}

const CameraWidget = ({ onExpand }: CameraWidgetProps) => {
  const [selectedCamera, setSelectedCamera] = useState(0);
  
  const cameras = [
    { name: 'Portaria Principal', status: 'online', isRecording: true },
    { name: 'Garagem', status: 'online', isRecording: false },
    { name: 'Elevador', status: 'offline', isRecording: false },
    { name: 'Área Comum', status: 'recording', isRecording: true }
  ];

  const onlineCameras = cameras.filter(c => c.status !== 'offline').length;

  return (
    <Card className="port-card hover:shadow-lg transition-shadow">
      <CardContent className="p-3">
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-12 flex flex-col items-center justify-center gap-1"
            onClick={onExpand}
          >
            <div className="relative">
              <Camera className="h-6 w-6 text-blue-600" />
              {onlineCameras > 0 && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {onlineCameras}
                </div>
              )}
            </div>
            <span className="text-xs font-medium">Câmeras</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraWidget;
