//@ts-nocheck

import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"

interface props {
    setBlogData : () => never
}



const useImageUpload:React.FC<props> = (setBlogData) => {
    const uploadImage = async(picture) => {
        if (!picture) {
            toast.error("Please Select an Picture")
            return
        }
        try {
            if (picture.type === 'image/jpeg' || picture.type === 'image/png') {
                const data = new FormData()
                data.append('file', picture)
                data.append('upload_preset', 'chaton')
                data.append('cloud_name', "dharmic-chaton")
                const { data: res_data } = await axios.post('https://api.cloudinary.com/v1_1/dharmic-chaton/image/upload', data)
                const pictureURL = res_data.url.toString()
                setBlogData(prevState => ({...prevState,image:pictureURL}))
            }
            else {
                toast.error("Please Select an Picture")
            }
        }
        catch (e:any) {
            console.log(e.message)
            toast.error("Error Occured while uploading picture")
        }
    }
    return {uploadImage}
}

export default useImageUpload