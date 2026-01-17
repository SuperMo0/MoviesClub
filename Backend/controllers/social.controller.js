import { prisma } from '../lib/prisma.js'
import v2 from '../lib/cloudinary.js'

export async function getFeed(req, res) {

    try {
        let posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                comments: true,
                _count: { select: { likedBy: true }, }
            }
        })

        res.json({ posts });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function getUserLikedPosts(req, res) {

    let userId = req.userId;

    let likedPosts = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            likedPosts: { select: { id: true } }
        }
    })

    res.json({ likedPosts: likedPosts.likedPosts });
}


export async function getUsers(req, res) {

    try {
        let users = await prisma.user.findMany({
            select: {
                _count: { select: { following: true, followedBy: true } },
                name: true,
                username: true,
                id: true,
                bio: true,
                image: true,
                joinedAt: true
            }
        })
        res.json({ users });
    } catch (error) {
        console.log(error);
        next(error);
    }


}

export async function getUserPosts(req, res, next) {

    try {
        let userId = req?.params?.userId;               // this is the target userId and not req.userId

        if (!userId) return res.status(400).json({ message: 'bad request' });

        let posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                comments: true,
                _count: { select: { likedBy: true } }
            },
            where: {
                authorId: userId
            }
        }
        )

        res.json({ posts });
    } catch (error) {
        console.log(error);
        next(error);
    }

}

export async function likePost(req, res, next) {

    try {
        let postId = req?.params?.postId;
        let userId = req.userId;
        if (!postId) return res.status(400).json({ message: 'bad request' });
        let result = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                likedBy: {
                    connect: {
                        id: userId
                    }
                }
            }

        })
        res.status(201).json({ message: "done" })

    } catch (error) {
        console.log(error);
        next(error)
    }
}


export async function deleteLikePost(req, res, next) {
    try {
        let postId = req?.params?.postId;
        let userId = req.userId;
        if (!postId) return res.status(400).json({ message: 'bad request' });
        let result = await prisma.post.update({
            data: {
                likedBy: {
                    disconnect: {
                        id: userId
                    }
                }
            },
            select: {
                _count: { select: { likedBy: true } }
            },
            where: {
                id: postId
            }
        })

        // console.log(result);

        res.status(200).json({ message: "done", count: result._count.likedBy })

    } catch (error) {
        console.log(error);
        next(error)
    }
}






export async function commentPost(req, res, next) {

    try {
        let postId = req?.params?.postId;
        let userId = req.userId;
        if (!postId) return res.status(400).json({ message: 'bad request' });

        const { content } = req.body;

        let result = await prisma.comment.create({
            data: {
                authorId: userId,
                content: content,
                postId: postId,
            }
        })

        res.status(201).json({ comment: result })

    } catch (error) {
        console.log(error);
        next(error)
    }

}


export async function createPost(req, res, next) {
    try {
        const userId = req.userId;
        const image = req.file;  //optional?
        let { content, movieId, rating } = req.body;

        if (movieId == 'null' || movieId == '') movieId = null;

        const saveToDb = async (imageUrl) => {
            const post = await prisma.post.create({
                data: {
                    authorId: userId,
                    content: content,
                    image: imageUrl,
                    movieId: movieId,
                    rating: rating ? Number(rating) : null,
                },
                include: {
                    _count: { select: { likedBy: true } }
                }
            });
            return res.json({ post });
        };

        if (!image) {
            return await saveToDb(null);
        }

        const uploadStream = v2.uploader.upload_stream(
            { resource_type: 'image' },
            async (err, result) => {
                if (err) {
                    console.log('Cloudinary Error:', err);
                    return res.status(500).json({ message: 'Error uploading image' });
                }

                try {
                    await saveToDb(result.secure_url);
                } catch (dbError) {
                    next(dbError);
                }
            }
        );

        uploadStream.end(image.buffer);

    } catch (error) {
        console.log(error);
        next(error);
    }
}



export async function updateProfile(req, res) {
    try {

        const { name } = req.body;
        const avatar = req.file;
        const userId = req.userId;

        v2.uploader.upload_stream({ format: 'png', resource_type: 'image' }, async (err, result) => {
            if (err) return res.status(500).json({ message: 'error uploading' });
            let newUser = await model.updateProfile(userId, name, result.url);
            return res.json({ user: newUser, message: "profile updated successfuly" });
        }).end(avatar.buffer)

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}