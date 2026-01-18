import { prisma } from '../lib/prisma.js'
import v2 from '../lib/cloudinary.js'
import { userProfileSelect } from './../Models/auth.model.js'

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
        next(error);
    }
}

export async function getUserLikedPosts(req, res) {
    try {
        const userId = req.userId;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                likedPosts: {
                    select: { id: true }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const likedPostIds = user.likedPosts.map(post => post.id);

        return res.json({ likedPosts: likedPostIds });

    } catch (error) {
        console.error("Get Liked Posts Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export async function getUsers(req, res) {
    try {
        let users = await prisma.user.findMany({
            select: userProfileSelect
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
        const image = req.file;
        let { content, movieId, rating } = req.body;

        if (movieId === 'null' || movieId === '') movieId = null;


        const dbRating = (rating && rating !== 'null') ? Number(rating) : null;

        let imageUrl = null;

        if (image) {
            try {
                imageUrl = await uploadImage(image.buffer, 'social_posts');
            } catch (uploadError) {
                console.error('Cloudinary Error:', uploadError);
                return res.status(500).json({ message: 'Error uploading image' });
            }
        }

        const post = await prisma.post.create({
            data: {
                authorId: userId,
                content: content,
                image: imageUrl,
                movieId: movieId,
                rating: dbRating,
            },
            include: {
                author: {
                    select: userProfileSelect
                },
                _count: { select: { likedBy: true, comments: true } }
            }
        });

        return res.json({ post });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function uploadImage(image) {
    if (!image) return;

    const imageUrl = await new Promise((resolve, reject) => {
        const stream = v2.uploader.upload_stream(
            {
                resource_type: 'image',
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(image);
    });


    return imageUrl;

}

export async function updateProfile(req, res) {
    try {
        const userId = req.userId;
        const image = req.file;
        const { name, bio } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name cannot be empty" });
        }

        const updateData = {
            name: name,
            bio: bio,
        };

        if (image) {
            let imageUrl = await uploadImage(image.buffer);

            updateData.image = imageUrl;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                username: true,
                name: true,
                image: true,
                bio: true,
                joinedAt: true,
                _count: {
                    select: { followedBy: true, following: true }
                }
            }
        });

        return res.json({
            user: updatedUser,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}