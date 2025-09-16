import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get Dashboard Data for Admin (total orders, total stores, total products, total revenue )
export async function GET(req) {

    try {
        
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)
        
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized"}, 
                {status: 401})
            }    
            // Get total orders
            const orders = await prisma.order.count()
            // Get total stores on app
            const stores = await prisma.store.count()
            // get all orders include only createdAt and total & calculate total revenue
            const allOrders = await prisma.order.findMany({
                select: {
                    createdAt: true,
                    total: true,
                }
            })
            let totalRevenue = 0
            allOrders.forEach(order => {
                totalRevenue += order.total
            })
            const revenue = totalRevenue.toFixed (2)
            // total products on app
            const products = await prisma.product.count()
            const dashboardData = {
                orders,
                stores,
                products,
                revenue,
                allOrders
            }
            return NextResponse.json({dashboardData})
        
} catch (error) {
    console.error(error)
        return NextResponse.json({ error: error.code || error.message}, 
        { status: 400})
    }
}
