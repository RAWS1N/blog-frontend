// @ts-nocheck
import { useQuery } from "@tanstack/react-query"
import React, { createContext, useEffect, useState } from "react"
import Server from "../utils/Server"
import { UserType } from "../models/UserType"
import { json, useNavigate } from "react-router-dom"

interface AuthProps {
    children : React.ReactNode
}

interface AuthContextType {
    user : UserType,
    setUser : (user:object | null) => void,
    // getUserProfile : () => void,
    // isLoading : boolean
}


export const AuthContext = createContext<AuthContextType>()

const AuthProvider:React.FC<AuthProps> = ({children}) => {
    const [user,setUser] = useState()
    const Navigator = useNavigate()

    useEffect(() => {
        const fetchUser = async() => {
            const user = await JSON.parse(localStorage.getItem("user"))
            if(!user){
                // Navigator("/signin")
                return 
            }
            setUser(user)
        }
        fetchUser()
    },[Navigator])

  return (
    <AuthContext.Provider value={{user,setUser}}>
            {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider