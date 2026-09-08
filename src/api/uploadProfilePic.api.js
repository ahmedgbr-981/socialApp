import axios from "axios";



export default function uploadProPic(photo){
    const formData = new FormData();
    formData.append('photo', photo);

    return axios.put(`https://route-posts.routemisr.com/users/upload-photo`,formData,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    })
}