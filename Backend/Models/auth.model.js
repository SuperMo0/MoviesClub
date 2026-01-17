import { prisma } from '../lib/prisma.js'

export async function insertUser(name, username, password) {
    try {
        let user = await prisma.user.create({
            data: {
                name: name,
                username: username,
                password: password,
                chats: {
                    connectOrCreate: {
                        create: {
                            id: "1",
                            name: 'global'
                        },
                        where: {
                            id: "1"
                        }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
            }
        })
        return user

    } catch (error) {
        console.log(error);

        throw (error)
    }
}

export async function getUserByUsername(username) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        return user;

    } catch (error) {
        throw error
    }
}


export async function getUserById(id) {

    try {
        const user = prisma.user.findUnique({
            where: {
                id: id
            }, select: {
                id: true,
                name: true,
                username: true,
                image: true,
            }
        })
        return user;

    } catch (error) {
        throw error;
    }
}