// @ts-nocheck
import Editor from "../components/editor/Editor"
import { useRef, useEffect, useState } from 'react'
import axios from "axios"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import getCookie from "../utils/getCookie"
import Server from "../utils/Server"
import { Link } from "react-router-dom"
import { BsArrowLeft } from "react-icons/bs"
import ImageModal from "../components/modals/ImageModal"
import useImageUpload from "../hooks/useImageUpload"

interface BlogDataTypes {
  title: string,
  tags: string,
  image: string,
}


const BlogWriterContainer = () => {
  const [value, setValue] = useState('')
  const titleRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState()
  const [blogData, setBlogData] = useState<BlogDataTypes>({
    title: '',
    tags: '',
    image: '',
  })
  

  const handlePictureSelect = async (pic) => {
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
        // toast.error("Please Select an Picture")
        return ""
      }
    }
    catch (e) {
      console.log(e.message)
      toast.error("Error Occured while uploading picture")
    }
  }



  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setBlogData(prevState => ({ ...prevState, [name]: type === 'file' ? files[0] :  value }))
    if(!files) return
    const file = files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const createBlog = async ({ title, description,image}) => {
    if (!title || !description) {
      toast.error("Please fill all required fields")
      return
    }
    try {
      const picture = await handlePictureSelect(image)
      console.log(picture)
      const shouldAddImage = picture.length > 0 ? picture: image ? image :  undefined
      const res = await Server.post('/blog/create', {
        title,
        description,
        image: shouldAddImage
      }, { withCredentials: true })
      toast.success(res?.data?.message)
      console.log(res)
      return res.data

    }


    catch (e) {
      toast.error(e.response.data.message)
      console.log(e.response.data.message)
    }
  }

  const createBlogMutation = useMutation({
    mutationFn: (variables) => createBlog(variables),
    onMutate: () => console.log('request sent')

  })
  const handleSubmit = (e) => {
    e.preventDefault()
    createBlogMutation.mutate({
      title: blogData.title,
      description: value,
      image : blogData.image
    })
    setValue("")
    setBlogData({
      title: '',
      tags: '',
      image : ''
    })
  }



  return (
    <>
      <div className="flex items-center justify-center flex-col mt-12 mx-4  my-6 md:mx-auto md:w-10/12 lg:w-6/12 gap-4">
        <Link to="/" className="self-start btn btn-sm bg-black text-white rounded-sm pl-2 pr-3 "><BsArrowLeft className="h-5 w-5" />Back To Home</Link>
        <input autoFocus type="text" name="title" className="blog-input" placeholder="Title" onChange={handleChange} value={blogData.title} required={true} maxLength={80} />
        <div className="flex flex-col md:flex-row  gap-4 w-full items-center ">
          <input type="url" name="image"  onChange={handleChange} placeholder="Paste Image Link Here" className="self-start w-full indent-2 py-0.5 border border-gray-300 rounded-sm hover:outline-none  focus:outline-none "/>
          <span>OR</span>
          <input id="file"  type="file" name="image" accept="image/*" onChange={handleChange} className=" file-input text-sm whitespace-nowrap rounded-sm file-input-bordered file-input-sm w-full max-w-xs focus:outline-none" />
          <button disabled={!blogData.image && !selectedImage} onClick={() => window.my_modal_5.showModal()} className="bg-gray-200 px-4 py-1 text-sm whitespace-nowrap">View Image</button>

        </div>
        <input type="text" name="tags" className="blog-input" placeholder="Tags" onChange={handleChange} value={blogData.tags} />
        <Editor value={value} setValue={setValue} />
        <button type="submit" onClick={handleSubmit} className="btn btn-sm btn-primary rounded-sm bg-black text-white hover:bg-black hover:text-white w-4/12">Create Blog</button>
      </div>
      <ImageModal selectedImage={blogData.image.length > 0 ? blogData.image: selectedImage} />
    </>
  )
}

export default BlogWriterContainer