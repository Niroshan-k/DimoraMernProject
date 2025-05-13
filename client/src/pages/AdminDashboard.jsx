import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminDashboard() {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showUserError, setShowUserError] = useState(false);
    const dispatch = useDispatch();
    const [newestUser, setNewestUser] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [userListings, setUserListings] = useState([]);
    const [listing, setListing] = useState([]);

    useEffect(() => {
        if (!currentUser || !currentUser._id) return;

        const fetchUsers = async () => {
            try {
                setShowUserError(false);
                const res = await fetch(`/api/user/get`);
                const data = await res.json();
                if (data.success === false) {
                    setShowUserError(true);
                    return;
                }
                setUsers(data); // ✅ Ensure it's always an array
            } catch (error) {
                setShowUserError(true);
            }
        };
        // Fetch users every 10 seconds
        const interval = setInterval(fetchUsers, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);

        fetchUsers();
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser || !currentUser._id) return;

        const fetchListing = async () => {
            try {
                setShowUserError(false);
                const res = await fetch(`/api/listing/all`);
                const data = await res.json();
                if (data.success === false) {
                    setShowUserError(true);
                    return;
                }
                setListing(data.listings); // ✅ Ensure it's always an array
            } catch (error) {
                setShowUserError(true);
            }
        };

        fetchListing();
    }, [currentUser]);

    //console.log(users);

    useEffect(() => {
        if (!currentUser || !currentUser._id) return;

        const fetchAlerts = async () => {
            try {
                setShowUserError(false);
                const res = await fetch(`/api/auth/alerts`);
                const data = await res.json();
                if (data.success === false) {
                    setShowUserError(true);
                    return;
                }
                setAlerts(data); // ✅ Ensure it's always an array
            } catch (error) {
                setShowUserError(true);
            }
        };

        fetchAlerts();
    }, [currentUser]);

    const handleDeleteUser = async (id) => {
        try {
            const res = await fetch(`/api/user/admin/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${currentUser.token}`, // Ensure the token is sent
                },
            });
            const data = await res.json();
            if (!data.success) {
                alert(`Failed to delete user: ${data.message || 'Unknown error'}`);
                return;
            }
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
            alert(data.message || 'User deleted successfully!');
        } catch (error) {
            alert(`Error deleting user: ${error.message}`);
            setShowUserError(true);
        }
    };

    const handleNewestUser = (date) => {
        const createdAt = new Date(date);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - createdAt); // Calculate time difference
        const differenceInDays = timeDiff / (1000 * 60 * 60 * 24); // Convert to days
        if (differenceInDays <= 40) {
            return "new"; // Return "new" if the user is created within the last 3 days
        } else {
            return null; // Return an empty string if the user is not new
        }
    };

    // Generate random hex color
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    // Inside your component
    const boostIncome = listing.filter((l) => l.packages === 'boost').length * 20000;
    const normalIncome = listing.filter((l) => l.packages === 'normal').length * 12000;
    const currentMonthIncome = boostIncome + normalIncome;
    const thisMonth = new Date().toLocaleString('default', { month: 'short' });
    const data = [
        { name: 'Jan', income: 56000, color: getRandomColor() },
        { name: 'Feb', income: 44000, color: getRandomColor() },
        { name: 'Mar', income: 68000, color: getRandomColor() },
        { name: 'Apr', income: 62000, color: getRandomColor() },
        { name: thisMonth, income: currentMonthIncome, color: getRandomColor() }, // Dynamically added
    ];

    return (
        <main>a
            <div className='p-10 mt-10'>
                <h1 className='text-5xl font-bold'>Users</h1>
                <div className='flex mt-10 gap-10 flex-row justify-between h-200'>
                    <div className='w-full overflow-scroll'>
                        <h1>Sellers</h1>
                        {users.length > 0 ? (
                            users.map((user) => (
                                user.role === 'seller' ? (
                                    <div key={user._id} className='bg-[#EFEFE9] mt-2 shadow flex flex-col gap-3 rounded'>
                                        {handleNewestUser(user.createdAt) == "new" ?
                                            <div className='flex'>
                                                <p className='text-sm bg-green-400 px-1 rounded-br-lg text-white'>New</p> {/* Show "new" if applicable */}
                                            </div>
                                            :
                                            <p className='p-2'></p>}

                                        <div className='flex p-3 gap-3 items-center'>
                                            <div>
                                                <img
                                                    className='min-h-20 min-w-20 max-w-20 border rounded-full object-cover'
                                                    src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "https://via.placeholder.com/150"}
                                                    alt={`${user?.username || "User"}-avatar`}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1 overflow-hidden'>
                                                <div className='flex items-center gap-3'>
                                                    <h5 className='text-xl'>{user.username}</h5>
                                                    {user.verified == "true" ?
                                                        <img className='w-5' src={'/assets/star.png'} alt="" />
                                                        :
                                                        <img className='w-5' src={'/assets/cross.png'} alt="" />
                                                    }
                                                </div>
                                                <p className='text-xl truncate w-full'>{user.email}</p>

                                            </div>
                                        </div>
                                        <div className='flex p-3 gap-3 items-center justify-between'>
                                            <div>
                                                <button disabled>
                                                    {
                                                        user.loggedIn === "logedin" ?
                                                            <p className='bg-green-400 text-white font-bold py-1 px-3 rounded'>Active</p>
                                                            :
                                                            <p className='bg-red-500 text-white font-bold py-1 px-3 rounded'>Logged Out</p>
                                                    }
                                                </button>
                                            </div>
                                            <div className='flex gap-3 p-3'>
                                                <Link to={`/dimora/admin-dashboard/user-activities/${user._id}`}>
                                                    <button className='bg-[#523D35] py-1 px-3 text-white font-bold rounded'>Activities</button>
                                                </Link>
                                                <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 py-1 px-3 text-white font-bold rounded'>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p className='text-5xl text-gray-400 mx-auto mt-20 col-span-2'>No Users :(</p>
                        )}
                    </div>
                    <div className='w-full overflow-scroll'>
                        <h1>Contractors</h1>
                        {users.length > 0 ? (
                            users.map((user) => (
                                user.role === 'contractor' ? (
                                    <div key={user._id} className='bg-[#EFEFE9] mt-2 shadow flex flex-col gap-3 rounded'>
                                        {handleNewestUser(user.createdAt) == "new" ?
                                            <div className='flex'>
                                                <p className='text-sm bg-green-400 px-1 rounded-br-lg text-white'>New</p> {/* Show "new" if applicable */}
                                            </div>
                                            :
                                            <p className='p-2'></p>}

                                        <div className='flex p-3 gap-3 items-center'>
                                            <div>
                                                <img
                                                    className='h-20 w-20 border rounded-full min-h-20 min-w-20 max-w-20 object-cover'
                                                    src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "https://via.placeholder.com/150"}
                                                    alt={`${user?.username || "User"}-avatar`}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <div className='flex items-center gap-3'>
                                                    <h5 className='text-xl'>{user.username}</h5>
                                                    {user.verified == "true" ?
                                                        <img className='w-5' src={'/assets/star.png'} alt="" />
                                                        :
                                                        <img className='w-5' src={'/assets/cross.png'} alt="" />
                                                    }
                                                </div>
                                                <p className='text-xl'>{user.email}</p>
                                            </div>
                                        </div>
                                        <div className='flex p-3 gap-3 items-center justify-between'>
                                            <div>
                                                <button disabled>
                                                    {
                                                        user.loggedIn === "logedin" ?
                                                            <p className='bg-green-400 text-white font-bold py-1 px-3 rounded'>Active</p>
                                                            :
                                                            <p className='bg-red-500 text-white font-bold py-1 px-3 rounded'>Logged Out</p>
                                                    }
                                                </button>
                                            </div>
                                            <div className='flex gap-3 p-3'>
                                                <Link to={`/dimora/admin-dashboard/user-activities/${user._id}`}>
                                                    <button className='bg-[#523D35] py-1 px-3 text-white font-bold rounded'>Activities</button>
                                                </Link>
                                                <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 py-1 px-3 text-white font-bold rounded'>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p className='text-5xl text-gray-400 mx-auto mt-20 col-span-2'>No Users :(</p>
                        )}
                    </div>
                    <div className='w-full overflow-scroll'>
                        <h1>Customers</h1>
                        {users.length > 0 ? (
                            users.map((user) => (
                                user.role === 'customer' ? (
                                    <div key={user._id} className='bg-[#EFEFE9] mt-2 shadow flex flex-col gap-3 rounded'>
                                        {handleNewestUser(user.createdAt) == "new" ?
                                            <div className='flex'>
                                                <p className='text-sm bg-green-400 px-1 rounded-br-lg text-white'>New</p> {/* Show "new" if applicable */}
                                            </div>
                                            :
                                            <p className='p-2'></p>}
                                        <div className='flex p-3 gap-3 items-center'>
                                            <div>
                                                <img
                                                    className='h-20 w-20 border rounded-full min-h-20 min-w-20 max-w-20 object-cover'
                                                    src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "https://via.placeholder.com/150"}
                                                    alt={`${user?.username || "User"}-avatar`}
                                                />
                                            </div>
                                            <div className='flex flex-col gap-1 overflow-hidden'>
                                                <h5 className='text-xl'>{user.username}</h5>
                                                <p className='text-xl truncate'>{user.email}</p>
                                            </div>
                                        </div>
                                        <div className='flex p-3 gap-3 items-center justify-between'>
                                            <div>
                                                <button disabled>
                                                    {
                                                        user.loggedIn === "logedin" ?
                                                            <p className='bg-green-400 text-white font-bold py-1 px-3 rounded'>Active</p>
                                                            :
                                                            <p className='bg-red-500 text-white font-bold py-1 px-3 rounded'>Logged Out</p>
                                                    }
                                                </button>
                                            </div>
                                            <div className='flex gap-3 p-3'>
                                                <Link to={`/dimora/admin-dashboard/user-activities/${user._id}`}>
                                                    <button className='bg-[#523D35] py-1 px-3 text-white font-bold rounded'>Activities</button>
                                                </Link>
                                                <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 py-1 px-3 text-white font-bold rounded'>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p className='text-5xl text-gray-400 mx-auto mt-20 col-span-2'>No Users :(</p>
                        )}
                    </div>
                </div>
                {showUserError && (
                    <div className='text-red-500 mt-5'>
                        Failed to fetch users. Please try again later.
                    </div>
                )}

                <section>
                    <h1 className='mt-10 text-3xl mb-5 font-bold'>Verify Requests from Users</h1>
                    {users.length > 0 ? (
                        users.map((user) => (
                            user.verified === 'verifying' ? (
                                <div key={user._id} className='bg-[#EFEFE9] mt-2 shadow flex flex-col gap-3 rounded'>
                                    {handleNewestUser(user.createdAt) == "new" ?
                                        <div className='flex'>
                                            <p className='text-sm bg-green-400 px-1 rounded-br-lg text-white'>New</p> {/* Show "new" if applicable */}
                                        </div>
                                        :
                                        <p className='p-2'></p>}

                                    <div className='flex p-3 gap-3 items-center'>
                                        <div>
                                            <img
                                                className='min-h-20 min-w-20 max-w-20 border rounded-full object-cover'
                                                src={user?.avatar && user.avatar.trim() !== "" ? user.avatar : "https://via.placeholder.com/150"}
                                                alt={`${user?.username || "User"}-avatar`}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1 overflow-hidden'>
                                            <h6 className='text-xl'>{user.username}</h6>
                                            <p className='text-xl truncate w-full'>{user.email}</p>
                                        </div>
                                    </div>
                                    <div className='flex gap-3 p-3 justify-end'>
                                        <Link to={`/dimora/admin-dashboard/user-activities/${user._id}`}>
                                            <button className='bg-[#523D35] py-1 px-3 text-white font-bold rounded'>Activities</button>
                                        </Link>
                                        <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 py-1 px-3 text-white font-bold rounded'>Delete</button>
                                    </div>
                                </div>
                            ) : null
                        ))
                    ) : (
                        <p className='text-xl text-gray-400 mx-auto mt-10 col-span-2'>No Verify Requests</p>
                    )}
                </section>
                <section>
                    <h1 className='mt-10 text-3xl text-red-600 font-bold'>Security Alerts</h1>
                    {alerts.length > 0 ? (
                        <table className="table-auto border-collapse border border-gray-300 w-full mt-5">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Email</th>
                                    <th className="border border-gray-300 px-4 py-2">Password</th>
                                    <th className="border border-gray-300 px-4 py-2">Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map((alert) => (
                                    <tr key={alert._id} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{alert.email}</td>
                                        <td className="border border-gray-300 px-4 py-2 truncate">{alert.password}</td>
                                        <td className="border border-gray-300 px-4 py-2">{alert.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-5xl text-gray-400 mx-auto mt-20 col-span-2">No Alerts :(</p>
                    )}
                </section>
                <section>
                    <h1 className='mt-10 text-3xl font-bold'>User Analytics</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
                        {[
                            { title: 'Total Users', count: users.length, color: 'bg-green-500' },
                            { title: 'Total Sellers', count: users.filter(u => u.role === 'seller').length, color: 'bg-blue-500' },
                            { title: 'Total Contractors', count: users.filter(u => u.role === 'contractor').length, color: 'bg-yellow-500' },
                            { title: 'Total Customers', count: users.filter(u => u.role === 'customer').length, color: 'bg-red-500' },
                        ].map(({ title, count, color }, i) => {
                            const percent = Math.min((count / 1000) * 100, 100); // capped at 100%
                            return (
                                <div key={i} className='bg-[#EFEFE9] shadow p-5 rounded space-y-3'>
                                    <h1 className='text-xl font-bold'>{title}</h1>
                                    <p className='text-2xl font-semibold'>{count}</p>
                                    <div className='w-full bg-gray-300 rounded-full h-3 overflow-hidden'>
                                        <div
                                            className={`${color} h-full rounded-full transition-all duration-300`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <p className='text-sm text-gray-500'>{percent.toFixed(1)}% of goal (1000)</p>
                                </div>
                            );
                        })}
                    </div>
                    <p className='mt-10 font-bold'>Boost Package Income</p>
                    <div>
                        <div>

                            {listing.length > 0 ? (
                                <table className="table-auto border-collapse border border-gray-300 w-full mt-5">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 px-4 py-2">Seller Profile</th>
                                            <th className="border border-gray-300 px-4 py-2">Seller Id</th>
                                            <th className="border border-gray-300 px-4 py-2">Listing Id</th>
                                            <th className="border border-gray-300 px-4 py-2">Package</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listing
                                            .filter((list) => list.packages === 'boost') // Filter only "boost" packages
                                            .map((list) => {
                                                // Find the corresponding user for the listing
                                                const seller = users.find((user) => user._id === list.userRef);
                                                return (
                                                    <tr key={list._id} className="text-center">
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {seller?.avatar && seller.avatar.trim() !== "" ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover mx-auto"
                                                                    src={seller.avatar}
                                                                    alt={`${seller.username || "Seller"}'s avatar`}
                                                                />
                                                            ) : (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover mx-auto"
                                                                    src="https://via.placeholder.com/150"
                                                                    alt="Default avatar"
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">{list.userRef}</td>
                                                        <td className="border border-gray-300 px-4 py-2">{list._id}</td>
                                                        <td className="border border-gray-300 px-4 py-2 truncate">{list.packages}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th className="border border-gray-300 px-4 py-2 text-right" colSpan="3">
                                                Total Income
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2">
                                                {`රු. ${listing.filter((list) => list.packages === 'boost').length * 20000}`}
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            ) : (
                                <p className="text-5xl text-gray-400 mx-auto mt-20 col-span-2">No Listing with the boost package :(</p>
                            )}
                        </div>

                        <p className='mt-10 font-bold'>Normal Package Income</p>
                        <table className="table-auto border-collapse border border-gray-300 w-full mt-5">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Seller Profile</th>
                                    <th className="border border-gray-300 px-4 py-2">Seller Id</th>
                                    <th className="border border-gray-300 px-4 py-2">Listing Id</th>
                                    <th className="border border-gray-300 px-4 py-2">Package</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listing
                                    .filter((list) => list.packages === 'normal') // Filter only "boost" packages
                                    .map((list) => {
                                        // Find the corresponding user for the listing
                                        const seller = users.find((user) => user._id === list.userRef);
                                        return (
                                            <tr key={list._id} className="text-center">
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {seller?.avatar && seller.avatar.trim() !== "" ? (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover mx-auto"
                                                            src={seller.avatar}
                                                            alt={`${seller.username || "Seller"}'s avatar`}
                                                        />
                                                    ) : (
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover mx-auto"
                                                            src="https://via.placeholder.com/150"
                                                            alt="Default avatar"
                                                        />
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">{list.userRef}</td>
                                                <td className="border border-gray-300 px-4 py-2">{list._id}</td>
                                                <td className="border border-gray-300 px-4 py-2 truncate">{list.packages}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-right" colSpan="3">
                                        Total Income
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2">
                                        {`රු. ${listing.filter((list) => list.packages === 'normal').length * 12000}`}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
                        {[
                            { title: 'Boost Earning', count: listing.filter((list) => list.packages === 'boost').length* 20000, color: 'bg-blue-500' },
                            { title: 'Normal Earning', count: listing.filter((list) => list.packages === 'normal').length * 12000, color: 'bg-green-500' },
                        ].map(({ title, count, color }, i) => {
                            const percent = Math.min((count / 500000) * 100, 100); // capped at 100%
                            return (
                                <div key={i} className='bg-[#EFEFE9] shadow p-5 rounded space-y-3'>
                                    <h1 className='text-xl font-bold'>{title}</h1>
                                    <p className='text-2xl font-semibold'>{"රු. " + (Number(count) || 0).toLocaleString('en-US')}</p>
                                    <div className='w-full bg-gray-300 rounded-full h-3 overflow-hidden'>
                                        <div
                                            className={`${color} h-full rounded-full transition-all duration-300`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    <p className='text-sm text-gray-500'>{percent.toFixed(1)}% of goal (රු.5,00,000)</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full h-96 mt-10 bg-white p-5 rounded shadow">
                        <h2 className="text-xl font-bold mb-5">Monthly Income</h2>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {/* Render a single Bar component */}
                                <Bar
                                    dataKey="income"
                                    radius={[5, 5, 0, 0]}
                                >
                                    {/* Add random colors for each bar */}
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            </div>
        </main>
    );
}
