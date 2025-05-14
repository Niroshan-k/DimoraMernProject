import React, { useEffect, useState } from 'react'
import { FaGlobe, FaBars, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AIagent from './AIagent';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1); // State to track zoom level

    useEffect(() => {
        document.body.style.zoom = zoomLevel; // Apply zoom level to the entire page
    }, [zoomLevel]);

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); // Limit max zoom to 2x
    };

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); // Limit min zoom to 0.5x
    };

    return (
        <header className='bg-[#EFEFE9] shadow-lg z-2 w-full flex justify-between p-2 fixed items-center'>
            {/* Zoom Buttons */}
            <div className="fixed bottom-5 left-5 flex flex-col gap-2 z-50">
                <button
                    onClick={handleZoomIn}
                    className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                >
                    <FaPlus />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                >
                    <FaMinus />
                </button>
                <p className='text-sm font-bold text-center'>{Math.round(zoomLevel * 100)}%</p>
            </div>

            <Link to='/'>
                <img src="/assets/logo.png" alt="logo" className='w-32' />
            </Link>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className='text-2xl p-2'
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Desktop Menu */}
            <ul className='hidden md:flex gap-5 items-center cursor-pointer'>
                {currentUser?.role != 'admin' && (
                    <>
                        <li className='flex gap-1 items-center'><FaGlobe />English</li>
                    </>
                )}
                {currentUser &&
                    <ul className='flex gap-5 items-center cursor-pointer'>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/contractors">Contractors</Link></li>
                        <li><Link to="/liked-listings">Favorites</Link></li>
                    </ul>
                }
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

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className='absolute top-full left-0 right-0 bg-[#EFEFE9] shadow-lg p-4 md:hidden'>
                    <ul className='flex flex-col gap-4'>
                        {currentUser?.role != 'admin' && (
                            <>
                                <li className='flex gap-1 items-center'><FaGlobe />English</li>
                                <li className=''>Contact</li>
                                <li>About Us</li>
                            </>
                        )}
                        <li><Link to="/blog" onClick={() => setIsMenuOpen(false)}>Blog</Link></li>
                        {currentUser && <li><Link to="/contractors" onClick={() => setIsMenuOpen(false)}>Contractors</Link></li>}

                        {currentUser?.role === 'seller' && (
                            <li><Link to="/seller-dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                        )}
                        {currentUser?.role === 'contractor' && (
                            <li><Link to="/contractor-dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                        )}
                        {currentUser?.role === 'admin' && (
                            <li><Link to="/dimora/admin-dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link></li>
                        )}

                        <li>
                            <Link to='/profile' onClick={() => setIsMenuOpen(false)}>
                                {currentUser ? (
                                    <div className='flex items-center gap-2'>
                                        <img src={currentUser.avatar || "https://th.bing.com/th/id/OIP.YEnn0jmP54djRm9Ma49NHgHaHa?rs=1&pid=ImgDetMain"} alt="profile" className='rounded-full border object-cover w-10 h-10' />
                                        <span>Profile</span>
                                    </div>
                                ) : (
                                    <button className='bg-[#959D90] font-bold p-3 w-full rounded text-white cursor-pointer'>Sign In</button>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}

// firebase

// allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 * 1024 &&
//       request.resource.contentType.matches('image/.*')
