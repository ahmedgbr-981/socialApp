import axios from "axios";


export default async function getNewsFeed(){
    const {data}=await axios.get(`https://route-posts.routemisr.com/posts`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    }
    )
    // console.log(data);
    
    return data
}