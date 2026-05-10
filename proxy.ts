import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";

import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    const session = await checkSession();

    if (session) {
      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/", request.url))
        : NextResponse.next();

      const setCookie = session.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires
              ? new Date(parsed.Expires)
              : undefined,
            path: parsed.Path,
            maxAge: parsed["Max-Age"]
              ? Number(parsed["Max-Age"])
              : undefined,
          };

          if (parsed.accessToken) {
            response.cookies.set(
              "accessToken",
              parsed.accessToken,
              options
            );
          }

          if (parsed.refreshToken) {
            response.cookies.set(
              "refreshToken",
              parsed.refreshToken,
              options
            );
          }
        }
      }

      return response;
    }
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};