import { useQuery } from '@tanstack/react-query'
import Server from '../utils/Server'
import Blog from '../components/blog/Blog'


const BlogContainer = () => {

  const getData = async () => {
    const data = await Server.get('/blog/all')
    return data?.data
  }


  const {isLoading,data} = useQuery({
    queryKey: ["blogs"],
    queryFn: getData,
    // staleTime : 1000*60*5
  })

  return (
    <>
    {isLoading ? <span className="loading loading-dots loading-lg h-screen mx-auto flex items-center justify-center"></span>: <div className=" flex  flex-wrap items-center justify-center  gap-4 my-6">
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
    </div>
    }
    </>
  )
}

export default BlogContainer