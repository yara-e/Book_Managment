import { OrderStatus } from '../../../generated/prisma/enums';

export interface GetAdminOrdersParams {
    limit: number;
    cursor?: number;
    direction: 'next' | 'prev';
    status?: OrderStatus;
    searchEmail?: string;
}