import axios from "axios";


export default async function getUnreadNotifications(){
    const {data}=await axios.get(`https://route-posts.routemisr.com/notifications/unread-count`,{
         headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    console.log('unread countttttttttttttttt',data);
    
    return data
}