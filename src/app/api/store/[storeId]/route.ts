import { error400, error403, error500, success200 } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import Store from "@/models/storeModel";
import User from "@/models/userModel";
import { NextRequest } from "next/server";

async function updateHandler(req: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const data = await req.json();
        
        if (!data) {
            return error400("Invalid data format.", {});
        }

        const { storeId } = await params;

        const result = ZodStoreSchema.safeParse(data);

        if (result.success) {
            const existingStore = await Store.findOne({
                _id: storeId,
            });

            if (!existingStore) {
                return error400("User not found.");
            }

            const updatedStore = await Store.findOneAndUpdate(
                { _id: storeId }, result.data, { new: true }
            );            

            return success200({ store: updatedStore });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

async function deleteHandler(req: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const { storeId } = await params;
        // Step 1: Check if any users have this storeId
        const userWithStore = await User.findOne({ storeId: storeId });

        if (userWithStore) {
            // If users are associated, block deletion
            return error400("Cannot delete this store. There are users associated with this store.");
        }

        const deletedStore = await Store.deleteOne({ _id: storeId });

        if (!deletedStore.acknowledged) {
            return error500({ error: "Failed to delete store" });
        }

        return success200({});
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const PUT = withDbConnectAndAuth(updateHandler);
export const DELETE = withDbConnectAndAuth(deleteHandler);