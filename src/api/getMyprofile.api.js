import axios from "axios";


export default async function getMyProfile(){
    const {data}=await axios.get(`https://route-posts.routemisr.com/users/profile-data`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })
    // console.log('profile',data);
    return data
    
}