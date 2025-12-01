import { Role } from "$/generated/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const isAdminPath = pathname.startsWith("/admin");
  const isClientPath = pathname.startsWith("/client");

  if (!req.auth) {
    if (isAdminPath || isClientPath) {
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
    return NextResponse.next();
  }

  const role = req.auth.user.role;

  if (isAdminPath && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL("/client", nextUrl));
  }

  if (isClientPath && role === Role.ADMIN) {
    return NextResponse.redirect(
      new URL("/admin/foods-management/foods", nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
