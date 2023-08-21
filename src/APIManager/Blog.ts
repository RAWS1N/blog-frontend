import Server from "../utils/Server"


export const getBlogById = async (id:string) => {
    const res = await Server.get(`/blog/${id}`)
    return res.data.data
}