import { useState, useRef, useEffect } from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import L from 'leaflet';

export default function UpdatePost() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const params = useParams();
    const mapRef = useRef(null);
    const [formData, setFormData] = useState({
        imageUrls: [],
        title: '',
        description: '',
        location: '',
        years: '',
        months: 0,
        days: 0,
        budget: 0,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    //console.log(params.postId);
    // console.log(currentUser);

    useEffect(() => {
        const fetchListings = async () => {
          const PostId = params.postId;
          const res = await fetch(`/api/posting/get/${PostId}`);
          const data = await res.json();
          if (data.success == false) {
            //console.log(data.message);
            return;
          }
          setFormData(data);
        }
        fetchListings();
      }, []);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 3) {
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
            setImageUploadError('You can only upload 2 images per post (before and after of project)');
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
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 2) {
                setError('Please upload two images');
                return;
            }
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/posting/update/${params.postId}`, {
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
            navigate('/contractor-dashboard');
        } catch (error) {
            setError(error.message);
            setLoading(false);
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
                    const location = data.display_name;
                    setFormData((prev) => ({ ...prev, location }));
                })
                .catch((error) => console.error("Error fetching address:", error));
        });

        return () => map.remove();
    }, []);
    return (
        <main>
            <p>p</p>
            <div className='p-10 max-w-4xl mx-auto'>
                <h6 className='uppercase text-5xl mt-10'>Update Post</h6>
                <form onSubmit={handleSubmit} className='mt-10 flex gap-5 flex-row'>
                    <div className='flex-[0.5] flex flex-col gap-5'>
                        <input onChange={handleChange} value={formData.title} type="text" placeholder='Project Name' className='p-3 bg-[#E8D9CD]' id='title' maxLength='62' minLength='0' />
                        <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='p-3 bg-[#E8D9CD]' id='description' required />
                        <textarea onChange={handleChange} value={formData.location} type="text" placeholder='location' className='p-3 bg-[#E8D9CD]' id='location' required />

                        <div className='justify-between items-center'>
                            <p>Budget</p>
                            <input onChange={handleChange} value={formData.budget} type="number" className='p-3 bg-[#E8D9CD] w-full' id='budget' required />
                        </div>
                        <div>
                            <p>Duration:</p>
                            <div className='flex gap-3'>
                                <div className='items-center'>
                                    <p className='text-sm'>Years</p>
                                    <input onChange={handleChange} value={formData.years} className='p-3 bg-[#E8D9CD] w-2x' type="number" id='years' min='0' max='10' required />
                                </div>
                                <div className='items-center'>
                                    <p className='text-sm'>Months</p>
                                    <input onChange={handleChange} value={formData.months} className='p-3 bg-[#E8D9CD] w-2x' type="number" id='months' min='0' max='12' required />
                                </div>
                                <div className='items-center'>
                                    <p className='text-sm'>Days</p>
                                    <input onChange={handleChange} value={formData.days} className='p-3 bg-[#E8D9CD] w-2x' type="number" id='days' min='0' max='31' required />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-[0.5] flex flex-col justify-between'>

                        <div>
                            <div className='flex gap-3 justify-between'>
                                <input onChange={(e) => setFiles(e.target.files)} className='p-3 bg-[#E8D9CD] w-full' type="file" id='images' accept='image/*' multiple />
                                <button disabled={uploading} onClick={handleImageSubmit} type='button' className='bg-[#959D90] p-3 text-white font-bold uppercase hover:shadow-lg'>{uploading ? 'Uploading' : 'Upload'}</button>
                            </div>
                            <p className='text-red-400 text-sm'>{imageUploadError && imageUploadError}</p>

                            <div className="grid grid-cols-2 gap-4 mt-4">
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
                    <p class="text-sm">Choose your location, click and wait:</p>
                    <div ref={mapRef} className="rounded mb-4 h-96"></div>
                </div>
            </div>
        </main>
    )
}
