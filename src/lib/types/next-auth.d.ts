import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        username: string;
        role: string;
        isAuthenticated: boolean;
    }
    interface Session {
        user: User & {
            username: string;
        };
        session: {
            username: string;
        };
    }
}
