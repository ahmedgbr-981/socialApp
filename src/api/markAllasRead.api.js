import axios from "axios";



export default function markAllasRead(){
    return axios.patch(`https://route-posts.routemisr.com/notifications/read-all`,{},{
         headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}