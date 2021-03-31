import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()  
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('')
            setLoading(true)
            await login(email, password)
            history.push('/')
        }catch {
            setError('failed to sign in')
        }
        
        setLoading(false)
    }
    return (
        <div>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input 
                    type="email"
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input 
                    type="password"
                    required
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>Log In</button>
            </form>
            <p><Link to='forgot-password'>Forgot password?</Link></p>
            <p>Need an account? <Link to='/signup'>Sign up</Link></p>
        </div>
    )
}

export default Login
