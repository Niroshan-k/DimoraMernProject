import React, { useEffect, useState } from 'react';
import { FaBox, FaCube, FaCubes, FaHeart, FaHouseUser, FaImage, FaRegHeart, FaShareAlt, FaSpinner, FaWarehouse, FaWhatsapp, FaFacebook, FaTwitter, FaCopy, FaLinkedin, FaInstagram, FaEye, FaEyeSlash, FaEyeDropper, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './listingitem.css';
import { useSelector } from 'react-redux';

export default function ListingItem({ listing }) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(listing.likes || 0); // Initialize with the current likes count
    const [showFloatingLike, setShowFloatingLike] = useState(false); // State to manage floating like visibility
    const [showShareForm, setShowShareForm] = useState(false); // State to manage floating share form visibility
    const { currentUser } = useSelector((state) => state.user);
    const [copied, setCopied] = useState(false); // State to manage copied status

    // Fetch the liked status when the component mounts
    useEffect(() => {
        if (currentUser && currentUser._id) {
            const fetchLikedStatus = async () => {
                try {
                    const res = await fetch(`/api/listing/liked/${listing._id}/${currentUser._id}`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch liked status');
                    }
                    const data = await res.json();
                    setLiked(data.liked); // Set the liked status
                } catch (error) {
                    console.error('Error fetching liked status:', error);
                }
            };

            fetchLikedStatus();
        }
    }, [listing._id, currentUser]); // Fetch liked status when listing or user changes

    const saveFavorite = async () => {
        if (currentUser && !liked) {
            try {
                const res = await fetch(`/api/listing/like/${listing._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: currentUser._id }),
                });
                if (!res.ok) {
                    throw new Error('Failed to update likes count');
                }
                const data = await res.json();
                setLikesCount(data.likes);
                setLiked(true);

                setShowFloatingLike(true);
                setTimeout(() => setShowFloatingLike(false), 1500);
            } catch (error) {
                console.error('Error updating likes:', error);
            }
        } else {
            console.log('User not signed in or already liked');
        }
    };

    const unsaveFavorite = async () => {
        if (currentUser && liked) {
            try {
                const res = await fetch(`/api/listing/unlike/${listing._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: currentUser._id }),
                });
                if (!res.ok) {
                    throw new Error('Failed to update likes count');
                }
                const data = await res.json();
                setLikesCount(data.likes);
                setLiked(false);
            } catch (error) {
                console.error('Error updating likes:', error);
            }
        } else {
            console.log('User not signed in or already unliked');
        }
    };

    const toggleShareForm = () => {
        setShowShareForm((prev) => !prev); // Toggle the share form visibility
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/listing/${listing._id}`);
        setCopied(true); // Set copied status to true
        setTimeout(() => {
            setCopied(false); // Reset copied status after 2 seconds
        }, 2000);
    };

    const handleNewestUser = (date) => {
        const createdAt = new Date(date);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - createdAt); // Calculate time difference
        const differenceInDays = timeDiff / (1000 * 60 * 60 * 24); // Convert to days
        if (differenceInDays <= 40) {
            return "new"; // Return "new" if the user is created within the last 3 days
        } else {
            return null; // Return an empty string if the user is not new
        }
    };

    const closeClipboard = () => {
        setCopied(false);
    }

    return (
        <div className="mt-3 relative">
            {/* Floating Like Icon */}
            {showFloatingLike && (
                <div className="floating-hearts-container">
                    {/* Multiple hearts with animation */}
                    <FaHeart className="heart-animation heart-1" />
                    <FaHeart className="heart-animation heart-2" />
                    <FaHeart className="heart-animation heart-3" />
                    <FaHeart className="heart-animation heart-4" />
                    <FaHeart className="heart-animation heart-5" />
                </div>
            )}

            {/* Floating Share Form */}
            {showShareForm && (
                <div className="floating-share-form bg-white shadow-lg rounded-lg p-5 absolute top-115 left-80 z-50">
                    <h1 className="font-bold text-lg mb-3">Share..</h1>
                    <div className="grid grid-cols-3 gap-10 p-5">
                        <FaWhatsapp
                            className="text-green-500 text-2xl cursor-pointer"
                            onClick={() =>
                                window.open(
                                    `https://api.whatsapp.com/send?text=Check out this property: ${window.location.origin}/listing/${listing._id}`,
                                    '_blank'
                                )
                            }
                        />
                        {/* LinkedIn Sharing */}
                        <FaLinkedin
                            className="text-blue-700 text-2xl cursor-pointer"
                            onClick={() =>
                                window.open(
                                    `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.origin}/listing/${listing._id}&title=Check out this property!`,
                                    '_blank'
                                )
                            }
                        />

                        {/* Instagram Sharing */}
                        <FaInstagram
                            className="text-pink-500 text-2xl cursor-pointer"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/listing/${listing._id}`);
                                alert('Link copied to clipboard! Share it on Instagram.');
                            }}
                        />
                        <FaFacebook
                            className="text-blue-600 text-2xl cursor-pointer"
                            onClick={() =>
                                window.open(
                                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/listing/${listing._id}`,
                                    '_blank'
                                )
                            }
                        />
                        <FaTwitter
                            className="text-blue-400 text-2xl cursor-pointer"
                            onClick={() =>
                                window.open(
                                    `https://twitter.com/intent/tweet?url=${window.location.origin}/listing/${listing._id}&text=Check out this property!`,
                                    '_blank'
                                )
                            }
                        />
                        <FaCopy className="text-gray-600 text-2xl cursor-pointer" onClick={copyLink} />
                    </div>
                </div>
            )}
            {

                copied ? <div className='z-100 bg-white shadow-lg rounded-2xl p-2 fixed bottom-5 left-1/2 -translate-x-1/2 max-w-lg w-full text-center'>
                    <div className='text-right justify-self-end'>
                        <FaTimes className='cursor-pointer' onClick={closeClipboard} />
                    </div>
                    <p className='flex items-center justify-center gap-2'>
                        <FaCheckCircle className='text-green-500' /> Link copied to clipboard!
                    </p>
                </div> : ""

            }

            <div className="bg-[#EFEFE9] rounded flex overflow-hidden flex-col shadow-lg w-90 hover:shadow-2xl">
                <div className="absolute z-0 text-white">
                    {listing.urgent ? (
                        <p className="bg-red-500 px-2 rounded-br rounded-tl font-bold uppercase">Urgent</p>
                    ) : listing.sold ? (
                        <p className="bg-purple-500 px-2 rounded-br rounded-tl font-bold uppercase">Sold</p>
                    ) : handleNewestUser(listing.createdAt) == "new" ? (
                        <p className='bg-green-500 px-2 rounded-br rounded-tl font-bold uppercase'>New</p>
                    ) : listing.package = "boost" ? (
                        <p className="bg-blue-500 px-2 rounded-br rounded-tl font-bold uppercase">Boost</p>
                    ) : (
                        <p className="bg-gray-500 px-2 rounded-br rounded-tl font-bold uppercase">Normal</p>
                    )
                    }

                </div>
                <div className="absolute mt-44 px-2 flex items-center gap-1 bg-[#EFEFE9] rounded-tr">
                    <p>{listing.imageUrls.length}</p>
                    <FaImage />
                </div>
                <Link to={`/listing/${listing._id}`}>
                    <img
                        className="h-50 w-90 object-cover hover:z-0 hover:scale-105 duration-300 transition-scale"
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                    />
                </Link>
                <div className="p-4">
                    <Link className="flex flex-col gap-2" to={`/listing/${listing._id}`}>
                        <h6 className="truncate font-bold text-xl mt-3 uppercase">{listing.name}</h6>
                        <p className="font-bold">
                            {"රු. " + (Number(listing.price) || 0).toLocaleString('en-US') + ".00"}
                            {listing.type === "rent" ? " /month" : ""}
                        </p>

                        <div className="flex items-center gap-0">
                            <MdLocationOn className="h-5 w-5" />
                            <span className="truncate w-full">{listing.address}</span>
                        </div>
                        <div className='p-3'>
                            <div className="flex justify-between gap-1">
                                <p className="flex text-sm items-center gap-1">
                                    <FaCube />Area:<b className="ml-2">{listing.area}<span className="text-sm">m<sup>2</sup></span></b>
                                </p>
                                <p className="flex text-sm items-center gap-1">
                                    <FaHouseUser /> Type: <b className="ml-2">{listing.property_type}</b>
                                </p>
                            </div>
                            <div className="flex justify-between gap-1">
                                <p className="flex text-sm items-center gap-1">
                                    <FaEye /> Views: <b className="ml-2">{listing.views || 0}</b>
                                </p>
                            </div>
                        </div>

                    </Link>

                    <div className="flex justify-between mt-5 text-xl">
                        <div className='flex items-center gap-1'>
                            {
                                currentUser ?
                                    liked ? (
                                        <FaHeart className="text-red-500 cursor-pointer" onClick={unsaveFavorite} />
                                    ) : (
                                        <FaRegHeart className="cursor-pointer" onClick={saveFavorite} />
                                    )
                                    : (
                                        <Link to="/sign-in">
                                            <FaRegHeart className="cursor-pointer" />
                                        </Link>
                                    )
                            }
                            <p>{likesCount}</p>
                        </div>
                        <FaShareAlt className="cursor-pointer" onClick={toggleShareForm} />
                    </div>
                </div>
            </div>
        </div>
    );
}