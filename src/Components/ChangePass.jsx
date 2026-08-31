import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ChangePass() {
  const navigate = useNavigate();
const { userToken,setUserToken } = useContext(UserContext);

  function patchPass(body) {
    return axios.patch(`https://route-posts.routemisr.com/users/change-password`, body, {
        headers:{
            Authorization:`Bearer ${localStorage.getItem('userToken')}`
        }
    });
  }
  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const {mutate,isPending}=useMutation({
    mutationFn:patchPass,
    onSuccess:()=>{

        console.log('pass changed');
        Swal.fire({
          icon:'success',
          text:'password changed'
        }).then((res)=>{
          if(res.isConfirmed){
              localStorage.removeItem('userToken');
              setUserToken(null);
              navigate('/login')
        }
        })

      


    }
  })

  const { register, handleSubmit } = form;

  function handelChangePass(values) {
    console.log(values);
    

    mutate(values)
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen px-5 bg-blue-200">
        <div className="card w-[55%] bg-base-100 shadow-xl">
          <div className="card-body ">
            <h2 className="card-title">Change Password</h2>
            <form onSubmit={handleSubmit(handelChangePass)}>
              <div className="form-control gap-3 flex items-center m-3">
                <label className="label">
                  <span className="label-text text-blue-300">Old Password</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Old Password"
                  className="input input-bordered text-white w-[80%]"
                />
              </div>
              <div className="form-control gap-3 flex items-center m-3">
                <label className="label">
                  <span className="label-text text-blue-300">New Password</span>
                </label>
                <input
                  {...register("newPassword")}
                  type="password"
                  placeholder="New Password"
                  className="input input-bordered text-white w-[80%]"
                />
              </div>
              <button type="submit" className="w-full mt-2  bg-blue-700 rounded-2xl p-2 text-neutral-200 cursor-pointer ">submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
