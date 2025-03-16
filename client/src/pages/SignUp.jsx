import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.role) {
            setError("Please select a role.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            setLoading(false);
            setError(null);
            navigate('/sign-in');
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className='mt-10 p-3 max-w-lg mx-auto'>
            <h6 className='text-6xl mb-12 uppercase'>Sign Up</h6>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <label className='font-semibold' htmlFor="username">Username:</label>
                <input type="text" id='username' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

                <label className='font-semibold' htmlFor="email">Email:</label>
                <input type="text" id='email' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

                <label className='font-semibold' htmlFor="password">Password:</label>
                <input type="password" id='password' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

                <label className='font-semibold'>Role:</label>
                <div className='flex mt-3 gap-4 px-10 justify-between mb-8'>
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
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>

                <OAuth role={formData.role} setError={setError} />
            </form>


            <p className='text-center mt-10'>Have an account? <Link to={"/sign-in"} className='text-[#523D35] font-bold'>Sign in</Link></p>



            {error && <p className='text-red-600'>{error}</p>}
        </div>
    );
}
