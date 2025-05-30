
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoorOpen, DoorClosed } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GateControlWidgetProps {
  gateName?: string;
  autoCloseTime?: number;
}

const GateControlWidget = ({ 
  gateName = "Portão Principal", 
  autoCloseTime = 10 
}: GateControlWidgetProps) => {
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [gateLoading, setGateLoading] = useState(false);

  const handleToggleGate = async () => {
    setGateLoading(true);
    
    try {
      // Simulate gate operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStatus = !isGateOpen;
      setIsGateOpen(newStatus);
      
      toast({
        title: newStatus ? "Portão aberto!" : "Portão fechado!",
        description: newStatus 
          ? `Fechamento automático em ${autoCloseTime}s`
          : "Portão fechado com sucesso"
      });

      // Auto close after specified time
      if (newStatus) {
        setTimeout(() => {
          setIsGateOpen(false);
          toast({
            title: "Fechamento automático",
            description: `${gateName} fechado automaticamente`
          });
        }, autoCloseTime * 1000);
      }

    } catch (error) {
      toast({
        title: "Erro na operação",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setGateLoading(false);
    }
  };

  return (
    <Card className="port-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
            isGateOpen ? 'bg-red-100' : 'bg-green-100'
          }`}>
            {isGateOpen ? (
              <DoorOpen className={`h-8 w-8 ${isGateOpen ? 'text-red-600' : 'text-green-600'}`} />
            ) : (
              <DoorClosed className={`h-8 w-8 ${isGateOpen ? 'text-red-600' : 'text-green-600'}`} />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{gateName}</h3>
            <p className="text-sm text-gray-600">
              Status: <span className={`font-medium ${isGateOpen ? 'text-red-600' : 'text-green-600'}`}>
                {isGateOpen ? 'Aberto' : 'Fechado'}
              </span>
            </p>
          </div>

          <Button
            className={`w-full port-button-${isGateOpen ? 'danger' : 'success'}`}
            onClick={handleToggleGate}
            disabled={gateLoading}
          >
            {gateLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : isGateOpen ? (
              <DoorClosed className="h-4 w-4" />
            ) : (
              <DoorOpen className="h-4 w-4" />
            )}
            {gateLoading ? 'Operando...' : isGateOpen ? 'Fechar' : 'Abrir'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GateControlWidget;
