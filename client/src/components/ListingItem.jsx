import React, { useState } from 'react'
import { FaBox, FaCube, FaCubes, FaHeart, FaRegHeart, FaShareAlt, FaSpinner } from 'react-icons/fa'

export default function ListingItem({ listing }) {
    const [liked, setLiked] = useState(false);

    const saveFavorite = () => {
        liked ? setLiked(false) : setLiked(true);
    };
    return (
        <div className='mt-5'>
            <div className='bg-[#EFEFE9] shadow-lg w-70'>
                <img className='h-50 w-70 object-cover' src={listing.imageUrls[0]} alt={listing.name} />
                <div className='p-4'>
                    <h6 className='text-xl mt-3 uppercase'>{listing.name}</h6>
                    {/* <p className='text-sm'>{listing.address}</p> */}
                    <p>රු.{listing.price}{listing.type === "rent" ? "(month)" : ""}</p>
                    <p className='flex items-center gap-1'><FaCube />Area:<b className='ml-2'>{listing.area}<span className='text-sm'>m<sup>2</sup></span></b></p>
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
