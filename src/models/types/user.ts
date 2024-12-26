import mongoose from "mongoose";

export interface UserDocument {
    _id: string;
    username: string;
    role: "ADMIN" | "MANAGER" | "DELIVERY";
    password: string;
    lpp: string;
    storeId: mongoose.Schema.Types.ObjectId;
    iv?: string;
}
