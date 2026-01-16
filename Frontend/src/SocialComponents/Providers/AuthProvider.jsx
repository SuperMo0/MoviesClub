import React, { useContext } from 'react'
import { USERS } from './../../socialData.js'
import { createContext } from 'react'

let AuthContext = createContext({ user: USERS[0] });
export default function Authprovider({ children }) {

    return (
        <AuthContext value={{ user: USERS[0] }}>
            {children}
        </AuthContext>
    )
}


export const useAuth = () => useContext(AuthContext);