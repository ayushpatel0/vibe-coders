import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
    fullname: string;
    email: string;
    password: string;
    profile: string;
    isVerified: boolean;
    otp: string;
    otpExpires: Date;
};

const userSchema: Schema<IUser> = new Schema<IUser>({
    fullname:   { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    profile:    String,
    isVerified: { type: Boolean, default: false },
    otp:        String,
    otpExpires: Date,
}, {
    timestamps: true
});

const userModel = models.users<IUser> || model<IUser>("users", userSchema);
export default userModel;