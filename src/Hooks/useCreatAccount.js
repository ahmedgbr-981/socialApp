import { useMutation } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { createAccountApi } from '../api/CreateAccount.api'

export default function useCreatAccount() {
  const nav = useNavigate()

  return useMutation({
    mutationFn: createAccountApi,
    onSuccess: (responseData) => {
        console.log(responseData);
      Swal.fire({
        title: 'Account Created',
        icon: 'success',
        text: responseData?.message,
      }).then((result) => {
        if (result.isConfirmed) {
          nav('/login')
        }
      })
    },
    onError: (error) => {
      Swal.fire({
        title: 'Failed',
        icon: 'error',
        text: error.response?.data?.message || 'Unable to create your account',
      })
    },
  })
}
