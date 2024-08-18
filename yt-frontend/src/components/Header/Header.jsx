import React , {useState , useEffect} from "react";
import SpButton from "../Button/spBtn";
import Logo from "@/Logo";
import Button from "../Button/button";
import { Link , useNavigate , useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/auth.hook";
import { useDispatch , useSelector } from "react-redux";
import { setUser } from "@/features/authSlice";

import SearchBar from "./SearchBar";
import { setShowUploadVideo } from "@/features/uiSlice";
import { isFluxStandardAction } from "@reduxjs/toolkit";

function Header(){
  const navigate = useNavigate();
const location = useLocation();
const authStatus = useSelector((state) => state.auth.authStatus);
const userData = useSelector((state) => state.auth.user);

const dispatch = useDispatch();
const { mutateAsync: logout } = useLogout();

const [sideBar , setSideBar] = useState(false);

const handleLogout = async () => {
  const sessionStatus = await logout();
  if (sessionStatus) {
    dispatch(setUser(null));
  }
};

const handleUploadVideo = () => {
  navigate("/dashboard");
  dispatch(setShowUploadVideo(true)); 
};

const mobileSidebarItems = [
  {
    name: "Liked Videos",
    path: "/liked-videos",
   // icon: <BiLike />,
  },
  {
    name: "My Channel",
    path: `/channel/${userData?.username}/videos`,
   // icon: <GoDeviceCameraVideo />,
  },
  {
    name: "Support",
    path: "/support",
    //icon: <RxQuestionMarkCircled />,
  },
  {
    name: "Settings",
    path: "/edit-profile/personal-info",
   // icon: <CiSettings />,
  },
];

const handleSideBar = () => {
  setSideBar((prev) => !prev);
};

useEffect(() => {
  setSideBar(false);
}, [location.pathname]);

function Header() {
  return (
   <header className="bg-white sticky top-0 z-50 border-b shadow-md dark:bg-black">
    <div>header</div>
   </header>
  ) 
}

}

export default Header

