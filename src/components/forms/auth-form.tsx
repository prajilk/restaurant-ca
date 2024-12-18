"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { ZodAuthSchema } from "@/lib/zod-schema/schema";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import LoadingButton from "../ui/loading-button";

const AuthForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [signInLoading, setSignInIsLoading] = useState(false);
    const router = useRouter();
    const callback = useSearchParams();

    const form = useForm<z.infer<typeof ZodAuthSchema>>({
        resolver: zodResolver(ZodAuthSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function handleSignIn(data: z.infer<typeof ZodAuthSchema>) {
        setError(null);
        setSignInIsLoading(true);

        try {
            const signInResponse = await signIn("credentials", {
                username: data.username,
                password: data.password,
                redirect: false,
                callbackUrl: callback.get("callbackUrl") || "/dashboard",
            });

            if (signInResponse?.error) {
                form.reset();
                throw new Error("Invalid credentials.");
            }
            toast.success("Signed in successfully.");
            router.refresh();
            router.replace(signInResponse?.url || "/");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setSignInIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSignIn)}
                className="space-y-4"
                method="post"
            >
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="mb-3">
                            <Label htmlFor="username">Username</Label>
                            <FormControl className="space-y-2">
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="mb-3">
                            <Label htmlFor="password">Password</Label>
                            <FormControl className="space-y-2">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error ? (
                    <span className="mt-3 block h-5 text-center text-xs font-medium text-destructive dark:text-red-500">
                        {error}
                    </span>
                ) : (
                    <span className="mt-3 block h-5" />
                )}
                <LoadingButton
                    isLoading={signInLoading}
                    type="submit"
                    className="w-full"
                >
                    Log in
                </LoadingButton>
            </form>
        </Form>
    );
};

export default AuthForm;
