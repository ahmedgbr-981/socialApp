import axios from "axios";


export default async function getPostDetails(id){
    const {data}=await axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
         headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
    // console.log(data);
    return data
    
}