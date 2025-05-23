
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DoorOpen, Shield, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, requiresTwoFactor } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password, twoFactorCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <DoorOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Port Cloud</h1>
          <p className="text-gray-600 mt-2">Porteiro Inteligente em Nuvem</p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acesso ao Sistema</CardTitle>
            <CardDescription>
              {requiresTwoFactor 
                ? "Digite o código de verificação enviado para seu celular"
                : "Entre com suas credenciais para continuar"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!requiresTwoFactor ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-describedby="email-hint"
                      className="port-input"
                    />
                    <p id="email-hint" className="text-sm text-gray-500">
                      Use: morador@portcloud.com ou admin@portcloud.com
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-describedby="password-hint"
                        className="port-input pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p id="password-hint" className="text-sm text-gray-500">
                      Senha padrão: 123456
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="twoFactor" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Código de Verificação
                  </Label>
                  <Input
                    id="twoFactor"
                    type="text"
                    placeholder="000000"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    aria-describedby="twofactor-hint"
                    className="port-input text-center text-2xl tracking-widest"
                  />
                  <p id="twofactor-hint" className="text-sm text-gray-500">
                    Digite qualquer código de 6 dígitos para demonstração
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full port-button-primary"
                disabled={isLoading || (!requiresTwoFactor && (!email || !password)) || (requiresTwoFactor && twoFactorCode.length !== 6)}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Verificando...
                  </>
                ) : requiresTwoFactor ? (
                  "Verificar Código"
                ) : (
                  "Entrar"
                )}
              </Button>

              {requiresTwoFactor && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setTwoFactorCode('');
                    // In a real app, you'd reset the 2FA state
                  }}
                >
                  Voltar ao Login
                </Button>
              )}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Precisa de ajuda?{" "}
                <button className="text-blue-600 hover:underline">
                  Contate o administrador
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Protegido por autenticação de dois fatores</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
