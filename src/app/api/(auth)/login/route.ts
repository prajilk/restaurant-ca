import { error401, error404, success200 } from "@/lib/utils";
import UserModel from "@/models/userModel";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export async function POST(req: NextRequest) {
    await dbConnect(); // connect to mongodb

    const { username, password } = await req.json();
    const user = await UserModel.findOne({ username });

    if (!user) {
        return error404("Invalid username!");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return error401("Invalid password!");
    }

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
        expiresIn: "3d",
    });

    const userWithoutPassword = user.toObject();
    // @ts-ignore
    delete userWithoutPassword.password;

    return success200({ user: userWithoutPassword, token });
}
