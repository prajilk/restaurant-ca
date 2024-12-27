import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function isRestricted(user: Request["user"], allow: RolesSet[] = ["ADMIN"]) {
    // If the user's role is "SUPERADMIN", always return false (no restriction)
    if (user?.role === "SUPERADMIN") {
        return false;
    }

    // If a user is not in the allowedRoles, they are restricted
    return !allow.includes(user?.role as RolesSet);
}

export { cn, isRestricted };
