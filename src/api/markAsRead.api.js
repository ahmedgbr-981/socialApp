import axios from "axios";


export default async function markNotificationsRead(notificationId){
    const {data}=await axios.patch(`https://route-posts.routemisr.com/notifications/${notificationId}/read`, null, {
         headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
    console.log('mark read ',data);
    
    return data
}