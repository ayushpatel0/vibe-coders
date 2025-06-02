import connectDB from "@/lib/dbConnect";
import userModel from "@/models/users.model";
import { userLoginSchema } from "@/utils/user.schema";
import { compare } from "bcryptjs";
import {sign} from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        const validation = userLoginSchema.safeParse({ email, password });
        if (validation.success === false) {
            return Response.json({
                message: "Invalid input",
                status: 400,
                errors: validation.error.errors.map(e => e.message).join(", "),
                success: false,
            }, { status: 400 });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return Response.json({
                message: "User not found",
                status: 404,
                success: false,
            }, { status: 404 });
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return Response.json({
                message: "Invalid password",
                status: 401,
                success: false,
            }, { status: 401 });
        }
        const token = sign({ id: user._id }, String(process.env.JWT_SECRET), { expiresIn: "1h" });
        const res = NextResponse.json({
            message: "Login successful",
            status: 200,
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                profile: "",
            },
            success: true,
        }, { status: 200 });
        res.cookies.set("token", token, { httpOnly: true, maxAge: 60 * 60 });
        return res;
        
    } catch (error) {
        console.log("Error in login:", error);
        return Response.json({
            message: "Internal server error",
            status: 500,
            success: false,
            error: "Something went wrong",
        }, { status: 500 });
    }
}