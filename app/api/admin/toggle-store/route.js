import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Toggle store isActive
export async function POST(req){
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized"}, 
                {status: 401})
        }

        const { storeId } = await req.json()

        if ( !storeId ) {
            return NextResponse.json({ error: "Missing storeID"}, 
                { status: 400});
        }

        // Find the store
        const store = await prisma.store.findUnique({where: 
            {id: storeId}
        })
        if (!store) {
            return NextResponse.json({ error: "Store not found"}, 
                { status: 400});
        }

        await prisma.store.update({
            where: { id: storeId},
            data: { isActive: !store.isActive}
        })

        return NextResponse.json({ error: "Store updated successfully"});      


    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message}, 
            { status: 400})
    }
}
