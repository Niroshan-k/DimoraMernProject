import React, { useState } from 'react'
import { FaBox, FaCube, FaCubes, FaHeart, FaRegHeart, FaShareAlt, FaSpinner } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function ListingItem({ listing }) {
    const [liked, setLiked] = useState(false);

    const saveFavorite = () => {
        liked ? setLiked(false) : setLiked(true);
    };
    return (
        <div className='mt-5'>
            <div className='bg-[#EFEFE9] rounded flex overflow-hidden flex-col shadow-lg  w-70 hover:shadow-2xl'>
                <Link to={`/listing/${listing._id}`}>
                <img className=' h-50 w-70 object-cover hover:scale-105 duration-300 transition-scale' src={listing.imageUrls[0]} alt={listing.name} />
                </Link>
                <div className='p-4'>
                    <Link className='flex flex-col gap-2' to={`/listing/${listing._id}`}>
                    <h6 className='truncate text-xl mt-3 uppercase'>{listing.name}</h6>
                    {/* <p className='text-sm'>{listing.address}</p> */}
                    <p className='font-bold'>
                        {"රු." + (Number(listing.price) || 0).toLocaleString('en-US')}
                        {listing.type === "rent" ? " /month" : ""}
                    </p>

                    <div className='flex items-center gap-0'>
                        <MdLocationOn className='h-5 w-5' />
                        <span className='truncate w-full'>{listing.address}</span>
                    </div>
                    <p className='flex items-center gap-1'><FaCube />Area:<b className='ml-2'>{listing.area}<span className='text-sm'>m<sup>2</sup></span></b></p>
                    </Link>

                    <div className='flex justify-between mt-5 text-xl'>
                        {liked ?
                            <FaHeart className='text-red-500 cursor-pointer' onClick={saveFavorite} /> :
                            <FaRegHeart className='cursor-pointer' onClick={saveFavorite} />
                        }
                        <FaShareAlt />
                    </div>
                </div>
            </div>
        </div>
    )
}
