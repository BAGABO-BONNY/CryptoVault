import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number | string;
  change: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: React.ReactNode;
  iconBgColor?: string;
};

const StatCard = ({ title, value, change, icon, iconBgColor }: StatCardProps) => {
  const trendColor = change.trend === 'up' ? 'text-green-500' : 'text-red-500';
  const defaultIconBg = 'bg-primary-50 dark:bg-slate-700';
  
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
          <p className={cn("text-sm font-medium flex items-center mt-1", trendColor)}>
            {change.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(change.value)}% {change.trend === 'up' ? 'increase' : 'decrease'}
          </p>
        </div>
        <div className={cn("rounded-full p-3", iconBgColor || defaultIconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
