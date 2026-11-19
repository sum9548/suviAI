import React from "react";
import { PiSparkleThin } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineMicrophone } from "react-icons/hi";
import {
  HiOutlineSpeakerWave,
  HiOutlineCodeBracket,
  HiOutlineBolt,
} from "react-icons/hi2";
import suvi1 from "../assets/suvi1.png";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";

import axios from "axios";
import { ServerUrl } from "../App";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  // Data for the feature cards, so we map over it instead of repeating JSX
  const FEATURES = [
    {
      icon: <HiOutlineMicrophone />,
      title: "Voice AI",
      desc: "Natural real-time voice conversations.",
    },
    {
      icon: <HiOutlineSpeakerWave />,
      title: "Smart Navigation",
      desc: "Navigate pages using voice commands.",
    },
    {
      icon: <HiOutlineCodeBracket />,
      title: "Easy Embed",
      desc: "Add assistant using one script tag.",
    },
    {
      icon: <HiOutlineBolt />,
      title: "Fast Responses",
      desc: "Optimized Gemini AI responses.",
    },
  ];

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      const { displayName, email } = result.user;
      const res = await axios.post(
        ServerUrl + "/api/auth/google",
        {
          name: displayName,
          email,
        },
        {
          withCredentials: true,
        },
      )
      toast.success("Login Successfully...")
      setUser(res.data);
      navigate("/");
    } catch (error) {
      toast.error("Login failed...")
      console.log(error);
    }
  };

  return (
    // Full-screen page with a soft purple -> white -> green background
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
        {/* 2-column grid: it must have exactly 2 direct children */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ================= LEFT SIDE (child 1) ================= */}
          <div>
            {/* Small badge on top */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-100 text-purple-600 text-sm font-medium">
              <PiSparkleThin />
              AI Voice Assistant Platform
            </div>

            {/* Big heading; the second line uses a gradient text trick */}
            <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight text-[#081028]">
              Build AI Assistants
              {/* block = new line, bg-clip-text + text-transparent = gradient shows through the letters */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
                For Any Website
              </span>
            </h1>

            {/* Description paragraph */}
            <p className="mt-6 text-lg text-[#475569] leading-8 max-w-2xl">
              Create customizable AI voice assistants that talk, guide users,
              and integrate into any website instantly.
            </p>

            {/* Google button: justify-between puts the text group left, arrow right */}
            <button
              className="mt-10 h-16 px-8 rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-lg font-semibold flex items-center justify-between gap-4 w-full max-w-md shadow-[0_20px_80px_rgba(139,92,246,0.25)] hover:scale-[1.02] transition cursor-pointer"
              onClick={() => handleLogin()}
            >
              <span className="flex items-center gap-3">
                <FcGoogle className="text-3xl bg-white rounded-full" />
                Continue with Google
              </span>
              <FaArrowRight className="w-4 h-4" />
            </button>

            {/* Small note under the button */}
            <p className="mt-4 text-sm text-[#64748b]">
              Free plan includes 200 AI responses
            </p>
          </div>

          {/* ================= RIGHT SIDE (child 2) ================= */}
          {/* relative = the glow inside can be positioned relative to this box */}
          <div className="relative">
            {/* Blurred colour glow behind the card (absolute, so it doesn't take space) */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/50 to-emerald-200/40 blur-[120px]" />

            {/* The white Features card (relative so it sits above the glow) */}
            <div className="relative rounded-[40px] border border-black/5 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.06)] p-8 overflow-hidden">
              {/* Card header: title on the left, logo box on the right */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#081028]">Features</h2>

                <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.25)] p-1">
                  <img
                    src={suvi1}
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Feature list: space-y-5 = vertical gap between cards */}
              <div className="mt-10 space-y-5">
                {FEATURES.map(({ icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="flex gap-5 rounded-3xl border border-black/5 bg-[#f8fafc] p-5"
                  >
                    {/* Gradient icon box */}
                    <div className="min-w-[60px] h-[60px] rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white text-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(139,92,246,0.20)]">
                      {icon}
                    </div>

                    {/* Title + description */}
                    <div>
                      <h3 className="text-[#081028] text-lg font-semibold">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[#64748b]">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
