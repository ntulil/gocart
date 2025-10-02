import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Verify coupon
export async function POST(req){
    try {
        const { userId, has } = await auth(req)
        const { code } = await req.json()

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase(),
                expiresAt: { gt: new Date()}
            }
        })

        if (!coupon) {
            return NextResponse.json({ error: "Coupon not found" }, { status: 404 })
        }
        if (coupon.forNewUser) {
            const userorders = await prisma.order.findMany({where: {userId}})
            if (userorders.length > 0) {
            return NextResponse.json({ error: "Coupon valid for New Users" }, { status: 400})
            }
        }

        if (coupon.forMember) {
            const hasPlusPlan = has({plan: 'plus'})
            if (!hasPlusPlan) {
                return NextResponse.json({ error: "Coupon valid for Members Only" }, { status: 400 })
            }
        }
        return NextResponse.json({ coupon })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400})
    }
}