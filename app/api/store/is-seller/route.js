import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

// Auth seller
export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({error: "Unauthorized"}, 
                { status: 401})
        }

        const storeInfo = await prisma.store.findUnique({
            where: { userId}
        })

        return NextResponse.json({isSeller, storeInfo})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, { status: 400})
        
    }
    
}