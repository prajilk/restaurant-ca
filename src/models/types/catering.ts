import mongoose from "mongoose";

export interface CateringDocument {
    _id: string;
    store: mongoose.Schema.Types.ObjectId;
    customer: mongoose.Schema.Types.ObjectId;
    deliveryDate: Date;
    items: [];
    advancePaid: number;
    pendingBalance: number;
    fullyPaid: boolean;
    totalPrice: number;
    status: "PENDING" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
}