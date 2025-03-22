import React, { useEffect, useState } from 'react'
import Searchbar from './Searchbar'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [sideBarData, setSidebarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        //pool: false,
        sort: 'createdAt',
        order: 'desc',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        //const poolFromUrl = urlParams.get('pool');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            //poolFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                //pool: poolFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',

            });
        }

        const fetchListing = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            setListing(data);
            setLoading(false);
        };
        fetchListing();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
            setSidebarData({ ...sideBarData, type: e.target.id })
        }
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sideBarData, searchTerm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished') {
            setSidebarData({ ...sideBarData, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const [sort, order] = e.target.value.split('_');
            setSidebarData({ ...sideBarData, sort: sort || 'createdAt', order: order || 'desc' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBarData.searchTerm)
        urlParams.set('type', sideBarData.type)
        urlParams.set('parking', sideBarData.parking)
        urlParams.set('furnished', sideBarData.furnished)
        //urlParams.set('pool', sideBarData.pool)
        urlParams.set('order', sideBarData.order)
        urlParams.set('sort', sideBarData.sort)
        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)
    };
    console.log(listing);
    //console.log("Query URL: ", `/api/listing/get?${urlParams.toString()}`);
    return (
        <main>Search
            <div className='flex gap-5 flex-col md:flex-row'>
                <form onSubmit={handleSubmit} className='flex-[0.2]'>
                    <div className='shadow-lg flex flex-col gap-10 md:min-h-full p-6 pt-20'>
                        {/* <Searchbar /> */}
                        <div>
                            <input
                                id="searchTerm"
                                type="text"
                                placeholder="Search..."
                                value={sideBarData.searchTerm}
                                onChange={handleChange}
                                class="bg-[#E8D9CD] w-full p-3 rounded-sm" />
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div>
                                <span className='text-sm font-bold'>Type:</span>
                                <div className='flex gap-2'>
                                    <input type="checkbox" name="all" id="all"
                                        onChange={handleChange}
                                        checked={sideBarData.type === 'all'} />
                                    <span>Rent & Sale</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input type="checkbox" name="rent" id="rent"
                                        onChange={handleChange}
                                        checked={sideBarData.type === 'rent'} />
                                    <span>Rent</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input type="checkbox" name="sale" id="sale"
                                        onChange={handleChange}
                                        checked={sideBarData.type === 'sale'} />
                                    <span>Sale</span>
                                </div>
                            </div>
                            <div>
                                <span className='text-sm font-bold'>Amenities:</span>
                                <div className='flex gap-2'>
                                    <input type="checkbox" name="parking" id="parking"
                                        onChange={handleChange}
                                        checked={sideBarData.parking} />
                                    <span>Parking</span>
                                </div>
                                <div className='flex gap-2'>
                                    <input type="checkbox" name="furnished" id="furnished"
                                        onChange={handleChange}
                                        checked={sideBarData.furnished} />
                                    <span>Furnished</span>
                                </div>
                                {/* <div className='flex gap-2'>
                                    <input type="checkbox" name="pool" id="pool" 
                                    onChange={handleChange}
                                    checked={sideBarData.pool}/>
                                    <span>Pool</span>
                                </div> */}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-sm font-bold'>Sort:</span>
                            <select className='bg-[#E8D9CD] p-3 rounded' name="" id="sort_order"
                                onChange={handleChange} defaultValue={'createdAt_desc'}>
                                <option value="price_desc">Price high to low</option>
                                <option value="price_asc">Price low to high</option>
                                <option value="createdAt_desc">Latest</option>
                                <option value="createdAt_asc">Oldest</option>
                            </select>

                        </div>
                        <div>
                            <button className=' bg-[#523D35] font-bold w-full text-white py-2 px-4 rounded-sm'>search</button>
                        </div>
                    </div>
                </form>
                <div className='flex-[0.80] p-10'>
                    <h6 className='md:mt-20'>Result:</h6>
                    <div className='justify-center'>
                        {!loading && listing.length === 0 && (
                            <h1 className='text-4xl mt-5 text-gray-400'>No Listing Found :(</h1>
                        )}
                        {loading && (
                            <div class='flex space-x-2 justify-center h-screen'>
                                <span class='sr-only'>Loading...</span>
                                <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                <div class='h-4 w-4 bg-gray-400 rounded-full animate-bounce'></div>
                            </div>
                        )}
                        <div>
                            {!loading && listing && listing.map((listing) => (
                                <ListingItem key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
