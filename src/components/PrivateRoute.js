import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'

function PrivateRoute({component: Component, ...rest}) {
    const { currentUser } = useAuth()
    return (
        <Route
         {...rest}
         render={props => {
            return currentUser ?
            <>
            <Navbar {...props}/>
            <Component {...props} /> 
            </>
            : <Redirect to='login' />
         }}
         ></Route>
    )
}

export default PrivateRoute

