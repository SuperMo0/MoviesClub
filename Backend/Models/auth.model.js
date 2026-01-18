import { prisma } from '../lib/prisma.js'

export const userProfileSelect = {
    id: true,
    name: true,
    username: true,
    image: true,
    bio: true,
    joinedAt: true,
    _count: {
        select: {
            followedBy: true,
            following: true,
        }
    }
}

export async function insertUser(name, username, password) {
    return await prisma.user.create({
        data: {
            name,
            username,
            password,
            image: "https://i.pinimg.com/originals/e7/ba/95/e7ba955b143cda691280e1d0fd23ada6.jpg",
        },
        select: userProfileSelect
    })
}

export async function getUserByUsername(username) {
    return await prisma.user.findUnique({
        where: {
            username: username
        }
    })
}


export async function getUserById(id) {
    return await prisma.user.findUnique({
        where: {
            id: id
        },
        select: userProfileSelect
    })
}