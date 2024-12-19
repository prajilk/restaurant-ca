import { NextRequest } from "next/server";

export async function POST(req: NextRequest) { 
    const { title, description, price, image } = await req.json();
}