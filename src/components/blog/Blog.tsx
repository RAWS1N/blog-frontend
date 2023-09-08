import React from 'react'
import BlogModel from '../../models/Blog'
import { memo } from 'react'
import { Link } from 'react-router-dom'

const Blog: React.FC<BlogModel> = ({ image, _id, title }) => {
    return (
        <div className="flex  flex-col gap-2  overflow-hidden w-60 h-60 md:h-72 md:w-72 lg:h-80 lg:w-80 bg-base-100 shadow-xl rounded-md ">
            <img src={image} alt="blog" className="h-[130px] md:h-[170px] lg:h-[200px]" />
            <div className="">
                <div className="px-3">
                    <div className="flex gap-2">
                        <div className="badge badge-outline">General</div>
                        <div className="badge badge-outline">Tech</div>
                    </div>
                    <h2 className="font-semibold truncate text-lg md:text-xl w-11/12 capitalize">{title}</h2>
                </div>
                <div className="flex justify-end self-end mt-5 px-3">
                    <Link to={`/blog/${_id}`}> <button className="btn btn-primary btn-xs md:btn-sm border-black hover:bg-black rounded-sm bg-white text-black hover:text-white">Read Now</button></Link>
                </div>
            </div>
        </div>
    )
}

export default memo(Blog)