// @ts-nocheck
import Editor from "../components/editor/Editor"
import { useState } from 'react'
import { useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { BsArrowLeft } from 'react-icons/bs'
import Server from "../utils/Server"
import { getBlogById } from "../APIManager/Blog"
import { Link, useParams } from "react-router-dom"
import ImageModal from "../components/modals/ImageModal"

const BlogEditorContainer = () => {
  const [value, setValue] = useState<string>('')
  const [blogData, setBlogData] = useState({
    title: '',
    tags: '',
    image: '',
  })

  const { id }: string | any = useParams()
  const { data: blog } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
    onSuccess: (data) => { setBlogData(data), setValue(data.description) }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value,type,files } = e.target
    setBlogData(prevState => ({ ...prevState, [name]: type === "file" ? files[0] : value }))
    if(!files) return
    const file = files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogData(prevState => ({...prevState,image:reader.result}));
      };
      reader.readAsDataURL(file);
    }
  }


  interface BlogProperty {
    title: string,
    description: string,
    image : string
  }
  const editBlog = async ({ title, description,image }: BlogProperty) => {
    if (!title || !description) {
      toast.error("Please fill all required fields")
      return
    }
    try {
      const res = await Server.post('/blog/edit', {
        id,
        title,
        description,
        image : image.length > 0 ? image : undefined
      }, { withCredentials: true })
      toast.success(res?.data?.message)
      return res.data

    }
    catch (err: any) {
      toast.error(err.response.data.message)
      console.log(err.response.data.message)
    }
  }

  const editBlogMutation = useMutation({
    mutationFn: (variables: BlogProperty) => editBlog(variables),
    onMutate: () => null

  })

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    editBlogMutation.mutate({
      title: blogData.title,
      description: value,
      image : blogData.image
    })
  }

  




  return (
    <>
      <div className="flex items-center justify-center flex-col mt-12 mx-4 md:mx-auto md:w-10/12 lg:w-6/12 gap-4">
        <Link to="/" className="self-start btn btn-sm bg-black text-white rounded-sm pl-2 pr-3 "><BsArrowLeft className="h-5 w-5" />Back To Home</Link>
        <input autoFocus type="text" name="title" className="blog-input" placeholder="Title" onChange={handleChange} value={blogData.title} required={true} maxLength={80} />
        <div className="flex flex-col md:flex-row  gap-4 w-full items-center ">
          <input onChange={handleChange}  type="url" name="image" placeholder="Paste Image Link Here" className="indent-2 py-0.5 border border-gray-300 rounded-sm hover:outline-none  focus:outline-none " />
          <span>OR</span>
          <input onChange={handleChange} id="file" type="file" name="image" accept="image/*" className=" file-input text-sm whitespace-nowrap rounded-sm file-input-bordered file-input-sm w-full max-w-xs focus:outline-none" />
          <button  onClick={() => window.my_modal_5.showModal()} className="bg-gray-200 px-4 py-1 text-sm whitespace-nowrap">View Image</button>
          <ImageModal selectedImage={blogData?.image ? blogData?.image : blog?.image} />
        </div>

        <input type="text" name="tags" className="blog-input" placeholder="Tags" onChange={handleChange} value={blogData.tags} />
        <Editor value={value} setValue={setValue} />
        <button type="submit" onClick={handleSubmit} className="btn btn-sm btn-primary rounded-sm bg-black text-white hover:bg-black hover:text-white w-4/12">Update Blog</button>
      </div>
    </>
  )
}

export default BlogEditorContainer