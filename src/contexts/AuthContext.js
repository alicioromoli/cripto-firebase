import React, {useContext, useState, useEffect} from 'react'
import { auth, database } from '../firebase'

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)

}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

        const signup = (email, password) => {
            return auth.createUserWithEmailAndPassword(email, password)
        }
        const login = (email, password) => {
            return auth.signInWithEmailAndPassword(email, password)
        }

        const logout = () => {
            return auth.signOut()
        }

        const resetPassword = (email, id) => {
            return auth.sendPasswordResetEmail(email)
        }

        const updateEmail = (email, id) => {
            return currentUser.updateEmail(email)
        }

        const updatePassword = password => {
            return currentUser.updatePassword(password)
        }

    useEffect(()=> {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value} >
            {!loading && children}
        </AuthContext.Provider>
    )
}