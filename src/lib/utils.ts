import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function success200(data: { [key: string]: any }) {
    const json = {
        success: true,
        message: "Success",
    };
    const resJson = Object.assign({}, json, data);
    return NextResponse.json(resJson, { status: 200 });
}

function error500(data: { [key: string]: any }) {
    const json = {
        success: false,
        message: "Something went wrong. SVR",
    };
    const resJson = Object.assign({}, json, data);
    return NextResponse.json(resJson, { status: 500 });
}

function error404(message: string, data?: { [key: string]: any }) {
    const json = {
        success: false,
        message,
    };
    const resJson = Object.assign({}, json, data);
    return NextResponse.json(resJson, { status: 404 });
}

function error400(message: string, data?: { [key: string]: any }) {
    const json = {
        success: false,
        message,
    };
    const resJson = Object.assign({}, json, data);
    return NextResponse.json(resJson, { status: 400 });
}

function error401(message: string, data?: { [key: string]: any }) {
    const json = {
        success: false,
        message,
    };
    const resJson = Object.assign({}, json, data);
    return NextResponse.json(resJson, { status: 401 });
}

export { cn, success200, error500, error404, error400, error401 };
