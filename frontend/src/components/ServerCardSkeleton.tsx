import { Skeleton } from "@/components/ui/skeleton";

export function ServerCardSkeleton() {
  return (
      <div className="bg-zinc-900 border-zinc-800 rounded-md p-4 pt-6 pb-10 animate-pulse-slow cursor-pointer">
        {/* Header with icon and title */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-32 rounded" /> {/* Title placeholder */}
        </div>

        {/* Description */}
        <Skeleton className="h-3 w-full rounded" />
      </div>
  );
}
