import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import Server from "../utils/Server"
import { useQuery } from "@tanstack/react-query"
import Blog from "../components/blog/Blog"




const Profile = () => {
  const { user } = useContext(AuthContext)

  const getUserBlogs = async () => {
    const res = await Server.get('/blog/myblogs', { withCredentials: true })
    return res.data
  }

  const { isLoading, data } = useQuery({
    queryKey: ['myblogs'],
    queryFn: getUserBlogs,
  })

  return (
    <>
      {isLoading ? <span className="loading loading-dots loading-lg h-screen mx-auto flex items-center justify-center"></span> : <> <div className=" border-b-2 py-4 px-2  box-border flex flex-col md:flex-row   items-center gap-6 justify-center">
        <img src={user?.picture} className="h-44  w-44 rounded-full" />
        <div className=" flex flex-col items-center gap-2 ">
          <p className="text-lg md:text-xl font-normal text-center tracking-widest uppercase">Name: {user?.name}</p>
          <p className="text-xs text-center w-80 truncate uppercase">Email: {user?.email}</p>
        </div>
      </div>
        <div className=" flex  flex-wrap items-center justify-center  gap-4 my-6">
          {data?.data?.map((blog: any) => {
            const { author: { name }, _id, title, image } = blog
            return <Blog
              key={_id}
              author={name}
              _id={_id}
              title={title}
              image={image}
            />
          })}
        </div></>}
    </>
  )
}

export default Profile