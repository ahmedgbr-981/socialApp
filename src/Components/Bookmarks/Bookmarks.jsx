
import { useQuery } from '@tanstack/react-query'
import getBookmarks from '../../api/getBookmarks.api'
import PostCard from '../PostCard/PostCard'


export default function Bookmarks() {

     // getBookMarks
  const {data}=useQuery({
    queryKey:['bookmarks'],
    queryFn:getBookmarks,
    select:(data)=>data.data.bookmarks
  })
  return (
    <>
    {
        data?.map((post)=><PostCard key={post._id} post={post} />)
    }
    </>
  )
}
