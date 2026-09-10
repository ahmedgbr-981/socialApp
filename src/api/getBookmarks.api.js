import axios from "axios";


export default async function getBookmarks(){
    const {data} =await axios.get(`https://route-posts.routemisr.com/users/bookmarks`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    })

    console.log('bookmarks',data);

    return data
    
}