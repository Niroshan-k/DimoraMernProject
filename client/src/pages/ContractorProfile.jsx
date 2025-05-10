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
 const [error, setError] = useState(false);
 const [userData, setUserData] = useState([]);
 const id = params.id;

 useEffect(() => {
  if (!currentUser || !currentUser._id) return;

  const fetchPosts = async () => {
   try {
    setShowPostError(false);
    const res = await fetch(`/api/user/admin/posts/${id}`);
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

 useEffect(() => {
  const fetchContractor = async () => {
   try {
    setLoading(true);
    const res = await fetch(`/api/user/get/${id}`);
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
  fetchContractor();
 }, []);

 //console.log(userData);

 return (
  <main>
   <div>
    <p>d</p>
    <div className='p-30'>
     <h6 className='text-5xl uppercase'>Contractors Work</h6>
     <div className='flex items-center gap-5 mt-10'>
      <img className='h-20 w-20 rounded-full' src={userData.avatar} alt="avatar" />
      <div>
       <h5 className='flex items-center gap-1 text-lg font-medium'>
        {userData.username}
        <img className='h-5 w-5' src={userData.verified ? "/assets/star.png" : "assets/cross.png"} alt="verified" />
       </h5>
       <h1 className='flex text-sm font-bold items-center gap-1'>{userData.email}</h1>
       <p className='text-sm font-bold'>Post Count: {userPosts.length}</p>
      </div>
     </div>
     <div className='flex justify-between gap-10 mt-10'>
      <div className='flex-[0.5] mt-10 shadow-lg rounded-lg p-5'>
       <h5 className='text-2xl mb-5'>Description</h5>
       <p className=''>{userData.description}</p>
      </div>
      <div className='flex flex-[0.5] flex-col w-50'>
       <form className='flex flex-col' action="">
        <span>Full Name:</span>
        <input type="text" id='name' className='mb-5 p-3 rounded bg-[#E8D9CD]' />
        <span>Email:</span>
        <input type="text" id='email' className='mb-5 p-3 rounded bg-[#E8D9CD]' />
        <span>Number:</span>
        <input type="text" id='number' className='mb-5 p-3 rounded bg-[#E8D9CD]' />
        <span>Message:</span>
        <textarea id='message' className='mb-5 p-3 rounded bg-[#E8D9CD]' />
        <button className='bg-[#523D35] rounded p-3 text-white uppercase font-bold w-full'>MESSAGE</button>
       </form>
      </div>
     </div>

     <div className='flex flex-col gap-5 mt-10'>
      {!loading && userPosts.length === 0 && (
       <h1 className='text-4xl mt-5 text-gray-400'>No Post Found :(</h1>
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
