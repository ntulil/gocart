import { Inngest } from "inngest";
// import "./functions"; // Add this line!

// Create a client to send and receive events
export const inngest = new Inngest({ id: "gocart-ecommerce" });

// AI generated comments and code from here down

// ✅ CRITICAL: Import all functions to register them
// import "./functions"; // Add this line!

// Debug logging (development only)
if (process.env.NODE_ENV === "development") {
  console.log('=== INNGEST CLIENT LOADED ===');
  console.log('Registered functions:', inngest.functionIds);
  console.log('Total functions:', inngest.functionIds?.length || 0);
}