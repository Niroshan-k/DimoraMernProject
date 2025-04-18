import React from 'react'
import { FaGlobe } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function header() {
    const { currentUser } = useSelector(state => state.user);
    //console.log(currentUser);
    return (
        <header className='bg-[#EFEFE9] shadow-lg z-2 w-full flex justify-between p-2 fixed items-center'>
            <Link to='/'>
                <img src="/assets/logo.png" alt="logo" className='w-32' />
            </Link>
            <ul className='flex gap-5 items-center cursor-pointer'>
                {currentUser?.role != 'admin' && (
                    <>
                    <li className='flex gap-1 items-center'><FaGlobe />English</li>
                    <li className=''>Contact</li>
                    <li>About Us</li>
                    </>
                )}
                <ul className='flex gap-5 items-center cursor-pointer'>
                    <li><Link to="/blog">Blog</Link></li> {/* Use Link directly */}
                    {currentUser && <li><Link to="/contractors">Contractors</Link></li>}
                </ul>

                {currentUser?.role === 'seller' && (
                    <li><Link to="/seller-dashboard">Dashboard</Link></li>
                )}
                {currentUser?.role === 'contractor' && (
                    <li><Link to="/contractor-dashboard">Dashboard</Link></li>
                )}
                {currentUser?.role === 'admin' && (
                    <li><Link to="/dimora/admin-dashboard">Dashboard</Link></li>
                )}

                <Link to='/profile'>
                    {currentUser ? (
                        <img src={currentUser.avatar || "https://th.bing.com/th/id/OIP.YEnn0jmP54djRm9Ma49NHgHaHa?rs=1&pid=ImgDetMain"} alt="profile" className='rounded-full border object-cover w-10 h-10' />
                    ) : (<li> <button className='bg-[#959D90] font-bold p-3 w-24 rounded cursor-pointer'>Sign In</button></li>
                    )}
                </Link>
                
            </ul>
        </header>
    )
}

// firebase

// allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 * 1024 &&
//       request.resource.contentType.matches('image/.*')
