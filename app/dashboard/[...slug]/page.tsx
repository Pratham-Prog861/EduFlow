import { redirect } from "next/navigation";

export default async function DashboardCompatRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  redirect(`/${slug.join("/")}`);
}
