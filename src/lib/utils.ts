import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function isRestricted(user: Request["user"]) {
    return user?.role !== "ADMIN" && user?.role !== "SUPERADMIN";
}

export { cn, isRestricted };
