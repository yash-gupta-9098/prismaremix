import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createDiscount = async ({ title, startsAt, endsAt, minimumRequirementSubtotal, discountAmount }) => {
    try {
        console.log('Creating discount with:', { title, startsAt, endsAt, minimumRequirementSubtotal, discountAmount });
        const discount = await prisma.discount.create({
            data: {
                title,
                startsAt: startsAt ? new Date(startsAt) : null,
                endsAt: endsAt ? new Date(endsAt) : null,
                minimumRequirementSubtotal: minimumRequirementSubtotal,
                discountAmount: discountAmount,
            },
        });
        console.log('Discount created:', discount);
        return discount;  
    } catch (error) {
        console.error('Error creating discount:', error);
        throw new Error('Error creating discount');
    }
};
