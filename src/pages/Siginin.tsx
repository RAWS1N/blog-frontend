// @ts-nocheck

import { useContext, useState } from "react"
import getCookie from "../utils/getCookie"
import { useMutation } from "@tanstack/react-query"
import { AuthContext } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import Server from "../utils/Server"
const Signin = () => {
  const [formData,setFormData] = useState({password:'',email:''})
  const {setUser,user} = useContext(AuthContext)
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name,value} = e.target
    setFormData(prevState => ({...prevState,[name]:value}))
  }
  
  const Navigator = useNavigate()
  const loginUser = async(data) => {
    try{
      const res = await Server.post('/user/login',data,{withCredentials:true})
      return res

    }
    catch(e){
      console.log(e)
    }
  }

  const loginUserMutation = useMutation({
    mutationFn: (variables) => loginUser(variables),
    // onMutate : () => console.log('request sent'),
    onSuccess : (data) => {
      setUser(data.data.user)
      localStorage.setItem("user",JSON.stringify(data.data.user))
      Navigator('/')
    },
    onError : (e) => {setUser(null),localStorage.removeItem("user"),console.log(e)}
    
  })



  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginUserMutation.mutate(formData)
    setFormData({
    password:'',
    email:''})
  }

  return (
    <div className="h-screen bg-gray-200">
    <div className="flex items-center justify-center h-[calc(100%-4rem)] w-full ">
        <form onSubmit={(handleSubmit)} className="flex flex-col items-center bg-white w-11/12  md:w-5/12  py-2 px-4 space-y-3 h-[350px] justify-center  rounded-lg">
        <h2 className="text-xl mb-2">Sign in to your account</h2>
        <input 
        type="email" 
        placeholder="Type Email Here" 
        name="email" 
        value={formData.email}
        required={true}
        onChange={(handleChange)}
        className="input  login-input w-full max-w-md" 
        />
        <input 
        type="password" 
        placeholder="Type Password Here" 
        name="password" 
        value={formData.password}
        required={true}
        onChange={(handleChange)}
        className="input  login-input w-full max-w-md" 
        />
        <button 
        className="btn btn-sm btn-primary w-full max-w-md">
          Login
        </button>
        <p>don't have an account? <Link to="/signup" className="text-blue-800">signup</Link></p>
        </form>
    </div>
    </div>
  )
}

export default Signin