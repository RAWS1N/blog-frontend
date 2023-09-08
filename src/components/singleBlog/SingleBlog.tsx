// @ts-nocheck
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CiShare2 } from 'react-icons/ci'
import { MdModeEditOutline } from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import  { AuthContext } from '../../context/AuthContext'
import { useContext, useState, useEffect } from 'react'
import toast from "react-hot-toast"
import { FcLikePlaceholder, FcLike } from 'react-icons/fc'
import { getBlogById } from '../../APIManager/Blog'
import Comments from '../comments/Comments'
import Server from '../../utils/Server'
import io from 'socket.io-client'

const endPoint = import.meta.env.VITE_API_URL
let socket:any  

const SingleBlog = () => {
  const { user: currentUser } = useContext(AuthContext)
  const { id } = useParams()
  const [comment, setComment] = useState('')
  const [comments,setComments] = useState([])
  const [likes,setLikes] = useState([])
  const [liked,setLiked] = useState(false)
  const [socketConnected,setSocketConnected] = useState<boolean>(false)
  // const [like,setLike] = useState<boolean>()
  const Navigator = useNavigate()

  const { data: blog, error, isLoading, isError,isFetching } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
    onSuccess : data => {setComments(data.comments),setLikes(data.likes)}
  })



  const addCommentRequest = async (data) => {
    const config = {
      headers: {
        Authorization: `Bearer ${currentUser?.token}`
      }
    }
    const res = await Server.post('/comment/add', data, config)
    socket.emit('comment',data)
    setComments(prevState => ([res.data.comment,...prevState]))
    return res.data
  }

  const addCommentMutation = useMutation({
    queryKey: ['comment'],
    mutationFn: (data) => addCommentRequest(data),
    onSuccess: (data) => { toast.success(data.message), setComment('')},
    onError: (e:any) => toast.error(e.response.data.message)
  })


  const addComment = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    addCommentMutation.mutate({
      blogId: blog._id,
      comment,
    })
  }

  
  const deleteBlogById = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      }
      const postData = {id,image:blog.image}
      const res = await Server.post(`/blog/delete`,postData,config)
      toast.success(res.data.message)
      setTimeout(() => {
        Navigator('/')
      }, 1500)
      return res.data
    }
    catch (e) {
      toast.error(e.response.data.message)
    }
  }

  const likePost = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      }
      const res = await Server.post('/like', { blogId: blog._id },config)
      socket.emit("like",currentUser._id)
      if(res.data.type === 'remove'){
        setLikes(prevState => prevState.filter(user => user !== res.data.user))
      }
      else {
        setLikes(prevState => ([...prevState,res.data.user]))
      }
      return res.data
    }
    catch (e) {
      toast.error(e.response.data.message)
    }
  }



  useEffect(() => {
    socket = io(endPoint)
    socket.on('connected', () => setSocketConnected(true))
    return () => socket.off('disconnect',() => setSocketConnected(false))
  }, [currentUser])


  useEffect(() => {
    const liked = likes.includes(currentUser?._id)
    setLiked(liked)
    return () => console.log('unmounted')
  },[likes])

  useEffect(() => {
    const liked = likes.includes(currentUser?._id)
    setLiked(liked)
    return () => console.log('unmounted')
  },[])

  const date = new Date(blog?.updatedAt);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const blogDate = date.toLocaleDateString('en-US', options);
  return (
    <div className=" text-black mb-4 ">
      <img src={blog?.image} alt="header" className="w-full h-[150px] md:h-[350px] object-center" />
      <div className="bg-white py-4 px-2   mx-auto w-full ">
        <div
          className={`flex  ${currentUser?._id === blog?.author?._id && "flex-col"
            }  lg:flex-row justify-between mb-4`}
        >
          <div className="space-y-3 flex-1 px-4">
            <h1 className="text-2xl md:text-3xl capitalize   md:w-10/12">
              {blog?.title}
            </h1>
            <div className="flex  md:flex-row gap-1 lg:gap-2 text-sm text-gray-500 md:items-center">
              <p className="">{blog?.author?.name}</p>
              <p className="h-4 border hidden md:block"></p>
              <p className="">{blogDate}</p>
            </div>
          </div>
          <div className="flex self-baseline px-4 items-center   gap-2 mt-2">
            {currentUser?._id === blog?.author?._id && (
              <>
                <Link to={`/edit/${id}`} className='inline-block w-24 md:w-auto'>
                  <div className=" flex items-center gap-0.5 btn btn-sm rounded-md hover:bg-zinc-900 bg-zinc-900 text-white btn-primary py-0.5">
                    <MdModeEditOutline />
                    <p className="text-sm">Edit</p>
                  </div>
                </Link>
                <div
                  onClick={deleteBlogById}
                  className="flex items-center gap-0.5 rounded-md hover:bg-zinc-900 bg-zinc-900 text-white  btn btn-sm btn-primary px-2 py-0.5"
                >
                  <AiTwotoneDelete />
                  <p className="text-sm">Delete</p>
                </div>
              </>
            )}
            <div className="flex items-center gap-2 mx-4 cursor-pointer">
              {liked ? <FcLike onClick={likePost} className="ml-4 h-7 w-7" /> : <FcLikePlaceholder onClick={likePost} className="ml-4 h-7 w-7" />}
              <span>{likes.length}</span>
              <CiShare2 className="h-7 w-7  " />
            </div>
          </div>
        </div>
        <div
          className="leading-relaxed px-4   text-lg mt-4"
          dangerouslySetInnerHTML={{ __html: blog?.description }}
        ></div>
      </div>
        <div className="px-4">
        <Comments addComment={addComment} comments={comments}  comment={comment} setComment={setComment}/>
        </div>
    </div>
  )
}

export default SingleBlog