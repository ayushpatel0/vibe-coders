import { NextRequest } from "next/server";
import { getWebPageFromImageUsingGemini } from "@/utils/gemini";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function POST(req:NextRequest) {
    try {
        const formData = await req.formData();
        // console.log("Form data received:", formData);
        const file = formData.get("image") as File;

        const imgData = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(process.cwd(), "/public/uploads/", file.name), imgData);
        const imagePath = path.join(process.cwd(), "public", "uploads", file.name);
        const response = await getWebPageFromImageUsingGemini(imagePath);
        await unlink(imagePath); // Delete the file after processing

        return Response.json({
            message: "Response generated successfully", 
            data: response,
            success: true
        }, { status: 200 });

    } catch (error) {
        console.log("Error occurred while generating response from Gemini API:", error);
        return Response.json({
            message: "Error occurred while generating response from Gemini API",
            error: "Some error occurred while generating response from Gemini API",
            status: 500,
            success: false,
        }, { status: 500 });
    }
}