import { useState, useEffect } from 'react';
import { FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaClock, FaDeskpro, FaFile, FaFileInvoice, FaFileWord, FaHeading, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaNode, FaPlusCircle, FaStreetView } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { list } from 'firebase/storage';

export default function ContractorDashboard() {

  const { currentUser } = useSelector(state => state.user); // ✅ Get user from Redux
  const [userPosts, setUserPosts] = useState([]); // ✅ Always an array
  const [showListingError, setShowListingError] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchPosts = async () => {
      try {
        setShowListingError(false);
        const res = await fetch(`/api/user/posts/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingError(true);
          return;
        }
        setUserPosts(data); // ✅ Ensure it's always an array
      } catch (error) {
        setShowListingError(true);
      }
    };

    fetchPosts();
  }, [currentUser]);

  //console.log(userPosts);

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
    <main>
      <div>
        <p>d</p>
        <div className='p-30'>
          <Link className='w-55 mt-10 mb-10 py-3 text-center text-2xl font-bold text-[#523D35] flex items-center gap-1' to={"/create-post"}>
            <FaPlusCircle /> Create Post
          </Link>
          <h6 className='text-5xl'>My Work</h6>
          <div className='grid grid-cols-1 gap-5'>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className='p-10 flex flex-col gap-5 mt-10 bg-[#EFEFE9] rounded-lg'>
                  {/* Post Content */}
                  <div className='flex gap-5 justify-between'>
                    <div className='flex-[0.3]'>
                      <img className='rounded-lg object-cover h-40 w-40' src={post.imageUrls[0]} alt="" />
                      <img className='mt-5 rounded-lg object-cover h-40 w-40' src={post.imageUrls[1]} alt="" />
                    </div>
                    <div className='flex-[1] flex gap-5'>
                      <div>
                        <h6 className='text-4xl uppercase'>{post.title}</h6>
                        <h1 className='text-xl mt-4 flex items-center'>
                          <FaMapMarker />
                          <b className='ml-4'>{post.location}</b></h1>
                        <h1 className='text-xl mt-4'><b>රු.</b><b className='ml-4'>{post.budget}/=</b></h1>
                        <p className='mt-4 mb-5 text-lg flex items-center'>
                          <FaClock />
                          <b className='ml-5'>{post.years}</b>:Years <b className='ml-3'>{post.months}</b>:Months <b className='ml-3'>{post.days}</b>:Days
                        </p>
                        <span className='text-sm'>Description:</span>
                        <p className='p-3 border'>{post.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* EDIT Button */}
                  <div className='flex justify-end gap-4'>
                    <button className='bg-[#523D35] rounded p-2 text-white font-bold w-30'>
                      EDIT
                    </button>
                    <button className='bg-red-500 rounded p-2 text-white font-bold w-30'>
                      DELETE
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-5xl text-gray-400 mx-auto mt-20 col-span-2'>No Posts found :(</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
