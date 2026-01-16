import { useState } from 'react'
import { Button } from './components/ui/button'
import Home from './pages/Home'
import { Routes, Route, Outlet } from 'react-router'
import SocialMainPage from './pages/SocialMainPage'
import Header from './MoviesComponents/Header'
import Authprovider from './SocialComponents/Providers/AuthProvider'
import SocialProfile from './pages/SocialProfile'

function App() {

  return (

    <Routes >
      <Route path='/'
        element={
          <div className='max-w-5xl mx-auto'>
            <Authprovider>
              <Header />
              <Outlet />
            </Authprovider>
          </div>}>
        <Route index element={<Home />}></Route>
        <Route path='/social' element={<SocialMainPage />}></Route>
        <Route path='/social/user/:id' element={<SocialProfile />}></Route>
      </Route>
    </Routes>




  )
}

export default App
