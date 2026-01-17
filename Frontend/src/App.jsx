import { createContext, useContext, useEffect, useState } from 'react'
import Home from './pages/Home'
import { Routes, Route, Outlet } from 'react-router'
import SocialMainPage from './pages/SocialMainPage'
import Header from './MoviesComponents/Header'
import SocialProfile from './pages/SocialProfile'
import Login from './SocialComponents/Login'
import { useAuthStore } from './stores/auth.store'

let LoginContext = createContext();

function App() {

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { authUser, check, isChecking } = useAuthStore()

  useEffect(() => {
    check();
  }, [])

  if (isChecking) return 'loading...';

  function handleHeaderLoginButtonClick() {
    setIsLoginModalOpen(true);
  }

  function handleCloseSigninModalClick() {
    setIsLoginModalOpen(false);
  }

  function handleHeaderSignupButtonClick() {

  }

  const shouldOpenLoginModal = isLoginModalOpen && !user

  return (
    <Routes >
      <Route path='/'
        element={
          <div className='max-w-5xl mx-auto'>
            <LoginContext value={setIsLoginModalOpen}>
              <Login isOpen={shouldOpenLoginModal} onClose={handleCloseSigninModalClick} />
              <Header onLoginClick={handleHeaderLoginButtonClick} onSignupClick={handleHeaderSignupButtonClick} />
              <Outlet />
            </LoginContext>
          </div>}>
        <Route index element={<Home />}></Route>
        <Route path='/social' element={<SocialMainPage />}></Route>
        <Route path='/social/user/:username' element={<SocialProfile />}></Route>
      </Route>
    </Routes>
  )
}

export default App;

export const useLoginModal = () => useContext(LoginContext);