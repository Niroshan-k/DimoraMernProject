import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/User/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [localError, setLocalError] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0); // Track failed attempts
  const [isLocked, setIsLocked] = useState(false); // Lock state
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (failedAttempts === 3) {
      // Save failed attempts to the database after the third attempt
      saveFailedAttempt();

      // Lock the login button for 10 minutes
      setIsLocked(true);
      const lockTimeout = setTimeout(() => {
        setFailedAttempts(0); // Reset failed attempts after lockout period
        setIsLocked(false);
      }, 10 * 60 * 1000); // 10 minutes

      return () => clearTimeout(lockTimeout); // Cleanup timeout
    }
  }, [failedAttempts]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };

  const saveFailedAttempt = async () => {
    try {
      await fetch('/api/auth/securityAlerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          reason: "Three failed login attempts",
        }),
      });
    } catch (error) {
      console.error("Error saving failed attempt:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      setLocalError("You've been locked out due to too many failed login attempts. Please try again later.");
      return;
    }

    try {
      dispatch(signInStart()); // Start the loading state
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setFailedAttempts((prev) => prev + 1); // Increment failed attempts
        setLocalError(data.message || "Invalid login credentials.");
        dispatch(signInFailure(data.message)); // Stop the loading state
        return; // Exit here
      }

      dispatch(signInSuccess(data)); // Stop the loading state on success
      setFailedAttempts(0); // Reset failed attempts on success
      setLocalError(null);

      if (data.role === 'seller') {
        navigate('/seller-dashboard');
        return;
      } else if (data.role === 'contractor') {
        navigate('/contractor-dashboard');
        return;
      } else {
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Stop the loading state on error
      setLocalError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <div>
        <h6 className='mt-20 text-6xl mb-12 uppercase'>Sign In</h6>
      </div>
      <br />
      <div>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <label className='font-semibold' htmlFor="email">Email:</label>
          <input type="text" id='email' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

          <label className='font-semibold' htmlFor="password">Password:</label>
          <input type="password" id='password' onChange={handleChange} className='bg-[#E8D9CD] p-3' />
          <p className='text-right text-yellow-700 cursor-pointer underline mb-10'>Forget Password?</p>

          <label className='font-semibold'>Role:</label>
          <div className='flex gap-4 mb-8 mt-3 px-20 justify-between'>
            <label>
              <input
                type='radio'
                name='role'
                value='customer'
                checked={formData.role === 'customer'}
                onChange={handleRoleChange}
              />
              <span> </span>Customer
            </label>
            <label>
              <input
                type='radio'
                name='role'
                value='seller'
                checked={formData.role === 'seller'}
                onChange={handleRoleChange}
              />
              <span> </span>Seller
            </label>
            <label>
              <input
                type='radio'
                name='role'
                value='contractor'
                checked={formData.role === 'contractor'}
                onChange={handleRoleChange}
              />
              <span> </span>Contractor
            </label>
          </div>

          <button
            disabled={loading || isLocked}
            type='submit'
            className={`w-full p-3 text-amber-50 mt-10 font-bold self-end ${isLocked ? 'bg-gray-400' : 'bg-[#523D35]'
              }`}
          >
            {isLocked ? 'Locked' : loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth role={formData.role} setError={setLocalError} />
        </form>
      </div>

      <p className='text-center mt-10'>Do not Have an account? <Link to={"/sign-up"} className='text-[#523D35] font-extrabold'>Sign Up</Link></p>

      <div>
        {(error || localError) && (
          <div className='text-red-500 shadow-lg rounded-lg mt-5 p-3 text-center font-semibold'>
            {error || localError}
          </div>
        )}
      </div>
    </div>
  );
}