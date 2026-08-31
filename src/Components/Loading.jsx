import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export default function Loading() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
    <AiOutlineLoading3Quarters className='animate-spin text-6xl text-blue-300' />

    </div>
  )
}
