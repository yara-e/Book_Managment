import { prisma } from "../../common/db/prisma"


export const findUserByEmailRepo = async (email: string) => {
    return await prisma.user.findUnique({ where: { email } })
};

export const createUser = async (data: any) => {
    return await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: data.password,
            phone: data.phone,
            address: data.address,
            city: data.city,
            country: data.country,
            // role is handled by @default(USER)  
        }
    });
};

export const updateResetToken = async (id: number, token: string, expiry: Date) => {
    return await prisma.user.update({
        where: { id },
        data: { resetPasswordToken: token, resetPasswordExpires: expiry }
    });
};

export const findUserByValidToken = async (token: string) => {
    return await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { gt: new Date() }  
        }
    });
};

export const updatePasswordAndClearToken = async (id: number, passwordHash: string) => {
    return await prisma.user.update({
        where: { id },
        data: {
            password: passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });
};