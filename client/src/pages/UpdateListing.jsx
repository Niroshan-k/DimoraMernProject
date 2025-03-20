import { useState, useEffect, useRef } from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import L from 'leaflet';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const params = useParams();
  const mapRef = useRef(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'sale',
    parking: false,
    furnished: false,
    bedrooms: 1,
    bathrooms: 1,
    area: 15,
    price: 0,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //console.log(currentUser);

  useEffect(() => {
    const fetchListings = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success == false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    }
    fetchListings();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('Image upload failed (2mb max)');
        setUploading(false);
      });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      )
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({ ...formData, type: e.target.id });
    } else if (e.target.id === 'parking' || e.target.id === 'furnished') {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        setError('Please upload at least one image');
        return;
      }
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate('/seller-dashboard');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([5, 5], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Click event to get location
    map.on("click", function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((response) => response.json())
        .then((data) => {
          const address = data.display_name;
          setFormData((prev) => ({ ...prev, address }));
        })
        .catch((error) => console.error("Error fetching address:", error));
    });

    return () => map.remove();
  }, []);


  return (
    <main className='p-10 max-w-4xl mx-auto'>
      <h6 className='uppercase text-5xl mt-10'>Update Listing</h6>
      <form onSubmit={handleSubmit} className='mt-10 flex flex-col gap-5 sm:flex-row'>
        <div className='flex flex-col gap-4'>
          <input onChange={handleChange} value={formData.name} type="text" placeholder='name' className='p-3 bg-[#E8D9CD]' id='name' maxLength='62' minLength='10' required />
          <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='p-3 bg-[#E8D9CD]' id='description' required />
          <textarea onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='p-3 bg-[#E8D9CD]' id='address' required />

          <div className='flex flex-wrap gap-6 justify-between'>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.type === 'sale'} type="checkbox" id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.parking} type="checkbox" id='parking' className='w-5' />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.furnished} type="checkbox" id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
          </div>

          <div className='flex gap-1 justify-between'>
            <div className='items-center'>
              <p>Bedrooms</p>
              <input onChange={handleChange} value={formData.bedrooms} className='p-3 bg-[#E8D9CD] w-2x' type="number" id='bedrooms' min='1' max='10' required />
            </div>
            <div className='items-center'>
              <p>Bathrooms</p>
              <input onChange={handleChange} value={formData.bathrooms} className='p-3 bg-[#E8D9CD] w-2x' type="number" id='bathrooms' min='1' max='10' required />
            </div>
            <div className='items-center'>
              <p>Area m<sup>2</sup></p>
              <input onChange={handleChange} value={formData.area} className='p-3 bg-[#E8D9CD] w-2x' type="number" id='area' min='15' required />
            </div>
          </div>

          <div className='justify-between items-center'>
            <p>Price <span className='text-xs'>{formData.type === 'rent' ? '($month)' : ''}</span></p>
            <input onChange={handleChange} value={formData.price} type="number" className='p-3 bg-[#E8D9CD] w-full' id='price' required />
          </div>
        </div>
        <div className='flex flex-col justify-between'>
          <div>
            <div className='flex gap-3 justify-between'>
              <input onChange={(e) => setFiles(e.target.files)} className='p-3 bg-[#E8D9CD] w-full' type="file" id='images' accept='image/*' multiple />
              <button disabled={uploading} onClick={handleImageSubmit} type='button' className='bg-[#959D90] p-3 text-white font-bold uppercase hover:shadow-lg'>{uploading ? 'Uploading' : 'Upload'}</button>
            </div>
            <p className='text-red-400 text-sm'>{imageUploadError && imageUploadError}</p>
            <div className='flex'>
              <span className='text-gray-500'>!The first image will be the cover image</span>
            </div>

            <div className="grid grid-cols-3 gap-1 mt-4">
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt="listing image" className="w-full h-32 object-cover" />

                    {/* Delete Icon - Hidden by default, shows on hover */}
                    <button
                      className="absolute inset-0 flex items-center justify-center text-red-700 opacity-0 bg-black bg-opacity-30 group-hover:opacity-80 transition-opacity duration-300"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTrash className="text-2xl" />
                    </button>
                  </div>
                ))}
            </div>

          </div>
          <div>
            <button disabled={loading || uploading} className='bg-[#523D35] mt-3 p-3 text-white font-bold w-full'>{loading ? 'UPDATING...' : 'UPDATE'}</button>
            {error && <p className='text-red-400 text-sm'>{error}</p>}
          </div>
        </div>

      </form>
      <div className='mt-10 shadow-lg'>
        <p class="text-sm">Choose your location, click once and wait:</p>
        <div ref={mapRef} className="rounded mb-4 h-96"></div>
      </div>
    </main>
  )
}
