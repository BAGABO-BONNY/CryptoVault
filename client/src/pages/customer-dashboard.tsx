import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { 
  Lock, 
  Key, 
  Hash, 
  FileSignature, 
  Clock, 
  Check, 
  X,
  Shield,
  BarChart3,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ActivityRecord, AlgorithmUsage, Stats } from '@shared/schema';
import { DashboardStatsSkeleton, ActivityListSkeleton } from '@/components/SkeletonLoaders';
import { Progress } from '@/components/ui/progress';

const CustomerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Fetch user-specific stats
  const { 
    data: stats,
    isLoading: isStatsLoading,
  } = useQuery<Stats, Error>({
    queryKey: ['/api/stats'],
    queryFn: getQueryFn({ on401: 'redirect' }),
  });

  // Fetch user activity records
  const { 
    data: activities,
    isLoading: isActivitiesLoading,
  } = useQuery<ActivityRecord[], Error>({
    queryKey: ['/api/activities'],
    queryFn: getQueryFn({ on401: 'redirect' }),
  });

  // Fetch algorithm usage
  const { 
    data: algorithmUsage,
    isLoading: isAlgorithmUsageLoading,
  } = useQuery<AlgorithmUsage[], Error>({
    queryKey: ['/api/algorithm-usage'],
    queryFn: getQueryFn({ on401: 'redirect' }),
  });

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'encrypt':
        return <Lock className="h-5 w-5 text-blue-500" />;
      case 'decrypt':
        return <Key className="h-5 w-5 text-green-500" />;
      case 'hash':
        return <Hash className="h-5 w-5 text-purple-500" />;
      case 'sign':
      case 'verify':
        return <FileSignature className="h-5 w-5 text-orange-500" />;
      default:
        return <Shield className="h-5 w-5 text-slate-500" />;
    }
  };

  // Calculate storage usage stats
  const storageUsage = {
    used: 1.2, // GB
    total: 5, // GB
    percentage: (1.2 / 5) * 100
  };

  // Define tool cards for quick access
  const tools = [
    { 
      title: t('encryption'),
      description: t('encryptionToolDesc'),
      icon: <Lock className="h-8 w-8 text-primary" />,
      link: '/encryption'
    },
    { 
      title: t('decryption'),
      description: t('decryptionToolDesc'),
      icon: <Key className="h-8 w-8 text-primary" />,
      link: '/decryption'
    },
    { 
      title: t('hashing'),
      description: t('hashingToolDesc'),
      icon: <Hash className="h-8 w-8 text-primary" />,
      link: '/hashing'
    },
    { 
      title: t('digitalSignature'),
      description: t('digitalSignatureToolDesc'),
      icon: <FileSignature className="h-8 w-8 text-primary" />,
      link: '/digital-signature'
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {t('dashboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t('customerWelcome')} {user?.username || ''}, {t('dashboardSubtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Settings size={16} />
            {t('settings')}
          </Button>
          <Button variant="outline" className="gap-2">
            <Shield size={16} />
            {t('securityCenter')}
          </Button>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="p-2 w-fit rounded-lg bg-primary/10 mb-2">
                {tool.icon}
              </div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = tool.link}>
                {t('launch')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {isStatsLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('accountOverview')}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('storageUsage')}</p>
                    <p className="text-xs text-muted-foreground">
                      {storageUsage.used} GB / {storageUsage.total} GB
                    </p>
                  </div>
                  <div className="w-1/2">
                    <Progress value={storageUsage.percentage} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('accountStatus')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('basicPlanDetails')}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                    {t('active')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t('totalOperations')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('thisMonth')}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {(stats?.totalEncrypted || 0) + 
                     (stats?.keysGenerated || 0) + 
                     (stats?.hashOperations || 0) + 
                     (stats?.signatureOperations || 0)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('operationStats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!stats ? (
                  <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                    {t('noOperationData')}
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{t('encryption')}</span>
                        </div>
                        <span className="text-sm font-medium">{stats.totalEncrypted}</span>
                      </div>
                      <Progress value={(stats.totalEncrypted / 
                        (stats.totalEncrypted + stats.keysGenerated + stats.hashOperations + stats.signatureOperations || 1)) * 100} 
                        className="h-2 bg-blue-100 dark:bg-blue-900/30" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Key className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{t('keyGeneration')}</span>
                        </div>
                        <span className="text-sm font-medium">{stats.keysGenerated}</span>
                      </div>
                      <Progress value={(stats.keysGenerated / 
                        (stats.totalEncrypted + stats.keysGenerated + stats.hashOperations + stats.signatureOperations || 1)) * 100} 
                        className="h-2 bg-green-100 dark:bg-green-900/30" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">{t('hashing')}</span>
                        </div>
                        <span className="text-sm font-medium">{stats.hashOperations}</span>
                      </div>
                      <Progress value={(stats.hashOperations / 
                        (stats.totalEncrypted + stats.keysGenerated + stats.hashOperations + stats.signatureOperations || 1)) * 100} 
                        className="h-2 bg-purple-100 dark:bg-purple-900/30" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <FileSignature className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{t('signatures')}</span>
                        </div>
                        <span className="text-sm font-medium">{stats.signatureOperations}</span>
                      </div>
                      <Progress value={(stats.signatureOperations / 
                        (stats.totalEncrypted + stats.keysGenerated + stats.hashOperations + stats.signatureOperations || 1)) * 100} 
                        className="h-2 bg-orange-100 dark:bg-orange-900/30" 
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t('algorithmUsage')}</CardTitle>
              </CardHeader>
              <CardContent>
                {isAlgorithmUsageLoading || !algorithmUsage || algorithmUsage.length === 0 ? (
                  <div className="flex items-center justify-center h-[150px] text-muted-foreground">
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
          </>
        )}
      </div>

      {/* Tabs for recent activities and analytics */}
      <Tabs defaultValue="recent" className="mt-8">
        <TabsList className="grid grid-cols-2 mb-8 w-full max-w-md">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {t('recentActivities')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
        </TabsList>
        
        {/* Recent Activities Tab */}
        <TabsContent value="recent" className="space-y-4">
          {isActivitiesLoading ? (
            <ActivityListSkeleton />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('yourRecentActivities')}</CardTitle>
                <CardDescription>
                  {t('recentActivitiesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(!activities || activities.length === 0) ? (
                  <div className="text-center py-6 text-muted-foreground">
                    {t('noActivitiesFound')}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                          {getOperationIcon(activity.operation)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              <span className="capitalize">{activity.operation}</span> - {activity.algorithm}
                            </p>
                            <div className="flex items-center">
                              {activity.result ? (
                                <Check className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <X className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <Badge 
                                variant={activity.result ? 'outline' : 'destructive'} 
                                className={activity.result ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : ''}
                              >
                                {activity.result ? t('success') : t('failed')}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activities.length > 5 && (
                      <div className="text-center pt-2">
                        <Button variant="link" onClick={() => window.location.href = '/logs'}>
                          {t('viewAllActivities')}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('usageOverTime')}</CardTitle>
              <CardDescription>
                {t('usageOverTimeDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-md">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>{t('analyticsComingSoon')}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDashboard;