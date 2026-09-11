import axios from "axios";


export default function follow_unfollow_user(userId){

    return axios.put(`https://route-posts.routemisr.com/users/${userId}/follow`,{},{
         headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })
    
}