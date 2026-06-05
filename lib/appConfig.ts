export const appConfig = {
  name:
    process.env.NEXT_PUBLIC_DASHBOARD_NAME?.trim() ||
    "Centro de Control IA",
  subtitle:
    process.env.NEXT_PUBLIC_DASHBOARD_SUBTITLE?.trim() ||
    "Dashboard operativo. Presente primero.",
  timezone:
    process.env.NEXT_PUBLIC_DASHBOARD_TIMEZONE?.trim() ||
    "America/Argentina/Buenos_Aires",
};
