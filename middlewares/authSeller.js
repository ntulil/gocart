import prisma from '@/lib/prisma';

const authSeller = async ( userId ) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
                include: {
                    store: true,
                },
            });
    
            if (user && user.store) {
                if (user.store.status === 'approved') {
                    return user.store.id;
                } 
                // else {
                //     return false;
                // }
            } else {
                return false;
            }
    /**
     * If there is an error with the prisma query, catch the error, log it, and return false
     */
    } catch (error) {
        console.error(error)
        return false
    }  
}

export default authSeller;