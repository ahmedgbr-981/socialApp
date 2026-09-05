import axios from "axios";

export default async function likePostApi(postId) {
  const { data } = await axios.put(
    `https://route-posts.routemisr.com/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );

  return data;
}
