import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css/bundle';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaArrowLeft, FaArrowRight, FaBath, FaBed, FaCar, FaChartArea, FaHome, FaMapMarker, FaSwimmingPool, FaEye } from 'react-icons/fa';

export default function Listing() {
    SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const [views, setViews] = useState(0); // State to store views count
    const params = useParams();
    const mapRef = useRef(null);
    const [userData, setUserData] = useState();
    const { currentUser } = useSelector(state => state.user);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        number: '',
        message: '',
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleWhatsAppMessage = (e) => {
        e.preventDefault();

        const { name, email, number, message } = formData;

        // Replace with your WhatsApp number (include country code, e.g., +94771234567)
        const phoneNumber = '+94788672025';

        // Construct the WhatsApp message
        const whatsappMessage = `Hello, I am interested in this property. :
- Name: ${name}
- Email: ${email}
- Number: ${number}
- Message: ${message}`;

        // Encode the message for the URL
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Open WhatsApp with the pre-filled message
        window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`, '_blank');
    };

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setViews(data.views || 0); // Set the initial views count
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    useEffect(() => {
        const fetchSeller = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/user/get/${listing.userRef}`);
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
    }, [listing]);

    useEffect(() => {
        if (listing?.address) {
            const fetchCoordinates = async () => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(listing.address)}&format=json&limit=1`,
                        {
                            headers: {
                                'User-Agent': 'DimoraApp/1.0 (https://example.com; your-email@example.com)'
                            }
                        }
                    );
                    const data = await response.json();
                    if (data.length > 0) {
                        setCoordinates({ lat: data[0].lat, lng: data[0].lon });
                    }
                } catch (error) {
                    console.error("Failed to fetch coordinates:", error);
                }
            };
            fetchCoordinates();
        }
    }, [listing]);

    useEffect(() => {
        if (coordinates && mapRef.current === null) {
            mapRef.current = L.map('map').setView([coordinates.lat, coordinates.lng], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(mapRef.current);

            L.marker([coordinates.lat, coordinates.lng]).addTo(mapRef.current)
                .bindPopup(listing?.address || "Location")
                .openPopup();
        }
    }, [coordinates, listing]);

    useEffect(() => {
        const incrementViews = async () => {
            try {
                if (currentUser) {
                    const res = await fetch(`/api/listing/incrementViews/${params.listingId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!res.ok) {
                        throw new Error('Failed to increment views count.');
                    }
                    const data = await res.json();
                    setViews(data.updatedViews); // Update the views count in the state
                }
            } catch (error) {
                console.error('Error incrementing views count:', error);
            }
        };
        incrementViews();
    }, [currentUser, params.listingId]);

    return (
        <main>
            {loading && <p>Loading</p>}
            {error && <p>There was an error fetching the listing</p>}
            {userData && listing && !loading && !error && (
                <>
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                    >
                        {listing.imageUrls.map((Url, index) => (
                            <SwiperSlide key={index}>
                                <img src={Url} alt={listing.name} className="w-screen h-200 object-cover" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='grid grid-cols-6 gap-1 max-w-6xl mx-auto'>
                        <div className='m-5'>
                            <img src={listing.imageUrls[0]} alt="Listing" className="rounded w-30 h-30 object-cover" />
                        </div>
                        <div className='m-5'>
                            <img src={listing.imageUrls[1] || "/assets/image.png"} alt="Listing" className="rounded w-30 h-30 object-cover" />
                        </div>
                        <div className='m-5'>
                            <img src={listing.imageUrls[2] || "/assets/image.png"} alt="Listing" className="rounded w-30 h-30 object-cover" />
                        </div>
                        <div className='m-5'>
                            <img src={listing.imageUrls[3] || "/assets/image.png"} alt="Listing" className="rounded w-30 h-30 object-cover" />
                        </div>
                        <div className='m-5'>
                            <img src={listing.imageUrls[4] || "/assets/image.png"} alt="Listing" className="rounded w-30 h-30 object-cover" />
                        </div>
                        <div className='m-5'>
                            <img src={listing.imageUrls[5] || "/assets/image.png"} alt="Listing" className="rounded w-30 h-30 object-cover" />
                        </div>
                    </div>
                    <div className='p-30'>
                        <h6 className='text-4xl'>{listing.name}</h6>
                        <h1 className='flex gap-1 mt-5 mb-5 items-center'><FaEye /> {views} Views</h1>
                        <h1 className='flex gap-1 mt-5 mb-5 items-center'><FaMapMarker />{listing.address}.</h1>
                        <h6 className='text-4xl'>
                            {"රු. " + (Number(listing.price) || 0).toLocaleString('en-US')}
                            {listing.type === "rent" ? " /month" : ""}
                        </h6>
                        <div className='rounded bg-[#EFEFE9] shadow-lg p-20 mt-5'>
                            <h6>Overview</h6>
                            <hr className='mt-5' />
                            <div className='mt-5 flex gap-10 justify-between sm:grid sm:grid-cols-3'>
                                <div className='text-center mx-auto'>
                                    <b>{listing.area} m<sup>2</sup></b>
                                    <p className='flex gap-1'><FaChartArea />Area</p>
                                </div>
                                <div className='text-center mx-auto'>
                                    <b>{listing.bedrooms}</b>
                                    <p className='flex gap-1 items-center'><FaBed />Bedrooms</p>
                                </div>
                                <div className='text-center mx-auto'>
                                    <b>{listing.bathrooms}</b>
                                    <p className='flex gap-1 items-center'><FaBath />Bathrooms</p>
                                </div>
                                <div className='text-center mx-auto'>
                                    <b>{listing.parking ? `✅` : `❎`}</b>
                                    <p className='flex gap-1 items-center'><FaCar />Car Park</p>
                                </div>
                                <div className='text-center mx-auto'>
                                    <b>{listing.pool ? "✅" : "❎"}</b>
                                    <p className='flex gap-1 items-center'><FaSwimmingPool />Pool</p>
                                </div>
                                <div className='text-center mx-auto'>
                                    <b>{listing.furnished ? "✅" : "❎"}</b>
                                    <p className='flex gap-1 items-center'><FaHome />Furnished</p>
                                </div>
                            </div>
                        </div>
                        <div className='rounded bg-[#EFEFE9] shadow-lg p-20 mt-5'>
                            <h6>Description</h6>
                            <hr className='mt-5' />
                            <p className='mt-5'>{listing.description}</p>
                        </div>
                        <div className='rounded bg-[#EFEFE9] shadow-lg p-20 mt-5'>
                            <h6>Location</h6>
                            <hr className='mt-5' />
                            <div id='map' className='mt-5 border' style={{ height: '300px', width: '100%' }}></div>
                        </div>
                        <div className='flex gap-3 mt-5'>
                            <div className='flex-[0.7] rounded shadow-lg bg-[#EFEFE9] p-20'>
                                <h6>Listed By</h6>

                                <hr className='mt-5' />
                                <div className='mt-5 mb-5'>
                                    <img className='w-50 h-50 object-cover rounded-full' src={userData.avatar} alt="user-Image" />
                                </div>
                                <span className='text-sm'>Username:</span>
                                <div className='flex gap-2 items-center'>
                                    <h5 className='text-2xl'>{userData.username}</h5>
                                    <img className='h-5 w-5' src={userData.verified ? "/assets/star.png" : "/assets/cross.png"} alt="verified-seller" />
                                </div>
                            </div>
                            <div className='flex-[0.3] flex flex-col w-50 float-end'>
                                <form className='flex flex-col' onSubmit={handleWhatsAppMessage}>
                                    <h6 className='text-2xl text-right mb-5'>More About This Property</h6>
                                    <span>Full Name:</span>
                                    <input
                                        type="text"
                                        id='name'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className='mb-5 p-3 rounded bg-[#E8D9CD]'
                                        required
                                    />
                                    <span>Email:</span>
                                    <input
                                        type="email"
                                        id='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='mb-5 p-3 rounded bg-[#E8D9CD]'
                                        required
                                    />
                                    <span>Number:</span>
                                    <input
                                        type="text"
                                        id='number'
                                        value={formData.number}
                                        onChange={handleInputChange}
                                        className='mb-5 p-3 rounded bg-[#E8D9CD]'
                                        required
                                    />
                                    <span>Message:</span>
                                    <textarea
                                        id='message'
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className='mb-5 p-3 rounded bg-[#E8D9CD]'
                                        required
                                    />
                                    {
                                        currentUser ? (
                                            <button
                                                type="submit"
                                                className='bg-[#523D35] rounded p-3 text-white uppercase font-bold w-full'
                                            >
                                                MESSAGE
                                            </button>
                                        ) : (
                                            <a href="/sign-in">
                                                <button
                                                    type="button"
                                                    className='bg-[#523D35] rounded p-3 text-white uppercase font-bold w-full'
                                                >
                                                    SIGN IN TO MESSAGE
                                                </button>
                                            </a>
                                        )
                                    }
                                </form>
                            </div>
                        </div>

                    </div>
                </>
            )}
        </main>
    )
}
