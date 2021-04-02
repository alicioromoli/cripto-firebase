import React from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './components/Signup'
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import NavbarSession from './components/NavbarSession'
import ForgotPassword from './components/ForgotPassword'
import UpdateProfile from './components/UpdateProfile'
import Buy from './components/Buy'
import Sell from './components/Sell'
import Transactions from './components/Transactions'
import Dashboard from './components/Dashboard'

const RouteNoUserNavbar = ({exact, path, component:Component, ...rest}) => {
  return (
      <Route exact={exact} path={path}
      {...rest} 
      render={(props) => {
          return <>
                  <NavbarSession {...props}/>
                  <Component {...props}/>
                  </>
      }}
      />
  )   
}

function App() {
  
  return (
    <>
    <Router>
        <AuthProvider>
            <Switch>
              <PrivateRoute exact path='/' component={Home}/>
              <PrivateRoute path='/update-profile' component={UpdateProfile}/>
              <PrivateRoute path='/buy' component={Buy}/>
              <PrivateRoute path='/sell' component={Sell}/>
              <PrivateRoute path='/transactions' component={Transactions}/>
              <PrivateRoute path='/dashboard' component={Dashboard}/>
              <RouteNoUserNavbar path='/signup' component={Signup}/>
              <RouteNoUserNavbar path='/login' component={Login}/>
              <RouteNoUserNavbar path='/forgot-password' component={ForgotPassword}/>
            </Switch>
        </AuthProvider>
    </Router>
    </>
        )
}

export default App;
