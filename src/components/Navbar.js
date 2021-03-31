import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

function Navbar() {
    const {currentUser, logout} = useAuth()
    const [error, setError] = useState('')
    const history = useHistory()

    const handleLogout = async () => {
            setError('')

            try {
                await logout()
                history.push('/login')
            } catch {
                setError('failed to log out')
            }
    }

    return (
        <div>
            {currentUser && 
            <>
            <button onClick={handleLogout}>LOGOUT</button>
            <strong>{currentUser.uid}</strong>
            <Link to='/update-profile'/>
            </>
            }
        </div>
    )
}

export default Navbar
