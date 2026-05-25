"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE_NAME,
  getAccessCookieValue,
  isAccessProtectionEnabled,
  isValidAccessPassword,
} from "@/lib/auth";

export interface UnlockState {
  error?: string;
}

export async function unlockAction(
  _prevState: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/");

  if (!isAccessProtectionEnabled()) {
    redirect("/");
  }

  if (!(await isValidAccessPassword(password))) {
    return { error: "Contraseña incorrecta." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, await getAccessCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(nextPath.startsWith("/") ? nextPath : "/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);
  redirect("/unlock");
}
