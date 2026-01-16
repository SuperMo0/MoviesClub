import { verify } from "../lib/jwt.js";
export default async function protect(req, res, next) {
    try {
        const { jwt } = req.cookies;
        let userId = await verify(jwt);
        req.userId = userId;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
} 