import { useQuery } from '@tanstack/react-query'
import React, { useEffect } from 'react'
import getNewsFeed from '../../api/getNewsFeed.api'
import PostCard from '../PostCard/PostCard'
import Loading from '../Loading'
import CreatePost from '../CreatePost'
import getMyProfile from '../../api/getMyprofile.api'
import FollowSuggestions from '../FollowSuggestions/FollowSuggestions'

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
  console.log(data,'profile',myPro);
  
  
  return (
    <>
      <CreatePost userPhoto={myPro?.photo} />
      <FollowSuggestions followingArr={myPro?.following} />
      {data?.map((post) => {
        const sharedBy = post?.isShare ? post?.user : null;

        return (
          <PostCard
            key={post?._id ?? post?.sharedPost?._id}
            post={post}
            sharedBy={sharedBy}
            followingArr={myPro?.following}
          />
        );
      })}
    </>
  );
}
