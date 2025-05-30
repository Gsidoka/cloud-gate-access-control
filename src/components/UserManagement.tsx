
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { User, UserRole } from "@/contexts/AuthContext";

interface UserManagementProps {
  onBack: () => void;
}

interface ManagementUser extends User {
  lastAccess?: Date;
  status: 'ativo' | 'inativo' | 'bloqueado';
}

const UserManagement = ({ onBack }: UserManagementProps) => {
  const [users, setUsers] = useState<ManagementUser[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@portcloud.com',
      role: 'morador',
      apartment: '301',
      phone: '(11) 99999-9999',
      permissions: ['view_camera', 'open_gate', 'view_history'],
      lastAccess: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'ativo'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@portcloud.com',
      role: 'administrador',
      phone: '(11) 88888-8888',
      permissions: ['view_camera', 'open_gate', 'view_history', 'manage_users', 'manage_settings'],
      lastAccess: new Date(Date.now() - 30 * 60 * 1000),
      status: 'ativo'
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      email: 'carlos@entrega.com',
      role: 'visitante',
      phone: '(11) 77777-7777',
      permissions: ['view_camera'],
      lastAccess: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'inativo'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana@portcloud.com',
      role: 'morador',
      apartment: '205',
      phone: '(11) 66666-6666',
      permissions: ['view_camera', 'open_gate', 'view_history'],
      lastAccess: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: 'ativo'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'todos'>('todos');
  const [showAddUser, setShowAddUser] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.apartment && user.apartment.includes(searchTerm));
    const matchesRole = filterRole === 'todos' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido com sucesso"
    });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'ativo' ? 'inativo' : 'ativo' }
        : user
    ));
    toast({
      title: "Status atualizado",
      description: "O status do usuário foi alterado com sucesso"
    });
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'administrador': return 'destructive';
      case 'morador': return 'default';
      case 'visitante': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ativo': return 'default';
      case 'inativo': return 'secondary';
      case 'bloqueado': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatLastAccess = (date?: Date) => {
    if (!date) return 'Nunca';
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
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gerenciamento de Usuários</h1>
                <p className="text-sm text-gray-500">Gerencie usuários, permissões e acessos</p>
              </div>
            </div>

            <Button 
              className="port-button-primary"
              onClick={() => setShowAddUser(true)}
            >
              <UserPlus className="h-4 w-4" />
              Novo Usuário
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
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Moradores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'morador').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'administrador').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'ativo').length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email ou apartamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="port-input pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as UserRole | 'todos')}
                  className="port-input"
                >
                  <option value="todos">Todos os perfis</option>
                  <option value="administrador">Administradores</option>
                  <option value="morador">Moradores</option>
                  <option value="visitante">Visitantes</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
            <CardDescription>
              {filteredUsers.length} usuário(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Apartamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.apartment || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatLastAccess(user.lastAccess)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
