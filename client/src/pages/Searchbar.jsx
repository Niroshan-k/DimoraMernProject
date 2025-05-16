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
