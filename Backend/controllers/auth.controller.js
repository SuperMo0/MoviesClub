import { sign, verify } from "../lib/jwt.js";
import { validateNewUser } from "../middlewares/validate.js";
import * as model from "../Models/auth.model.js"
import { compare, hash } from "../lib/bcrypt.js";

function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await model.getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Wrong credentials" });
        }

        await sign(user, res);

        return res.status(200).json({ user: sanitizeUser(user) });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function signup(req, res) {
    try {
        let { name, username, password } = req.body;

        const { error, ok } = validateNewUser(name, username, password);

        if (!ok) {

            return res.status(400).json({ message: error || "Invalid request parameters" });
        }

        const hashedPassword = await hash(password);

        const user = await model.insertUser(name, username, hashedPassword);

        await sign(user, res);

        return res.status(201).json({ user: sanitizeUser(user) });

    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(409).json({ message: "Username already exists" });
        }

        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function check(req, res) {
    try {
        const { jwt } = req.cookies;

        if (!jwt) {
            return res.status(200).json({ user: null });
        }


        let userId = await verify(jwt);

        if (!userId) {
            return res.status(200).json({ user: null });
        }


        let user = await model.getUserById(userId);

        if (!user) {
            res.clearCookie("jwt");
            return res.status(200).json({ user: null });
        }

        return res.status(200).json({ user: sanitizeUser(user) });

    } catch (error) {
        return res.status(200).json({ user: null });
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Error during logout" });
    }
}