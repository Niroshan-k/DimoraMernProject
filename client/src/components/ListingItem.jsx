import React, { useState } from 'react';
import { FaBox, FaCube, FaCubes, FaHeart, FaHouseUser, FaImage, FaRegHeart, FaShareAlt, FaSpinner, FaWarehouse, FaWhatsapp, FaFacebook, FaTwitter, FaCopy, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './listingItem.css';

export default function ListingItem({ listing }) {
    const [liked, setLiked] = useState(false);
    const [showFloatingLike, setShowFloatingLike] = useState(false); // State to manage floating like visibility
    const [showShareForm, setShowShareForm] = useState(false); // State to manage floating share form visibility

    const saveFavorite = () => {
        if (!liked) {
            setLiked(true);
            setShowFloatingLike(true);

            // Hide the floating like after 2 seconds
            setTimeout(() => {
                setShowFloatingLike(false);
            }, 2000);
        } else {
            setLiked(false);
            setShowFloatingLike(false);
        }
    };

    const toggleShareForm = () => {
        setShowShareForm((prev) => !prev); // Toggle the share form visibility
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/listing/${listing._id}`);
        alert('Link copied to clipboard!');
    };

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

            <div className="bg-[#EFEFE9] rounded flex overflow-hidden flex-col shadow-lg w-90 hover:shadow-2xl">
                <div className="absolute z-0 text-white">
                    {listing.urgent ? (
                        <p className="bg-red-500 px-2 rounded-br rounded-tl">urgent</p>
                    ) : listing.sold ? (
                        <p className="bg-purple-600 px-2 rounded-br rounded-tl">sold</p>
                    ) : null}
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
                            {"රු. " + (Number(listing.price) || 0).toLocaleString('en-US') + "/="}
                            {listing.type === "rent" ? " /month" : ""}
                        </p>

                        <div className="flex items-center gap-0">
                            <MdLocationOn className="h-5 w-5" />
                            <span className="truncate w-full">{listing.address}</span>
                        </div>
                        <p className="flex items-center gap-1">
                            <FaCube />Area:<b className="ml-2">{listing.area}<span className="text-sm">m<sup>2</sup></span></b>
                        </p>
                        <p className="flex items-center gap-1">
                            <FaHouseUser /> Type: <b className="ml-2">{listing.property_type}</b>
                        </p>
                    </Link>

                    <div className="flex justify-between mt-5 text-xl">
                        {liked ? (
                            <FaHeart className="text-red-500 cursor-pointer" onClick={saveFavorite} />
                        ) : (
                            <FaRegHeart className="cursor-pointer" onClick={saveFavorite} />
                        )}
                        <FaShareAlt className="cursor-pointer" onClick={toggleShareForm} />
                    </div>
                </div>
            </div>
        </div>
    );
}