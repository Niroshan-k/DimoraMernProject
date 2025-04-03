import React, { useEffect, useState } from 'react'
import { FaMapMarker } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Contractors() {
    const [postsData, setPostData] = useState([]);
      //console.log(rentListings);
      useEffect(()=>{
        const posts = async () => {
          try {
            const res = await fetch('/api/posting/get');
            const data = await res.json();
            setPostData(data);
          } catch (error) {
            console.log(error);
          }
        };
        posts();
      },[]);
    return (
        <main>i
            <div className='p-10'>
                <h6 className='mt-10 text-2xl'>Find Your Contractor</h6>
                <div>
                    <input type="text" className='p-3 bg-[#E8D9CD]' />
                    <button className='bg-[#523D35] mt-3 p-3 text-white font-bold'>Search</button>
                </div>
                <div>

                </div>
            </div>
        </main>
    )
}
