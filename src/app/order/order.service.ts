import Stripe from 'stripe';
import * as OrderRepo from './order.repository';
import { prisma } from "../../common/db/prisma"

import { AppError } from '../../common/error/AppError';
import { GetAdminOrdersParams } from './order.types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


// --- START CHECKOUT ---
export const startCheckout = async (userUuid: string, cartItems: { bookUuid: string, quantity: number }[]) => {
    const userId = await OrderRepo.findIdByUuid(userUuid);
    if (!userId) throw new AppError("User not found", 404);

    // 1. Fetch books by UUID to get current Stock and Price
    const books = await prisma.book.findMany({
        where: { uuid: { in: cartItems.map(i => i.bookUuid) } }
    });

    let total = 0;
    const lineItemsForStripe = [];
    const itemsForDb = [];

    for (const cartItem of cartItems) {
        const book = books.find(b => b.uuid === cartItem.bookUuid);

        if (!book) throw new AppError(`Book not found`, 404);

        // 💡 CHECK STOCK BEFORE CHECKOUT
        if (book.stock < cartItem.quantity) {
            throw new AppError(`Not enough stock for ${book.name}. Available: ${book.stock}`, 400);
        }

        total += book.price * cartItem.quantity;

        lineItemsForStripe.push({
            price_data: {
                currency: 'usd',
                product_data: { name: book.name },
                unit_amount: Math.round(book.price * 100),
            },
            quantity: cartItem.quantity,
        });

        itemsForDb.push({
            bookId: book.id, // Use internal ID for relation
            quantity: cartItem.quantity,
            price: book.price
        });
    }

    // 2. Create the PENDING Order
    const order = await OrderRepo.createPendingOrder(userId, total, itemsForDb);

    // 3. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItemsForStripe,
        mode: 'payment',
        metadata: { orderUuid: order.uuid },
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/cancel`,
    });

    return { url: session.url };
};

// --- VERIFY PAYMENT ---
export const verifyPayment = async (sessionId: string) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
        const orderUuid = session.metadata?.orderUuid;

        // 💡 DECREASE STOCK AND MARK PAID
        const updatedOrder = await OrderRepo.updateStockAndStatus(orderUuid!);
        return updatedOrder;
    }

    throw new AppError("Payment not verified", 400);
};

export const findAdminOrdersService = async (params: GetAdminOrdersParams) => {
    const { limit, direction, cursor } = params;
    const orders = await OrderRepo.findAdminOrdersRepo(params);

    const hasMore = orders.length > limit;

    if (hasMore) {
        if (direction === 'next') {
            orders.pop();
        } else {
            orders.shift();
        }
    }

    if (orders.length === 0) {
        return { data: [], nextCursor: null, prevCursor: null };
    }

    const firstItem = orders[0].id;
    const lastItem = orders[orders.length - 1].id;

    return {
        data: orders,
        // Logic for the 'Previous' button
        prevCursor: (direction === 'prev' ? hasMore : !!cursor) ? firstItem : null,
        // Logic for the 'Next' button
        nextCursor: (direction === 'next' ? hasMore : true) ? lastItem : null,
    };
};