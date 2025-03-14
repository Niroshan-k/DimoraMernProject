import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/User/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [localError, setLocalError] = useState(null);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(
      {
        ...formData,
        [e.target.id]: e.target.value,
      }
    );
  };
  //console.log(formData);

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      if (data.role === 'seller') {
        navigate('/seller-dashboard');
        return;
      }else if (data.role === 'contractor') {
        navigate('/contractor-dashboard');
        return;
      }else{
        navigate('/');
      }

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className='p-24'>
      <div>
        <h1 className=' text-6xl mb-12'>Sign In</h1>
      </div>
      <br />
      <div>
        <form onSubmit={handleSubmit} className='flex flex-col'>
          <label htmlFor="email">Email:</label>
          <input type="text" id='email' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

          <label htmlFor="password">Password:</label>
          <input type="password" id='password' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

          <label>Role:</label>
          <div className='flex gap-4 mb-8'>
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

          <button disabled={loading} type='submit' className='bg-[#523D35] w-60 p-3 text-amber-50 font-bold'>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth role={formData.role} setError={setLocalError} />
        </form>
      </div>
      <div className='flex gap-2 mt-4'>
        <p>Do not Have an account?</p>
        <Link to={"/sign-up"} className='text-blue-400 font-bold'>Sign Up</Link>
      </div>
      <div>
        {(error || localError) && <p className='text-red-600'>{error || localError}</p>}
      </div>
    </div>
  )
};
