import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma"; // adjust this path if needed

export const checkUser = async () => {
  try {
    // 1. Get the current user from Clerk
    const user = await currentUser();

    // 2. Return null if no user is found (not logged in)
    if (!user) return null;

    // 3. Check if the user exists in your database using clerkUserId
    const existingUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    // 4. If found, return existing user
    if (existingUser) return existingUser;

    // 5. Prepare user details from Clerk object
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const email =
      Array.isArray(user.emailAddresses) && user.emailAddresses.length > 0
        ? user.emailAddresses[0].emailAddress
        : "";
    const imageUrl = user.imageUrl || "";

    // 6. Create new user in your database
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        email,
        imageUrl,
        skills: [], // default empty array since it's required
      },
    });

    return newUser;
  } catch (error) {
    console.error("❌ Error in checkUser:", error);
    return null;
  }
};
