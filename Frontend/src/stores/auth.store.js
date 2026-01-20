import { create } from "zustand";
import api from '../lib/axios.js';
import { useSocialStore } from "./social.store.js";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLogginIn: false,
    isSigningUp: false,
    isChecking: true,

    check: async () => {
        try {
            const res = await api.get('/auth/check');
            let user = res.data.user;
            if (!user) throw 'not logged in ';
            set({ authUser: res.data.user });
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isChecking: false });
        }
    },

    login: async (data) => {
        set({ isLogginIn: true });
        try {
            const res = await api.post('/auth/login', data);
            set({ authUser: res.data.user });
            return { success: true, message: 'ok' };
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            return { success: false, message };
        } finally {
            set({ isLogginIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await api.post('/auth/signup', data);
            set({ authUser: res.data.user });
            return { success: true, message: 'ok' };
        } catch (error) {
            const message = error.response?.data?.message || "Signup failed";
            return { success: false, message };
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            set({ authUser: null });
            useSocialStore.setState({ likedPosts: null });
            return { success: true, message: "Logged out successfully" };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Logout failed" };
        }
    },

    guestLogin: async () => {
        try {
            let result = await api.post('/auth/login', {
                username: 'guest11',
                password: '123'
            })
            set({ authUser: result.data.user });
            return { success: true, message: 'ok' };
        } catch (error) {
            console.log(error);
            const message = error.response?.data?.message || "Login failed";
            return { success: false, message };
        }
    }
}));