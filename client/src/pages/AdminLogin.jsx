import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/User/userSlice';

export default function AdminLogin() {
    const [formData, setFormData] = useState({ role: 'admin' }); // Set default role to 'admin'
    const [localError, setLocalError] = useState(null);
    const { loading, error } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
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
            } else if (data.role === 'admin') {
                navigate('/dimora/admin-dashboard');
                return;
            } else {
                navigate('/');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <div>
                <h6 className='mt-20 text-6xl mb-12 uppercase'>Admin</h6>
            </div>
            <div>
                <form onSubmit={handleSubmit} className='flex flex-col'>
                    <label className='font-semibold' htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id='email'
                        onChange={handleChange}
                        className='bg-[#E8D9CD] p-3 mb-8'
                    />

                    <label className='font-semibold' htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id='password'
                        onChange={handleChange}
                        className='bg-[#E8D9CD] p-3'
                    />

                    {/* Hidden Radio Button for Role */}
                    <input
                        type='radio'
                        name='role'
                        value='admin'
                        checked={true} // Always checked
                        readOnly // Prevent user interaction
                        hidden // Hide the radio button
                    />

                    <button
                        disabled={loading}
                        type='submit'
                        className='bg-[#523D35] w-full p-3 text-amber-50 mt-10 font-bold self-end'
                    >
                        {loading ? 'Loading...' : 'Sign In'}
                    </button>
                </form>
            </div>
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
