import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../Context/UserContext";
import getUnreadNotifications from "../../api/getUnreadCount.api";

export default function Navbar() {
  const { userToken, setUserToken, userPhoto } = useContext(UserContext);

  const { data, isLoading: countIsloading } = useQuery({
    queryKey:['unReads'],
    queryFn: getUnreadNotifications,
  });

  const navigate=useNavigate()
  let signOut = () => {
    navigate("/login");
    localStorage.removeItem("userToken");
    setUserToken(null);
  };
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-10">
      {
        userToken &&  <div className="flex-1">
          <Link to={"/home"} className="btn btn-ghost text-xl text-blue-200">
            Home
          </Link>
        </div>
      }
        <div className="flex gap-4 items-center">
          {userToken ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar relative"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User avatar"
                    src={userPhoto || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                  />
                </div>

                {data?.data?.unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
                    {data?.data?.unreadCount > 9 ? "9+" : data?.data?.unreadCount}
                  </span>
                )}
              </div>
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to={"/profile"} className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to={"/setting"}>Settings</Link>
                </li>
                <li>
                  <Link to={"/notifications"} className="relative flex justify-between">
                    Notifications
                    {data?.data?.unreadCount > 0 && (
                      <span className="badge badge-error badge-sm text-white">
                        {data?.data?.unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button onClick={()=>{signOut()}}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to={"/"} className="hover:text-gray-400">
                Register
              </Link>
              <Link to={"/login"} className="hover:text-gray-400">
                login
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
