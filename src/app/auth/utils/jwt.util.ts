import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;

if (!ACCESS_TOKEN_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

// 💡 Update: Changed 'id' to 'uuid' and ensured it's a string
interface JwtPayload {
    uuid: string;
    role: string;
}

export const createAccessToken = (user: JwtPayload) => {
    return jwt.sign(
        {
            uuid: user.uuid,
            role: user.role,
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d",  
        }
    );
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
}