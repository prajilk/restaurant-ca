import mongoose from "mongoose";

export interface CateringDocument {
    _id: string;
    storeId: mongoose.Schema.Types.ObjectId;
    customerId: mongoose.Schema.Types.ObjectId;
    deliveryDate: Date;
    items: [];
    totalPrice: number;
}
