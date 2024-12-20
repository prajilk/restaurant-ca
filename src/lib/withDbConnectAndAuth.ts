import dbConnect from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { error401, error500 } from "./utils";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export function withDbConnectAndAuth(handler: Function, isAuthRequired = true) {
    return async (req: NextRequest) => {
        try {
            const [_, session] = await Promise.all([
                dbConnect(),
                getServerSession(authOptions)
            ])

            if (isAuthRequired) {
                if (!session || !session.user || !session.user.id) {
                    return error401("Unauthorized");
                }
                (req as any).user = session.user; // Attach user to request
            }

            return await handler(req); // Proceed with the handler
        } catch (error) {
            console.error("Middleware Error:", error);
            return error500({
                message: "Unauthorized or Internal Server Error",
            });
        }
    };
}
