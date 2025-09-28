import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// Approve seller
export async function POST(req){
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401})
        }

        const { storeId, status } = await req.json()

        if (status === 'approved') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "approved", isActive: true }
            })
        }else if (status === 'rejected') {
            await prisma.store.update({
                where: { id: storeId},
                data: { status: "rejected"}
            })
        }

        return NextResponse.json({ message: status + " successfully"})

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400})
    }
}
// get all pending and rejected stores
export async function GET(req){
    try {
        const { userId } = await getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized"}, {status: 401})
        }

        const stores = await prisma.store.findMany({
            where: { status: { in: ["pending", "rejected"]}},
            include: { user: true }
        })

        return NextResponse.json({ stores })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message}, { status: 400})
    }
}


/* import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Approve seller
export async function POST(req) {
    try {
        const { userId } = await getAuth(req); // Added await
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { storeId, status } = await req.json();

        // Add validation
        if (!storeId || !status) {
            return NextResponse.json({ error: "Missing storeId or status" }, { status: 400 });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        if (status === 'approved') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "approved", isActive: true }
            });
        } else if (status === 'rejected') {
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "rejected", isActive: false } // Added isActive: false
            });
        }

        return NextResponse.json({ message: status + " successfully" }); // Fixed space

    } catch (error) {
        console.error("Admin approval error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Get all pending and rejected stores
export async function GET(req) {
    try {
        const { userId } = await getAuth(req); // Added await
        const isAdmin = await authAdmin(userId);

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const stores = await prisma.store.findMany({
            where: { status: { in: ["pending", "rejected"] } },
            include: { user: true }
        });

        return NextResponse.json({ stores });

    } catch (error) {
        console.error("Admin stores fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} */