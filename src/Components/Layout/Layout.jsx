import React, { useContext } from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'
import { UserContext } from '../Context/UserContext';

export default function Layout() {
      const { userToken, setUserToken } = useContext(UserContext);
  
  return (
    <>
    
    <Navbar/>
    <div className='min-h-screen my-10'>
            <Outlet/>

    </div>
   {
    userToken && <Footer/>
   }
    </>
  )
}
