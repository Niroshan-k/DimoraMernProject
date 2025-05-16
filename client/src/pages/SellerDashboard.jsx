import { useState, useEffect } from 'react';
import { FaArrowsAlt, FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaDeskpro, FaExpand, FaExpandAlt, FaEye, FaFile, FaFileInvoice, FaFileWord, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaPlusCircle, FaStreetView } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './SellerDashboard.css';


export default function SellerDashboard() {
  const { currentUser } = useSelector(state => state.user); // ✅ Get user from Redux
  const [userListings, setUserListings] = useState([]); // ✅ Always an array
  const [showListingError, setShowListingError] = useState(false);
  const [recommend, setRecommend] = useState([]);
  const [district, setDistrict] = useState(''); // State for the district input
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchListings = async () => {
      try {
        setShowListingError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingError(true);
          return;
        }
        setUserListings(data); // ✅ Ensure it's always an array
      } catch (error) {
        setShowListingError(true);
      }
    };

    fetchListings();
  }, [currentUser]); // ✅ Runs when `currentUser` changes
  //bg-[#523D35]
  const handleDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        console.log(`Error: ${res.status} ${res.statusText}`);
        return;
      }
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchRecommendListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?address=${district}&type=sale`);
        const data = await res.json();
        setRecommend(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (district) {
      fetchRecommendListings();
    }
  }, [district]); // ✅ Runs when `district` changes

  const handleSearch = (e) => {
    e.preventDefault();
    setDistrict(searchValue); // Update the district state with the search box value
  };

  // Calculate total advertisements, average price, lowest price, and highest price
  const totalAds = recommend.length;
  const prices = recommend.map((listing) => listing.price || 0); // Extract prices, default to 0 if undefined
  const totalPrice = prices.reduce((sum, price) => sum + price, 0);
  const averagePrice = prices.length > 0 ? (totalPrice / prices.length).toFixed(2) : 0;
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  // Fake + Real Data
  const chartData = [
    { month: 'Jan', avg: 1250000, low: 900000, high: 1600000 },
    { month: 'Feb', avg: 1150000, low: 870000, high: 1550000 },
    { month: 'Mar', avg: 1300000, low: 950000, high: 1650000 },
    { month: 'Apr', avg: 1400000, low: 980000, high: 1700000 },
    { month: 'May', avg: averagePrice, low: lowestPrice, high: highestPrice }
  ];

  const percentage = Math.min((totalAds / 1000) * 100, 100); // full is 1000

  return (
    <main className='p-10'>
      <div className='mt-10'>
        {
          currentUser && currentUser.verified === "true" ? (
            <div>
              {
                currentUser.verifiedFormData[0] ?
                  <h5 className='text-2xl text-center'>Welcome Back, {currentUser.verifiedFormData[0].fullName.split(' ')[0]}..</h5>
                  : null
              }
              <Link className='w-55 mb-10 py-3 text-center text-2xl font-bold text-[#523D35] flex items-center gap-1' to={"/create-listing"}>
                <FaPlusCircle /> Create Listing
              </Link>
            </div>
          ) : (
            <div className='flex gap-5'>
              <p className='text-red-500 font-bold flex items-center gap-2 mb-10'>You can't create advertisements without being verified.<FaTimesCircle /></p>
              <Link to="/beVerified">
                <button className='bg-blue-400 text-white px-2 py-1 rounded cursor-pointer hover:shadow-lg'>Be Verified</button>
              </Link>
            </div>
          )
        }
      </div>

      <div className='grid grid-cols-2'>
        <div>
          <form onSubmit={handleSearch}>
            <label className="font-semibold">Search:</label>
            <div className="flex gap-4 mb-8 mt-3 px-20 justify-between">
              <input
                type="text"
                placeholder="Search by district"
                className="bg-[#E8D9CD] p-3 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)} // Update the search box value
              />
              <button
                type="submit"
                className="bg-[#523D35] text-white px-2 py-1 rounded cursor-pointer hover:shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
          <div className='flex p-10 items-center gap-10 justify-center'>
            <div className="relative w-64 h-64">
              <svg className="transform rotate-[-90deg]" width="100%" height="100%">
                <circle cx="128" cy="128" r="108" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                <circle cx="128" cy="128" r="108" stroke="#10B981" strokeWidth="10" fill="none"
                  strokeDasharray={`${678.584 * percentage / 100} 678.584`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <p className="text-xl font-bold">{totalAds}</p>
                <p className="text-sm">Total Ads</p>
              </div>
            </div>
            <div className="bg-[#EFEFE9] p-5 rounded shadow-lg">
              <h5 className="text-2xl font-bold mb-5">Statistics</h5>
              <p>Average Price: <b>රු. {Number(averagePrice).toLocaleString('en-US')}</b></p>
              <p>Lowest Price: <b>රු. {Number(lowestPrice).toLocaleString('en-US')}</b></p>
              <p>Highest Price: <b>රු. {Number(highestPrice).toLocaleString('en-US')}</b></p>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white shadow rounded min-w-full h-100 py-10 pl-10 ">
            <h5 className="text-lg font-bold mb-3">Monthly Price Stats</h5>
            <ResponsiveContainer width="90%" height="100%" className="p-2">
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avg" fill="#6366F1" name="Average Price" />
                <Bar dataKey="low" fill="#10B981" name="Lowest Price" />
                <Bar dataKey="high" fill="#EF4444" name="Highest Price" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {showListingError && <p className='text-red-500 text-sm'>Error showing listing</p>}

      <h6 className='md:text-left text-center font-serif text-5xl mb-10'>My Listing</h6>

      <div className='flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-10 p-10'>

        {userListings.length > 0 ? (
          userListings.map((listing) => (
            <div className='bg-[#EFEFE9] rounded p-10 flex flex-col gap-10 justify-between shadow-lg' >
              <div className='flex flex-col justify-between'>
                {listing.imageUrls.length > 1 ? ( // ✅ Use slider only for multiple images
                  <Slider
                    dots={true}
                    infinite={true}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    autoplay={true}
                    autoplaySpeed={3000}
                    className='rounded'
                  >
                    {listing.imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Listing ${index}`} className="rounded w-full h-60 md:h-100 object-cover" />
                      </div>
                    ))}
                  </Slider>
                ) : ( // ✅ If only one image, show it normally
                  <div className="relative">
                    <img src={listing.imageUrls[0]} alt="Listing" className="rounded w-200 h-100 object-cover" />
                  </div>
                )}

              </div>

              <div className='mt-10'>
                <div>
                  <h6 className='text-2xl font-bold mb-5'>{listing.name}</h6>
                  <p className="flex items-center gap-2">
                    <FaEye /> Views: <b className="ml-2">{listing.views || 0}</b>
                  </p>
                  <p className='flex items-center gap-2'><FaMapMarker />Location:</p>
                  <p className='flex items-center gap-2 mb-2'><b>{listing.address}.</b></p>
                  <p>Property Type: <b>{listing.property_type}</b></p>
                  <p className='flex items-center gap-2'><FaMoneyBill />{listing.type}:<b>රු.{listing.price}</b><span className='text-sm'>{listing.type === "rent" ? "(රු.month)" : ""}</span></p>
                  <p className='flex items-center gap-2'><FaChartArea />Area:<b>{listing.area}m<sup>2</sup></b></p>
                  <p className='flex items-center gap-2'><FaBed />Bedrooms: <b>{listing.bedrooms}</b></p>
                  <p className='flex items-center gap-2'><FaBath />Bathrooms:<b>{listing.bathrooms}</b></p>
                  <p className='flex items-center gap-2'><FaCar />Parking:<b>{listing.parking ? 'Available' : 'No parking'}</b></p>
                  <p className='flex items-center gap-2'><FaFileInvoice /> Description:</p>
                  <textarea
                    className="rounded bg-white p-3 mt-3 w-full h-32 overflow-y-auto overflow-x-hidden resize-none"
                    value={listing.description}
                    disabled
                  />
                </div>
                <div className='flex justify-between mt-10'>
                  <div>
                    <Link to={`/listing/${listing._id}`}>
                      <button className='text-white bg-blue-500 w-max rounded font-bold px-3 py-2 flex gap-1 items-center self-end'>view Listing<FaExpandAlt /></button>
                    </Link>
                  </div>
                  <div className='flex gap-2'>
                    <Link to={`/update-listing/${listing._id}`} className='bg-[#523D35] rounded hover:shadow-lg text-white font-bold'>
                      <button className='bg-[#523D35] hover:shadow-lg rounded text-white font-bold px-3 py-2'>EDIT</button>
                    </Link>
                    <button type="button" onClick={() => handleDelete(listing._id)} className='bg-red-500 hover:shadow-lg rounded text-white font-bold px-3 py-2'>DELETE</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-5xl text-gray-400 mx-auto mt-20'>No listings found :(</p>
        )}
      </div>

    </main>
  );
}
