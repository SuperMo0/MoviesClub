import { sign, verify } from "../lib/jwt.js";
import { validateNewUser } from "../middlewares/validate.js";
import * as model from "../models/auth.model.js"
import { compare, hash } from "../lib/bcrypt.js";


export async function login(req, res) {

    let user;
    try {
        const { username, password } = req.body;

        user = await model.getUserByUsername(username);

        let originalPassword = user.password;

        await compare(password, originalPassword)

    } catch (error) {
        return res.status(401).json({ message: "wrong credentials" })
    }

    try {
        await sign(user, res);
        res.status(201).json({ user: { name: user.name, username: user.username, image: user.image, id: user.id } });

    } catch (error) {
        console.log("error in login > sign token");
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function signup(req, res) {

    let { name, username, password } = req.body;

    const { error, ok } = validateNewUser(name, username, password);

    if (!ok) return res.status(401).json({ message: "Invalid request" })
    let user;
    try {
        password = await hash(password);
        user = await model.insertUser(name, username, password);
    } catch (error) {
        return res.status(401).json({ message: "Email already Exists" })
    }

    try {
        await sign(user, res);
        res.status(201).json({ user });

    } catch (error) {
        console.log("error in signup > sign token");
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function check(req, res) {
    try {
        const { jwt } = req.cookies;
        let userId = await verify(jwt);
        let user = await model.getUserById(userId);
        return res.json({ user });
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt");
        return res.json({ message: 'ok' });
    } catch (error) {
        return res.status(401).json({ message: "error please try again" });
    }
}