import { Schema, model, models } from "mongoose";
import { CateringMenuDocument } from "./types/catering-menu";

const CateringMenuSchema = new Schema<CateringMenuDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: String,
        image: String
    },
    { versionKey: false }
);

const CateringMenu =
    models?.CateringMenu || model<CateringMenuDocument>("CateringMenu", CateringMenuSchema);
export default CateringMenu;
