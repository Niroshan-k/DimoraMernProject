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
      } else if (data.role === 'contractor') {
        navigate('/contractor-dashboard');
        return;
      } else {
        navigate('/');
      }

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className=' p-3 max-w-lg mx-auto'>
      <p>h</p>
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

          <button disabled={loading} type='submit' className='bg-[#523D35] w-full p-3 text-amber-50 mt-10 font-bold self-end'>
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth role={formData.role} setError={setLocalError} />
        </form>
      </div>

      <p className='text-center mt-10'>Do not Have an account? <Link to={"/sign-up"} className='text-[#523D35] font-extrabold'>Sign Up</Link></p>
      
      <div>
        {(error || localError) && <p className='text-red-600 text-center font-semibold'>{error || localError}</p>}
      </div>
    </div>
  )
};
