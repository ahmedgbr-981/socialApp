import React, { createContext, useEffect, useState } from 'react'
// Share data acrros the app
import {jwtDecode} from 'jwt-decode'
import getMyProfile from '../../api/getMyprofile.api'

export const UserContext=createContext()


export default  function UserContextProvider({children}){
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'))
    const [logedUserid, setLogedUserid] = useState(null)
    const [userPhoto, setUserPhoto] = useState(null)
    const [modaleOpend, setModaleOpend] = useState(false)

    useEffect(() => {
      const token = localStorage.getItem("userToken")

      if (!token) {
        setLogedUserid(null)
        setUserPhoto(null)
        return
      }

      try {
        const { user } = jwtDecode(token)
        setLogedUserid(user)
      } catch (error) {
        console.error('Invalid token:', error)
        setLogedUserid(null)
      }

      getMyProfile()
        .then((res) => {
          setUserPhoto(res?.data?.user?.photo || res?.user?.photo || null)
        })
        .catch(() => {
          setUserPhoto(null)
        })
    }, [userToken])

    return (
      <UserContext.Provider value={{ userToken, setUserToken, logedUserid, userPhoto, setUserPhoto, modaleOpend, setModaleOpend }}>
        {children}
      </UserContext.Provider>
    )
}
