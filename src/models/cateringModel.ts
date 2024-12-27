import mongoose, { Schema, model, models } from "mongoose";
import { CateringDocument } from "./types/catering";

const CateringSchema = new Schema<CateringDocument>(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
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
        advancePaid: {
            type: Number,
            required: true,
        },
        pendingBalance: {
            type: Number,
            required: true,
        },
        fullyPaid: {
            type: Boolean,
            default: false,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["PENDING", "IN_PROGRESS", "DELIVERED", "CANCELLED"],
            default: "PENDING"
        }
    },
    { versionKey: false, timestamps: true }
);

const Catering =
    models?.Catering || model<CateringDocument>("Catering", CateringSchema);
export default Catering;
