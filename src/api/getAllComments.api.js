import axios from "axios";


export default async function getAllComments(id){
    const {data}=await axios.get(`https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`,{
         headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })

    // console.log("comments",data);
    return data
    
}