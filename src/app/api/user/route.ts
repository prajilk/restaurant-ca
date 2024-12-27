import {
    error400,
    error403,
    error500,
    success200,
    success201,
} from "@/lib/response";
import User from "@/models/userModel";
import { NextRequest } from "next/server";
import { ZodUserSchemaWithPassword } from "@/lib/zod-schema/schema";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { decryptPassword, encryptPassword } from "@/lib/password";
import bcrypt from "bcryptjs";
import { isRestricted } from "@/lib/utils";

async function postHandler(req: NextRequest) {
    try {
        if (isRestricted(req.user)) return error403();

        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }
        const result = ZodUserSchemaWithPassword.safeParse(data);

        if (result.success) {
            const existingUser = await User.findOne({
                username: result.data.username.toLowerCase(),
            });

            if (existingUser) {
                return error400("Username already exists!");
            }

            const hashedPassword = encryptPassword(result.data.password);
            const bcryptPassword = await bcrypt.hash(result.data.password, 10);

            const newUser = await User.create({
                username: result.data.username.toLowerCase(),
                password: bcryptPassword,
                lpp: hashedPassword.encryptedPassword,
                role: result.data.role,
                storeId: result.data.storeId,
                iv: hashedPassword.iv,
            });

            return success201({
                user: {
                    id: newUser._doc._id,
                    username: newUser._doc.username,
                    role: newUser._doc.role,
                    storeId: newUser._doc.storeId,
                },
            });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error: any) {
        console.log(error);

        return error500({ error: error.message });
    }
}

async function getHandler(req: NextRequest) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const users = await User.find({
            role: { $nin: ["ADMIN", "SUPERADMIN"] },
        });

        const decryptedUsers = users.map((user: any) => {
            const decryptedPassword = decryptPassword(user.lpp, user.iv);
            return {
                id: user._id,
                username: user.username,
                role: user.role,
                storeId: user.storeId,
                password: decryptedPassword,
            };
        });

        return success200({ users: decryptedUsers });
    } catch (error: any) {
        console.log(error);

        return error500({ error: error.message });
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);
