import jwt from 'jsonwebtoken'

let SECRET = process.env.SECRET
export async function sign(user, res) {

    return await new Promise((resolve, reject) => {
        jwt.sign({ id: user.id }, SECRET, { expiresIn: "30 days" }, (error, token) => {
            if (error) return reject(error);

            res.cookie("jwt", token, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            resolve(token);
        });
    })
}

export async function verify(token) {
    if (!token) throw 'no token';
    return await new Promise((res, rej) => {
        jwt.verify(token, SECRET, (error, token) => {
            if (error) return rej(error);
            res(token.id);
        })
    })


}