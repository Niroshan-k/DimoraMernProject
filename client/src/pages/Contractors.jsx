import React, { useEffect, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';
import Post from '../components/Post';

export default function Contractors() {
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [postsData, setPostData] = useState([]);
  const [searchData, setSearchData] = useState({
    searchTerm: '',
    sort: 'createdAt',
    order: 'desc',
    location: ''
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/posting/get');
        const data = await res.json();
        setPostData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'searchTerm') {
      setSearchData({ ...searchData, searchTerm: value });
    }
    if (id === 'location') {
      setSearchData({ ...searchData, location: value });
    }
    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSearchData({ ...searchData, sort: sort || 'createdAt', order: order || 'desc' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', searchData.searchTerm);
      urlParams.set('order', searchData.order);
      urlParams.set('sort', searchData.sort);
      urlParams.set('location', searchData.location);
      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/posting/get?${searchQuery}`);
      const data = await res.json();
      setPostData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log(postsData);
  return (
    <main>
      <div className='md:flex gap-5'>
        <div className='md:fixed bg-white z-1 md:min-h-screen p-5'>
          <h6 className='mt-20 text-2xl'>Find Your Contractor</h6>
          <form className='mt-5' onSubmit={handleSubmit}>
            <div className='flex flex-col'>
              <span className='text-sm font-bold'>Title:</span>
              <input
                id="searchTerm"
                type="text"
                placeholder="Search..."
                value={searchData.searchTerm}
                onChange={handleChange}
                className="bg-[#E8D9CD] w-full p-3 rounded-sm"
              />
              <span className='text-sm font-bold mt-3'>Location:</span>
              <input
                id="location"
                type="text"
                placeholder="Search by location..."
                value={searchData.location}
                onChange={handleChange}
                className="bg-[#E8D9CD] w-full p-3 rounded-sm"
              />
            </div>
            <div className='flex flex-col mt-3'>
              <span className='text-sm font-bold'>Sort:</span>
              <select
                className='bg-[#E8D9CD] p-3 rounded'
                id="sort_order"
                onChange={handleChange}
                defaultValue={'createdAt_desc'}
              >
                <option value="price_desc">Price high to low</option>
                <option value="price_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
            <div className='mt-3'>
              <button className='bg-[#523D35] font-bold w-full text-white py-2 px-4 rounded-sm'>
                Search
              </button>
            </div>
          </form>
        </div>
        <div className='md:ml-60 md:p-20 p-10'>
          <div className='flex flex-col gap-5 mt-10'>
            {!loading && postsData.length === 0 && (
              <h1 className='text-4xl mt-5 text-gray-400'>No Listing Found :(</h1>
            )}
            {loading && (
              <div class='flex mt-10 space-x-2 justify-center h-screen'>
                <span class='sr-only'>Loading...</span>
                <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce'></div>
              </div>
            )}
            {!loading && postsData && postsData.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
