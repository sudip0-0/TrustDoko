import { redirect } from "next/navigation";

type ReportPageProps = {
  params: Promise<{ businessSlug: string }>;
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { businessSlug } = await params;
  redirect(`/businesses/${businessSlug}#report-issue`);
}
