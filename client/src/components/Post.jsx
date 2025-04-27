import { useEffect, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

export default function Post({ post }) {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle description

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

    return (
        <div className='p-5 bg-[#EFEFE9] rounded flex flex-col overflow-hidden shadow-lg hover:shadow-xl gap-5'>
            {/* User Info */}
            <div className='flex items-center gap-3'>
                <img className='h-15 w-15 rounded-full' src={userData.avatar} alt="avatar" />
                <h6 className='flex items-center gap-1 text-lg'>
                    {userData.username}
                    <img className='h-5 w-5' src={userData.verified ? "/assets/star.png" : "assets/cross.png"} alt="verified-seller" />
                </h6>
            </div>

            {/* Images Section */}
            <div className='md:flex md:gap-5'>
                <div className='flex-[0.5] flex gap-1 justify-between md:flex md:flex-col'>
                    <div className='flex-[0.5] text-sm'>
                        <span>Before:</span>
                        <img className='h-40 md:h-60 w-full md:w-90 object-cover rounded' src={post.imageUrls[0]} alt={post.title} />
                    </div>
                    <div className='flex-[0.5] text-sm'>
                        <span>After:</span>
                        <img className='h-40 md:h-60 w-full md:w-90 object-cover rounded' src={post.imageUrls[1]} alt={post.title} />
                    </div>
                </div>

                {/* Post Details */}
                <div className='flex-[0.5] md:flex-[1] overflow-hidden flex flex-col gap-2 md:gap-5'>
                    <h6 className='truncate text-3xl mt-3 uppercase'>{post.title}</h6>
                    <p className='font-bold text-2xl'>
                        {"රු." + (Number(post.budget) || 0).toLocaleString('en-US')}
                    </p>
                    <div className='flex items-center text-xl'>
                        <MdLocationOn />
                        <span className='truncate w-full ml-1'>{post.location}.</span>
                    </div>
                    <p className='text-lg flex items-center'>
                        <FaClock />
                        <b className='ml-5'>{post.years}</b>:Years <b className='ml-3'>{post.months}</b>:Months <b className='ml-3'>{post.days}</b>:Days
                    </p>
                    <span className='text-sm mt-2'>Description:</span>
                    {/* Description Section */}
                    <p className={`text-gray-700 text-sm border border-gray-300 p-2 ${!showFullDescription ? 'line-clamp-2 md:line-clamp-5' : ''}`}>
                        {post.description}
                    </p>
                    {post.description.length > 100 && ( // Show "Read More" only if the description is long
                        <button
                            className="text-blue-500 text-right text-sm font-semibold mt-1"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                        >
                            {showFullDescription ? 'Show Less' : 'Read More..'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
