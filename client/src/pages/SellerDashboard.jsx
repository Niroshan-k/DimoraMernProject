import { useState, useEffect } from 'react';
import { FaArrowsAlt, FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaDeskpro, FaExpand, FaExpandAlt, FaFile, FaFileInvoice, FaFileWord, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaPlusCircle, FaStreetView } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function SellerDashboard() {
  const { currentUser } = useSelector(state => state.user); // ✅ Get user from Redux
  const [userListings, setUserListings] = useState([]); // ✅ Always an array
  const [showListingError, setShowListingError] = useState(false);

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
  return (
    <main className='p-10'>
      <div className='mt-10'>
        <Link className='w-55 mb-10 py-3 text-center text-2xl font-bold text-[#523D35] flex items-center gap-1' to={"/create-listing"}>
          <FaPlusCircle /> Create Listing
        </Link>
      </div>

      {showListingError && <p className='text-red-500 text-sm'>Error showing listing</p>}

      <h6 className='md:text-left text-center font-serif text-5xl mb-10'>My Listing</h6>

      <div className='flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-10'>

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
                  <p className='flex items-center gap-2'><FaMapMarker />Location:</p>
                  <p className='flex items-center gap-2 mb-2'><b>{listing.address}.</b></p>
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
                    <button onClick={() => handleDelete(listing._id)} className='bg-red-500 hover:shadow-lg rounded text-white font-bold px-3 py-2'>DELETE</button>
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
