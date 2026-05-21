import { BusinessProfileSkeleton } from "@/components/business/business-profile-skeleton";

export default function BusinessProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <BusinessProfileSkeleton />
    </div>
  );
}
