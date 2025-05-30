import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX, 
  Circle, 
  Download,
  Settings,
  Maximize,
  AlertTriangle,
  Wifi,
  WifiOff
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CameraMonitoringProps {
  onBack: () => void;
}

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'recording';
  isRecording: boolean;
  hasAudio: boolean;
  quality: 'HD' | 'FHD' | '4K';
  lastActivity: Date;
  isFullscreen?: boolean;
}

const CameraMonitoring = ({ onBack }: CameraMonitoringProps) => {
  const [cameras, setCameras] = useState<CameraFeed[]>([
    {
      id: '1',
      name: 'Câmera Principal',
      location: 'Portaria Principal',
      status: 'online',
      isRecording: true,
      hasAudio: true,
      quality: 'FHD',
      lastActivity: new Date()
    },
    {
      id: '2',
      name: 'Câmera Garagem',
      location: 'Entrada Garagem',
      status: 'online',
      isRecording: false,
      hasAudio: false,
      quality: 'HD',
      lastActivity: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Câmera Elevador',
      location: 'Hall dos Elevadores',
      status: 'offline',
      isRecording: false,
      hasAudio: true,
      quality: 'HD',
      lastActivity: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Câmera Área Comum',
      location: 'Salão de Festas',
      status: 'recording',
      isRecording: true,
      hasAudio: true,
      quality: '4K',
      lastActivity: new Date()
    }
  ]);

  const [selectedCamera, setSelectedCamera] = useState<string | null>('1');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleRecording = (cameraId: string) => {
    setCameras(prev => prev.map(camera => 
      camera.id === cameraId 
        ? { ...camera, isRecording: !camera.isRecording, lastActivity: new Date() }
        : camera
    ));
    
    const camera = cameras.find(c => c.id === cameraId);
    toast({
      title: `Gravação ${camera?.isRecording ? 'pausada' : 'iniciada'}`,
      description: `${camera?.name} - ${camera?.location}`
    });
  };

  const handleDownloadFootage = (cameraId: string) => {
    const camera = cameras.find(c => c.id === cameraId);
    toast({
      title: "Download iniciado",
      description: `Baixando gravação de ${camera?.name} das últimas 24h`
    });
  };

  const getStatusBadge = (camera: CameraFeed) => {
    switch (camera.status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'recording':
        return <Badge variant="default" className="bg-red-500 animate-pulse">Gravando</Badge>;
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const selectedCameraData = cameras.find(c => c.id === selectedCamera);
  const onlineCameras = cameras.filter(c => c.status !== 'offline').length;
  const recordingCameras = cameras.filter(c => c.isRecording).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Monitoramento de Câmeras</h1>
                <p className="text-sm text-gray-500">Central de monitoramento em tempo real</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Câmeras</p>
                  <p className="text-2xl font-bold text-gray-900">{cameras.length}</p>
                </div>
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online</p>
                  <p className="text-2xl font-bold text-gray-900">{onlineCameras}</p>
                </div>
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gravando</p>
                  <p className="text-2xl font-bold text-gray-900">{recordingCameras}</p>
                </div>
                <Circle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Armazenamento</p>
                  <p className="text-2xl font-bold text-gray-900">156GB</p>
                </div>
                <Download className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Camera List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Câmeras Disponíveis</CardTitle>
                <CardDescription>Selecione uma câmera para visualizar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cameras.map((camera) => (
                    <div
                      key={camera.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedCamera === camera.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCamera(camera.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{camera.name}</h4>
                        {getStatusBadge(camera)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{camera.location}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Badge variant="outline">{camera.quality}</Badge>
                        {camera.hasAudio && <Volume2 className="h-3 w-3" />}
                        {camera.isRecording && <Circle className="h-3 w-3 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Video Feed */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedCameraData?.name || 'Selecione uma câmera'}</CardTitle>
                    <CardDescription>{selectedCameraData?.location}</CardDescription>
                  </div>
                  {selectedCameraData && (
                    <div className="flex items-center gap-2">
                      {getStatusBadge(selectedCameraData)}
                      <Badge variant="outline">{selectedCameraData.quality}</Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedCameraData ? (
                  <>
                    {/* Video Container */}
                    <div className="relative bg-gray-900 rounded-lg aspect-video mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {selectedCameraData.status === 'offline' ? (
                          <div className="text-center text-white">
                            <WifiOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Câmera Offline</p>
                            <p className="text-sm opacity-75">Verifique a conexão</p>
                          </div>
                        ) : (
                          <div className="text-center text-white">
                            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Transmissão ao Vivo</p>
                            <p className="text-sm opacity-75">
                              {new Date().toLocaleTimeString('pt-BR')} - {selectedCameraData.quality}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Recording Indicator */}
                      {selectedCameraData.isRecording && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="text-white text-sm font-medium">REC</span>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleRecording(selectedCameraData.id)}
                          disabled={selectedCameraData.status === 'offline'}
                        >
                          {selectedCameraData.isRecording ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          {selectedCameraData.isRecording ? 'Pausar' : 'Gravar'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadFootage(selectedCameraData.id)}
                          disabled={selectedCameraData.status === 'offline'}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Maximize className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">Nenhuma câmera selecionada</p>
                    <p className="text-sm text-gray-500">Escolha uma câmera da lista para visualizar</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraMonitoring;
