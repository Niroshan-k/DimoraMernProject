import { useState, useEffect } from 'react';
import { FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaClock, FaDeskpro, FaFile, FaFileInvoice, FaFileWord, FaHeading, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaNode, FaPlusCircle, FaStreetView } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { MdLocationOn } from 'react-icons/md';
import "slick-carousel/slick/slick-theme.css";
import { list } from 'firebase/storage';
import { useParams } from 'react-router-dom';
import Post from '../components/Post';

export default function ContractorProfile() {

 const { currentUser } = useSelector(state => state.user); // ✅ Get user from Redux
 const [userPosts, setUserPosts] = useState([]); // ✅ Always an array
 const [showPostError, setShowPostError] = useState(false);
 const params = useParams();
 const [loading, setLoading] = useState(false);

 useEffect(() => {
  if (!currentUser || !currentUser._id) return;

  const fetchPosts = async () => {
   try {
    setShowPostError(false);
    const res = await fetch(`/api/user/admin/posts/${params.id}`);
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


 return (
  <main>
   <div>
    <p>d</p>
    <div className='p-30'>
     <h6 className='text-5xl uppercase'>Contractors Work</h6>
     <div className='flex flex-col gap-5 mt-10'>
      {!loading && userPosts.length === 0 && (
       <h1 className='text-4xl mt-5 text-gray-400'>No Listing Found :(</h1>
      )}
      {loading && (
       <div class='flex mt-10 space-x-2 justify-center h-screen'>
        <span class='sr-only'>Loading...</span>
        <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce'></div>
       </div>
      )}
      {!loading && userPosts && userPosts.map((post) => (
       <Post key={post._id} post={post} />
      ))}
     </div>
    </div>
   </div>
  </main>
 )
}
