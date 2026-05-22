import { redirect } from "next/navigation";

type WriteReviewPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function WriteReviewPage({ params }: WriteReviewPageProps) {
  const { businessSlug } = await params;
  redirect(`/businesses/${businessSlug}#write-review`);
}
