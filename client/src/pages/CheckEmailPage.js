import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LuUserCircle2 } from "react-icons/lu";

const CheckEmailPage = () => {
  //all the useStates
  const [data, setData] = useState({
    email: "",

  })
  const navigate = useNavigate();
  // functions of useState
  const handelOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      //console.log(response)
      toast.success(response.data.message);
      //console.log("response", response);
      if (response.data.success) {
        setData({
          email: "",
        })
        navigate("/password", {
          state:response?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      //console.log("error",error)
    }
    //console.log(data);
  }


  //html part
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">

        <div className="w-fit mx-auto">
          <LuUserCircle2
            size={70}
          />

        </div>
        <h3>Welcome to Chat App!</h3>

        <form className="grid gap-4 mt-3" onSubmit={handelSubmit}>


          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handelOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-full mt-2 font-bold text-white leading-relaxed tracking-wider">
            Let's Go
          </button>
        </form>
        <p className="my-3 text-center">
          New User ?
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckEmailPage
