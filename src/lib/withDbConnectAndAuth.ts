import dbConnect from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { error401, error500 } from "./utils";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key";

export function withDbConnectAndAuth(handler: Function, isAuthRequired = true) {
    return async (req: NextRequest) => {
        try {
            // Connect to MongoDB
            await dbConnect();

            if (isAuthRequired) {
                // Extract and verify JWT token
                const authHeader = req.headers.get("authorization");
                if (!authHeader) {
                    return error401("Unauthorized: No token provided");
                }

                const token = authHeader.split(" ")[1];
                if (!token) {
                    return error401("Unauthorized: Invalid token");
                }

                // Verify the token
                const decoded = jwt.verify(token, SECRET_KEY);
                (req as any).user = decoded; // Attach decoded user to request
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
