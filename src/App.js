import React from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './components/Signup'
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import ForgotPassword from './components/ForgotPassword'
import UpdateProfile from './components/UpdateProfile'

function App() {
  
  return (
    <>
    <Router>
        <AuthProvider>
          <Navbar />
            <Switch>
              <PrivateRoute exact path='/' component={Home}/>
              <PrivateRoute path='/update-profile' component={UpdateProfile}/>
              <Route path='/signup' component={Signup}/>
              <Route path='/login' component={Login}/>
              <Route path='/forgot-password' component={ForgotPassword}/>
            </Switch>
        </AuthProvider>
    </Router>
    </>
        )
}

export default App;
