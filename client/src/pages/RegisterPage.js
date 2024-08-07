import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from 'axios'
import toast from "react-hot-toast";

const RegisterPage = () => {

  //all the useStates
  const [data,setData]=useState({
    name:"",
    email:"",
    password:"",
    profile_pic:""
  })
  const [uploadPhoto,setUploadPhoto] =useState("")
  const navigate=useNavigate()

// functions of useState
  const handelOnChange=(e)=>{
    const {name,value}=e.target
    setData((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }

  const handelUploadPhoto =async(e)=>{
    const file=e.target.files[0];
    const uploadPhoto =await uploadFile(file)
   // console.log("uploadPhoto", uploadPhoto);
    setUploadPhoto(file)

    setData((prev)=>{
      return{
        ...prev,
        profile_pic:uploadPhoto?.url
      }
    })
  }

  const handelClearUploadPhoto =(e)=>{
    e.stopPropagation();
     e.preventDefault();
    setUploadPhoto(null)
  }
  const handelSubmit=async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response =await axios.post(URL,data)
      toast.success(response.data.message)
      console.log("response",response)
       if(response.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        })
        navigate('/email')
       }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      //console.log("error",error)
    }
    console.log(data);
  }



// html part
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat App!</h3>

        <form className="grid gap-4 mt-5" onSubmit={handelSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Your Name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.name}
              onChange={handelOnChange}
              required
            />
          </div>

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

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handelOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm">
                  {uploadPhoto?.name ? uploadPhoto.name : "Upload Profile Photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-600"
                    onClick={handelClearUploadPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handelUploadPhoto}
            />
          </div>

          <button
            className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-full mt-2 font-bold text-white leading-relaxed tracking-wider"
          >
            Register
          </button>
        </form>
        <p className="my-3 text-center">Already Have Account ?<Link to={"/email"} className="hover:text-primary font-semibold">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
