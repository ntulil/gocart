import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";

//  toggle stock of a product
export async function POST(req){
    try {
        const { userId } = getAuth(req);
        const {productId} = await req.json();

        if (!productId){
            return NextResponse.json({error: "Product ID details missing"}, {status: 400} );
        }
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({error:"Unauthotized"}, {status: 401})
        }

        // Check if product exists
        const product = await prisma.product.findFirst({
            where: { id: productId, storeId}
        })

        if (!productId) {
            return NextResponse.json({error: "No product found"}, { status: 404})
        }
        await prisma.product.update({
            where: { id: productId, storeId},
            data: { inStock: !product.inStock }
        })
            return NextResponse.json({error: "Product Stock updated successfully"})


    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message }, { status: 400})

    }
}