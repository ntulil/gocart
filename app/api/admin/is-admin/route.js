import { NextResponse } from "next/server"

// Auth Admin
export async function GET (request){
    try {
        const { userId } = getAuth(req)
        const isAdmin = await authAdmin(userId)

        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401})
        }
        
        return NextResponse.json({isAdmin})

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error.code || error.message }, { status: 400})
    }
}