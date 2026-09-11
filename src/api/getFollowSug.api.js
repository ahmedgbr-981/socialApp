import axios from "axios";


export default function getFollowSug(){

    return axios.get(`https://route-posts.routemisr.com/users/suggestions?limit=10`,{
         headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    })

}