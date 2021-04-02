import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import CryptocurrencyLogo from './CryptocurrencyLogo'
import './Navbar.css'

function NavbarSession() {
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
            <div className="navbar__container">
                <div className="navbar__wrapper">
                    <div className="navbar__logo">
                        <CryptocurrencyLogo />
                        <h2>CRPTO FINANCE</h2>
                    </div>
                    <div className="navbar__links">
                        <Link to='/login' className='navbar__links-link' >SIGN IN</Link>
                        <Link to='/signup' className='navbar__links-link' >SIGN UP</Link>
                        {currentUser && 
                        <>
                        <button onClick={handleLogout} className='navbar__links-logout-btn'>LOGOUT</button>
                        {/* <strong>{currentUser.uid}</strong>
                        <Link to='/update-profile'/> */}
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavbarSession
