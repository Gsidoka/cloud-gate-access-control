
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export type UserRole = 'morador' | 'administrador' | 'visitante';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  apartment?: string;
  phone?: string;
  avatar?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  requiresTwoFactor: boolean;
  setRequiresTwoFactor: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);

  // Simulated users database
  const mockUsers: Record<string, { password: string; user: User }> = {
    'morador@portcloud.com': {
      password: '123456',
      user: {
        id: '1',
        name: 'João Silva',
        email: 'morador@portcloud.com',
        role: 'morador',
        apartment: '301',
        phone: '(11) 99999-9999',
        permissions: ['view_camera', 'open_gate', 'view_history']
      }
    },
    'admin@portcloud.com': {
      password: '123456',
      user: {
        id: '2',
        name: 'Maria Santos',
        email: 'admin@portcloud.com',
        role: 'administrador',
        phone: '(11) 88888-8888',
        permissions: ['view_camera', 'open_gate', 'view_history', 'manage_users', 'manage_settings']
      }
    }
  };

  const login = async (email: string, password: string, twoFactorCode?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = mockUsers[email];
      
      if (!userData || userData.password !== password) {
        toast({
          title: "Erro de login",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
        return false;
      }

      if (!twoFactorCode) {
        setRequiresTwoFactor(true);
        toast({
          title: "Código de verificação necessário",
          description: "Insira o código enviado para seu celular"
        });
        return false;
      }

      // Simulate 2FA validation (accept any 6-digit code)
      if (twoFactorCode.length !== 6) {
        toast({
          title: "Código inválido",
          description: "O código deve ter 6 dígitos",
          variant: "destructive"
        });
        return false;
      }

      setUser(userData.user);
      setRequiresTwoFactor(false);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userData.user.name}`
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Erro no sistema",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRequiresTwoFactor(false);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com segurança"
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      requiresTwoFactor,
      setRequiresTwoFactor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
