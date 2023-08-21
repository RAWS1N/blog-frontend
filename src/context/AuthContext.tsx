// @ts-nocheck
import { useQuery } from "@tanstack/react-query"
import React, { createContext, useState } from "react"
import Server from "../utils/Server"
import { UserType } from "../models/UserType"
import { json } from "react-router-dom"

interface AuthProps {
    children : React.ReactNode
}

interface AuthContextType {
    user : UserType,
    setUser : (user:object | null) => void,
    getUserProfile : () => void,
    isLoading : boolean
}


export const AuthContext = createContext<AuthContextType>()

const AuthProvider:React.FC<AuthProps> = ({children}) => {
    const [user,setUser] = useState({})
    const getUserProfile = async() => {
        const res = await Server.get('/user/profile')  
        localStorage.setItem("user",JSON.stringify(res.data.user))
        return res.data
    }

        const {isLoading}= useQuery({
            queryKey : ['user'],
            queryFn : getUserProfile,
            retry:1,
            onSuccess : (data) => setUser(data.user),
            onError : (e) => {setUser(null),localStorage.removeItem('user'),console.log(e)}
        })
  return (
    <AuthContext.Provider value={{user,setUser,isLoading,getUserProfile}}>
            {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider