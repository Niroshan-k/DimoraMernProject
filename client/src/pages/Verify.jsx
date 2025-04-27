import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Verify() {
 const { currentUser } = useSelector(state => state.user);
 const [submit, setSubmit] = useState(false);
 const [formData, setFormData] = useState({
  id: currentUser._id,
  role: currentUser.role,
  fullName: '',
  dateOfBirth: '',
  email: '',
  phoneNumber: '',
  idType: '',
  idFile: null,
  selfieFile: null,
 });

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
 };

 const handleFileChange = (e) => {
  const { name } = e.target;
  setFormData({ ...formData, [name]: e.target.files[0] });
 };

 const handleSubmit = (e) => {
  e.preventDefault();
  setSubmit(true);
  // Add functionality to send data to the backend
 };



 return (
  <main>d
   <div className="min-h-screen flex items-center justify-center mt-10 px-6 py-8">
    <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
     <h6 className="text-3xl text-gray-800 mb-10 text-center">
      Verify Your Identity
     </h6>
     <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className='flex gap-3 justify-between'>
       <div className='flex-[0.7]'>
        <label
         htmlFor="fullName"
         className="block text-sm font-medium text-gray-700"
        >
         User Id
        </label>
        <input
         type="text"
         id="id"
         name="id"
         value={formData.id}
         required
         className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
         disabled
        />
       </div>
       <div className='flex-[0.3]'>
        <label
         htmlFor="fullName"
         className="block text-sm font-medium text-gray-700"
        >
         User Role
        </label>
        <input
         type="text"
         id="id"
         name="id"
         value={formData.role}
         required
         className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
         disabled
        />
       </div>
      </div>
      <div>
       <label
        htmlFor="fullName"
        className="block text-sm font-medium text-gray-700"
       >
        Full Name
       </label>
       <input
        type="text"
        id="fullName"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        placeholder="Enter your full name"
        className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
       />
      </div>

      {/* Date of Birth */}
      <div>
       <label
        htmlFor="dateOfBirth"
        className="block text-sm font-medium text-gray-700"
       >
        Date of Birth
       </label>
       <input
        type="date"
        id="dateOfBirth"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
        className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
       />
      </div>

      {/* Email */}
      <div>
       <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
       >
        Email Address
       </label>
       <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="example@example.com"
        className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
       />
      </div>

      {/* Phone Number */}
      <div>
       <label
        htmlFor="phoneNumber"
        className="block text-sm font-medium text-gray-700"
       >
        Phone Number
       </label>
       <input
        type="tel"
        id="phoneNumber"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        placeholder="Enter your phone number"
        className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
       />
      </div>

      {/* ID Type */}
      <div>
       <label
        htmlFor="idType"
        className="block text-sm font-medium text-gray-700"
       >
        ID Type
       </label>
       <select
        id="idType"
        name="idType"
        value={formData.idType}
        onChange={handleChange}
        required
        className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
       >
        <option value="" disabled>
         Select ID Type
        </option>
        <option value="national-id">National ID</option>
        <option value="passport">Passport</option>
        <option value="driver-license">Driver's License</option>
       </select>
      </div>

      {/* ID File Upload */}
      <div>
       <label
        htmlFor="idFile"
        className="block text-sm font-medium text-gray-700"
       >
        Upload Your ID
       </label>
       <input
        type="file"
        id="idFile"
        name="idFile"
        onChange={handleFileChange}
        required
        accept="image/*,application/pdf"
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
       />
      </div>

      {/* Selfie Upload */}
      <div>
       <label
        htmlFor="selfieFile"
        className="block text-sm font-medium text-gray-700"
       >
        Upload a Selfie with Your ID
       </label>
       <input
        type="file"
        id="selfieFile"
        name="selfieFile"
        onChange={handleFileChange}
        required
        accept="image/*"
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
       />
      </div>

      {/* Submit Button */}
      <div>
       <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
       >
        Submit for Verification
       </button>
      </div>
     </form>
    </div>
   </div>
   <div className='flex flex-col gap-3 text-center mx-40 fixed bottom-5 left-0 bg-white shadow-2xl right-0 p-3 rounded-2xl text-sm'>
    <p className='w-full flex justify-end'><FaTimes /></p>
    <p>We Will let you know when your account is verified. Please be patient as this process may take some time.</p>
    <Link to='/profile'>
     <button className='px-3 py-1 bg-blue-400 rounded-lg mt-5'>Go to Profile</button>
    </Link>
   </div>
  </main>
 );
}