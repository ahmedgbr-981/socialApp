import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createCommentApi from '../api/createComment.api';
import createReply from '../api/createReply.api';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function useCreatComment(
  postId,
  setShowCommentForm,
  replyTo,
  onSubmitted,
) {
    const {id}=useParams()
    const commentPostId = postId ?? id
const queryClient=useQueryClient()
 
  const {data,isPending,isError,error,mutate}=useMutation({
      mutationFn:({ formData, replyCommentId }) =>
        replyCommentId
          ? createReply(commentPostId, replyCommentId, formData)
          : createCommentApi(commentPostId, formData),
      mutationKey:['createComment'],
      onSuccess:(data)=>{
        console.log('comment created',data?.data?.message);
        console.log(data);
        
        queryClient.invalidateQueries({
          queryKey:['postComments']
        })
        queryClient.invalidateQueries({
          queryKey:['allPosts']
        })
        queryClient.invalidateQueries({
          queryKey:['myPosts']
        })
        setShowCommentForm?.(false)
        onSubmitted?.()
        },
        
    })
  
    const {register,handleSubmit,reset,setValue}=useForm({
      defaultValues:{
        content:'',
        image:''
      }
    })
  
    function sendCommentData(values){
      if (isPending) return
      if(!values.content&&!values.image?.[0]){return}
      const formData=new FormData()
      if(values.content){
  
        formData.append('content',values.content)
      }
      if(values.image?.[0]){
  
        formData.append('image',values.image[0])
      }
      mutate({
        formData,
        replyCommentId: replyTo?.commentId,
      })
      reset()
      
      
      
    }

    return {
      data,
      isPending,
      isError,
      error,
      register,
      handleSubmit,
      sendCommentData,
      setValue,
    }
}
