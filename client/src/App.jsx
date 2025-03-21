import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import Header from './components/header';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import SellerDashboard from './pages/SellerDashboard';
import ContractorDashboard from './pages/ContractorDashboard';
import Blog from './pages/Blog';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import CreatePost from './pages/CreatePost';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/listing/:listingId' element={<Listing />}></Route>

        {/* ✅ Protect Profile (All Authenticated Users) */}
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog" element={<Blog />} />
        </Route>

        {/* ✅ Seller Dashboard - Only for Sellers */}
        <Route element={<PrivateRoute allowedRoles={['seller']} />} >
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>

        {/* ✅ Contractor Dashboard - Only for Contractors */}
        <Route element={<PrivateRoute allowedRoles={['contractor']} />} >
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
          <Route path='/create-post' element={<CreatePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
