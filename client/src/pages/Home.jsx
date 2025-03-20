import React from 'react'
import './Home.css'
import { FaMapMarker } from 'react-icons/fa'
import Search from './Search'

export default function Home() {
  return (
    <main>
      <section id='banner'>
        <h1 className='mt-100' id='h1'>MAKE YOUR OWN</h1>
        <h6 id='h6'>Real Estate Network</h6>

        <div className='mx-auto mt-70'>
          <button className='bg-[#ffffff] text-black text-2xl rounded-4xl font-bold py-3 flex gap-2 items-center px-6 hover:bg-black hover:text-white'><FaMapMarker />Get Started</button>
        </div>
      </section>
      <section id=''>
        <Search />
      </section>
    </main>
  )
}
