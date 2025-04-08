import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../components/OAuth';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        cPassword: '',
        role: ''
    });
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

    // Email validation function
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation function
    const isStrongPassword = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.role) {
            setError("Please select a role.");
            return;
        }

        if (!isValidEmail(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!isStrongPassword(formData.password)) {
            setError("Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number.");
            return;
        }

        if (formData.password !== formData.cPassword) {
            setError("Passwords do not match.");
            return;
        }
        //Z?zNB4FtEykzn5D

        try {
            setLoading(true);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    password: formData.password, // Send only one correct password
                }),
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
        <div className='p-3 max-w-lg mx-auto'>
            <h6 className='mt-20 text-6xl mb-12 uppercase'>Sign Up</h6>
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <label className='font-semibold text-sm' htmlFor="username">Username:</label>
                <input type="text" id='username' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

                <label className='font-semibold text-sm' htmlFor="email">Email:</label>
                <input type="text" id='email' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-2' />
                <p className="text-xs text-gray-600 mb-8">Enter a valid email address (e.g., user@example.com).</p>

                <label className='font-semibold text-sm' htmlFor="password">Password:</label>
                <input type="password" id='password' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-2' />
                <p className="text-xs text-gray-600 mb-8">Password must be at least 8 characters, contain an uppercase letter, a lowercase letter, and a number.</p>

                <label className='font-semibold text-sm' htmlFor="cPassword">Confirm Password:</label>
                <input type="password" id='cPassword' onChange={handleChange} className='bg-[#E8D9CD] p-3 mb-8' />

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

                <button disabled={loading} type='submit' className='bg-[#523D35] w-full p-3 text-amber-50 font-bold'>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                {error && <div className='text-red-500 mt-5 shadow-lg p-3 rounded-lg'>{error}</div>}

                <OAuth role={formData.role} setError={setError} />
            </form>

            <p className='text-center mt-10'>Have an account? <Link to={"/sign-in"} className='text-[#523D35] font-extrabold'>Sign in</Link></p>

            
        </div>
    );
}
