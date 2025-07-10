import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
    const user = await currentUser();
  
    if (!user) {
        return null;
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id,
            }
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name: name || 'Anonymous User',
                imageUrl: user.imageUrl || null,
                email: user.emailAddresses[0]?.emailAddress || `${user.id}@example.com`
            },
        });

        return newUser;

    } catch (error) {
        console.log('Error in checkUser:', error.message);
        
        // If unique constraint error, try to find the user again
        if (error.code === 'P2002' && error.meta?.target?.includes('clerkUserId')) {
            try {
                const existingUser = await db.user.findUnique({
                    where: {
                        clerkUserId: user.id,
                    }
                });
                if (existingUser) {
                    return existingUser;
                }
            } catch (findError) {
                console.log('Error finding existing user:', findError.message);
            }
        }
        
        return null;
    }
}