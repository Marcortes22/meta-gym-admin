
import { TenantDetailsPage } from "@/modules/tenants/pages/tenant-details.page";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <TenantDetailsPage tenantId={id} />;
}
