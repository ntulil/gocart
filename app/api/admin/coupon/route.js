import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin"
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/lib/inngest"; // ✅ Add this
import { inngest } from "./client";


// Add new coupon
export async function POST(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, { status: 401})
        }

        const { coupon } = await req.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({data: coupon}).then(async(coupon) => {
            // Trigger Inngest Scheduler function to delete coupon on expiry
            await inngest.send({
                name: 'app/coupon.expired',
                data: {
                    code: coupon.code,
                    expires_at: coupon.expiresAt
                }
            })
        })

        return NextResponse.json({message: "Coupon added successfully"})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:error.code || error.message}, {status:
            400})
    }
    
}
// Delete coupon /api/coupon?id=couponId
export async function DELETE(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, { status: 401})
        }
        const { searchParams } = req.nextUrl;
        const code = searchParams.get('code')

        await prisma.coupon.delete({ where: { code }})
        return NextResponse.json({ message: 'Coupon deleted successfully'})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:error.code || error.message}, {status:
            400})
    }
}

// Get all coupons
export async function GET(req) {
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, { status: 401})
        }
        const coupons = await prisma.coupon.findMany({})
        return NextResponse.json({ coupons })

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status:
            400})
    }
}