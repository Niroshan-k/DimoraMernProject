import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/User/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';

export default function OAuth({ role, setError }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        if (!role) {
            setError("Please select a role before signing up with Google.");
            return;
        }
    
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
    
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    name: result.user.displayName, 
                    email: result.user.email, 
                    photo: result.user.photoURL, 
                    role: role 
                }),
            });
    
            const data = await res.json();
    
            if (!res.ok) {  
                // If backend responds with an error, show it on the frontend
                setError(data.message || "Google authentication failed.");
                return;
            }
            dispatch(signInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log("Google authentication error:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className='flex flex-col'>
            <p className='mt-10 text-sm self-center'>or continue with</p>
            <button
                onClick={handleGoogleClick}
                type='button'
                className='bg-amber-700 text-white self-center p-3 mt-2 flex items-center justify-center gap-2 rounded-3xl'
            >
                <FaGoogle className="text-lg" />
            </button>

        </div>
    )
}
