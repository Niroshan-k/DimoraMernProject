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
import { FaCheckCircle, FaSpinner, FaTrash, FaFrownOpen, FaRecycle, FaTimes, FaUserCircle, FaWindowClose } from 'react-icons/fa';
import L from 'leaflet';
import { Link } from 'react-router-dom';

export default function Profile() {
 const fileRef = useRef(null);
 const { currentUser, error } = useSelector(state => state.user);  // ✅ Get user from Redux
 const [file, setFile] = useState(null);
 const [filePerc, setFilePerc] = useState(0);
 const [fileUploadError, setFileUploadError] = useState(false);
 const [updateSuccess, setUpdateSuccess] = useState(false);
 const dispatch = useDispatch();
 const mapRef = useRef(null);
 const [verifying, setVerifying] = useState(false);
 const [imageUploadError, setImageUploadError] = useState(false);
 const [files, setFiles] = useState(null);
 const [uploading, setUploading] = useState(false);
 const [formData, setFormData] = useState({
  imageUrls: [],
  username: currentUser.username,
  userId: currentUser._id,
  role: currentUser.role,
  fullName: '',
  DOB: '',
  email: currentUser.email,
  phone: currentUser.phone,
  idType: 'national-id',
 });



 const handleImageSubmit = (e) => {
  if (files.length > 0 && files.length + formData.imageUrls.length < 3) {
   setUploading(true);
   setImageUploadError(false);
   const promises = [];
   for (let i = 0; i < files.length; i++) {
    promises.push(storeImage(files[i]));
   }
   Promise.all(promises).then((urls) => {
    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
    setImageUploadError(false);
    setUploading(false);
   }).catch((err) => {
    setImageUploadError('Image upload failed (2mb max)');
    setUploading(false);
   });
  } else {
   setImageUploadError('You can only upload 2 images.');
   setUploading(false);
  }
 };

 const storeImage = async (file) => {
  return new Promise((resolve, reject) => {
   const storage = getStorage(app);
   const fileName = new Date().getTime() + file.name;
   const storageRef = ref(storage, fileName);
   const uploadTask = uploadBytesResumable(storageRef, file);

   uploadTask.on(
    "state_changed",
    (snapshot) => {
     const progress =
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     console.log(`Upload is ${progress}% done`);
    },
    (error) => {
     reject(error);
    },
    () => {
     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
     });
    }
   )
  });
 };

 const handleRemoveImage = (index) => {
  setFormData({
   ...formData,
   imageUrls: formData.imageUrls.filter((_, i) => i !== index),
  });
 };

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

  // Validate form data
  if (!formData.fullName || !formData.DOB || !formData.idType || formData.imageUrls.length < 2) {
   setImageUploadError('Please fill in all required fields.');
   return;
  }

  // Check if the user is 18 or older
  const today = new Date();
  const dob = new Date(formData.DOB);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
   age--;
  }
  if (age < 18) {
   setImageUploadError('You must be at least 18 years old to submit this form.');
   return;
  }

  try {
   dispatch(updateUserStart());

   // Wrapping formData inside "form" and adding "verified"
   const bodyData = {
    form: formData,
    verified: "verifying", // Adding the verified field
   };

   const res = await fetch(`/api/user/createVerifyForm/${currentUser._id}`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData), // Correct: Wrapping formData in "form" and adding "verified"
   });

   const data = await res.json();
   console.log("Response from Backend:", data); // Debugging: Log the backend response

   if (!res.ok) {
    dispatch(updateUserFailure(data.message));
    return;
   }
   dispatch(updateUserSuccess(data));
   setUpdateSuccess(true);
  } catch (error) {
   console.error("Error in handleSubmit:", error); // Debugging: Log any errors
   dispatch(updateUserFailure(error.message));
  }
 };
 const [showListingError, setShowListingError] = useState(false);
 const handleUpdate = () => {
  updateSuccess ? setUpdateSuccess(false) : setUpdateSuccess(true);
 }

 const clicked = () => {
  setVerifying(true);
 }
 //console.log("currentUser:", currentUser); // Debugging: Log the currentUser object
 //console.log("form data", formData)
 //console.log("userData:", userData); // Debugging: Log the userData object
 return (

  <div className='p-3 max-w-lg mx-auto'>
   <form onSubmit={handleSubmit} className='text-center mt-24'>
    <h6 className='text-2xl'>Verify Your Identity</h6>
    <span className='text-sm flex mt-6'>username</span>
    <input
     type="text"
     value={formData.username || currentUser.username}
     onChange={handleChange}
     className='bg-[#E8D9CD] h-12 w-full p-2 rounded'
     id='username'
    />
    <span className='text-sm flex mt-6'>user Id</span>
    <input
     type="text"
     value={formData.userId || currentUser._id}
     onChange={handleChange}
     className='bg-[#E8D9CD] h-12 w-full p-2 rounded'
     id='userId'
    />
    <span className='text-sm flex mt-6'>Full Name</span>
    <input
     type="text"
     value={formData.fullName}
     onChange={handleChange}
     className='bg-[#E8D9CD] h-12 w-full p-2 rounded'
     placeholder='Full Name'
     id='fullName'
    />
    <span className='text-sm flex mt-6'>Email</span>
    <input
     type="email"
     value={formData.email || currentUser.email}
     onChange={handleChange}
     className='bg-[#E8D9CD] h-12 w-full p-2 rounded'
     id='email'
    />
    <span className='text-sm flex mt-6'>Role</span>
    <input
     type="text"
     value={formData.role || currentUser.role}
     onChange={handleChange}
     className='bg-[#E8D9CD] h-12 w-full p-2 rounded'
     id='role'
    />

    <>
     <span className='text-sm flex mt-6'>Contact Number</span>
     <div className='flex justify-center items-center gap-2'>
      <input
       type="text"
       className='bg-[#E8D9CD] h-12 w-15 p-2 rounded'
       value={"+94"}
       id='+94'
       disabled
      />
      <input
       type="text"
       value={formData.phone || currentUser.phone}
       onChange={handleChange}
       className='bg-[#E8D9CD] h-12 w-full p-2 rounded'
       placeholder='contact number'
       max="9"
       id='phone'
      />
     </div>
     <input
      type="date"
      value={formData.DOB}
      onChange={handleChange}
      className='bg-[#E8D9CD] mt-6 h-12 w-full p-2 rounded'
      id='DOB'
     />
    </>
    <span className='text-sm flex mt-6'>ID Type</span>
    <select
     id="idType"
     name="idType"
     value={formData.idType}
     onChange={handleChange}
     required
     className="bg-[#E8D9CD] h-12 w-full p-2 rounded"
    >
     <option value="" disabled>
      Select ID Type
     </option>
     <option value="national-id">National ID</option>
     <option value="passport">Passport</option>
     <option value="driver-license">Driver's License</option>
    </select>

    <div>
     <span className='text-sm flex mt-6'>1. Upload Image of your {formData.idType} </span>
     <span className='text-sm flex'>2. Upload a Selfie With your {formData.idType} </span>
     <div className='flex gap-3 justify-between'>
      <input onChange={(e) => setFiles(e.target.files)} className='p-3 bg-[#E8D9CD] w-full rounded' type="file" id='images' accept='image/*' multiple />
      <button disabled={uploading} onClick={handleImageSubmit} type='button' className='bg-[#959D90] p-3 rounded w-max text-white font-bold uppercase hover:shadow-lg'>{uploading ? <FaSpinner className='mx-auto text-2xl animate-spin' /> : 'Upload'}</button>
     </div>

     <div className="grid grid-cols-2 gap-3 mt-4">
      {formData.imageUrls.length > 0 &&
       formData.imageUrls.map((url, index) => (
        <div key={index} className="relative group">
         <img src={url} alt="listing image" className="w-full h-32 object-cover" />

         {/* Delete Icon - Hidden by default, shows on hover */}
         <button
          className="absolute inset-0 flex items-center justify-center text-red-700 opacity-0 bg-black bg-opacity-30 group-hover:opacity-80 transition-opacity duration-300"
          onClick={() => handleRemoveImage(index)}
         >
          <FaTrash className="text-2xl" />
         </button>
        </div>
       ))}
     </div>

    </div>

    <div className='flex justify-end gap-2'>
     <button disabled={uploading} className='bg-[#523D35] rounded text-white font-bold p-3 w-40 cursor-pointer mt-6'>
      {uploading ? 'Loading...' : 'Submit'}
     </button>
     <Link to={'/profile'}>
      <button className='bg-red-500 rounded text-white font-bold p-3 w-40 cursor-pointer mt-6'>
       Cancel
      </button>
     </Link>
    </div>
   </form>


   <div className='mt-5'>
    <p className='text-red-500 text-right font-bold'>{error ? error : ""}</p>
    <p className='text-red-500 text-right font-bold'>{imageUploadError ? imageUploadError : ""}</p>
    {
     updateSuccess ? <div className='bg-white shadow-lg p-4 fixed bottom-5 left-1/2 -translate-x-1/2 max-w-lg w-full text-center'>
      <div className='text-right justify-self-end'>
       <FaTimes className='cursor-pointer' onClick={handleUpdate} />
      </div>
      <p className='flex items-center justify-center gap-2'>
       <FaCheckCircle className='text-green-500' /> Submitted Successfully!
      </p>
      <Link to={'/profile'}>
       <button className='bg-blue-500 mt-5 text-white text-sm p-2 rounded'>Go to profile</button>
      </Link>
     </div> : ""
    }
   </div>
  </div>
 );
}
