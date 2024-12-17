import { Document, Model, Schema, model, models } from "mongoose";
import { IUser } from "./types/user";

const userSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);

const UserModel: Model<IUser> = models.User || model("User", userSchema);

export default UserModel;
