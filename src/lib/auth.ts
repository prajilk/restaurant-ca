import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    jwt: {
        maxAge: 12 * 60 * 60,
    },
    pages: {
        signIn: "/",
    },
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({
                    username: credentials?.username,
                }).select("+password");

                if (!user) throw new Error("Wrong Username");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch) throw new Error("Wrong Password");
                return {
                    username: user.username,
                    role: user.role,
                    isAuthenticated: true,
                    id: user._id,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                return { ...token, ...session.user };
            }
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role,
                };
            }
            return token;
        },
        async session({ session, token }) {
            try {
                if (token.sub) {
                    const user = await User.findById(token.sub);

                    if (!user) {
                        return {
                            ...session,
                            user: {
                                ...session.user,
                                id: token.sub,
                                role: user?.role,
                                username: user?.username,
                                isAuthenticated: false,
                            },
                        };
                    }
                }
            } catch (error) {
                console.log(error);

                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.sub,
                        role: token.role,
                        isAuthenticated: false,
                    },
                };
            }
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    role: token.role,
                    isAuthenticated: true,
                },
            };
        },
    },
};
