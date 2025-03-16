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
import { FaRecycle } from 'react-icons/fa';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector(state => state.user);  // ✅ Get user from Redux
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

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

  const handleSignOut = async (e)=> {
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
  
  return (
    
    <div className='p-3 max-w-lg mx-auto'>
      <p className='text-sm'>role:{currentUser.role}</p>
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
        <p>
          {fileUploadError ? (
            <span className='text-red-600 font-bold'>File upload failed.</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className='text-green-400 font-bold'>Upload complete</span>
          ) : null}
        </p>

        {/* ✅ Updated Input Fields */}
        <input
          type="text"
          value={formData.username || currentUser.username}
          onChange={handleChange}
          className='bg-[#E8D9CD] mt-6 h-12 w-full p-2'
          placeholder='username'
          id='username'
        />
        <input
          type="email"
          value={formData.email || currentUser.email}
          onChange={handleChange}
          className='bg-[#E8D9CD] mt-6 h-12 w-full p-2'
          placeholder='email'
          id='email'
        />
        <input
          type="password"

          onChange={handleChange}
          className='bg-[#E8D9CD] mt-6 h-12 w-full p-2'
          placeholder='password'
          id='password'
        />

        <div className='flex justify-between'>
          <button disabled={loading} className='bg-[#523D35] text-white font-bold p-3 w-40 cursor-pointer mt-6'>
            {loading ? 'Loading...' : 'Update'}
          </button>
          <button onClick={handleSignOut} className='bg-red-500 text-white font-bold p-3 w-40 cursor-pointer mt-6'>
            Sign Out
          </button>
        </div>
      </form>

      <span onClick={handleDeleteUser} className='text-red-500 mt-5 font-bold flex gap-1 cursor-pointer items-center text-right'><FaRecycle />Delete account</span>
        <div className='mt-5'>
          <p className='text-red-500 text-right font-bold'>{error ? error : ""}</p>
          <p className='text-green-600 text-right font-bold'>{updateSuccess ? "User Updated Successfully!" : ""}</p>
        </div>
        <p className='text-red-500 text-sm'>{showListingError ? 'Error showing listing' : ''}</p>
    </div>
  );
}
