import { getResponseFromGemini } from "@/utils/gemini";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest) {
    const token = request.cookies.get("token")?.value || request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        return Response.json({
            message: "Unauthorized",
            status: 401,
            success: false,
        }, { status: 401 });
    }
    try {
        const { prompt } = await request.json();
        if (!prompt) {
            return Response.json({
                message: "Prompt is required",
                status: 400,
                success: false,
            }, { status: 400 });
        }
        const response = await getResponseFromGemini(prompt);
        return Response.json({
            message: "Code generated successfully",
            status: 200,
            success: true,
            response,
        }, { status: 200 });

    } catch (error) {
        console.error("Error in code generation:", error);
        return Response.json({
            message: "Internal Server Error",
            status: 500,
            success: false,
        }, { status: 500 });
        
    }
}