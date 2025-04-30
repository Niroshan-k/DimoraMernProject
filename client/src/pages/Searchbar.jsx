import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Searchbar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('searchTerm', searchTerm);
            const searchQuery = urlParams.toString();
            navigate(`/search?${searchQuery}`);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search])
    return (
        <div class="container max-w-lg mx-auto py-8">
            <form onSubmit={handleSubmit} class="flex flex-col mt-5 p-6 md:mt-15">
                <h6>Find the perfect property for you</h6>
                <div class="flex gap-5 item-center">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search..."
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        class="flex-[1] bg-[#E8D9CD] p-3 rounded-sm" />
                    <button
                        class="flex-[0.3] bg-[#523D35] font-bold text-white py-2 px-4 rounded-sm">
                        Search
                    </button>
                </div>
            </form>
        </div>
    )
}

{/* <div class="grid grid-cols-3 gap-4 mb-6">
    <div>
        <label for="type" class="block text-sm text-gray-600 font-bold">Type</label>
        <select id="type" class="w-full bg-brown-50 mt-1 px-4 py-2 rounded-sm">
            <option>Luxury House</option>
            <option>Residential House</option>
            <option>Traditional House</option>
            <option>Modern House</option>
        </select>
    </div>
    <div>
        <label for="district" class="block text-sm text-gray-600 font-bold">District</label>
        <select id="district" class="w-full bg-brown-50 mt-1 px-4 py-2 rounded-sm">
            <option>Colombo</option>
            <option>Kandy</option>
            <option>Galle</option>
        </select>
    </div>
    <div>
        <label for="city" class="block text-sm text-gray-600 font-bold">City</label>
        <select id="city" class="w-full bg-brown-50 mt-1 px-4 py-2 rounded-sm">
            <option>City A</option>
            <option>City B</option>
            <option>City C</option>
        </select>
    </div>
</div> */}