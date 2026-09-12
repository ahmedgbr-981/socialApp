import axios from "axios";


export default function like_unlike_comment(postId,commentId){

    return axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,{},{
         headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      }
    })

}