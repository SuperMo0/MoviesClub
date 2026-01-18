import { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route, Outlet } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import SocialMainPage from './pages/SocialMainPage'
import SocialProfile from './pages/SocialProfile'
import Header from './MoviesComponents/Header'
import Login from './SocialComponents/Login'
import Signup from './SocialComponents/Signup'

// Stores
import { useAuthStore } from './stores/auth.store'
import { useSocialStore } from './stores/social.store'
import { useMoviesStore } from './stores/movies.store'

const LoginContext = createContext();

function App() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const { check, isChecking, authUser } = useAuthStore()
  const { getPosts, getUsers, users, userPosts, isLoading, allPosts, likedPosts, getLikedPosts } = useSocialStore();
  const { allMovies, getAllMovies, todayMovies, getTodayMovie } = useMoviesStore();


  useEffect(() => {
    check();
  }, []);

  useEffect(() => {

    if (!users) getUsers();
    if (!userPosts) getPosts();
    if (!allMovies) getAllMovies();
    if (!todayMovies) getTodayMovie();

    if (authUser && !likedPosts) {
      getLikedPosts();
    }
  }, [authUser]);

  const isDataNotReady =
    isChecking ||
    isLoading ||
    !users ||
    !allPosts ||
    !allMovies ||
    !todayMovies ||
    (authUser && !likedPosts);

  if (isDataNotReady) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-lg font-medium">Loading MovieClub...</div>
      </div>
    );
  }

  const openLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  }

  const openSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  }

  const shouldOpenLogin = isLoginModalOpen && !authUser;
  const shouldOpenSignup = isSignupModalOpen && !authUser;

  return (
    <div className='max-w-5xl mx-auto min-h-screen relative'>
      <ToastContainer theme="dark" position="bottom-right" />
      <LoginContext.Provider value={{
        openLogin,
        openSignup
      }}>
        <Login
          isOpen={shouldOpenLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />

        <Signup
          isOpen={shouldOpenSignup}
          onClose={() => setIsSignupModalOpen(false)}
        />

        <Header
          onLoginClick={openLogin}
          onSignupClick={openSignup}
        />

        <Routes>
          <Route path='/' element={<Outlet />}>
            <Route index element={<Home />} />
            <Route path='/social' element={<SocialMainPage />} />
            <Route path='/social/user/:id' element={<SocialProfile />} />
          </Route>
        </Routes>

      </LoginContext.Provider>
    </div>
  )
}

export default App;

export const useLoginModal = () => useContext(LoginContext);