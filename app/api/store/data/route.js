import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get store info & store products
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get('username').toLowerCase();

        if (!username) {
            return NextResponse.json({error: "Missing username"}, 
                { status: 400})
        }
// Get store info and instock products with ratings
        const store = await prisma.store.findUnique({
            where: { username, isActive: true},
            include: { Product: { rating: true}}
        })
        if (!store) {
            return NextResponse.json({error: "Store not found"}, 
                { status: 400})
        }

        return NextResponse.json({ store })

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, { status: 400})
        
    }
}
