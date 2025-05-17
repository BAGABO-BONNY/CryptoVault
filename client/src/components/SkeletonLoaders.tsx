import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-1/3 mt-4" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <CardSkeleton />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex items-center justify-between space-x-4">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-6 w-[60px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityListSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        <Skeleton className="h-7 w-[200px] mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="py-3 flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CryptoToolSkeleton() {
  return (
    <div className="container py-6">
      <Skeleton className="h-8 w-[300px] mb-6" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-12 w-full" />
          
          <Skeleton className="h-5 w-[140px] mt-4" />
          <Skeleton className="h-[200px] w-full" />
          
          <Skeleton className="h-10 w-[100px] mt-4 self-end" />
        </div>
        
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  );
}