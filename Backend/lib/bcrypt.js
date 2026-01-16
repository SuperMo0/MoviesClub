import bcrypt from 'bcrypt'


export async function hash(password) {
    let result = await bcrypt.hash(password, 12);
    return result
}

export async function compare(current, original) {
    let result = await bcrypt.compare(current, original);
    return result;
}