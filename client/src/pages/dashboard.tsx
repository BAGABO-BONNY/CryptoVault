import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Lock, 
  Key, 
  ShieldCheck,
  FileSignature,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import StatCard from '@/components/StatCard';
import RecentActivity from '@/components/RecentActivity';
import { ActivityRecord, AlgorithmUsage } from '@/types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';

const Dashboard = () => {
  // Fetch stats from API
  const { data: stats, isLoading: isLoadingStats } = useQuery<{
    totalEncrypted: number;
    keysGenerated: number;
    hashOperations: number;
    digitalSignatures: number;
  }>({
    queryKey: ['/api/stats'],
  });

  // Fetch activities from API
  const { data: activities, isLoading: isLoadingActivities } = useQuery<ActivityRecord[]>({
    queryKey: ['/api/activities'],
  });

  // Fetch algorithm usage data
  const { data: algoUsage, isLoading: isLoadingAlgoUsage } = useQuery<AlgorithmUsage[]>({
    queryKey: ['/api/algorithm-usage'],
  });
  
  // Chart colors
  const COLORS = ['#0284C7', '#059669', '#8B5CF6', '#EC4899', '#F59E0B'];

  return (
    <div className="pb-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <div className="mt-3 sm:mt-0">
          <Link href="/encryption">
            <Button className="gap-2">
              <Plus className="h-5 w-5" />
              New Operation
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Welcome Banner */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Welcome back, Alex</h2>
              <p className="text-slate-600 dark:text-slate-300">Your encryption activity is safe and secure.</p>
            </div>
            
            {/* Banner Image */}
            <img 
              className="w-full md:w-auto mt-4 md:mt-0 max-w-sm rounded-lg" 
              src="https://images.unsplash.com/photo-1496096265110-f83ad7f96608?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=200"
              alt="Security visualization" 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoadingStats ? (
          // Skeleton loaders for stats
          Array(4).fill(0).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-8 w-[80px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Encrypted Files"
              value={stats?.totalEncrypted ?? 0}
              change={{ value: 16.8, trend: 'up' }}
              icon={<Lock className="h-6 w-6 text-primary-500 dark:text-primary-400" />}
              iconBgColor="bg-primary-50 dark:bg-slate-700"
            />
            
            <StatCard
              title="Keys Generated"
              value={stats?.keysGenerated ?? 0}
              change={{ value: 12.5, trend: 'up' }}
              icon={<Key className="h-6 w-6 text-green-500 dark:text-green-400" />}
              iconBgColor="bg-green-50 dark:bg-slate-700"
            />
            
            <StatCard
              title="Hash Operations"
              value={stats?.hashOperations ?? 0}
              change={{ value: 3.2, trend: 'down' }}
              icon={<ShieldCheck className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />}
              iconBgColor="bg-indigo-50 dark:bg-slate-700"
            />
            
            <StatCard
              title="Digital Signatures"
              value={stats?.digitalSignatures ?? 0}
              change={{ value: 24.3, trend: 'up' }}
              icon={<FileSignature className="h-6 w-6 text-amber-500 dark:text-amber-400" />}
              iconBgColor="bg-amber-50 dark:bg-slate-700"
            />
          </>
        )}
      </div>
      
      {/* Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Chart Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Algorithm Usage</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Last 30 days</span>
              </div>
            </div>
            
            {isLoadingAlgoUsage ? (
              <div className="h-64 flex items-center justify-center">
                <Skeleton className="h-full w-full rounded-md" />
              </div>
            ) : (
              <div className="h-64">
                {algoUsage && algoUsage.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={algoUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {algoUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350" 
                      alt="Algorithm visualization" 
                      className="max-h-48 mb-3 rounded-lg"
                    />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      Chart visualization for algorithm usage (AES: 48%, RSA: 27%, Others: 25%)
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        {isLoadingActivities ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <RecentActivity 
            activities={activities || []} 
            limit={5} 
            showViewAll={true}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
