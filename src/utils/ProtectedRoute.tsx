import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect } from "react";

interface RouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
    const { user, isLoading } = useContext(AuthContext)
    const Navigator = useNavigate()

    useEffect(() => {
        if (isLoading) return
        const user = localStorage.getItem('user')
        if (!user) {
            Navigator('/signin')
        }
    }, [user])

    return children

};

export default ProtectedRoute;