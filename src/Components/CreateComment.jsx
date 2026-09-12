import { FiSend } from 'react-icons/fi'
import { FaImage } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import useCreatComment from '../Hooks/useCreatComment';



const fallbackAvatar = 'https://ui-avatars.com/api/?background=0f766e&color=fff&name=Social+User'

export default function CreateComment({
  postId,
  setShowCommentForm,
  replyTo,
  onSubmitted,
}) {
  const contentInputRef = useRef(null);

  const {
    isPending,
    isError,
    error,
    register,
    handleSubmit,
    sendCommentData,
    setValue,
  } = useCreatComment(
    postId,
    setShowCommentForm,
    replyTo,
    onSubmitted,
  )

  useEffect(() => {
    if (!replyTo) return;

    setValue('content', `@${replyTo.name} `);
    contentInputRef.current?.focus();
  }, [replyTo, setValue]);

  const contentField = register('content');

  if(isError){return error.message}
  return (
   <>
    <form className="comment-composer w-full" onSubmit={handleSubmit(sendCommentData)}>
        <img src={fallbackAvatar} alt="" aria-hidden="true" />
        <input
          {...contentField}
          ref={(element) => {
            contentField.ref(element);
            contentInputRef.current = element;
          }}
          type="text"
          placeholder="Add comment..."
          aria-label="Add comment"
        />
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
