import axios from "axios";


export default function createReply(postId, commId, data){
    return axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${commId}/replies`, data, {
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
}