import { ErrorMessage, Input } from "@heroui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import useCreatAccount from "../../Hooks/useCreatAccount";
import z from "zod";
import ErrorMess from "../../Components/ErroMess/ErrorMess";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

export default function Register() {
  const { mutate, isPending } = useCreatAccount();

  const schema=z.object({
    name:z.string().min(3,'name must be at least 3 char'),
    username:z.string().min(3,'userName must be at least 3 char'),
    email:z.string().email('invalid email'),
    dateOfBirth:z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'invalid date').refine((date)=>{
        const userDate=new Date(date)
        const today=new Date()
        today.setHours(0,0,0,0)
        return userDate <today
    },'invalid date can not enter future date'),
      gender: z.enum(["male", "female"], "invalid gender"),
      password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "invalid password"),
          rePassword:z.string(),
  }).refine((obj)=>obj.password===obj.rePassword,{
    error:'password dose not match repassword',
    path:['rePassword']
  })

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode:'all',
    resolver:zodResolver(schema)
  });

  const { register, handleSubmit,reset,formState } = form;

  function sendRegisterData(values) {
    console.log("values", values);

    mutate(values);
    reset()
  }
  return (
    <>
      <form
        onSubmit={handleSubmit(sendRegisterData)}
        className="text-black dark:text-white"
      >
        <div className="text-center ">
          <label htmlFor="" className="pb-5 text-blue-300 text-3xl font-bold">
            Sign Up
          </label>
          <div className="flex flex-col gap-3 p-5  w-[80%] mx-auto ">
            <Input
              {...register("name")}
              type="text"
              aria-label="Name"
              className="w-full p-5 rounded-xl text-black bg-neutral-100"
              placeholder="Enter your name"
            />
            <ErrorMess error={formState.errors.name}/>
            <Input
              {...register("username")}
              type="text"
              aria-label="UserName"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 "
              placeholder="Enter your userName"
            />
            <ErrorMess error={formState.errors.username}/>
            <Input
              {...register("email")}
              type="email"
              aria-label="Email"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 "
              placeholder="Enter your email"
            />
            <ErrorMess error={formState.errors.email}/>

            <Input
              {...register("dateOfBirth")}
              type="date"
              aria-label="DateOfBirth"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 dark:bg-white "
              placeholder="Enter your dateOfBirth"
            />
            <ErrorMess error={formState.errors.dateOfBirth}/>

            <select
              {...register("gender")}
              className="register-gender-select w-full p-5 rounded-xl text-black bg-neutral-100 dark:bg-white border border-black/20 dark:border-white/20 px-5"
              defaultValue=""
            >
              <option
                value=""
                className="rounded-2xl text-black bg-neutral-100"
                disabled
              >
                choose gender
              </option>
              <option
                value="male"
                className="rounded-2xl text-black bg-neutral-100"
              >
                male
              </option>
              <option value="female" className="text-black bg-neutral-100">
                female
              </option>
            </select>
            <ErrorMess error={formState.errors.gender}/>

            <Input
              {...register("password")}
              type="password"
              aria-label="Password"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 "
              placeholder="Enter your password"
            />
            <ErrorMess error={formState.errors.password}/>

            <Input
              {...register("rePassword")}
              type="password"
              aria-label="RePassword"
              className="w-full p-5 rounded-xl text-black bg-neutral-100 "
              placeholder="Confirm your Password"
            />
            <ErrorMess error={formState.errors.rePassword}/>

          </div>
          <button
          disabled={isPending}
            type="submit"
            className="cursor-pointer mt-2 w-[70%] rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-offset-black"
          >
           <span className="flex justify-center ">{isPending ? <AiOutlineLoading className="animate-spin text-2xl" />:' Create Account'}</span>
          </button>
          <div className="py-3 dark:text-white">Already have an account? <Link to={'/login'} className="text-blue-400 hover:text-blue-300 cursor-pointer underline">Sign in</Link></div>

        </div>
      </form>
    </>
  );
}
