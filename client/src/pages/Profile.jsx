import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserSuccess, updateUserFailure, updateUserStart,
  deleteUserStart, deleteUserFailure, deleteUserSuccess,
  signOutUserFailure, signOutUserStart, signOutUserSuccess
} from '../redux/User/userSlice.js';
import { FaCheckCircle, FaFrownOpen, FaRecycle, FaTimes, FaUserCircle, FaWindowClose } from 'react-icons/fa';
import L from 'leaflet';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);  // ✅ Get user from Redux
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [verifying, setVerifying] = useState(false);


  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([7.8731, 80.7718], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Click event to get location
    map.on("click", function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((response) => response.json())
        .then((data) => {
          const location = data.display_name;
          setFormData((prev) => ({ ...prev, location }));
        })
        .catch((error) => console.error("Error fetching address:", error));
    });

    return () => map.remove();
  }, []);

  const handleUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }));
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }
  const [showListingError, setShowListingError] = useState(false);
  const handleUpdate = () => {
    updateSuccess ? setUpdateSuccess(false) : setUpdateSuccess(true);
  }

  const clicked = () => {
    setVerifying(true);
  }
  //console.log("currentUser:", currentUser); // Debugging: Log the currentUser object
  return (

    <div className='p-3 max-w-lg mx-auto'>
      <p className='text-sm mt-10'>role:{currentUser.role}</p>
      <p className='text-sm'>id:{currentUser._id}</p>
      <form onSubmit={handleSubmit} className='text-center mt-24'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept='image/*'
        />
        {/* ✅ Updated Profile Image Display */}
        <img
          src={formData?.avatar || currentUser.avatar || "https://th.bing.com/th/id/OIP.YEnn0jmP54djRm9Ma49NHgHaHa?rs=1&pid=ImgDetMain"}
          alt="profile"
          className='w-40 h-40 m-auto mt-3 rounded-full object-cover cursor-pointer'
          onClick={() => fileRef.current.click()}
        />

        {/* ✅ Upload Progress/Error Messages */}
        <p className='mt-5'>
          {fileUploadError ? (
            <span className='text-red-600 font-bold flex gap-3 items-center shadow p-2 justify-center'>File upload failed. <FaFrownOpen />
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className='text-green-400 p-2 justify-center flex gap-3 items-center font-bold shadow rounded'>Image Upload complete<FaCheckCircle /></span>
          ) : null}
        </p>

        {/* ✅ Updated Input Fields */}
        {currentUser.role != "admin" && currentUser.role != "customer" ?
          <>{verifying ? <p className='text-green-400 font-bold'>Verifying...</p> :
            <>
              {currentUser.verified ?
                <div className='flex gap-2 items-center justify-center'>
                  <span className='text-blue-400 font-bold'>Verified</span>
                  <img src="assets/star.png" className='w-5' alt="verified" />
                </div> :
                <div className='flex gap-2 items-center justify-center'>
                  <span className='text-red-400 font-bold'>Not Verified</span>
                  <img src="assets/cross.png" className='w-5' alt="not verified" />
                  <Link to="/beVerified">
                    <button className='bg-blue-400 text-white px-2 py-1 rounded cursor-pointer hover:shadow-lg' onClick={clicked}>Be Verified</button>
                  </Link>
                </div>}
            </>}
          </> : ""}

        <input
          type="text"
          value={formData.username || currentUser.username}
          onChange={handleChange}
          className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
          placeholder='username'
          id='username'
        />
        <input
          type="email"
          value={formData.email || currentUser.email}
          onChange={handleChange}
          className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
          placeholder='email'
          id='email'
        />

        {currentUser.role != "admin" ?
          <>
            <div className='flex justify-center items-center gap-2'>
              <input
                type="text"
                className='bg-[#E8D9CD] mt-6 h-12 w-15 p-2 rounded'
                value={"+94"}
                id='phone'
                disabled
              />
              <input
                type="text"
                value={formData.phone || currentUser.phone}
                onChange={handleChange}
                className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
                placeholder='contact number'
                id='phone'
              />
            </div>
            <input
              type="text"
              value={formData.location || currentUser.location}
              onChange={handleChange}
              className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
              placeholder='location'
              id='location'
            />
            <span className='flex text-sm mt-3'>or, You can choose your location:</span>
            <div ref={mapRef} className="rounded h-50"></div>
          </>
          : ""}
        {currentUser.role === 'contractor' && (
          <input
            type="password"
            onChange={handleChange}
            className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
            placeholder='password'
            id='password'
          />
        )}
        {currentUser.role === 'seller' && (
          <input
            type="password"
            onChange={handleChange}
            className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
            placeholder='password'
            id='password'
          />
        )}

        <div className='flex justify-between'>
          <button disabled={loading} className='bg-[#523D35] rounded text-white font-bold p-3 w-40 cursor-pointer mt-6'>
            {loading ? 'Loading...' : 'Update'}
          </button>
          <button onClick={handleSignOut} className='bg-red-500 rounded text-white font-bold p-3 w-40 cursor-pointer mt-6'>
            Sign Out
          </button>
        </div>
      </form>

      <span onClick={handleDeleteUser} className='text-red-500 mt-5 font-bold flex gap-1 cursor-pointer items-center text-right'><FaUserCircle />Deactivate account</span>
      <div className='mt-5'>
        <p className='text-red-500 text-right font-bold'>{error ? error : ""}</p>
        {
          updateSuccess ? <div className='bg-white shadow-lg p-4 fixed bottom-5 left-1/2 -translate-x-1/2 max-w-lg w-full text-center'>
            <div className='text-right justify-self-end'>
              <FaTimes className='cursor-pointer' onClick={handleUpdate} />
            </div>
            <p className='flex items-center justify-center gap-2'>
              <FaCheckCircle className='text-green-500' /> User Updated Successfully!
            </p>
          </div> : ""
        }
      </div>
    </div>
  );
}
