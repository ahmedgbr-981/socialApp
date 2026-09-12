import axios from "axios";


export default function sharePostApi(postId,body){
    return axios.post(`https://route-posts.routemisr.com/posts/${postId}/share`,body,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`,
            "Content-Type":'application/json'
        }
    })
}