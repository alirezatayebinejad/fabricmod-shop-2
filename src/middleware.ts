import { cookiesNames } from "@/constants/cacheNames";
import { routePermissions } from "@/constants/permissions";
import { getAuth } from "@/services/auth";
import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest) => {
  const userSessionCookie = request.cookies.get(cookiesNames.userSession);
  const userInfoCookie = request.cookies.get(cookiesNames.userInfo);
  const userPermsCookie = request.cookies.get(cookiesNames.userPermissions);
  const userSession = userSessionCookie
    ? getAuth.session(userSessionCookie.value)
    : undefined;
  const userInfo = userInfoCookie
    ? getAuth.user(userInfoCookie.value)
    : undefined;
  let userPerms;
  try {
    userPerms = userPermsCookie
      ? getAuth.perms(userPermsCookie.value)
      : undefined;
  } catch (error) {
    console.error("Error parsing user permissions:", error);
    userPerms = [];
  }
  const path = request.nextUrl.pathname;
  const authRequiredPaths = ["/panel", "/dashboard"];

  /* ------- redirect if logged in or not to the desired path --------- */

  if (path.startsWith("/auth") && userSession?.token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (authRequiredPaths.some((authPath) => path.startsWith(authPath))) {
    if (!userSession?.token) {
      return NextResponse.redirect(
        new URL(
          `/auth/login?fallback=` + path + "?" + request.nextUrl.searchParams,
          request.url,
        ),
      );
    }
  }

  /* ----------- check if the user has the permission of the page in admin panel -------------- */

  if (path.startsWith("/panel")) {
    const roles = userInfo?.roles?.map((item) => item.name) || [];
    if (roles.includes("super_admin")) return;
    const requiredPermission =
      routePermissions[path] ||
      Object.entries(routePermissions).find((r) =>
        path.startsWith(r[0]),
      )?.[1] ||
      null;
    if (
      !roles.includes("admin") ||
      (requiredPermission && !userPerms?.includes(requiredPermission))
    ) {
      return NextResponse.error();
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/auth/:path*", "/panel/:path*", "/dashboard/:path*"],
};
