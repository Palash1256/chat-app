import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setOnlineUser, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar"
import logo from '../assets/logo.png'
import { useSocket } from "../context/SocketContext";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { socket } = useSocket();

  // console.log("redux-user", user);
  // console.log('user',user)


  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        method: "GET",
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data))
      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email"); // <-- redirect here if backend says logout
      }
    } catch (error) {
      console.log("error", error);
      dispatch(logout());
      navigate("/email"); // <-- redirect here if error (e.g. session expired)
    }
  };
  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line
  }, []);

  /* Sccket connection */
  useEffect(() => {
    if (!socket) return;
    socket.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data))
    });
    return () => {
      socket.off('onlineUser');
    }
  }, [socket, dispatch])


  const basePath = location.pathname === '/'

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      {/* message components */}
      <section className={`${basePath && 'hidden'}`}>
        <Outlet />
      </section>

      <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>

        <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
      </div>
    </div>
  );
};

export default Home;
