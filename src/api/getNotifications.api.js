import axios from "axios";

export default async function getNotifications() {
    const { data } = await axios.get('https://route-posts.routemisr.com/notifications?unread=false&page=1&limit=10', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
    });

    console.log('notifications', data);

    return data?.data?.notifications;
}