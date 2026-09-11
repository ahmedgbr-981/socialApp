import axios from "axios";


export default function sharePostApi(postId){
    return axios.post(`https://route-posts.routemisr.com/posts/${postId}/share`,{},{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`,
            "Content-Type":'application/json'
        }
    })
}