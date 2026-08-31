import axios from "axios"


export default async function createPost(postData){
    const {data}=await axios.post(`https://route-posts.routemisr.com/posts`,postData,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })

    console.log(data);
    return data
    
}