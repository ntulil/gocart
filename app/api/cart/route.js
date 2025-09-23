import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// update user cart
export async function POST(req){
    try {
        const { userId } = getAuth(req)
        const { cart } = await req.json()

        // Save the cart to the user object
        await prisma.user.update({
            where: {id: userId}, 
            data: {cart: cart}
        })
        return NextResponse.json({ message: 'Cart updated' })

    } catch (error) {
         console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}

// update user cart
export async function GET(req){
    try {
        const { userId } = getAuth(req)
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
        return NextResponse.json({ cart: user.cart })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}