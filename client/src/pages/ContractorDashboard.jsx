import { useState, useEffect } from 'react';
import { FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaClock, FaDeskpro, FaFile, FaFileInvoice, FaFileWord, FaHeading, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaNode, FaPlusCircle, FaStreetView, FaTimes, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { MdLocationOn } from 'react-icons/md';
import "slick-carousel/slick/slick-theme.css";
import { list } from 'firebase/storage';

export default function ContractorDashboard() {

  const { currentUser } = useSelector(state => state.user); // ✅ Get user from Redux
  const [userPosts, setUserPosts] = useState([]); // ✅ Always an array
  const [showPostError, setShowPostError] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchPosts = async () => {
      try {
        setShowPostError(false);
        const res = await fetch(`/api/user/posts/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowPostError(true);
          return;
        }
        setUserPosts(data); // ✅ Ensure it's always an array
      } catch (error) {
        setShowPostError(true);
      }
    };

    fetchPosts();
  }, [currentUser]);

  //console.log(userPosts);

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`/api/posting/delete/${postId}`, {
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
      setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(error.message);
    }
  };

  console.log(currentUser);


  return (
    <main>
      <div>
        <p>d</p>
        <div className='p-30'>
          {
            currentUser && currentUser.verified === "true" ? (
              <div>
                <h5 className='text-2xl text-center'>Welcome Back, {currentUser.verifiedFormData[0].fullName.split(' ')[0]}..</h5>
                <Link className='w-55 mt-10 mb-10 py-3 text-center text-2xl font-bold text-[#523D35] flex items-center gap-1' to={"/create-post"}>
                  <FaPlusCircle /> Create Post
                </Link>
              </div>
            ) : (
              <div className='flex gap-5'>
                <p className='text-red-500 font-bold flex items-center gap-2 mb-10'>You can't create posts without being verified.<FaTimesCircle /></p>
                <Link to="/beVerified">
                  <button className='bg-blue-400 text-white px-2 py-1 rounded cursor-pointer hover:shadow-lg'>Be Verified</button>
                </Link>
              </div>
            )
          }

          <h6 className='text-5xl'>My Work</h6>
          <div className='grid grid-cols-1 gap-5'>
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <div key={post.id} className='p-10 flex flex-col gap-5 mt-10 bg-[#EFEFE9] rounded-lg'>
                  {/* Post Content */}
                  <div className='flex gap-5 justify-between'>
                    <div className='flex-[0.3]'>
                      <span className='text-sm'>Before:</span>
                      <img className='rounded-lg mb-5 object-cover h-40 w-40' src={post.imageUrls[0]} alt="" />
                      <span className='text-sm'>After:</span>
                      <img className='rounded-lg object-cover h-40 w-40' src={post.imageUrls[1]} alt="" />
                    </div>
                    <div className='flex-[1] flex gap-5'>
                      <div>
                        <h6 className='text-4xl uppercase'>{post.title}</h6>
                        <h1 className='text-xl mt-4 flex items-center'>
                          <MdLocationOn />
                          <b className='ml-4'>{post.location}</b></h1>
                        <h1 className='text-xl mt-4'><b>රු.</b><b className='ml-4'>{(Number(post.budget) || 0).toLocaleString('en-US')}/=</b></h1>
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
                    <Link to={`/update-post/${post._id}`} className='bg-[#523D35] rounded hover:shadow-lg text-white font-bold'>
                      <button className='bg-[#523D35] rounded p-2 text-white font-bold w-30'>
                        EDIT
                      </button>
                    </Link>
                    <button onClick={() => handleDelete(post._id)} className='bg-red-500 rounded p-2 text-white font-bold w-30'>
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
