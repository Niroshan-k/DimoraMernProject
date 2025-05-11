import { useState, useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { FaTrash, FaSpinner, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const mapRef = useRef(null);
  const [pLoading, setPLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [payment, setPayment] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'sale',
    property_type: 'house',
    parking: false,
    furnished: false,
    bedrooms: 1,
    bathrooms: 1,
    area: 15,
    price: 0,
    urgent: false,
    packages: ''
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  console.log(currentUser);
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
    } else if (e.target.id === 'house' || e.target.id === 'apartment' || e.target.id === 'villa' || e.target.id === 'hotel') {
      setFormData({ ...formData, property_type: e.target.id });
    } else if (e.target.id === 'urgent') {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.packages) {
      setError('Please select a package');
      return;
    }
    else {
      try {
        if (formData.imageUrls.length < 1) {
          setError('Please upload at least one image');
          return;
        }
        setLoading(true);
        setError(false);
        const res = await fetch('/api/listing/create', {
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
    }
  }

  useEffect(() => {
    if (!mapRef.current) return;
    const map = L.map(mapRef.current).setView([7.8731, 80.7718], 8);

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

  const handlePayment = () => {
    setShowForm(true);
    setPLoading(true);
  }

  const handlePaymentSuccess = () => {
    setPayment(true);
    setShowForm(false);
    setPLoading(false);
  }

  return (
    <main className='p-10 max-w-4xl mx-auto'>
      <h6 className='uppercase text-5xl mt-10'>Create Listing</h6>
      <form onSubmit={handleSubmit} className='mt-10 flex flex-col gap-5 sm:flex-row'>
        <div className='flex flex-col gap-4'>
          <input onChange={handleChange} value={formData.name} type="text" placeholder='name' className='p-3 bg-[#E8D9CD]' id='name' maxLength='30' minLength='10' required />
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

          <div className='flex flex-wrap gap-6 justify-between'>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.property_type === 'house'} type="checkbox" id='house' className='w-5' />
              <span>House</span>
            </div>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.property_type === 'apartment'} type="checkbox" id='guest_house' className='w-5' />
              <span>Apartment</span>
            </div>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.property_type === 'villa'} type="checkbox" id='villa' className='w-5' />
              <span>Villa</span>
            </div>
            <div className="flex gap-1">
              <input onChange={handleChange} checked={formData.property_type === 'hotel'} type="checkbox" id='hotel' className='w-5' />
              <span>Hotel</span>
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
            <input
              onChange={handleChange}
              value={formData.price}
              type="number"
              className='p-3 bg-[#E8D9CD] w-full'
              min='10000'
              id='price'
              required
              onKeyDown={(e) => {
                if (["e", "E", "+", "-"].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />

          </div>
        </div>
        <div className='flex flex-col justify-between'>
          <div>
            <div className='flex gap-3 justify-between'>
              <input onChange={(e) => setFiles(e.target.files)} className='p-3 bg-[#E8D9CD] w-full' type="file" id='images' accept='image/*' multiple />
              <button disabled={uploading} onClick={handleImageSubmit} type='button' className='bg-[#959D90] p-3 w-max text-white font-bold uppercase hover:shadow-lg'>{uploading ? <FaSpinner className='mx-auto text-2xl animate-spin' /> : 'Upload'}</button>
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

            <div className='mt-1 p-2 border border-gray-300'>
              <p className='text-sm text-red-500'>Make your Advertisement appear first by using our premium features.</p>
              <div className=''>
                <span className='text-sm flex mt-6'>Choose a Package</span>
                <div className='flex items-center gap-3'>
                  <select
                    id="packages"
                    name="packages"
                    value={formData.packages}
                    onChange={handleChange}
                    required
                    className="bg-[#E8D9CD] h-13 w-full p-3"
                  >
                    <option value="" disabled>
                      Select a Package
                    </option>
                    <option value="normal">Normal</option>
                    <option value="boost">Boost</option>
                  </select>
                  <button onClick={handlePayment} type='button' className='bg-[#959D90] p-3 text-white font-bold uppercase'>
                    {
                      payment ? <FaCheckCircle className='text-[27px]' /> : pLoading ?
                        <FaSpinner className='mx-auto text-2xl animate-spin' />
                        : "Proceed"
                    }
                  </button>
                </div>
              </div>
            </div>

            <div className='flex gap-2 mt-5'>
              <input onChange={handleChange} checked={formData.urgent} type="checkbox" id='urgent' className='w-5' />
              <span className='text-red-500'>Urgent</span>
            </div>
            <p className='text-sm text-green-500'>{formData.urgent ? formData.packages == "normal" || null ? "We recommend to use our boost package if your in a hurry..." : null : null}</p>

            {showForm && (
              <div className='fixed inset-0 shadow-2xl bg-opacity-40 flex justify-center items-center z-50'>
                <div className='bg-white p-6 rounded-lg w-[90%] max-w-md space-y-4 shadow-xl'>
                  <div className='flex justify-between'>
                    <h2 className='font-bold text-lg'>Payment Method</h2>
                    <button onClick={() => {
                      setShowForm(false)
                      setPLoading(false)
                    }
                    }
                      className='text-red-500 font-bold'><FaTimes /></button>
                  </div>

                  <div className='flex gap-5'>
                    <div className='flex items-center gap-3'>
                      <input type="radio" name="card" />
                      <img src={'/assets/visa.png'} className='w-14 rounded' alt="Visa" />
                    </div>
                    <div className='flex items-center gap-3'>
                      <input type="radio" name="card" />
                      <img src={'/assets/master.png'} className='w-14 rounded' alt="MasterCard" />
                    </div>
                  </div>

                  <input className='p-3 bg-[#E8D9CD] rounded-lg w-full' placeholder='Holder’s Name' type="text" />
                  <input className='p-3 bg-[#E8D9CD] rounded-lg w-full' placeholder='Card Number' type="text" />
                  <div className='flex gap-2'>
                    <input className='p-3 bg-[#E8D9CD] w-full rounded-lg' placeholder='CVV' type="text" />
                    <input className='p-3 bg-[#E8D9CD] w-full rounded-lg' placeholder='Month' type="text" />
                    <input className='p-3 bg-[#E8D9CD] w-full rounded-lg' placeholder='Year' type="text" />
                  </div>
                  <div>
                    <button onClick={handlePaymentSuccess} className='bg-blue-400 rounded-lg text-white p-3 w-full font-bold' type='button'>Make a Payment</button>
                  </div>
                </div>
              </div>
            )}

          </div>
          <div>
            <button disabled={loading || uploading} className='bg-[#523D35] mt-3 p-3 text-white font-bold w-full'>{loading ? 'POSTING...' : 'POST'}</button>
            {error && <p className='text-red-400 text-sm'>{error}</p>}
          </div>
        </div>

      </form>
      <div className='mt-10 shadow-lg'>
        <p class="text-sm">Choose your location, click once and wait:</p>
        <div ref={mapRef} className="rounded mb-4 h-96 z-0"></div>
      </div>
    </main>
  )
}
