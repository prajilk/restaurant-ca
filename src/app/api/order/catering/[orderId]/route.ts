import { error403, error404, error500, success200 } from "@/lib/response";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import Customer from "@/models/customerModel";
import { NextRequest } from "next/server";

async function deleteHandler(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
    try {
        if (isRestricted(req.user)) return error403();

        const { orderId } = await params;

        const searchParams = req.nextUrl.searchParams.get('deleteCustomer');
        const deleteCustomer = searchParams ? searchParams.toLowerCase() === 'true' : false;

        const order = await Catering.findByIdAndDelete(orderId);
        if (!order) {
            return error404("Order not found.");
        }

        if (deleteCustomer) {
            const customer = await Customer.findByIdAndDelete(order.customer);

            if (!customer) {
                return error404("Customer not found.");
            }
        }

        return success200({ message: "Order deleted successfully." });
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const DELETE = withDbConnectAndAuth(deleteHandler);