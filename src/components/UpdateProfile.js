import React, {useState, useEffect} from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

function UpdateProfile() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState() 
    const [repeatPassword, setRepeatPassword] = useState()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [uid, setUid] = useState('')
    const history = useHistory()

    const { currentUser, updateEmail, updatePassword } = useAuth();

    useEffect(()=> {
        setEmail(currentUser.email)
        setUid(currentUser.uid)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password !== repeatPassword){
            return setError('Password do not match')
        }

        const promises =[]
        setError('')
        setLoading(true)

        if(email !== currentUser.email){
            promises.push(updateEmail(email), uid)
        }
        if(password) {
            promises.push(updatePassword(password), uid)
        }

        try {
            await Promise.all(promises)
            history.push('/')
        } catch {
            setError('failed to create an account')
        }
        setLoading(false)
    }
    return (
        <div>
            <h2>Update Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input 
                    type="email"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input 
                    type="password"
                    placeholder='leave blank to keep the same'
                    onChange={e => setPassword(e.target.value)}
                />
                <label>Repeat Password</label>
                <input 
                    type="password"
                    placeholder='leave blank to keep the same'
                    onChange={e => setRepeatPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>Update</button>
            </form>
            <p><Link to='/'>Cancel</Link></p>
        </div>
    )
}

export default UpdateProfile
