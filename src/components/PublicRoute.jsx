import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({children}) => {
 const {isAuthenticated,user} = useAuth()

 if(isAuthenticated){
    return <Navigate to={user.userType === 'vendor' ? '/vendor' : '/customer'} />
 }

 return children
}

export default PublicRoute