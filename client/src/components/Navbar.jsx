import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import suvi1 from "../assets/suvi1.png";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { ServerUrl } from "../App";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("logout failed..");
      console.log(error);
    }
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/100 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex items-center gap-2.5"
          onClick={() => navigate("/")}
        >
          <img
            src={suvi1}
            alt="suvi logo"
            className="h-9 w-auto object-contain  animate-[spin_5s_linear_infinite] "
            
          />
          <h1 className="font-bold text-gray-700 leading-none  ">
            suvi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500 ">
              AI
            </span>
          </h1>
        </div>
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <button
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-sm font-medium shadow-md hover:scale-[1.02] transition-all cursor-pointer"
              onClick={() => navigate("/builder")}
            >
              Builder
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-orange-100 bg-white text-gray-700 text-sm font-medium hover:border-purple-300 transition-all cursor-pointer"
              onClick={() => navigate("/billing")}
            >
              Billing
            </button>

            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-orange-100 shadow-sm ">
              {/* Avtar......... */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* user info */}
              <div className="max-w-[140px] ">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                className="ml-1 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <FiLogOut />
              </button>
            </div>
          </div>
        )}

        {user && (
          <button
            className="md:hidden text-gray-600 hover:text-purple-500 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        )}
      </div>
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-lg p-4">
            <div className="flex items-center gap-3 pb-4 border-b border-b-orange-100">
              {/* Avtar......... */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              {/* user info */}
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => {
                  navigate("/builder");
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white"
              >
                Builder
              </button>
              <button
                onClick={() => {
                  navigate("/billing");
                  setMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-orange-100 bg-white text-gray-700 text-sm font-medium"
              >
                Billing
              </button>
            </div>
            <button onClick={()=>{setMenuOpen(false);handleLogout()}} className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm font-medium">
              <FiLogOut size={16} />
              LougOut
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
