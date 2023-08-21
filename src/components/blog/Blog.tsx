import React from 'react'
import BlogModel from '../../models/Blog'
import {memo} from 'react'
import {Link} from 'react-router-dom'


const Blog: React.FC<BlogModel> = ({ image, _id, title }) => {
    return (
        <div className="card w-60 h-60 md:h-72 md:w-72 lg:h-96 lg:w-96 bg-base-100 shadow-xl rounded-md ">
            <figure><img src={image} alt="Shoes" className="  w-full object-cover"/></figure>
            <div className="card-body py-4 px-3">
            <div className="card-actions flex-col pb-4 ">
                <div className="flex gap-2 ">
                <div className="badge badge-outline">General</div>
                <div className="badge badge-outline">Tech</div>
                </div>
                <h2 className="font-semibold truncate text-lg md:text-xl w-11/12 capitalize">{title}</h2>
                </div>
                
                <div className="card-actions justify-end items-center">
                   
                    <Link to={`/blog/${_id}`}> <button className="btn btn-primary btn-xs md:btn-sm border-black hover:bg-black rounded-sm bg-white text-black hover:text-white">Read Now</button></Link>
                </div>
            </div>
        </div>
    )
}

export default memo(Blog)