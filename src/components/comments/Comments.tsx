// @ts-nocheck
import {useContext, useEffect} from 'react'
import { BiSolidUserCircle } from "react-icons/bi"
import { AuthContext } from '../../context/AuthContext'

interface CommentProps {
    comments: object[],
    // setComments: () => void
    addComment : (e) => void
    comment : string
    setComment : (e) => void
}

const Comments: React.FC<CommentProps> = ({ comments, setComments,addComment,comment,setComment }) => {
    const {user} = useContext(AuthContext)
    return (
        <>
            <div className="mt-20">
                <div className="flex gap-4 items-center">
                {user ? <img src={user?.picture} className=' object-cover h-10 w-10 rounded-full hidden md:block' /> : <BiSolidUserCircle className="h-14 w-14 md:h-12 md:w-12" />}
                    <input  value={comment} onChange={(e) => setComment(e.target.value)} type="text" className="w-full border border-zinc-900 rounded-md indent-2 focus:outline-black h-8 " />
                    <button onClick={(e) => addComment(e) } disabled={!comment.length} className="btn btn-sm rounded-full bg-zinc-900 text-white hover:bg-zinc-900 hover:text-white ">comment</button>
                </div>
                <h4 className="text-lg font-semibold text-gray-500 my-2">Comments</h4>
            </div>

            <div>
                {comments?.map(comment => {
                    return (
                        <div key={comment?._id} className="flex gap-4 items-center py-2">
                            
                            <img src={comment?.user?.picture} className=' object-cover h-10 w-10 rounded-full' />
                            <div key={comment?._id} className="mt-1 leading-5">
                                <p className="capitalize font-semibold tracking-wider">{comment?.user?.name}</p>
                                <p className='capitalize'>{comment?.comment}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Comments