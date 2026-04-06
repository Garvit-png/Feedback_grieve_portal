import { NextResponse } from "next/server";
import { withAppAuth } from "@/lib/authMiddleware";

async function handler(req: Request) {
    return NextResponse.json({
        message: "You are authorized!",
        success: true,
    });
}

export const GET = withAppAuth(handler);
