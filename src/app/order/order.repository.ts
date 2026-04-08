import { prisma } from "../../common/db/prisma"
import { GetAdminOrdersParams } from "./order.types";



export const findIdByUuid = async (uuid: string) => {
    const user = await prisma.user.findUnique({
        where: { uuid },
        select: { id: true }
    });
    return user?.id;
};

export const createPendingOrder = async (userId: number, total: number, items: any[]) => {
    return await prisma.order.create({
        data: {
            userId,
            total,
            status: 'PENDING',
            items: {
                create: items.map(item => ({
                    bookId: item.bookId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        }
    });
};

export const updateStockAndStatus = async (orderUuid: string) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Find the order and its items
        const order = await tx.order.findUnique({
            where: { uuid: orderUuid },
            include: { items: true }
        });

        if (!order || order.status === 'PAID') return;

        // 2. Decrease stock for each item
        for (const item of order.items) {
            await tx.book.update({
                where: { id: item.bookId },
                data: {
                    stock: { decrement: item.quantity }
                }
            });
        }

        // 3. Mark order as PAID
        return await tx.order.update({
            where: { uuid: orderUuid },
            data: { status: 'PAID' }
        });
    });
};

export const findAdminOrdersRepo = async (params: GetAdminOrdersParams) => {
    const { limit, cursor, direction, status, searchEmail } = params;

    return await prisma.order.findMany({
        where: {
            ...(status && { status }),
            ...(searchEmail && {
                user: {
                    email: { contains: searchEmail, mode: 'insensitive' },
                },
            }),
        },
         
        take: direction === 'next' ? limit + 1 : -(limit + 1),
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor },
        }),
        orderBy: { id: 'desc' },
        include: {
            user: {
                select: {
                    email: true,
                    name: true,

                },
                payment: {  
                    select: {
                        method: true,
                        transactionId: true,
                        status: true 
                    }
                }
            },
        },
    });
};
