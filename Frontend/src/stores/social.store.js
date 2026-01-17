import { create } from "zustand";
import api from '../lib/axios.js';
import { toast } from "react-toastify";
import { useAuthStore } from '@/stores/auth.store.js';

export const useSocialStore = create((set, get) => ({

    users: null,
    allPosts: null,
    userPosts: null,
    likedPosts: null,
    isLoading: true,
    isUploading: false,

    getUsers: async () => {
        if (get().users) return;
        set({ isLoading: true });
        try {
            let response = await api.get('/social/users');
            let users = new Map();
            response.data.users.forEach((u) => {
                users.set(u.id, u);
            });
            set({ users });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    },

    getLikedPosts: async () => {
        try {
            let result = await api.get('/social/liked');
            let likedPosts = result.data.likedPosts;
            set({ likedPosts });
        } catch (error) {
            console.log(error);
            toast.error('Error while getting liked posts');
        }
    },

    getPosts: async () => {
        if (get().allPosts) return;
        set({ isLoading: true });
        try {
            let response = await api.get('/social/feed');
            let posts = response.data.posts;

            let userPosts = new Map();
            posts.forEach((p) => {
                if (!userPosts.has(p.authorId))
                    userPosts.set(p.authorId, []);
                userPosts.get(p.authorId).push(p);
            });

            set({ allPosts: posts });
            set({ userPosts });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    },

    createNewPost: async (formData) => {
        set({ isUploading: true });

        const { authUser } = useAuthStore.getState();

        const content = formData.get('content');
        const imageFile = formData.get('image');
        const movieId = formData.get('movieId');
        const rating = formData.get('rating');

        // Optimistic Post
        const tempId = `temp-${Date.now()}`;
        const optimisticPost = {
            id: tempId,
            content: content,
            image: (imageFile instanceof File) ? URL.createObjectURL(imageFile) : null,
            movieId: movieId,
            rating: rating ? Number(rating) : null,
            createdAt: new Date().toISOString(),
            authorId: authUser.id,
            _count: { likedBy: 0, comments: 0 }
        };

        // SNAPSHOT & UPDATE
        const prevAll = get().allPosts;
        const prevUserPosts = get().userPosts;

        set(state => {
            const updatedAllPosts = [optimisticPost, ...state.allPosts];

            const updatedUserPosts = new Map(state.userPosts);
            const authorPosts = updatedUserPosts.get(authUser.id) || [];
            updatedUserPosts.set(authUser.id, [optimisticPost, ...authorPosts]);

            return { allPosts: updatedAllPosts, userPosts: updatedUserPosts };
        });

        try {
            let result = await api.post('/social/post', formData);
            const realPost = result.data.post;

            set(state => {
                // Helper to find and replace the temp post
                const swapPost = (p) => p.id === tempId ? realPost : p;

                const finalAllPosts = state.allPosts.map(swapPost);

                const finalUserPosts = new Map(state.userPosts);
                const authorPosts = finalUserPosts.get(authUser.id);
                if (authorPosts) {
                    finalUserPosts.set(authUser.id, authorPosts.map(swapPost));
                }

                return {
                    allPosts: finalAllPosts,
                    userPosts: finalUserPosts,
                    isUploading: false
                };
            });

            return { success: true };

        } catch (error) {
            console.log("Upload failed", error);

            set({
                allPosts: prevAll,
                userPosts: prevUserPosts,
                isUploading: false
            });

            return { success: false, message: error.message };
        }
    },

    likePost: async (post) => {
        // SNAPSHOTS
        const prevLiked = get().likedPosts;
        const prevAll = get().allPosts;
        const prevUserPosts = get().userPosts;

        //  OPTIMISTIC UPDATE
        set((state) => {
            const newAllPosts = state.allPosts.map((p) =>
                p.id === post.id
                    ? { ...p, _count: { ...p._count, likedBy: (p._count?.likedBy || 0) + 1 } }
                    : p
            );

            const newUserPostsMap = new Map(state.userPosts);
            const authorPosts = newUserPostsMap.get(post.authorId);

            if (authorPosts) {
                const updatedAuthorPosts = authorPosts.map((p) =>
                    p.id === post.id
                        ? { ...p, _count: { ...p._count, likedBy: (p._count?.likedBy || 0) + 1 } }
                        : p
                );
                newUserPostsMap.set(post.authorId, updatedAuthorPosts);
            }

            return {
                likedPosts: [...state.likedPosts, post],
                allPosts: newAllPosts,
                userPosts: newUserPostsMap
            };
        });

        //  API CALL
        try {
            await api.post(`/social/like/${post.id}`);
            return { success: true, message: 'ok' };
        } catch (error) {
            console.log("Like failed, reverting...");
            set({ likedPosts: prevLiked, allPosts: prevAll, userPosts: prevUserPosts });
            return { success: false, message: 'error' };
        }
    },

    unLikePost: async (post) => {
        //  SNAPSHOTS
        const prevLiked = get().likedPosts;
        const prevAll = get().allPosts;
        const prevUserPosts = get().userPosts;

        //  OPTIMISTIC UPDATE
        set((state) => {

            const newAllPosts = state.allPosts.map((p) =>
                p.id === post.id
                    ? { ...p, _count: { ...p._count, likedBy: Math.max(0, (p._count?.likedBy || 1) - 1) } }
                    : p
            );


            const newUserPostsMap = new Map(state.userPosts);
            const authorPosts = newUserPostsMap.get(post.authorId);

            if (authorPosts) {
                const updatedAuthorPosts = authorPosts.map((p) =>
                    p.id === post.id
                        ? { ...p, _count: { ...p._count, likedBy: Math.max(0, (p._count?.likedBy || 1) - 1) } }
                        : p
                );
                newUserPostsMap.set(post.authorId, updatedAuthorPosts);
            }

            return {
                likedPosts: state.likedPosts.filter(p => p.id !== post.id),
                allPosts: newAllPosts,
                userPosts: newUserPostsMap
            };
        });

        // 3. API CALL
        try {
            await api.delete(`/social/like/${post.id}`);
            return { success: true, message: 'ok' };
        } catch (error) {
            console.log("Unlike failed, reverting...");
            // 4. REVERT ON ERROR
            set({ likedPosts: prevLiked, allPosts: prevAll, userPosts: prevUserPosts });
            return { success: false, message: 'error' };
        }
    },

    commentPost: async (post, content) => {
        const currentUser = useAuthStore.getState().authUser;

        // Optimistic Comment
        const tempId = Date.now();
        const optimisticComment = {
            id: tempId,
            content: content,
            createdAt: new Date().toISOString(),
            authorId: currentUser.id,
            postId: post.id
        };

        // SNAPSHOT 
        const prevAll = get().allPosts;

        const prevUserPosts = get().userPosts;

        const updatePostWithComment = (p) => {
            if (p.id === post.id) {
                return {
                    ...p,
                    comments: [...(p.comments || []), optimisticComment],
                };
            }
            return p;
        };

        //  OPTIMISTIC UPDATE
        set((state) => {
            const newAllPosts = state.allPosts.map(updatePostWithComment);

            const newUserPosts = new Map(state.userPosts);

            const authorPosts = newUserPosts.get(post.authorId);

            newUserPosts.set(post.authorId, authorPosts.map(updatePostWithComment));

            return { allPosts: newAllPosts, userPosts: newUserPosts };
        });

        try {
            //  API
            const res = await api.post(`social/comment/${post.id}`, { content });
            const realComment = res.data.comment;

            set((state) => {
                const swapTempForReal = (p) => {
                    if (p.id === post.id) {
                        return {
                            ...p,
                            comments: p.comments.map(c => c.id === tempId ? realComment : c)
                        };
                    }
                    return p;
                };
                const finalAllPosts = state.allPosts.map(swapTempForReal);

                const finalUserPosts = new Map(state.userPosts);

                const authorPosts = finalUserPosts.get(post.authorId);

                if (authorPosts) {
                    finalUserPosts.set(post.authorId, authorPosts.map(swapTempForReal));
                }
                return { allPosts: finalAllPosts, userPosts: finalUserPosts };
            });

            return { success: true };

        } catch (error) {
            console.log(error);

            console.log("Comment failed");
            set({ allPosts: prevAll, userPosts: prevUserPosts });
            return { success: false, message: "Failed to post comment" };
        }
    }
}));