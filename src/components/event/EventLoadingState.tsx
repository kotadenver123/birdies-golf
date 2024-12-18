import { Skeleton } from "@/components/ui/skeleton";

export const EventLoadingState = () => {
  return (
    <div className="min-h-screen bg-golf-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-full h-64 rounded-lg" />
          <Skeleton className="w-2/3 h-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
      </div>
    </div>
  );
};