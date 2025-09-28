import { clerkClient } from "@clerk/nextjs/server"

const authAdmin = async (userId) => {
    try {
        if (!userId) return false

        const client = await clerkClient()
        // const user = await client.users.getUser(userId) --- IGNORE --- AI
        
        const user = await client.users.getUser(userId);


        return process.env.ADMIN_EMAIL.split(',').includes(user.emailAddresses[0].emailAddress)

    } catch (error) {
        console.error(error)
        return false
    }
}

export default authAdmin; 



// // all code below is DS AI gen
// import { clerkClient } from "@clerk/nextjs/server"

// const authAdmin = async (userId) => {
//     try {
//         if (!userId) return false

//         // Correct usage - clerkClient is already initialized
//         const user = await clerkClient.users.getUser(userId)
        
//         // Check if user has email addresses
//         if (!user.emailAddresses || user.emailAddresses.length === 0) {
//             return false
//         }
        
//         // Get the primary email address
//         const primaryEmail = user.emailAddresses[0].emailAddress
        
//         // Check if the email is in the admin list
//         const adminEmails = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.split(',') : []
//         return adminEmails.includes(primaryEmail)

//     } catch (error) {
//         console.error("Admin auth error:", error)
//         return false
//     }
// }

// export default authAdmin

/* import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  try {
    if (!userId) return false;

    // ✅ clerkClient is already ready to use – no need to call it
    const user = await clerkClient.users.getUser(userId);

    const adminEmails = (process.env.ADMIN_EMAIL || "").split(",");
    return adminEmails.includes(user.emailAddresses[0].emailAddress);
  } catch (error) {
    console.error("authAdmin error:", error);
    return false;
  }
};

export default authAdmin;
 */

/* import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  try {
    if (!clerkClient) {
      console.error("❌ clerkClient is undefined - check Clerk configuration and CLERK_SECRET_KEY.");
      return false;
    }

    if (!userId) return false;

    const user = await clerkClient.users.getUser(userId);
    if (!user?.emailAddresses?.length) return false;

    const adminEmails = (process.env.ADMIN_EMAIL || "").split(",");
    console.log("✅ ADMIN_EMAIL loaded from env:", adminEmails);

    return adminEmails.includes(user.emailAddresses[0].emailAddress);
  } catch (error) {
    console.error("authAdmin error:", error);
    return false;
  }
};

export default authAdmin; */
