import { ErrorMessage, Input } from "@heroui/react";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import useCreatAccount from "../../Hooks/useCreatAccount";
import z from "zod";
import ErrorMess from "../../Components/ErroMess/ErrorMess";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Components/Context/UserContext";

export default function Login() {
    const { userToken, setUserToken } = useContext(UserContext);
  
  const nav =useNavigate()
  const { mutate, isPending,data } =useMutation({
    mutationFn:signIn,
    onSuccess:(data)=>{
      console.log(data);
      console.log(data?.message);
      Swal.fire({
        text:data?.message,
        icon:'success'
      }).then((res)=>{
        if(res.isConfirmed){
          reset()
          setTimeout(()=>{nav('/home')},500)
          setUserToken(localStorage.getItem('userToken'))
        }
      })
      
    },

    onError:(data)=>{
      Swal.fire({
        text:data?.message,
        icon:'error'
      })
    }
  });
  
 async function signIn(values){
    const {data}=await axios.post(`https://route-posts.routemisr.com/users/signin`,values)
    
    localStorage.setItem('userToken',data?.data?.token)
    return data
  }

  const schema=z.object({
    email:z.string().email('invalid email'),
    
      password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "invalid password"),
  })

  const form = useForm({
    defaultValues: {
     
      email: "",
      
      password: "",
    },
    mode:'all',
    resolver:zodResolver(schema)
  });

  const { register, handleSubmit,reset,formState } = form;

  function sendSignInData(values) {
    console.log("values", values);

    mutate(values);
  }
  return (
    <>
      <form
        onSubmit={handleSubmit(sendSignInData)}
        className="text-black dark:text-white"
      >
        <div className="text-center ">
          <label htmlFor="" className="pb-5 text-blue-300 text-3xl font-bold">
            Sign In
          </label>
          <div className="flex flex-col gap-3 p-5  w-[80%] mx-auto ">
           
            
            <Input
              {...register("email")}
              type="email"
              aria-label="Email"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 "
              placeholder="Enter your email"
            />
            <ErrorMess error={formState.errors.email}/>

           

           
            <Input
              {...register("password")}
              type="password"
              aria-label="Password"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 "
              placeholder="Enter your password"
            />
            <ErrorMess error={formState.errors.password}/>

           

          </div>
          <button
          disabled={isPending}
            type="submit"
            className="cursor-pointer mt-2 w-[70%] rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-offset-black"
          >
           <span className="flex justify-center ">{isPending ? <AiOutlineLoading className="animate-spin text-2xl" />:'Sign In'}</span>
          </button>
        </div>
      </form>
    </>
  );
}
