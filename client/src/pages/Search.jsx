import React from 'react'

export default function Search() {
  return (
    <div class="container mx-auto py-8 px-4">
        
        <div class="grid grid-cols-5 gap-4 items-center">
            
            <div class="col-span-1 flex items-center justify-center bg-white p-6">
                <h1 class="text-2xl text-left font-serif">
                    Find the perfect property for you
                </h1>
            </div>

            
            <div class="col-span-4 bg-white p-6">
                
                <div class="grid grid-cols-3 gap-4 mb-6">
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
                </div>

                
                <div class="grid grid-cols-5 gap-4 items-center">
                    
                    <div class="col-span-4">
                        <label for="search" class="block text-sm text-gray-600 font-bold">Search</label>
                        <input id="search" type="text" placeholder="Enter your keywords here..." class="w-full bg-brown-50 mt-1 px-4 py-2 rounded-sm" />
                    </div>
                
                    <div class="col-span-1">
                        <button class="w-full mt-6 bg-brown-150 font-bold text-white py-2 px-4 rounded-sm">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
