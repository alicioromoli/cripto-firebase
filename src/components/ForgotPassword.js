import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

function ForgotPassword() {
    const [email, setEmail] = useState()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(email)
            setMessage('check your inbox')
            
        }catch {
            setError('failed to reset password')
        }
        
        setLoading(false)
    }
    return (
        <div>
            <div className="login__container">
                <div className="login__wrapper">
                <form onSubmit={handleSubmit} className='login__wrapper__form'>
                        {message && alert(message)}
                        <label>Email</label>
                        <input 
                            type="email"
                            required
                            onChange={e => setEmail(e.target.value)}
                        />
                        <div className='button-container' >
                        <button type="submit" disabled={loading}>Reset Password</button>
                        <p><Link to='login'>Log In</Link></p>
                        <p>Need an account? <Link to='/signup'>Sign up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
