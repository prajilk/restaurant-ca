import { error400, error403, error500, success200, success201 } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";
import { NextRequest } from "next/server";

async function postHandler(req: NextRequest) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }
        const result = ZodStoreSchema.safeParse(data);

        if (result.success) {
            const store = await Store.create(result.data);
            return success201({ store });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error: any) {
        if(error.message.startsWith("E11000 duplicate key error")) {
            return error400("Store name already exists.", {});
        }
        return error500({ error: error.message });
    }
}

async function getHandler(req: NextRequest) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const stores = await Store.find({});

        return success200({ stores });
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);