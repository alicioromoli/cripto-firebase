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
            <h2>Password Reset</h2>
            <form onSubmit={handleSubmit}>
                {message && alert(message)}
                <label>Email</label>
                <input 
                    type="email"
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <button type="submit" disabled={loading}>Reset Password</button>
            </form>
            <p><Link to='login'>Log In</Link></p>
            <p>Need an account? <Link to='/signup'>Sign up</Link></p>
        </div>
    )
}

export default ForgotPassword
