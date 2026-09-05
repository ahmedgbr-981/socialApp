import React from 'react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createCommentApi from '../api/createComment.api';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function useCreatComment(postId,setShowCommentForm) {
    const {id}=useParams()
    const commentPostId = postId ?? id
const queryClient=useQueryClient()
 
  const {data,isPending,isError,error,mutate}=useMutation({
      mutationFn:(formData)=>createCommentApi(commentPostId,formData),
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
        setShowCommentForm(false)
        },
        
    })
  
    const {register,handleSubmit,reset}=useForm({
      defaultValues:{
        content:'',
        image:''
      }
    })
  
    function sendCommentData(values){
      if(!values.content&&!values.image?.[0]){return}
      const formData=new FormData()
      if(values.content){
  
        formData.append('content',values.content)
      }
      if(values.image?.[0]){
  
        formData.append('image',values.image[0])
      }
      mutate(formData)
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
    }
}
