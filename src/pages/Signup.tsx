// @ts-nocheck

import { useState, useContext } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"
import Server from "../utils/Server"

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', password: '', email: '' })
  const Navigator = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [picture, setPicture] = useState()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const createUser = async (data) => {
    const res = await Server.post('/user/create', data, { withCredentials: true })
    console.log(res)
    return res.data
  }

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0])
  }

  const PictureUpload = async (pic) => {
    if (!pic) {
      return ""
    }
    try {
      if (pic.type === 'image/jpeg' || pic.type === 'image/png') {
        const data = new FormData()
        data.append('file', pic)
        data.append('upload_preset', 'chaton')
        data.append('cloud_name', "dharmic-chaton")
        const { data: res_data } = await axios.post('https://api.cloudinary.com/v1_1/dharmic-chaton/image/upload', data)
        const picture = res_data.url.toString()
        return picture
      }
      else {
        return ""
      }
    }
    catch (e) {
      console.log(e.message)
      toast.error("Error Occured while uploading picture")
    }
  }





  const createUserMutation = useMutation({
    mutationFn: (variables) => {createUser(variables)},
    onMutate: () => console.log('request sent'),
    onSuccess: (data) => {
      toast.success(data.message)
      setUser(data.user)
      localStorage.setItem("user",data.user)
      Navigator('/')
    },
    onError: (data) => toast.error(data.response.data.message)
  })


  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const avatar = await PictureUpload(picture)
    console.log(avatar)
    const shouldAddAvatar = avatar.length > 0 ? avatar : undefined
    createUserMutation.mutate({...formData,picture:shouldAddAvatar})
    setFormData({
      name: '',
      password: '',
      email: '',
    })
    setPicture(null)
    Navigator("/")
    
  }



  return (
    <div className="h-screen bg-gray-200">
      <div className="flex items-center justify-center h-[calc(100%-4rem)]  w-full">
        <form onSubmit={(handleSubmit)} className="flex flex-col items-center bg-white w-11/12 md:w-5/12  py-2 px-4 space-y-3 h-[350px] justify-center rounded-lg">
          <h2 className="text-xl mb-2">Create an Account</h2>
          <input
            type="text"
            placeholder="Name"
            name="name"
            required={true}
            value={formData.name}
            onChange={handleChange}
            className="input login-input w-full max-w-md"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            required={true}
            onChange={(handleChange)}
            className="input  login-input w-full max-w-md"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            required={true}
            onChange={(handleChange)}
            className="input  login-input w-full max-w-md"
          />
          <div className="flex gap-6 w-10/12 items-center">
            <span className="text-[15px] font-medium">Select Avatar <sup>(optional)</sup></span>
          <input onChange={handlePictureChange} id="file" type="file" name="image" accept="image/*" className="flex-1 file-input text-sm whitespace-nowrap rounded-sm file-input-bordered file-input-sm w-6/12 max-w-xs focus:outline-none" />
          </div>
          <button
            className="btn btn-sm btn-primary w-full max-w-md">
            Create Account
          </button>
          <p>Already have an account? <Link to="/signin" className="text-blue-800">signin</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Signup