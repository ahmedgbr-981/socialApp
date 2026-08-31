import axios from "axios";


export default async function updatePostApi(postId,upData){
    const {data}=await axios.put(`https://route-posts.routemisr.com/posts/${postId}`,upData,{
         headers:{
                Authorization:`Bearer ${localStorage.getItem('userToken')}`
            }
    })

    console.log('updeted',data);
    return data
    
}