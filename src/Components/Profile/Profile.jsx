import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import getMyProfile from '../../api/getMyprofile.api'
import Loading from '../Loading'
import { FiCalendar, FiEdit3, FiMail, FiMapPin, FiMoreHorizontal } from 'react-icons/fi'

import './Profile.css'
import CreatePost from '../CreatePost'
import getMyPosts from '../../api/getMyPosts.api'
import UserContextProvider, { UserContext } from '../Context/UserContext'
import PostCard from '../PostCard/PostCard'
import { FaFileImage } from 'react-icons/fa'
import { Button, Modal } from '@heroui/react'
import { useForm } from 'react-hook-form'
import uploadProPic from '../../api/uploadProfilePic.api'
import Swal from 'sweetalert2'

export default function Profile() {

    const {logedUserid}=useContext(UserContext)
    const [uplodpicMOdal, setUplodpicModal] = useState(false)
    const [photoPreview, setPhotoPreview] = useState(null)
    
        const queryClient = useQueryClient()
    
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
  const {data:proPic,isPending,mutate}=useMutation({
    mutationFn:(photo)=>uploadProPic(photo),
    onSuccess:async()=>{
      setUplodpicModal(false)
      setPhotoPreview(null)
      reset()

      const result = await Swal.fire({
        title: 'Picture changed',
        icon: 'success',
        confirmButtonText: 'OK',
        allowOutsideClick: false
      })

      if (result.isConfirmed) {
        queryClient.invalidateQueries({queryKey:['profile']})
      }
    }
  })
  
  const {handleSubmit,register,reset}=useForm({
    defaultValues:{
      photo:'',
    }
  })
  const photoField = register('photo')

  function handleUploadPic(values){
    const file=values.photo?.[0]

    if (!file) return

    mutate(file)
    handlePhotoPreview(file)
    console.log(file);
    
  }

  function handlePhotoPreview(photo){
    if (!photo) return

    setPhotoPreview(URL.createObjectURL(photo))
  }
  
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
    
    <main className="profile-page ">
      <section className="profile-hero">
        <div className="profile-cover" aria-hidden="true" />
        <div className="profile-identity">
          <div className="relative flex shrink-0 flex-col items-center">
            {data?.photo ? (
              <img className="profile-avatar" src={data.photo} alt={`${name}'s profile`} />
            ) : (
              <div className="profile-avatar profile-avatar--fallback" aria-label={`${name}'s profile`}>
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => setUplodpicModal(true)}
              className="mt-2 flex max-w-full items-center gap-2 rounded-2xl bg-gray-500/80 px-3 py-2 text-sm text-white shadow-md sm:text-base"
            >
              <span className="truncate">Upload Picture</span>
              <FaFileImage aria-hidden="true" className="shrink-0" />
            </button>
          </div>
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
     { uplodpicMOdal&&     <Modal isOpen={uplodpicMOdal} onOpenChange={setUplodpicModal}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Upload Picture</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmit(handleUploadPic)}>
              <input {...photoField} onChange={(e)=>{photoField.onChange(e); handlePhotoPreview(e.target.files?.[0])}} type="file" className='bg-gray-600 text-black p-3 rounded-2xl cursor-pointer mb-3' />
              {photoPreview && (
  <img src={photoPreview} alt="Selected profile preview" className='my-3 rounded-2xl' />
)}
              <Button type='submit' className="w-full">
                Upload
              </Button>
              </form>
            </Modal.Body>
            
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>}
    </main>
  )
}
