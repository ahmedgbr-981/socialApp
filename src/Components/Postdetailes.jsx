import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import getPostDetails from '../api/getPostDetails.api'
import PostCard from './PostCard/PostCard'
import Loading from './Loading'
import Comments from './Comments/Comments'


export default function Postdetailes() {

    const {id}=useParams()
   
    

    const {data,isLoading,isError,error}=useQuery({
        queryKey:['singlePost',id],
        queryFn:()=>{return getPostDetails(id)},
        select:(data)=>data?.data?.post
    })

    if(isError){return error.message}

    if(isLoading){return <Loading/>}
    
  return (
    <>
    {data&& <PostCard post={data}/>}
    <div className='flex items-center justify-center p-3 w-[95%] mx-auto'>
        <Comments postId={id}/>
    </div>
    </>
  )
}
