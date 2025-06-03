import React, { useState } from 'react'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would typically send a request to your backend
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
        <h3 className="mb-4">Forgot Password</h3>
        {!submitted ? (
          <form className="grid gap-4" onSubmit={handleSubmit}>
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
            <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded-full mt-2 font-bold text-white leading-relaxed tracking-wider">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600 py-6">
            If an account with that email exists, a password reset link has been sent.
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword
