/* import { clerkClient } from "@clerk/nextjs/server"

const authAdmin = async (userId) => {
    try {
        if (!userId) return false

        const client = await clerkClient()
        // const user = await client.users.getUser(userId) --- IGNORE --- AI
        
        const user = await clerkClient.users.getUser(userId);


        return process.env.ADMIN_EMAIL.split(',').includes(user.
            emailAddresses[0].emailAddress)

    } catch (error) {
        console.error(error)
        return false
    }
}

export default authAdmin; */

// all code below is DS AI gen
import { clerkClient } from "@clerk/nextjs/server"

const authAdmin = async (userId) => {
    try {
        if (!userId) return false

        // Correct usage - clerkClient is already initialized
        const user = await clerkClient.users.getUser(userId)
        
        // Check if user has email addresses
        if (!user.emailAddresses || user.emailAddresses.length === 0) {
            return false
        }
        
        // Get the primary email address
        const primaryEmail = user.emailAddresses[0].emailAddress
        
        // Check if the email is in the admin list
        const adminEmails = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(',') : []
        return adminEmails.includes(primaryEmail)

    } catch (error) {
        console.error("Admin auth error:", error)
        return false
    }
}

export default authAdmin

