import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import CryptocurrencyLogo from './CryptocurrencyLogo'
import './Navbar.css'

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
            <div className="navbar__container">
                <div className="navbar__wrapper">
                    <div className="navbar__logo">
                        <CryptocurrencyLogo />
                        <h2>CRPTO FINANCE</h2>
                    </div>
                    <div className="navbar__links">
                        <Link to='/dashboard' className='navbar__links-link' >DASHBOARD</Link>
                        <Link to='/' className='navbar__links-link' >CRYPTOCURRENCIES</Link>
                        <Link to='/buy' className='navbar__links-link' >BUY</Link>
                        <Link to='/sell' className='navbar__links-link' >SELL</Link>
                        <Link to='/transactions' className='navbar__links-link' >HISTORY</Link>
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

export default Navbar
