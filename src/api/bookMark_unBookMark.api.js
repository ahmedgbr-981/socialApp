import axios from "axios";

export default async function bookMark_unBookMark(postId) {
  const { data } = await axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/bookmark`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  console.log('post booked',data);
  
  return data;
}
