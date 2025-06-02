import { NextRequest, NextResponse } from "next/server";


export function GET(request: NextRequest) {
    const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return Response.json({
            message: "No token provided",
            success: false,
            status: 401,
        }, { status: 401 });
    }

    const res = NextResponse.json({
        message: "Logout successful",
        success: true,
        status: 200,
    }, { status: 200 });

    res.cookies.delete("token");
    return res;
}