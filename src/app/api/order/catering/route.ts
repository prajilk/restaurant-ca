import { error400, error403, error500, success200, success201 } from "@/lib/response";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import CateringMenu from "@/models/cateringMenuModel";
import Catering from "@/models/cateringModel";
import Customer from "@/models/customerModel";
import Store from "@/models/storeModel";
import { NextRequest } from "next/server";

async function postHandler(req: NextRequest) {
    try {
        if(isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }
        const result = ZodCateringSchema.safeParse(data);

        if (result.success) {
            const customer = await Customer.create(result.data.customerDetails);
            const order = await Catering.create({
                ...result.data,
                customer: customer._id
            });
            return success201({ order });
        }

        if (result.error) {
            console.log(result.error);
            return error400("Invalid data format.", {});
        }
    } catch (error: any) {
        console.log(error);
        return error500({error: error.message});
    }
}

async function getHandler(req: NextRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const storeId = req.nextUrl.searchParams.get('storeId');
        
        // Build the query object dynamically based on the presence of storeId
        const query = storeId ? { store: storeId } : {};

        const orders = await Catering.find(query)
            .populate({path: "store", model: Store})
            .populate({path: "customer", model: Customer})
            .populate({path: "items.itemId", model: CateringMenu});
        
        return success200({ orders });
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);