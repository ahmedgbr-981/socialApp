import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import getNewsFeed from '../../api/getNewsFeed.api'
import PostCard from '../PostCard/PostCard'
import Loading from '../Loading'
import CreatePost from '../CreatePost'
import getMyProfile from '../../api/getMyprofile.api'

export default function Home() {
  const {data,isLoading,isError,error}=useQuery({
    queryKey:['allPosts'],
    queryFn:getNewsFeed,
    select:(data)=>data?.data?.posts
  })

   const {data:myPro}=useQuery({
        queryKey:['profile'],
        queryFn:getMyProfile,
        select:(data)=>data?.data?.user
      })
  
  if(isLoading){return <Loading/>}
  console.log(data);
  
  
  return (
    <>
           <CreatePost userPhoto={myPro.photo}/>
              {
    data?.map((post)=><PostCard key={post._id} post={post}/>)
   }
    </>
  )
}
