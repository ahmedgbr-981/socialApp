import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../Context/UserContext";
import getUnreadNotifications from "../../api/getUnreadCount.api";
import { TiHome } from "react-icons/ti";
import {
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

export default function Navbar() {
  const { userToken, setUserToken, userPhoto } = useContext(UserContext);
  const [ShowdropDwon, setShowdropDwon] = useState(false);
  const navigate = useNavigate();

  const { data: ureadCountData } = useQuery({
    queryKey: ["unReads"],
    queryFn: getUnreadNotifications,
    enabled: Boolean(userToken),
  });

  const signOut = () => {
    navigate("/login");
    localStorage.removeItem("userToken");
    setUserToken(null);
  };
  return (
    <>
      {userToken && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
          
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-base-100/20 px-4 py-2 shadow-lg backdrop-blur-xl">
            
            {/* Logo / Home */}
            {userToken && (
              <Link
                to="/home"
                className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 hover:bg-green-500/10"
              >
                
                <TiHome className="text-3xl text-green-500 transition-transform duration-200 group-hover:scale-110" />
                <span className="hidden text-lg font-bold tracking-tight sm:block">
                  
                  Social
                </span>
              </Link>
            )}
            {/* Right Side */}
            {userToken && (
              <div className="flex items-center gap-3">
                
                {/* Profile Dropdown */}
                
                <div className="dropdown dropdown-end relative">
                  
                  <button
                    onClick={() => setShowdropDwon(!ShowdropDwon)}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-base-200/60 p-1 pr-2 transition-all duration-200 hover:border-green-500/40 hover:bg-base-200"
                  >
                    
                    {/* Avatar */}
                    <div className="avatar">
                      
                      <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-transparent transition-all hover:ring-green-500/40">
                        
                        <img
                          src={userPhoto}
                          alt="User avatar"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Arrow */}
                    <span
                      className={`text-xs opacity-60 transition-transform duration-200 ${ShowdropDwon ? "rotate-180" : ""}`}
                    >
                      
                      ▼
                    </span>
                  </button>
                  {/* Dropdown */}
                  {ShowdropDwon && (
                    <ul className="menu absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-base-100/95 p-2 shadow-2xl backdrop-blur-xl">
                      
                      {/* Profile */}
                      <li>
                        
                        <Link
                          to="/profile"
                          onClick={() => setShowdropDwon(false)}
                          className="rounded-xl px-3 py-3 transition-colors hover:bg-green-500/10"
                        >
                          
                          <span className="text-lg">👤</span>
                          <span>Profile</span>
                        </Link>
                      </li>
                      {/* Settings */}
                      <li>
                        
                        <Link
                          to="/setting"
                          onClick={() => setShowdropDwon(false)}
                          className="rounded-xl px-3 py-3 transition-colors hover:bg-green-500/10"
                        >
                          
                          <span className="text-lg">⚙️</span>
                          <span>Settings</span>
                        </Link>
                      </li>
                      {/* Notifications */}
                      <li>
                        
                        <Link
                          to="/notifications"
                          onClick={() => setShowdropDwon(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-green-500/10"
                        >
                          
                          <div className="flex items-center gap-3">
                            
                            <span className="text-lg">🔔</span>
                            <span>Notifications</span>
                          </div>
                          {ureadCountData?.data?.unreadCount > 0 && (
                            <span className="badge badge-error badge-sm text-white">
                              
                              {ureadCountData.data.unreadCount}
                            </span>
                          )}
                        </Link>
                      </li>
                      {/* Divider */}
                      <div className="my-1 border-t border-base-300" />
                      {/* Logout */}
                      <li>
                        
                        <button
                          onClick={() => {
                            signOut();
                            setShowdropDwon(false);
                          }}
                          className="rounded-xl px-3 py-3 text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
                        >
                          
                          <span className="text-lg">↪</span>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all duration-200 hover:bg-base-200"
                >
                  
                  🔔
                  {ureadCountData?.data?.unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-base-100">
                      
                      {ureadCountData.data.unreadCount > 99
                        ? "99+"
                        : ureadCountData.data.unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
