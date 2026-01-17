import { create } from "zustand";
import api from '../lib/axios.js';

export const useSocialStore = create((set, get) => ({

    users: null,
    allPosts: null,
    userPosts: null,
    isLoading: true,

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

    getPosts: async () => {
        if (get().posts) return;
        set({ isLoading: true });
        try {
            let response = await api.get('/social/feed');
            let posts = response.data.posts;

            let userPosts = new Map();
            posts.forEach((p) => {
                if (!userPosts.has(p.authorId))
                    userPosts.set(p.authorId, []);
                userPosts.get(p.authorId).push(p);

            })
            set({ allPosts: posts });
            set({ userPosts });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    },
}))