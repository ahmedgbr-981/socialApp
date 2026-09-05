import { FiSend } from 'react-icons/fi'
import { FaImage } from 'react-icons/fa';
import useCreatComment from '../Hooks/useCreatComment';



const fallbackAvatar = 'https://ui-avatars.com/api/?background=0f766e&color=fff&name=Social+User'

export default function CreateComment({ postId ,setShowCommentForm}) {

  const {
    isPending,
    isError,
    error,
    register,
    handleSubmit,
    sendCommentData,
  } = useCreatComment(postId,setShowCommentForm)


  
  if(isError){return error.message}
  return (
   <>
    <form className="comment-composer w-full" onSubmit={handleSubmit(sendCommentData)}>
        <img src={fallbackAvatar} alt="" aria-hidden="true" />
        <input {...register('content')} type="text" placeholder="Add comment..." aria-label="Add comment" />
        <label>
          <input type="file" {...register('image')} hidden/>
          <FaImage className='cursor-pointer text-3xl' />
        </label>
        {
          isPending ? 'uploading...':
        <button disabled={isPending} type="submit" aria-label="Send comment" title="Send comment"><FiSend aria-hidden="true" /></button>

        }
      </form>
      </>
  )
}
