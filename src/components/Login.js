import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import './Login.css'


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
        <>
        <div className="login__container">
            <div className="login__wrapper">
                <form onSubmit={handleSubmit} className='login__wrapper__form'>
                    <label>Email</label>
                    <input 
                        type="email"
                        required
                        onChange={e => setEmail(e.target.value)}
                    />
                    <div className='password__container'>
                        <label>Password</label>
                        <p className='forgot-password'><Link className='forgot-password-link' to='forgot-password'>Forgot password?</Link></p>
                    </div>
                    <input 
                        type="password"
                        required
                        onChange={e => setPassword(e.target.value)}
                    />
                    <div className='button-container' >
                    <button type="submit" disabled={loading}>Log In</button>
                    <p>Need an account? <Link to='/signup'>Sign up</Link></p>
                    </div>     
                </form>
            </div>
        </div>
        </>
    )
}

export default Login
