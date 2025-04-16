import { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import emailjs from 'emailjs-com';


import { FaArrowsAlt, FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaDeskpro, FaExpand, FaExpandAlt, FaFile, FaFileInvoice, FaFileWord, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaPlusCircle, FaClock } from 'react-icons/fa';

export default function UserActivities() {
  const { currentUser } = useSelector(state => state.user);
  const [user, setUser] = useState([]);
  const [showUserError, setShowUserError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [showPostError, setShowPostError] = useState(false);

  const params = useParams();

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchUser = async () => {
      try {
        setShowUserError(false);
        const res = await fetch(`/api/user/get/${params.userId}`);
        const data = await res.json();
        if (data.success === false) {
          setShowUserError(true);
          console.log(data.message);
          return;
        }
        setUser(data); // ✅ Ensure it's always an array
      } catch (error) {
        setShowUserError(true);
      }
    };

    fetchUser();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchListings = async () => {
      try {
        setShowListingError(false);
        const res = await fetch(`/api/user/admin/listings/${params.userId}`);
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
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    const fetchPosts = async () => {
      try {
        setShowPostError(false);
        const res = await fetch(`/api/user/admin/posts/${params.userId}`);
        const data = await res.json();
        if (data.success === false) {
          setShowPostError(true);
          console.log(data.message);
          return;
        }
        setUserPosts(data); // ✅ Ensure it's always an array
      } catch (error) {
        setShowPostError(true);
      }
    };

    fetchPosts();
  }, [currentUser]);

  const handleDelete = async (Id) => {
    if (user.role === "seller") {
      try {
        const res = await fetch(`/api/listing/admin/delete/${Id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Ensure the token is sent
          },
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
        console.log(data.message || 'Listing deleted successfully!');
        setUserListings((prev) => prev.filter((listing) => listing._id !== Id));
      } catch (error) {
        console.error(error.message);
      }
    }
    else if (user.role === "contractor") {
      try {
        const res = await fetch(`/api/posting/admin/delete/${Id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Ensure the token is sent
          },
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
        console.log(data.message || 'Post deleted successfully!');
        setUserPosts((prev) => prev.filter((post) => post._id !== Id));
      } catch (error) {
        console.error(error.message);
      }
    }

  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_982yye9', // Replace with your EmailJS Service ID
        'template_ioidlpy', // Replace with your EmailJS Template ID
        e.target,
        '2iX0jPLVEGHfOJi_U' // Replace with your EmailJS User ID
      )
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          alert('Email sent successfully!');
        },
        (error) => {
          console.error('Error sending email:', error.text);
          alert('Failed to send email.');
        }
      );

    e.target.reset(); // Reset the form after submission
  };

  console.log(userPosts);
  return (
    <main>a
      <div className='mt-10 p-10'>
        <h6 className='text-4xl'>User Details</h6>
        <div className='mt-10'>
          <div className='flex items-center gap-5'>
            <img className='max-h-25 max-w-25 rounded' src={user.avatar} alt="profile_image" />
            <div className='flex flex-row gap-2'>
              <div>
                <p><b>User Id: </b></p>
                <p><b>Username: </b></p>
                <p><b>Email: </b></p>
                <p><b>Role: </b></p>
              </div>
              <div>
                <p>{user._id}</p>
                <p>{user.username}</p>
                <p>{user.email}</p>
                <p>{user.role}</p>
              </div>
            </div>
          </div>
          <form onSubmit={sendEmail}>
            <div className="mb-4">
              <label htmlFor="to_email" className="block text-sm font-medium text-gray-700">
                To Email
              </label>
              <input
                type="email"
                name="to_email" // Matches {{to_email}} in the template
                id="to_email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter recipient email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="from_name" className="block text-sm font-medium text-gray-700">
                From Name
              </label>
              <input
                type="text"
                name="from_name" // Matches {{from_name}} in the template
                id="from_name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reply_to" className="block text-sm font-medium text-gray-700">
                Reply-To Email
              </label>
              <input
                type="email"
                name="reply_to" // Matches {{reply_to}} in the template
                id="reply_to"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter reply-to email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cc" className="block text-sm font-medium text-gray-700">
                CC
              </label>
              <input
                type="text"
                name="cc" // Matches {{cc}} in the template
                id="cc"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter CC email (optional)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bcc" className="block text-sm font-medium text-gray-700">
                BCC
              </label>
              <input
                type="text"
                name="bcc" // Matches {{bcc}} in the template
                id="bcc"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter BCC email (optional)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject" // Matches {{subject}} in the template
                id="subject"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter email subject"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message" // Matches {{message}} in the template
                id="message"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your message"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send Email
            </button>
          </form>
          {
            user.role === "seller" ?
              <>
                <h6 className='md:text-left mt-10 text-center font-serif text-4xl mb-10'>Listing</h6>

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

              </>
              : null
          }
          {
            user.role === "contractor" ?
              <>
                <h6 className='md:text-left mt-10 text-center font-serif text-4xl mb-10'>Projects</h6>
                <div className='flex flex-col gap-5'>
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
                                <p>
                                  <MdLocationOn />
                                </p>
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
              </> : null
          }
        </div>
      </div>
    </main>
  );
}
