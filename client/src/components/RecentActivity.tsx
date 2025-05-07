import React from 'react';
import { Link } from 'wouter';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ActivityRecord } from '@/types';

interface RecentActivityProps {
  activities: ActivityRecord[];
  showHeader?: boolean;
  limit?: number;
  showViewAll?: boolean;
}

const RecentActivity = ({
  activities,
  showHeader = true,
  limit,
  showViewAll = true
}: RecentActivityProps) => {
  const displayActivities = limit ? activities.slice(0, limit) : activities;
  
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg">
      {showHeader && (
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        </div>
      )}
      
      <div className="overflow-hidden">
        {displayActivities.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {displayActivities.map((activity) => (
              <li key={activity.id}>
                <div className="px-4 py-4 sm:px-6 flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary-600 dark:text-primary-400">
                      {getActivityTitle(activity)}
                    </p>
                    <div className="flex text-xs text-slate-500 dark:text-slate-400">
                      <p>{activity.algorithm}</p>
                      <span className="mx-1">•</span>
                      <p>{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Badge variant={activity.result ? "success" : "destructive"}>
                      {activity.result ? 'Completed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {showViewAll && activities.length > 0 && (
          <div className="bg-white dark:bg-slate-800 px-4 py-4 sm:px-6 border-t border-slate-200 dark:border-slate-700">
            <Link href="/logs">
              <a className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                View all activity <span aria-hidden="true">&rarr;</span>
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to generate activity titles
function getActivityTitle(activity: ActivityRecord): string {
  const inputName = activity.input || 'data';
  
  switch (activity.operation) {
    case 'encrypt':
      return `Encrypted ${inputName}`;
    case 'decrypt':
      return `Decrypted ${inputName}`;
    case 'hash':
      return `Computed ${activity.algorithm} Hash`;
    case 'generate-key':
      return `Generated ${activity.algorithm} Key Pair`;
    case 'sign':
      return `Signed ${inputName}`;
    case 'verify':
      return `Verified signature for ${inputName}`;
    default:
      return `Processed ${inputName}`;
  }
}

export default RecentActivity;
