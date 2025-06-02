import userModel from "@/models/users.model";
import dbConnect from "@/lib/dbConnect";
import {verify} from "jsonwebtoken";
import {NextRequest} from "next/server";


export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return Response.json({
      message: "Token not provided",
      status: 401,
      success: false,
    }, {status: 401});
  }

  try {
    await dbConnect();

    const decoded = verify(token, process.env.JWT_SECRET as string) as {id: string};
    if (!decoded) {
      return Response.json({
        message: "Invalid token",
        status: 401,
        success: false,
      }, {status: 401});
    }
    const user = await userModel.findById(decoded.id).select("-password -__v -createdAt -updatedAt -profile -isVerified");

    if (!user) {
      return Response.json({
        message: "User not found",
        status: 401,
        success: false,
      }, {status: 401});;
    }

    return Response.json({
      message: "User found",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        profile: "",
      },
      status: 200,
      success: true,
    }, {status: 200});

  } catch (error) {
    console.error("Error verifying token:", error);
    return new Response(JSON.stringify({error: "Invalid token"}), {status: 401});
  }
}