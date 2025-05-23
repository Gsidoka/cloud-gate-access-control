
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DoorOpen, 
  Camera, 
  Bell, 
  Users, 
  History, 
  Settings, 
  LogOut,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Home
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AccessRecord {
  id: string;
  type: 'entrada' | 'saida';
  user: string;
  time: Date;
  method: 'portao' | 'interfone' | 'app';
  status: 'autorizado' | 'negado' | 'pendente';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'visitante' | 'alerta' | 'sistema';
  time: Date;
  read: boolean;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateLoading, setGateLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Visitante na portaria',
      message: 'Carlos Silva solicita acesso - Apt 301',
      type: 'visitante',
      time: new Date(Date.now() - 5 * 60000),
      read: false
    },
    {
      id: '2',
      title: 'Entrega realizada',
      message: 'Encomenda entregue para Maria - Apt 205',
      type: 'sistema',
      time: new Date(Date.now() - 30 * 60000),
      read: true
    }
  ]);

  const [accessHistory] = useState<AccessRecord[]>([
    {
      id: '1',
      type: 'entrada',
      user: 'João Silva',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      method: 'app',
      status: 'autorizado'
    },
    {
      id: '2',
      type: 'entrada',
      user: 'Entregador - iFood',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      method: 'interfone',
      status: 'autorizado'
    },
    {
      id: '3',
      type: 'entrada',
      user: 'Visitante não identificado',
      time: new Date(Date.now() - 6 * 60 * 60 * 1000),
      method: 'interfone',
      status: 'negado'
    }
  ]);

  const handleOpenGate = async () => {
    setGateLoading(true);
    
    try {
      // Simulate gate operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsGateOpen(true);
      
      toast({
        title: "Portão aberto com sucesso!",
        description: "O portão será fechado automaticamente em 10 segundos"
      });

      // Auto close after 10 seconds
      setTimeout(() => {
        setIsGateOpen(false);
        toast({
          title: "Portão fechado",
          description: "Fechamento automático realizado"
        });
      }, 10000);
      
    } catch (error) {
      toast({
        title: "Erro ao abrir portão",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setGateLoading(false);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'agora mesmo';
    if (diffMins < 60) return `${diffMins}min atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <DoorOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Port Cloud</h1>
                <p className="text-sm text-gray-500">
                  {user?.role === 'administrador' ? 'Painel Administrativo' : 'Área do Morador'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={isGateOpen ? "destructive" : "secondary"} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isGateOpen ? 'bg-red-500' : 'bg-green-500'}`} />
                  {isGateOpen ? 'Portão Aberto' : 'Portão Fechado'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Home className="h-4 w-4" />
                {user?.apartment && `Apt ${user.apartment}`}
                {user?.name}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="port-card hover:shadow-lg cursor-pointer" onClick={handleOpenGate}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Controle de Acesso</p>
                  <p className="text-2xl font-bold text-gray-900">Portão</p>
                </div>
                <Button
                  className={`port-button-${isGateOpen ? 'danger' : 'success'}`}
                  disabled={gateLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenGate();
                  }}
                >
                  {gateLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <DoorOpen className="h-4 w-4" />
                  )}
                  {gateLoading ? 'Abrindo...' : isGateOpen ? 'Aberto' : 'Abrir'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="port-card hover:shadow-lg cursor-pointer" onClick={() => setShowCamera(true)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monitoramento</p>
                  <p className="text-2xl font-bold text-gray-900">Câmeras</p>
                </div>
                <Button className="port-button-primary">
                  <Camera className="h-4 w-4" />
                  Ver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="port-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notificações</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <div className="relative">
                  <Bell className="h-8 w-8 text-gray-400" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'administrador' && (
            <Card className="port-card hover:shadow-lg cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <Button className="port-button-secondary">
                    <Users className="h-4 w-4" />
                    Gerenciar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações Recentes
              </CardTitle>
              <CardDescription>
                Acompanhe as atividades em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {notification.type === 'visitante' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                          {notification.type === 'sistema' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {notification.type === 'alerta' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          <p className="font-medium text-gray-900">{notification.title}</p>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(notification.time)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Acesso
              </CardTitle>
              <CardDescription>
                Registros das últimas atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessHistory.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        record.status === 'autorizado' 
                          ? 'bg-green-100 text-green-600' 
                          : record.status === 'negado' 
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {record.type === 'entrada' ? <DoorOpen className="h-4 w-4" /> : <DoorOpen className="h-4 w-4 rotate-180" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{record.user}</p>
                        <p className="text-sm text-gray-600">
                          {record.type === 'entrada' ? 'Entrada' : 'Saída'} via {record.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatTime(record.time)}</p>
                      <Badge 
                        variant={record.status === 'autorizado' ? 'default' : record.status === 'negado' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Câmera da Portaria
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCamera(false)}
                >
                  Fechar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Transmissão ao vivo</p>
                  <p className="text-sm opacity-75">Portaria Principal - {new Date().toLocaleTimeString('pt-BR')}</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Button className="port-button-success" onClick={handleOpenGate}>
                      <DoorOpen className="h-4 w-4" />
                      Abrir Portão
                    </Button>
                    <Button className="port-button-secondary">
                      <Bell className="h-4 w-4" />
                      Falar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
