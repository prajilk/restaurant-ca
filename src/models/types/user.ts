export interface UserDocument {
    _id: string;
    username: string;
    role: "ADMIN" | "MANAGER" | "DELIVERY";
    password: string;
    storeId: string;
    iv?: string;
}
