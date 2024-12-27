import mongoose from "mongoose";

export interface UserDocument {
    _id: string;
    username: string;
    role: "SUPERADMIN" | "ADMIN" | "MANAGER" | "DELIVERY";
    password: string;
    lpp: string;
    storeId: mongoose.Schema.Types.ObjectId | null;
    iv?: string;
}
