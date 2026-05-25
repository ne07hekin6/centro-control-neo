import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UnlockForm } from "@/components/auth/UnlockForm";
import {
  ACCESS_COOKIE_NAME,
  isAccessProtectionEnabled,
  isDashboardConfigurationLocked,
  isValidAccessCookie,
} from "@/lib/auth";

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const params = await searchParams;
  const nextPath = params.next && params.next.startsWith("/") ? params.next : "/";
  const setupRequired = isDashboardConfigurationLocked();

  if (!setupRequired && (!isAccessProtectionEnabled() || await isValidAccessCookie(accessCookie))) {
    redirect(nextPath);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <UnlockForm nextPath={nextPath} setupRequired={setupRequired} />
    </main>
  );
}
