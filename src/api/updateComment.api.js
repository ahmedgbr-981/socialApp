import axios from "axios";

export default async function updateComment(postId,commentId,commdata){
    const {data}=await axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,commdata,{
         headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
        
    })
    console.log(data);
    
    return data
}