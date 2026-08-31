import axios from 'axios'

export async function createAccountApi(dataObj) {
    const { data } = await axios.post(
      `https://route-posts.routemisr.com/users/signup`,
      dataObj,
    );

    return data;
  }
