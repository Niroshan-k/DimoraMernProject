import { set } from 'mongoose';
import { useEffect, useState } from 'react';
import { FaClock, FaStar, FaHeart, FaShareAlt, FaSmile, FaMeh, FaFrown, FaRegHeart, FaWhatsapp, FaLinkedin, FaInstagram, FaCopy, FaFacebook, FaTwitter, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Post({ post }) {
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitRating, setSubmitRating] = useState(false);
    const [error, setError] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false); // State to toggle description
    const [clipboard, setClipboard] = useState(false); // State to manage clipboard copy
    const [formData, setFormData] = useState({
        Star1: 0,
        Star2: 0,
        Star3: 0,
        Star4: 0,
        Star5: 0
    });

    const [liked, setLiked] = useState(false);

    const saveFavorite = () => {
        if (!liked) {
            setLiked(true);
        } else {
            setLiked(false);
        }
    };

    const [highlightedStars, setHighlightedStars] = useState(0); // For UI color

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/ContractorProfile/${userData._id}`);
        setClipboard(true);
    };

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

    const [starRatings, setStarRatings] = useState([
        { count: post.Star5 || 0, stars: 5 },
        { count: post.Star4 || 0, stars: 4 },
        { count: post.Star3 || 0, stars: 3 },
        { count: post.Star2 || 0, stars: 2 },
        { count: post.Star1 || 0, stars: 1 },
    ]);

    // Polling function to fetch updated star ratings
    useEffect(() => {
        const fetchStarRatings = async () => {
            try {
                const res = await fetch(`/api/post/${post._id}/stars`);
                if (!res.ok) {
                    throw new Error('Failed to fetch star ratings');
                }
                const data = await res.json();
                setStarRatings([
                    { count: data.stars.Star5, stars: 5 },
                    { count: data.stars.Star4, stars: 4 },
                    { count: data.stars.Star3, stars: 3 },
                    { count: data.stars.Star2, stars: 2 },
                    { count: data.stars.Star1, stars: 1 },
                ]);
            } catch (error) {
                console.error('Error fetching star ratings:', error);
            }
        };

        // Poll every 10 seconds
        const interval = setInterval(fetchStarRatings, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [post]);

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

            const data = await res.json();

            // Update the starRatings state to reflect the new values
            setStarRatings([
                { count: data.post.Star5, stars: 5 },
                { count: data.post.Star4, stars: 4 },
                { count: data.post.Star3, stars: 3 },
                { count: data.post.Star2, stars: 2 },
                { count: data.post.Star1, stars: 1 },
            ]);

            // Update the highlighted stars for UI
            setHighlightedStars(star);
            setSubmitRating(true);
        } catch (error) {
            console.error("Error updating star rating:", error);
        }

    };

    const closeClipboard = () => {
        setClipboard(false);
    }

    //console.log(formData)

    return (
        <div className='p-5 bg-[#EFEFE9] rounded shadow-lg hover:shadow-xl space-y-5 overflow-hidden'>

            {/* User Info */}
            <Link to={`/ContractorProfile/${userData._id}`}>
                <div className='flex items-center gap-3'>
                    <img className='h-14 w-14 rounded-full' src={userData.avatar} alt="avatar" />
                    <div>
                        <h5 className='flex items-center gap-1 text-lg font-medium'>
                            {userData.username}
                            <img className='h-5 w-5' src={userData.verified ? "/assets/star.png" : "assets/cross.png"} alt="verified" />
                        </h5>
                        <p className='text-sm'>{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(post.createdAt))}</p>
                    </div>
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
                    <div className='flex justify-between p-5'>
                        <div className='flex-[0.5] flex flex-col gap-1 mt-2'>
                            {starRatings.map((item, idx) => (
                                <p key={idx} className='flex items-center gap-1'>
                                    {item.count}
                                    {renderStars(item.stars)}
                                </p>
                            ))}
                        </div>
                        {
                            !submitRating ? (
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
                            ) : (
                                <div className='flex-[0.5] flex items-center gap-2 justify-center'>
                                    Thank you for your feedback<br />
                                    <span className='text-blue-500'>{faces[currentFace]}</span>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
            {/* Bottom Buttons */}
            <div className='flex justify-between gap-3 pt-3 border-t border-gray-300'>
                <button className='transition'>
                    {liked ? (
                        <FaHeart className="text-red-500 cursor-pointer text-2xl" onClick={saveFavorite} />
                    ) : (
                        <FaRegHeart className="cursor-pointer text-2xl" onClick={saveFavorite} />
                    )}
                </button>
                <div className="flex gap-3 items-center">
                    <FaWhatsapp
                        className="text-green-500 text-2xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://api.whatsapp.com/send?text=Check out this Contractor: ${window.location.origin}/ContractorProfile/${userData._id}`,
                                '_blank'
                            )
                        }
                    />
                    <FaLinkedin
                        className="text-blue-700 text-2xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.origin}/ContractorProfile/${userData._id}&title=Check out this Contractor!`,
                                '_blank'
                            )
                        }
                    />
                    <FaInstagram
                        className="text-pink-500 text-2xl cursor-pointer"
                        onClick={() => {
                            copyLink();
                        }}
                    />
                    <FaFacebook
                        className="text-blue-600 text-2xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/ContractorProfile/${userData._id}`,
                                '_blank'
                            )
                        }
                    />
                    <FaTwitter
                        className="text-blue-400 text-2xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://twitter.com/intent/tweet?url=${window.location.origin}/ContractorProfile/${userData._id}&text=Check out this Contractor!`,
                                '_blank'
                            )
                        }
                    />
                    <FaCopy className="text-gray-600 text-2xl cursor-pointer" onClick={copyLink} />
                </div>
            </div>
            {
                clipboard ? <div className='bg-white shadow-lg rounded-2xl p-2 fixed bottom-5 left-1/2 -translate-x-1/2 max-w-lg w-full text-center'>
                    <div className='text-right justify-self-end'>
                        <FaTimes className='cursor-pointer' onClick={closeClipboard} />
                    </div>
                    <p className='flex items-center justify-center gap-2'>
                        <FaCheckCircle className='text-green-500' /> Link copied to clipboard!
                    </p>
                </div> : ""
            }
        </div>
    );
}
