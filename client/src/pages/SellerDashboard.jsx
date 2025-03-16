import { useState, useEffect } from 'react';
import { FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaDeskpro, FaFile, FaFileInvoice, FaFileWord, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
  return (
    <main className='p-10'>
      <div>
        <Link className='w-55 mb-10 p-3 text-center text-2xl font-bold text-[#523D35] flex items-center gap-1' to={"/create-listing"}>
          <FaPlusCircle /> Create Listing
        </Link>
      </div>

      {showListingError && <p className='text-red-500 text-sm'>Error showing listing</p>}

      <h6 className='font-serif text-5xl mb-10'>My Listing</h6>

      <div className='sm:grid grid-cols-2 gap-5 flex flex-col'>
        {userListings.length > 0 ? (
          userListings.map((listing) => (
            <div className='bg-[#EFEFE9] p-10 flex gap-3 justify-between shadow-lg' >
              <div key={listing._id}>
                <Link to={`/listing/${listing._id}`}>
                  <img className='object-cover h-full w-100' src={listing.imageUrls[0]} alt={listing.title} />
                </Link>
              </div>
              <div>
                <div>
                  <h6 className='text-2xl font-bold mb-5'>{listing.name}</h6>
                  <p className='flex items-center gap-2'><FaMapMarker /><b>{listing.address}</b></p>
                  <p className='flex items-center gap-2'><FaMoneyBill /><b>රු.{listing.price}</b></p>
                  <p className='flex items-center gap-2'><FaChartArea />Area:<b>{listing.area}m<sup>2</sup></b></p>
                  <p className='flex items-center gap-2'><FaBed />Bedrooms: <b>{listing.bedrooms}</b></p>
                  <p className='flex items-center gap-2'><FaBath />Bathrooms:<b>{listing.bathrooms}</b></p>
                  <p className='flex items-center gap-2'><FaCar />Parking:<b>{listing.parking ? 'Available' : 'No parking'}</b></p>
                  <p className='flex items-center gap-2'><FaFileInvoice /> Description:</p>
                  <textarea
                    className="bg-white p-3 mt-3 w-full h-32 overflow-y-auto overflow-x-hidden resize-none"
                    value={listing.description}
                    disabled
                  />
                </div>
                <div className='flex justify-between mt-10'>
                  <button className='bg-[#523D35] hover:shadow-lg text-white font-bold px-3 py-2'>EDIT</button>
                  <button className='bg-red-500 hover:shadow-lg text-white font-bold px-3 py-2'>DELETE</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-5xl text-gray-400 text-center mt-20'>No listings found :(</p>
        )}
      </div>
    </main>
  );
}
