import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useContext } from 'react'
import getMyProfile from '../../api/getMyprofile.api'
import Loading from '../Loading'
import { FiCalendar, FiEdit3, FiMail, FiMapPin, FiMoreHorizontal } from 'react-icons/fi'

import './Profile.css'
import CreatePost from '../CreatePost'
import getMyPosts from '../../api/getMyPosts.api'
import UserContextProvider, { UserContext } from '../Context/UserContext'
import PostCard from '../PostCard/PostCard'

export default function Profile() {

    const {logedUserid}=useContext(UserContext)
    
    
    const {data,isLoading,isError,error}=useQuery({
      queryKey:['profile'],
      queryFn:getMyProfile,
      select:(data)=>data?.data?.user
    })
    const myId=data?._id

  const {data:myPosts,isLoading:myPostsIsLoading}=useQuery({
    queryKey:['myPosts',myId],
    queryFn:()=>getMyPosts(myId),
    enabled:Boolean(myId),
    select:(myPosts)=>myPosts?.data?.posts 
  })
  
  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <p>{error?.message || 'Unable to load profile.'}</p>
  }

  const name = data?.name || 'User profile'
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-cover" aria-hidden="true" />
        <div className="profile-identity">
          {data?.photo ? (
            <img className="profile-avatar z-10" src={data.photo} alt={`${name}'s profile`} />
          ) : (
            <div className="profile-avatar profile-avatar--fallback" aria-label={`${name}'s profile`}>
              {initials}
            </div>
          )}
          <div className="profile-heading">
            <h1>{name}</h1>
            <p>{data?.username ? `@${data.username}` : 'Social App member'}</p>
          </div>
          <div className="profile-actions">
            <button className="profile-button profile-button--primary" type="button">
              <FiEdit3 aria-hidden="true" /> Edit profile
            </button>
            <button className="profile-icon-button" type="button" aria-label="More profile options" title="More options">
              <FiMoreHorizontal aria-hidden="true" />
            </button>
          </div>
        </div>
        <nav className="profile-tabs" aria-label="Profile sections">
          <a className="profile-tab profile-tab--active" href="#posts">Posts</a>
          <a className="profile-tab" href="#about">About</a>
          <a className="profile-tab" href="#photos">Photos</a>
        </nav>
      </section>

      <div className="flex flex-col lg:flex-row w-[75%] gap-4 mt-4 mx-auto">
        <section className="" id="about">
          <h2>Info</h2>
          <div className="profile-details">
            {data?.email && <p><FiMail aria-hidden="true" /> {data.email}</p>}
            {data?.location && <p><FiMapPin aria-hidden="true" /> {data.location}</p>}
            {data?.createdAt && <p><FiCalendar aria-hidden="true" /> Joined {new Date(data.createdAt).toLocaleDateString()}</p>}
          </div>
        </section>

        <section className="profile-panel profile-panel--posts " id="posts">
         <div className='w-[70%] mx-auto'>
           <CreatePost userPhoto={data.photo}/>
         </div>
          <div className="profile-panel__heading">
            <h2>{name}'s posts</h2>
          </div>
          {myPostsIsLoading && <Loading />}
          {
            myPosts? myPosts.map((post)=>{return <PostCard key={post._id} post={post}/>}):<p>your posts will apear here</p>
          }
        </section>
      </div>
      <UserContextProvider userPhoto={data.photo}/>
    </main>
  )
}
