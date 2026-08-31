import axios from "axios";


export default function delePostApi(postId){
    return axios.delete(`https://route-posts.routemisr.com/posts/${postId}`,
        {
            headers:{
                token:localStorage.getItem('userToken')
            }
        }
    )
}