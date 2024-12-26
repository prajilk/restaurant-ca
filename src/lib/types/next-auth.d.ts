import NextAuth from "next-auth";

declare global {
    namespace NodeJS {
        interface Global {
            user: {
                id: string;
                role: string;
            };
        }
    }

    // Extend the Request interface to include user property
    interface Request {
        user?: {
                id: string;
                role: string;
            };
    }
}

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
