import { useEffect, useState } from 'react';
import { FaClock, FaStar, FaHeart, FaShareAlt, FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle description
    const [formData, setFormData] = useState({
        Star1: 0,
        Star2: 0,
        Star3: 0,
        Star4: 0,
        Star5: 0
    });

    const [highlightedStars, setHighlightedStars] = useState(0); // For UI color

    const handleMouseEnter = (star) => {
        setHighlightedStars(star); // Highlight all stars up to the hovered star
    };

    const handleMouseLeave = () => {
        setHighlightedStars(Object.keys(formData).findIndex((key) => formData[key] === 1) + 1); // Highlight stars up to the selected star
    };

    const [currentFace, setCurrentFace] = useState(0); // To track the current face in the animation

    const faces = [<FaSmile key="smile" />, <FaMeh key="meh" />, <FaFrown key="frown" />];

    useEffect(() => {
        // Set up an interval to change the face every second
        const interval = setInterval(() => {
            setCurrentFace((prev) => (prev + 1) % faces.length); // Cycle through the faces
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

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
        { count: post.Star2 || 0, stars: 2 },
        { count: post.Star1 || 0, stars: 1 },
    ];

    const handleStarClick = async (star) => {
        try {
            // Fetch the current value of the clicked star from post data
            const currentStarValue = post[`Star${star}`] || 0;

            // Increment the clicked star value by 1
            const updatedStarValue = currentStarValue + 1;

            // Update the backend with the new value
            const res = await fetch(`/api/posting/updateStar/${post._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [`Star${star}`]: updatedStarValue,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update star rating.");
            }

            // Update the local `formData` to reflect the new state
            setFormData((prev) => ({
                ...prev,
                [`Star${star}`]: updatedStarValue,
            }));

            // Update the highlighted stars for UI
            setHighlightedStars(star);
        } catch (error) {
            console.error("Error updating star rating:", error);
        }
        
    };

    //console.log(formData)

    return (
        <div className='p-5 bg-[#EFEFE9] rounded shadow-lg hover:shadow-xl space-y-5 overflow-hidden'>
            {/* User Info */}
            <Link to={`/ContractorProfile/${userData._id}`}>
                <div className='flex items-center gap-3'>
                    <img className='h-14 w-14 rounded-full' src={userData.avatar} alt="avatar" />
                    <h5 className='flex items-center gap-1 text-lg font-medium'>
                        {userData.username}
                        <img className='h-5 w-5' src={userData.verified ? "/assets/star.png" : "assets/cross.png"} alt="verified" />
                    </h5>
                </div>
            </Link>
            <hr className='text-gray-300 mt-3' />
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
                        <div className="flex-[0.5] p-5 flex flex-col justify-center rounded-lg shadow">
                            <div className='flex justify-center gap-2 items-center'>
                                <span className=''>Rate your Service</span>
                                <span className='text-blue-500'>{faces[currentFace]}</span>
                            </div>
                            <div className="flex justify-center gap-5 mt-5 text-3xl">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        onClick={() => handleStarClick(star)} // Handle star click
                                        onMouseEnter={() => handleMouseEnter(star)} // Highlight stars on hover
                                        onMouseLeave={handleMouseLeave} // Reset highlight on mouse leave
                                        color={highlightedStars >= star ? "yellow" : "gray"} // Highlight logic
                                        style={{ cursor: "pointer" }} // Pointer cursor for better UX
                                    />
                                ))}
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
