import React, { useEffect, useState } from 'react'
import './Home.css'
import { FaMapMarker } from 'react-icons/fa'
import Search from './Searchbar'
import ListingItem from '../components/ListingItem';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function Home() {
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(rentListings);
  useEffect(()=>{
    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSaleListings();
  },[]);
  return (
    <main>
      <section id='banner'>
        <h1 className='mt-100' id='h1'>MAKE YOUR OWN</h1>
        <h6 id='h6'>Real Estate Network</h6>

        <div className='mx-auto mt-70'>
          <button className='bg-[#ffffff] text-black text-2xl rounded-4xl font-bold py-3 flex gap-2 items-center px-6 hover:bg-black hover:text-white'><MdLocationOn />Get Started</button>
        </div>
      </section>
      <section id=''>
        <Search />
      </section>
      <section className='px-30'>
        {
          saleListings && saleListings.length > 0 && (
            <div>
              <div>
                <h6 className='text-5xl'>Sales</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
              <div className='mt-10  flex justify-end'>
                <Link to={`/search?type=sale`}>
                <button className='p-3 bg-green-400'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='px-30 mt-10'>
        {
          saleListings && saleListings.length > 0 && (
            <div>
              <div>
                <h6 className='text-5xl'>Rent</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id}/>
                  ))
                }
              </div>
              <div className='mt-10 flex justify-end'>
                <Link to={`/search?type=rent`}>
                <button className='p-3 bg-green-400'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
    </main>
  )
}
