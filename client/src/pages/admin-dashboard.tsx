import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { 
  Users, 
  ShieldCheck, 
  Key, 
  Activity, 
  Lock, 
  Search, 
  BarChart3, 
  Eye, 
  Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { ActivityRecord, User, AlgorithmUsage, Stats } from '@shared/schema';
import { DashboardStatsSkeleton, ActivityListSkeleton } from '@/components/SkeletonLoaders';

// Mock users array (in a real app, this would come from the API)
const mockUsers = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active', lastLogin: '2023-05-18T09:30:00Z' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'customer', status: 'active', lastLogin: '2023-05-17T14:20:00Z' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: 'customer', status: 'inactive', lastLogin: '2023-05-10T11:15:00Z' },
  { id: 4, username: 'bonny', email: 'bagabobonny544@gmail.com', role: 'customer', status: 'active', lastLogin: '2023-05-19T08:45:00Z' },
];

interface UserTableProps {
  users: typeof mockUsers;
  searchTerm: string;
  t: (key: string) => string;
}

const UserTable = ({ users, searchTerm, t }: UserTableProps) => {
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('id')}</TableHead>
            <TableHead>{t('username')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('role')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('lastLogin')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                {t('noUsersFound')}
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                    {user.role === 'admin' ? t('admin') : t('customer')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'active' ? 'outline' : 'secondary'} 
                    className={user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                  >
                    {user.status === 'active' ? t('active') : t('inactive')}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      title={t('viewDetails')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive" 
                      title={t('deleteUser')}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch stats
  const { 
    data: stats,
    isLoading: isStatsLoading,
  } = useQuery<Stats, Error>({
    queryKey: ['/api/stats'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Fetch activity records
  const { 
    data: activities,
    isLoading: isActivitiesLoading,
  } = useQuery<ActivityRecord[], Error>({
    queryKey: ['/api/activities'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Fetch algorithm usage
  const { 
    data: algorithmUsage,
    isLoading: isAlgorithmUsageLoading,
  } = useQuery<AlgorithmUsage[], Error>({
    queryKey: ['/api/algorithm-usage'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {t('adminDashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('adminWelcome')} {user?.username || ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Users size={16} />
            {t('addUser')}
          </Button>
          <Button variant="outline" className="gap-2">
            <ShieldCheck size={16} />
            {t('securitySettings')}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isStatsLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('totalEncrypted')}
                </CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalEncrypted || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20)}% {t('fromLastMonth')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('keysGenerated')}
                </CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.keysGenerated || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15)}% {t('fromLastMonth')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('totalOperations')}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats?.totalEncrypted || 0) + 
                   (stats?.keysGenerated || 0) + 
                   (stats?.hashOperations || 0) + 
                   (stats?.signatureOperations || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 30)}% {t('fromLastMonth')}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('activeUsers')}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockUsers.filter(u => u.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  +1 {t('newUserToday')}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="users" className="mt-6">
        <TabsList className="grid grid-cols-3 mb-8 w-full max-w-md">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('users')}
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('activities')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t('userManagement')}</h2>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder={t('searchUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <UserTable users={mockUsers} searchTerm={searchTerm} t={t} />
        </TabsContent>
        
        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <h2 className="text-xl font-bold">{t('recentActivities')}</h2>
          {isActivitiesLoading ? (
            <ActivityListSkeleton />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('id')}</TableHead>
                    <TableHead>{t('operation')}</TableHead>
                    <TableHead>{t('algorithm')}</TableHead>
                    <TableHead>{t('result')}</TableHead>
                    <TableHead>{t('timestamp')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!activities || activities.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                        {t('noActivitiesFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell className="capitalize">{activity.operation}</TableCell>
                        <TableCell>{activity.algorithm}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={activity.result ? 'outline' : 'destructive'}
                            className={activity.result ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                          >
                            {activity.result ? t('success') : t('failed')}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-bold">{t('usageAnalytics')}</h2>
          {isAlgorithmUsageLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('algorithmUsage')}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {(!algorithmUsage || algorithmUsage.length === 0) ? (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      {t('noAlgorithmData')}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {algorithmUsage.map(algo => (
                        <div key={algo.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: algo.color }} />
                              <span className="text-sm font-medium">{algo.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{algo.count} {t('uses')}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${(algo.count / algorithmUsage.reduce((sum, curr) => sum + curr.count, 0)) * 100}%`,
                                backgroundColor: algo.color 
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('operationDistribution')}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {!stats ? (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      {t('noOperationData')}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { name: t('encryption'), count: stats.totalEncrypted, color: '#0284c7' },
                        { name: t('keyGeneration'), count: stats.keysGenerated, color: '#16a34a' },
                        { name: t('hashing'), count: stats.hashOperations, color: '#9333ea' },
                        { name: t('digitalSignatures'), count: stats.signatureOperations, color: '#ea580c' }
                      ].map(op => (
                        <div key={op.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: op.color }} />
                              <span className="text-sm font-medium">{op.name}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{op.count} {t('operations')}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{ 
                                width: `${(op.count / (stats.totalEncrypted + stats.keysGenerated + stats.hashOperations + stats.signatureOperations || 1)) * 100}%`,
                                backgroundColor: op.color 
                              }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;