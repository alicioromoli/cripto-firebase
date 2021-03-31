import React, {useState} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { database } from '../firebase'

function Signup() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState() 
    const [repeatPassword, setRepeatPassword] = useState()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== repeatPassword){
            return setError('Password do not match')
        }
        try {
            setError('')
            setLoading(true)
            let cred = await signup(email, password)
            const uid = cred.user.uid
            const userRef = database.ref('users')
            const user = {
                email,
                password,
                money: 10000,
                currencies: [],
                transactions: []
            }
            userRef.child(uid).set(user)
            history.push('/')
        }catch {
            setError('failed to create an account')
        }
        
        setLoading(false)
    }
    return (
        <div>
            <h2>Sign Up</h2>
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
                <label>Repeat Password</label>
                <input 
                    type="password"
                    required
                    onChange={e => setRepeatPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>Sign up</button>
            </form>
            <p>Already have an account? <Link to='/login'>Log In</Link></p>
        </div>
    )
}

export default Signup
