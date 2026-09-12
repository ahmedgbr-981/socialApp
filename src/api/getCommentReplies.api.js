import axios from "axios";


export default function getCommentReplies(postId,commentId){
    return axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
}