import { default as middleware } from "next-auth/middleware";

export const proxy = middleware;

export const config = {
//    matcher: ["/dashboard", "/dashboard/:path*", "/auth/register"],
    // matcher: ["/dashboard", "/dashboard/:path*"],
    matcher: ["/auth/register"],
};