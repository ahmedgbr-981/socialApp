import axios from "axios";


export default async function getMyPosts(id){
    const {data}= await axios.get(`https://route-posts.routemisr.com/users/${id}/posts`,{
           headers:{
                Authorization:`Bearer ${localStorage.getItem('userToken')}`
            }
    })
    console.log('my posts',data);
    
    return data
}