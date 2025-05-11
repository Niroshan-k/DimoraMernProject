import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

export default function Footer() {
 return (
  <footer className="text-black shadow-xl px-10 py-12">
   <div className="flex flex-col items-center space-y-8">
    {/* Social Icons */}
    <div className="flex justify-center space-x-6 text-xl border-b border-gray-200 pb-10 w-full">
     <a href="#"><FaFacebook /></a>
     <a href="#"><FaTwitter /></a>
     <a href="#"><FaInstagram /></a>
     <a href="#"><FaLinkedin /></a>
    </div>


    {/* Footer Links Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 w-full max-w-6xl text-sm text-left">
     <div>
      <h5 className="text-lg mb-3">About</h5>
      <ul className="space-y-2">
       <li><a href="#">About us</a></li>
       <li><a href="#">Careers</a></li>
       <li><a href="#">Updates</a></li>
      </ul>
     </div>

     <div>
      <h5 className="text-lg mb-3">Contact us</h5>
      <p className="text-sm">
       Dimora land pvt (Ltd)<br />
       No. 234,<br />
       DS Mawatha,<br />
       Kandy,<br />
       Sri Lanka.<br /><br />
       +94 89 789 90<br />
       dimoraland@email.com
      </p>
     </div>

     <div>
      <h5 className="text-lg mb-3">Services</h5>
      <ul className="space-y-2">
       <li><a href="#">Become seller</a></li>
       <li><a href="#">Valuation help</a></li>
       <li><a href="#">Negotiation</a></li>
      </ul>
     </div>

     <div>
      <h5 className="text-lg mb-3">Others</h5>
      <ul className="space-y-2">
       <li><a href="#">News</a></li>
       <li><a href="#">Online publication</a></li>
       <li><a href="#">Privacy policy</a></li>
       <li><a href="#">Agent help</a></li>
      </ul>
     </div>
    </div>

    {/* Copyright */}
    <div className="text-center flex gap-3 justify-center pt-10 border-t border-gray-200 w-full">
     <h5>Copyright ©2024 Dimóra Lands (Pvt) Ltd.</h5>
     <h1> All Rights Reserved.</h1>
    </div>
   </div>
  </footer>
 )
}
