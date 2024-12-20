import {
    error400,
    error403,
    error500,
    success200,
    success201,
} from "@/lib/utils";
import User from "@/models/userModel";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { ZodUserSchemaWithPassword } from "@/lib/zod-schema/schema";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";

async function postHandler(req: NextRequest) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }
        const result = ZodUserSchemaWithPassword.safeParse(data);

        if (result.success) {
            const existingUser = await User.findOne({
                username: result.data.username,
            });

            if (existingUser) {
                return error400("Username already exists!");
            }

            const hashedPassword = await bcrypt.hash(result.data.password, 10);

            const newUser = await User.create({
                username: result.data.username,
                password: hashedPassword,
                role: result.data.role,
                storeId: result.data.storeId,
            });

            return success201({
                id: newUser._doc._id,
                username: newUser._doc.username,
                role: newUser._doc.role,
                storeId: newUser._doc.storeId,
            });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

async function getHandler(req: NextRequest) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const users = await User.find({
            role: { $ne: "ADMIN" },
        });

        success200(users)
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);