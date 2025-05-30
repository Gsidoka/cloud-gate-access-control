
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  DoorOpen, 
  DoorClosed, 
  Plus, 
  Settings, 
  Wifi, 
  WifiOff, 
  Battery, 
  Signal,
  Camera,
  History,
  Shield
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GateManagementProps {
  onBack: () => void;
}

interface Gate {
  id: string;
  name: string;
  location: string;
  status: 'aberto' | 'fechado';
  isOnline: boolean;
  batteryLevel?: number;
  signalStrength: number;
  lastActivity: Date;
  autoCloseTime: number; // in seconds
  hasCamera: boolean;
  isBlocked: boolean;
}

const GateManagement = ({ onBack }: GateManagementProps) => {
  const [gates, setGates] = useState<Gate[]>([
    {
      id: '1',
      name: 'Portão Principal',
      location: 'Entrada Principal',
      status: 'fechado',
      isOnline: true,
      batteryLevel: 85,
      signalStrength: 95,
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      autoCloseTime: 10,
      hasCamera: true,
      isBlocked: false
    },
    {
      id: '2',
      name: 'Portão Garagem',
      location: 'Garagem Subsolo',
      status: 'fechado',
      isOnline: true,
      batteryLevel: 62,
      signalStrength: 78,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      autoCloseTime: 15,
      hasCamera: false,
      isBlocked: false
    },
    {
      id: '3',
      name: 'Portão Serviço',
      location: 'Área de Serviço',
      status: 'fechado',
      isOnline: false,
      signalStrength: 0,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      autoCloseTime: 8,
      hasCamera: true,
      isBlocked: true
    }
  ]);

  const [operatingGate, setOperatingGate] = useState<string | null>(null);

  const handleToggleGate = async (gateId: string) => {
    const gate = gates.find(g => g.id === gateId);
    if (!gate || !gate.isOnline || gate.isBlocked) {
      toast({
        title: "Operação não permitida",
        description: gate?.isBlocked ? "Portão bloqueado" : "Portão offline",
        variant: "destructive"
      });
      return;
    }

    setOperatingGate(gateId);
    
    try {
      // Simulate gate operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGates(prev => prev.map(g => 
        g.id === gateId 
          ? { 
              ...g, 
              status: g.status === 'aberto' ? 'fechado' : 'aberto',
              lastActivity: new Date()
            }
          : g
      ));

      const newStatus = gate.status === 'aberto' ? 'fechado' : 'aberto';
      
      toast({
        title: `${gate.name} ${newStatus}`,
        description: newStatus === 'aberto' 
          ? `Fechamento automático em ${gate.autoCloseTime}s`
          : 'Portão fechado com sucesso'
      });

      // Auto close after specified time
      if (newStatus === 'aberto') {
        setTimeout(() => {
          setGates(prev => prev.map(g => 
            g.id === gateId 
              ? { ...g, status: 'fechado', lastActivity: new Date() }
              : g
          ));
          toast({
            title: "Fechamento automático",
            description: `${gate.name} fechado automaticamente`
          });
        }, gate.autoCloseTime * 1000);
      }

    } catch (error) {
      toast({
        title: "Erro na operação",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setOperatingGate(null);
    }
  };

  const handleToggleBlock = (gateId: string) => {
    setGates(prev => prev.map(gate => 
      gate.id === gateId 
        ? { ...gate, isBlocked: !gate.isBlocked }
        : gate
    ));
    
    const gate = gates.find(g => g.id === gateId);
    toast({
      title: gate?.isBlocked ? "Portão desbloqueado" : "Portão bloqueado",
      description: gate?.isBlocked 
        ? "Operações liberadas" 
        : "Operações bloqueadas por segurança"
    });
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins}min atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (gate: Gate) => {
    if (gate.isBlocked) return <Badge variant="destructive">Bloqueado</Badge>;
    if (!gate.isOnline) return <Badge variant="secondary">Offline</Badge>;
    if (gate.status === 'aberto') return <Badge variant="destructive">Aberto</Badge>;
    return <Badge variant="default">Fechado</Badge>;
  };

  const getSignalIcon = (strength: number) => {
    if (strength === 0) return <WifiOff className="h-4 w-4 text-red-500" />;
    return <Wifi className="h-4 w-4 text-green-500" />;
  };

  const onlineGates = gates.filter(g => g.isOnline).length;
  const openGates = gates.filter(g => g.status === 'aberto').length;
  const blockedGates = gates.filter(g => g.isBlocked).length;

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
                <DoorOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Controle de Portões</h1>
                <p className="text-sm text-gray-500">Gerencie e monitore todos os portões conectados</p>
              </div>
            </div>

            <Button 
              className="port-button-primary"
            >
              <Plus className="h-4 w-4" />
              Adicionar Portão
            </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total de Portões</p>
                  <p className="text-2xl font-bold text-gray-900">{gates.length}</p>
                </div>
                <DoorOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online</p>
                  <p className="text-2xl font-bold text-gray-900">{onlineGates}</p>
                </div>
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Abertos</p>
                  <p className="text-2xl font-bold text-gray-900">{openGates}</p>
                </div>
                <DoorOpen className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bloqueados</p>
                  <p className="text-2xl font-bold text-gray-900">{blockedGates}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gates.map((gate) => (
            <Card key={gate.id} className="port-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{gate.name}</CardTitle>
                  {getStatusBadge(gate)}
                </div>
                <CardDescription>{gate.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Status Indicators */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getSignalIcon(gate.signalStrength)}
                      <span>{gate.isOnline ? 'Online' : 'Offline'}</span>
                      {gate.isOnline && (
                        <span className="text-gray-500">({gate.signalStrength}%)</span>
                      )}
                    </div>
                    
                    {gate.batteryLevel && (
                      <div className="flex items-center gap-1">
                        <Battery className="h-4 w-4" />
                        <span>{gate.batteryLevel}%</span>
                      </div>
                    )}
                  </div>

                  {/* Last Activity */}
                  <div className="text-sm text-gray-600">
                    <span>Última atividade: {formatLastActivity(gate.lastActivity)}</span>
                  </div>

                  {/* Features */}
                  <div className="flex gap-2">
                    {gate.hasCamera && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        Câmera
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <History className="h-3 w-3" />
                      Auto: {gate.autoCloseTime}s
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      className={`flex-1 port-button-${
                        gate.status === 'aberto' ? 'danger' : 'success'
                      }`}
                      onClick={() => handleToggleGate(gate.id)}
                      disabled={operatingGate === gate.id || !gate.isOnline || gate.isBlocked}
                    >
                      {operatingGate === gate.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : gate.status === 'aberto' ? (
                        <DoorClosed className="h-4 w-4" />
                      ) : (
                        <DoorOpen className="h-4 w-4" />
                      )}
                      {operatingGate === gate.id 
                        ? 'Operando...' 
                        : gate.status === 'aberto' 
                        ? 'Fechar' 
                        : 'Abrir'
                      }
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleBlock(gate.id)}
                      className={gate.isBlocked ? 'text-red-600' : 'text-gray-600'}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GateManagement;
