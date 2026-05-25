export const ACCESS_COOKIE_NAME = "control_center_access";

export function isAccessProtectionEnabled() {
  return Boolean(process.env.DASHBOARD_ACCESS_PASSWORD?.trim());
}

export function isDashboardConfigurationLocked() {
  const hasConnectedData = Boolean(
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim(),
  );
  const explicitlyPublic = process.env.DASHBOARD_PUBLIC_ACCESS === "true";

  return (
    process.env.NODE_ENV === "production" &&
    hasConnectedData &&
    !explicitlyPublic &&
    !isAccessProtectionEnabled()
  );
}

async function digest(value: string) {
  const encoded = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((part) => part.toString(16).padStart(2, "0"))
    .join("");
}

export async function getAccessCookieValue() {
  const password = process.env.DASHBOARD_ACCESS_PASSWORD ?? "";
  const secret = process.env.DASHBOARD_COOKIE_SECRET ?? password;

  return digest(`control-center-template:${password}:${secret}:v1`);
}

export async function isValidAccessPassword(password: string) {
  const expected = process.env.DASHBOARD_ACCESS_PASSWORD?.trim();
  if (!expected) return false;

  return (await digest(password)) === (await digest(expected));
}

export async function isValidAccessCookie(value: string | undefined) {
  if (!isAccessProtectionEnabled()) return true;
  if (!value) return false;

  return value === (await getAccessCookieValue());
}
