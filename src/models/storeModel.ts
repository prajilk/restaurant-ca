import { Schema, model, models } from "mongoose";
import { StoreDocument } from "./types/store";

const StoreSchema = new Schema<StoreDocument>(
    {
        name: {
            type: String,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
        phone: String,
    },
    { versionKey: false }
);

const Store = models?.Store || model<StoreDocument>("Store", StoreSchema);
export default Store;