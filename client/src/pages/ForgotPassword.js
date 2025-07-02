import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: reset password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [serverOtp, setServerOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/send-otp`
      const res = await axios.post(URL, { email })
      if (res.data.success) {
        setStep(2)
        toast.success('OTP sent to your email')
      } else {
        toast.error(res.data.message || 'Failed to send OTP')
      }
    } catch (err) {
      toast.error('Failed to send OTP')
    }
    setLoading(false)
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`
      const res = await axios.post(URL, { email, otp })
      if (res.data.success) {
        setStep(3)
        toast.success('OTP verified')
      } else {
        toast.error(res.data.message || 'Invalid OTP')
      }
    } catch (err) {
      toast.error('Invalid OTP')
    }
    setLoading(false)
  }

  // Step 3: Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill all fields')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-password`
      const res = await axios.post(URL, { email, password: newPassword })
      if (res.data.success) {
        toast.success('Password updated successfully')
        setStep(1)
        setEmail('')
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
        navigate('/email') // redirect to login page
      } else {
        toast.error(res.data.message || 'Failed to update password')
      }
    } catch (err) {
      toast.error('Failed to update password')
    }
    setLoading(false)
  }

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3 className="mb-4">Forgot Password</h3>
        {step === 1 && (
          <form className="grid gap-4" onSubmit={handleSendOtp}>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Enter your email address:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email"
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-full mt-2 font-bold text-white leading-relaxed tracking-wider"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form className="grid gap-4" onSubmit={handleVerifyOtp}>
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
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        {step === 3 && (
          <form className="grid gap-4" onSubmit={handleUpdatePassword}>
            <div className="flex flex-col gap-1">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                className="bg-slate-100 px-2 py-1 focus:outline-primary"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-full mt-2 font-bold text-white leading-relaxed tracking-wider"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
