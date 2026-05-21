import { BusinessListSkeleton } from "@/components/business/business-list-skeleton";

export default function BusinessesLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-3" aria-busy="true" aria-label="Loading businesses">
        <div className="bg-border h-9 w-48 max-w-full rounded" />
        <div className="bg-border h-4 w-72 max-w-full rounded" />
      </div>
      <div className="mt-8">
        <BusinessListSkeleton />
      </div>
    </div>
  );
}
