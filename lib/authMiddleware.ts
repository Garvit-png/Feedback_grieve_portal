import { NextResponse } from "next/server";
import prisma from "@/lib/dbInstance";
import crypto from "crypto";

type RouteHandler = (req: Request, context: any) => Promise<NextResponse> | NextResponse;

export function withAppAuth(handler: RouteHandler) {
    return async (req: Request, context: any) => {
        try {
            const token = req.headers.get("x-api-token");

            if (!token) {
                return NextResponse.json(
                    { message: "Unauthorized: Missing token", success: false },
                    { status: 401 }
                );
            }

            const hashid = crypto.createHash("sha256").update(token).digest("hex");

            const app = await prisma.app.findFirst({
                where: {
                    hashid: hashid,
                },
            });

            if (!app) {
                return NextResponse.json(
                    { message: "Unauthorized: Invalid token", success: false },
                    { status: 401 }
                );
            }

            // Optionally attach app to request if needed, but for now just proceed
            return handler(req, context);
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            return NextResponse.json(
                { message: "Internal Server Error", success: false },
                { status: 500 }
            );
        }
    };
}
