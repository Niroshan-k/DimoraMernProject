import { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import emailjs from 'emailjs-com';
import { FaArrowsAlt, FaBath, FaBed, FaCar, FaCashRegister, FaChartArea, FaDeskpro, FaExpand, FaExpandAlt, FaFile, FaFileInvoice, FaFileWord, FaLocationArrow, FaMap, FaMapMarked, FaMapMarker, FaMarker, FaMoneyBill, FaPlusCircle, FaClock, FaEye } from 'react-icons/fa';

export default function UserActivities() {
  const { currentUser } = useSelector(state => state.user);
  const [user, setUser] = useState([]);
  const [showUserError, setShowUserError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [showPostError, setShowPostError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const [emailSent, setEmailSent] = useState(false); // Add this state
  const [email, setEmail] = useState(user.email || ''); 
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [replyTo, setReplyTo] = useState('');
  
  const [formData, setFormData] = useState({
    verified: 'false'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

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
          setEmailSent(true);
          alert('Email sent successfully!');
        },
        (error) => {
          console.error('Error sending email:', error.text);
          alert('Failed to send email.');
        }
      );

    e.target.reset(); // Reset the form after submission
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const verifyUser = async (e) => {
    e.preventDefault();

    // Validate user ID
    if (!user || !user._id) {
      setUpdateError(true);
      alert('User ID is missing. Cannot verify user.');
      return;
    }

    try {
      const res = await fetch(`/api/user/userVerified/${user._id}`, {
        method: 'POST', // Change to PUT or PATCH if required by the backend
        headers: {
          'Content-Type': 'application/json',
          headers: {
            Authorization: `Bearer ${currentUser.token}`, // Ensure the token is sent
          },
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setUpdateSuccess(false);
        setUpdateError(true);
        alert('Failed to verify user. Please try again.');
        return;
      }

      setUpdateSuccess(true);
      setUpdateError(false);
    } catch (error) {
      console.error('Error verifying user:', error);
      setUpdateError(true);
    }
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl); // Set the clicked image
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setCurrentImage(null); // Clear the current image
  };

  //console.log(user);
  //console.log('form data', formData);
  //console.log(currentUser)
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
          <h6 className='mt-5 mb-3'>Send a Email</h6>
          <form onSubmit={sendEmail}>
            <div className="mb-4">
              <label htmlFor="to_email" className="block text-sm font-medium">
                Email:
              </label>
              <input
                type="email"
                name="to_email" // Matches {{to_email}} in the template
                id="to_email"
                className="mt-1 bg-[#EFEFE9] p-3 block w-full rounded border-gray-300 shadow-sm sm:text-sm"
                defaultValue={user.email}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="from_name" className="block text-sm font-medium">
                From:
              </label>
              <input
                type="text"
                name="from_name" // Matches {{from_name}} in the template
                id="from_name"
                className="bg-[#EFEFE9] p-3 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value="DimoraLand(pvt) Ltd."
                required
                readOnly
              />
            </div>
            <div className="mb-4">
              <label htmlFor="reply_to" className="block text-sm font-medium">
                Reply-To Email
              </label>
              <input
                type="email"
                name="reply_to" // Matches {{reply_to}} in the template
                id="reply_to"
                className="bg-[#EFEFE9] p-3 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="Enter reply-to email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cc" className="block text-sm font-medium">
                CC
              </label>
              <input
                type="email"
                name="cc" // Matches {{cc}} in the template
                id="cc"
                className="bg-[#EFEFE9] p-3 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter CC email (optional)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bcc" className="block text-sm font-medium">
                BCC
              </label>
              <input
                type="email"
                name="bcc" // Matches {{bcc}} in the template
                id="bcc"
                className="bg-[#EFEFE9] p-3 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter BCC email (optional)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium">
                Subject
              </label>
              <input
                type="text"
                name="subject" // Matches {{subject}} in the template
                id="subject"
                className="bg-[#EFEFE9] p-3 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <textarea
                name="message" // Matches {{message}} in the template
                id="message"
                className="bg-[#EFEFE9] p-3 mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                required
              />
            </div>
            <button
              type="submit"
              className="py-3 px-4 text-sm font-medium rounded text-white bg-[#523D35]"
            >
              Send Email
            </button>
            {emailSent && (
              <p className="text-green-500 mt-4 text-sm">Email sent successfully!</p>
            )}
          </form>

          {user.verifiedFormData && user.verifiedFormData.length > 0 ? (
            <div>
              <h6 className='mt-6 text-4xl'>Verifying Request</h6>
              <div className='bg-[#EFEFE9] rounded p-5 mt-5 shadow'>
                <p className='mb-3 text-2xl'><b>Verification Status:<span className='text-red-500 ml-3'>{user.verified}</span></b></p>
                <div className='flex gap-3'>
                  <div>
                    <p><b>Username:</b></p>
                    <p><b>User ID:</b></p>
                    <p><b>Full Name:</b></p>
                    <p><b>Email:</b></p>
                    <p><b>Date of Birth:</b></p>
                    <p><b>Contact:</b></p>
                    <p><b>User Role:</b></p>
                    <p><b>ID Type:</b></p>
                  </div>
                  <div>
                    <p>{user.verifiedFormData[0].username}</p>
                    <p>{user.verifiedFormData[0].userId}</p>
                    <p>{user.verifiedFormData[0].fullName}</p>
                    <p>{user.verifiedFormData[0].email}</p>
                    <p>{user.verifiedFormData[0].DOB} <span className='text-sm'>[YY/MM/DD]</span></p>
                    <p>+94 {user.verifiedFormData[0].phone}</p>
                    <p>{user.verifiedFormData[0].role}</p>
                    <p>{user.verifiedFormData[0].idType}</p>
                  </div>
                </div>
                <div className="flex mt-5 gap-5">
                  {user.verifiedFormData[0].imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Verifying Image ${index + 1}`}
                      className="cursor-pointer rounded w-30 object-cover"
                      onClick={() => handleImageClick(url)} // Open modal on click
                    />
                  ))}
                </div>
                <div className='mt-5'>
                  <form onSubmit={verifyUser}>
                    <span>Verification</span>
                    <select
                      id="verified"
                      name="verified"
                      value={formData.verified}
                      onChange={handleChange}
                      required
                      className="bg-[#E8D9CD] h-12 w-full p-2 rounded"
                    >
                      <option value="true">True</option>
                      <option value="verifying">Verifying</option>
                      <option value="false">False</option>
                    </select>
                    <button className='bg-blue-500 mt-5 rounded text-white p-3 font-bold'>Make changes</button>
                  </form>
                </div>
                <div>
                  <p className='text-sm mt-5 text-red-500'>{updateError ? "Changes have not applied!" : null}</p>
                  <p className='text-sm mt-5 text-green-700'>{updateSuccess ? "Changes Submitted Successfully!" : null}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className='mt-5'>No verification data available.</p>
          )}
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
                            <p className="flex items-center gap-2">
                              <FaEye /> Views: <b className="ml-2">{listing.views || 0}</b>
                            </p>
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
      {/* Full-Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000b7] bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            {/* Close Button */}
            <button
              className="absolute top-5 right-5 bg-black rounded-full w-10 h-10 text-white text-5xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            {/* Full-Screen Image */}
            <img
              src={currentImage}
              alt="Full Screen"
              className="max-w-full max-h-full rounded"
            />
          </div>
        </div>
      )}
    </main>
  );
}
