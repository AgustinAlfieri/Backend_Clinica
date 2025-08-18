import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET || "secreto";

export const generateToken = (payload: PayloadUser) => {
    return jwt.sign(payload, SECRET);
}