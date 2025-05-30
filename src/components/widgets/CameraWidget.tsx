
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Play, Maximize, Wifi, WifiOff, Circle } from "lucide-react";

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

  const currentCamera = cameras[selectedCamera];
  const onlineCameras = cameras.filter(c => c.status !== 'offline').length;

  return (
    <Card className="port-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Monitoramento
          </CardTitle>
          <Badge variant="outline">
            {onlineCameras}/{cameras.length} Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mini Camera Feed */}
        <div className="relative bg-gray-900 rounded-lg aspect-video">
          <div className="absolute inset-0 flex items-center justify-center">
            {currentCamera.status === 'offline' ? (
              <div className="text-center text-white">
                <WifiOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs opacity-75">Offline</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs opacity-75">Ao Vivo</p>
              </div>
            )}
          </div>
          
          {/* Recording Indicator */}
          {currentCamera.isRecording && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white text-xs">REC</span>
            </div>
          )}

          {/* Camera Name */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
            <span className="text-white text-xs">{currentCamera.name}</span>
          </div>
        </div>

        {/* Camera Selector */}
        <div className="flex gap-1 overflow-x-auto">
          {cameras.map((camera, index) => (
            <button
              key={index}
              onClick={() => setSelectedCamera(index)}
              className={`px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                selectedCamera === index
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                {camera.status === 'offline' ? (
                  <WifiOff className="h-3 w-3 text-red-500" />
                ) : (
                  <Wifi className="h-3 w-3 text-green-500" />
                )}
                {camera.name}
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            disabled={currentCamera.status === 'offline'}
          >
            <Play className="h-3 w-3" />
            Reproduzir
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onExpand}
          >
            <Maximize className="h-3 w-3" />
            Expandir
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <p className="text-gray-600">Online</p>
            <p className="font-semibold text-green-600">{onlineCameras}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Gravando</p>
            <p className="font-semibold text-red-600">
              {cameras.filter(c => c.isRecording).length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraWidget;
