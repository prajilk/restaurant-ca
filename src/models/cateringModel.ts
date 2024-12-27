import mongoose, { Schema, model, models } from "mongoose";
import { CateringDocument } from "./types/catering";

const CateringSchema = new Schema<CateringDocument>(
    {
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        deliveryDate: {
            type: Date,
            required: true,
        },
        items: {
            type: [
                {
                    itemId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "CateringMenu", // Reference to the Item collection
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                    priceAtOrder: {
                        // Store the price at the time of order
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

const Catering =
    models?.Catering || model<CateringDocument>("Catering", CateringSchema);
export default Catering;
