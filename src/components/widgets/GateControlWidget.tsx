
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
      <CardContent className="p-3">
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-12 flex flex-col items-center justify-center gap-1"
            onClick={handleToggleGate}
            disabled={gateLoading}
          >
            {gateLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
            ) : isGateOpen ? (
              <DoorOpen className="h-6 w-6 text-red-600" />
            ) : (
              <DoorClosed className="h-6 w-6 text-green-600" />
            )}
            <span className="text-xs font-medium">
              {gateLoading ? 'Carregando' : isGateOpen ? 'Fechar' : 'Abrir'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GateControlWidget;
