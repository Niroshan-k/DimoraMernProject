import { useEffect, useState } from 'react';
import { FaClock, FaStar, FaHeart, FaShareAlt } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

export default function Post({ post }) {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle description
    const [formData, setFormData] = useState({
        Star1 : post.Star1,
        Star2 : post.Star2,
        Star3 : post.Star3,
        Star4 : post.Star4,
        Star5 : post.Star5
    });

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/get/${post.userRef}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setUserData(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchSeller();
    }, [post]);

    const renderStars = (count) => (
        [...Array(count)].map((_, i) => <FaStar key={i} className='text-yellow-300' />)
    );

    const starRatings = [
        { count: post.Star5 || 0, stars: 5 },
        { count: post.Star4 || 0, stars: 4 },
        { count: post.Star3 || 0, stars: 3 },
        { count: post.Star3 || 0, stars: 3 },
        { count: post.Star2 || 0, stars: 2 },
        { count: post.Star1 || 0, stars: 1 },
    ];

    return (
        <div className='p-5 bg-[#EFEFE9] rounded shadow-lg hover:shadow-xl space-y-5 overflow-hidden'>
            {/* User Info */}
            <div className='flex items-center gap-3'>
                <img className='h-14 w-14 rounded-full' src={userData.avatar} alt="avatar" />
                <h6 className='flex items-center gap-1 text-lg font-medium'>
                    {userData.username}
                    <img className='h-5 w-5' src={userData.verified ? "/assets/star.png" : "assets/cross.png"} alt="verified" />
                </h6>
            </div>
            <hr className='text-gray-300' />
            {/* Grid Layout */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {/* Images */}
                <div className='flex flex-col gap-3'>
                    <div>
                        <span className='text-sm'>Before:</span>
                        <img src={post.imageUrls[0]} className='h-40 md:h-60 w-full object-cover rounded' alt="before" />
                    </div>
                    <div>
                        <span className='text-sm'>After:</span>
                        <img src={post.imageUrls[1]} className='h-40 md:h-60 w-full object-cover rounded' alt="after" />
                    </div>
                </div>

                {/* Post Info */}
                <div className='col-span-2 flex flex-col gap-2'>
                    <div>
                        <h6 className='text-2xl uppercase truncate'>{post.title}</h6>
                        <h6 className='text-2xl text-green-700'>
                            {"රු." + (Number(post.budget) || 0).toLocaleString('en-US')}
                        </h6>
                        <div className='flex items-center gap-1 text-sm mt-5'>
                            <span>Project Location</span>
                            <MdLocationOn />
                            <span className='truncate'>{post.location}.</span>
                        </div>
                    </div>

                    {/* Duration */}
                    <div className='flex items-center gap-2'>
                        <span className='flex items-center gap-1'>Project Duration <FaClock />:</span>
                        <span className='flex gap-2'>
                            <b>{post.years}</b> Years
                            <b>{post.months}</b> Months
                            <b>{post.days}</b> Days
                        </span>
                    </div>

                    {/* Description */}
                    <div className='mt-5'>
                        <span className='text-sm'>Description:</span>
                        <p className={`text-gray-700 text-sm border border-gray-300 p-2 rounded ${!showFullDescription ? 'line-clamp-2 md:line-clamp-4' : ''}`}>
                            {post.description}
                        </p>
                        {post.description.length > 100 && (
                            <button
                                className='text-blue-500 text-sm font-semibold mt-1'
                                onClick={() => setShowFullDescription(!showFullDescription)}
                            >
                                {showFullDescription ? 'Show Less' : 'Read More...'}
                            </button>
                        )}
                    </div>

                    {/* Ratings */}
                    <div className='flex justify-between'>
                        <div className='flex-[0.5] flex flex-col gap-1 mt-2'>
                            {starRatings.map((item, idx) => (
                                <p key={idx} className='flex items-center gap-1'>
                                    {item.count}
                                    {renderStars(item.stars)}
                                </p>
                            ))}
                        </div>
                        <div className='flex-[0.5] bg-white p-5 items-center rounded-lg shadow'>
                            <div className='flex justify-center gap-5 text-3xl'>
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Buttons */}
            <div className='flex justify-between gap-3 pt-3 border-t border-gray-300'>
                <button className='text-red-500 hover:text-red-600 transition'>
                    <FaHeart size={20} />
                </button>
                <button className='text-blue-500 hover:text-blue-600 transition'>
                    <FaShareAlt size={20} />
                </button>
            </div>
        </div>
    );
}
