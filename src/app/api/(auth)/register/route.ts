import connectDB from "@/lib/dbConnect";
import userModel from "@/models/users.model";
import { userRegisterSchema } from "@/utils/user.schema";
import {hash} from "bcryptjs"


export async function POST(request: Request) {
    try {
        await connectDB();
        const {
            fullname,
            email,
            password,
        } = await request.json();

        const validation = userRegisterSchema.safeParse({ fullname, email, password })
        if (validation.success === false) {
            return Response.json({
                message: "Invalid input",
                status: 400,
                errors: validation.error.errors.map(e => e.message).join(", "),
            }, { status: 400 });
        }

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return Response.json({
                message: "User already exists",
                status: 409,
            }, { status: 409 });
        }
        await userModel.create({
            fullname,
            email,
            password: await hash(password, 10),
        });
        return Response.json({  
            message: "User registered successfully",
            status: 201,
            success: true,
        }, { status: 201 });

    } catch (error) {
        console.error("Error in registration:", error);
        return Response.json({
            message: "Internal server error",
            status: 500,
        }, { status: 500 });
    }
}