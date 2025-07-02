import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from 'axios'
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  });
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [step, setStep] = useState(1); // 1: form, 2: otp
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [buttonText, setButtonText] = useState("Register");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation regex
  const isValidEmail = (email) => {
    // Simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handelOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handelUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url
    }));
  };

  const handelClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  // Check email validity and uniqueness
  const handleCheckEmail = async () => {
    setButtonText("Verifying Email...");
    setLoading(true);
    if (!isValidEmail(data.email)) {
      toast.error("Please enter a valid email address.");
      setButtonText("Register");
      setLoading(false);
      return false;
    }
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;
      const response = await axios.post(URL, { email: data.email });
      if (response.data.success) {
        toast.error("Email already registered.");
        setButtonText("Register");
        setLoading(false);
        return false;
      }
    } catch (error) {
      // If error is 400, user does not exist, so it's OK to proceed
      if (error?.response?.status === 400) {
        setEmailChecked(true);
        setButtonText("Sending OTP...");
        setLoading(false);
        return true;
      }
      toast.error("Error checking email.");
      setButtonText("Register");
      setLoading(false);
      return false;
    }
    setButtonText("Register");
    setLoading(false);
    return false;
  };

  // Send OTP to email
  const handleSendOtp = async () => {
    setButtonText("Verifying Email...");
    setLoading(true);
    const valid = await handleCheckEmail();
    if (!valid) {
      setButtonText("Register");
      setLoading(false);
      return;
    }
    setButtonText("Sending OTP...");
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/send-otp`;
      const response = await axios.post(URL, { email: data.email });
      if (response.data.success) {
        setServerOtp(response.data.otp); // For demo, in real app, don't expose OTP
        setStep(2);
        toast.success("OTP sent to your email.");
        setButtonText("Register");
      } else {
        toast.error("Failed to send OTP.");
        setButtonText("Register");
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
      setButtonText("Register");
    }
    setLoading(false);
  };

  // Verify OTP and register
  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!otp) {
      toast.error("Please enter OTP.");
      return;
    }
    try {
      const verifyURL = `${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`;
      const verifyRes = await axios.post(verifyURL, { email: data.email, otp });
      if (!verifyRes.data.success) {
        toast.error("Invalid OTP.");
        return;
      }
      // Proceed with registration
      const registerURL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;
      const response = await axios.post(registerURL, data);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        setStep(1);
        setOtp("");
        navigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed.");
    }
  };

  // html part
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome to Chat App!</h3>
        {step === 1 && (
          <form className="grid gap-4 mt-5" onSubmit={e => { e.preventDefault(); handleSendOtp(); }}>
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
              type="submit"
              disabled={loading}
            >
              {buttonText}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="grid gap-4 mt-5" onSubmit={handleVerifyOtpAndRegister}>
            <div className="flex flex-col gap-1">
              <label htmlFor="otp">Enter OTP sent to your email:</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-full mt-2 font-bold text-white leading-relaxed tracking-wider"
              type="submit"
            >
              Verify & Register
            </button>
          </form>
        )}
        <p className="my-3 text-center">
          Already Have Account ?<Link to={"/email"} className="hover:text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
