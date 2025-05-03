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
  const [houseListings, setHouseListings] = useState([]);
  const [apartmentListings, setApartmentListings] = useState([]);
  const [villaListings, setVillaListings] = useState([]);
  const [hotelListings, setHotelListings] = useState([]);
  const [trending, setTrending] = useState([]);
  console.log(trending);
  useEffect(() => {
    const fetchTOPListings = async () => {
      try {
        const res = await fetch('/api/listing/get?package=boost&limit=4');
        const data = await res.json();
        setTrending(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
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
        fetchHouseListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchHouseListings = async () => {
      try {
        const res = await fetch('/api/listing/get?property_type=house&limit=4');
        const data = await res.json();
        setHouseListings(data);
        fetchApartmentListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchApartmentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?property_type=apartment&limit=4');
        const data = await res.json();
        setApartmentListings(data);
        fetchVillaListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchVillaListings = async () => {
      try {
        const res = await fetch('/api/listing/get?property_type=villa&limit=4');
        const data = await res.json();
        setVillaListings(data);
        fetchHotelListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchHotelListings = async () => {
      try {
        const res = await fetch('/api/listing/get?property_type=hotel&limit=4');
        const data = await res.json();
        setHotelListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTOPListings();
    //fetchSaleListings();
    console.log("h", houseListings);
    console.log(rentListings);
    console.log(saleListings);
  }, []);
  return (
    <main>
      <section id='banner'>

        <div className='bg-[#00000083] h-screen w-full text-center md:text-left md:w-[30%] md:p-5'>
          <h1 className='mt-50 md:mt-100' id='h1'>MAKE YOUR OWN</h1>
          <h6 id='h6' className='uppercase'>Real Estate Network</h6>
          <div className='flex justify-center md:justify-start'>
            <button className='border-4 border-white mt-90 md:mt-10 text-white text-xl py-3 flex gap-2 items-center px-6 hover:bg-white hover:text-black uppercase'><MdLocationOn />Get Started</button>
          </div>
        </div>

      </section>
      <section id=''>
        <Search />
      </section>
      <section className='md:px-30'>
        {
          trending && trending.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Trending</h6>
              </div>
              <div className='md:flex md:flex-wrap gap-3 justify-between mt-10'>
                {
                  trending.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10  flex justify-end'>
                <Link to={`/search?package=boost`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='md:px-30'>
        {
          saleListings && saleListings.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Sales</h6>
              </div>
              <div className='md:flex md:flex-wrap gap-3 justify-between mt-10'>
                {
                  saleListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10  flex justify-end'>
                <Link to={`/search?type=sale`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='md:px-30 mt-10 mb-5'>
        {
          rentListings && rentListings.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Rent</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  rentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10 flex justify-end'>
                <Link to={`/search?type=rent`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='bg-white py-10 h-screen mt-20 mb-20'>
        <div className='flex md:px-30 mt-10 mb-5 md:gap-10'>
        <div className='flex-[0.5] flex flex-col justify-between'>
          <h6 className='text-3xl'>Find the Right Contractor for Your Next Property</h6>
          <p className='w-100'>Planning a new build? We make it easy to connect with trusted contractors who specialize in residential and commercial properties. Get your project started with the right hands—reliable, skilled, and ready to deliver. Whether you're constructing a family home, a villa, or a commercial space, our platform helps you compare services, view past work, and choose the perfect fit for your needs. With verified reviews, clear pricing, and easy communication, turning your vision into reality has never been simpler.</p>
          <div>
            <Link to="/contractors">
              <button className='border-2 bg-black text-white hover:bg-white hover:text-black p-3'>Start your search today?</button>
            </Link>
          </div>
        </div>
        <div className='flex-[0.5]'>
          <div className='grid grid-cols-2 gap-3'>
            <img src="assets/banner2.jpg" className='w-100 h-100 object-cover' alt="" />
            <img src="assets/banner3.jpg" className='w-100 h-100 object-cover' alt="" />
            <img src="assets/banner4.jpg" className='w-100 h-100 object-cover' alt="" />
            <img src="assets/banner5.jpg" className='w-100 h-100 object-cover' alt="" />
          </div>
        </div>
        </div>
      </section>
      <section className='md:px-30 mt-10 mb-5'>
        {
          houseListings && houseListings.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Houses</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  houseListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10 flex justify-end'>
                <Link to={`/search?property_type=house`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='md:px-30 mt-10 mb-5'>
        {
          apartmentListings && apartmentListings.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Apartments</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  apartmentListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10 flex justify-end'>
                <Link to={`/search?property_type=apartment`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='md:px-30 mt-10 mb-5'>
        {
          villaListings && villaListings.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Villas</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  villaListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10 flex justify-end'>
                <Link to={`/search?property_type=villa`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
      <section className='md:px-30 mt-10 mb-5'>
        {
          hotelListings && hotelListings.length > 0 && (
            <div className='px-5'>
              <div>
                <h6 className='text-5xl uppercase'>Hotels</h6>
              </div>
              <div className='flex flex-wrap gap-3 justify-between mt-10'>
                {
                  hotelListings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))
                }
              </div>
              <div className='mt-10 flex justify-end'>
                <Link to={`/search?property_type=hotel`}>
                  <button className='p-3 bg-[#959D90] text-white font-bold rounded'>show more</button>
                </Link>
              </div>
            </div>
          )
        }
      </section>
    </main>
  )
}
