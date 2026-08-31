import axios from "axios";

export default function createCommentApi(id,data){
    return axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`,data,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
}