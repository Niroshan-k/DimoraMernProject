import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useDispatch, } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

export default function AdminDashboard() {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showUserError, setShowUserError] = useState(false);
    const dispatch = useDispatch();
    const [newestUser, setNewestUser] = useState(false);
    const [alerts, setAlerts] = useState([]);

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

        fetchUsers();
    }, [currentUser]);

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

    console.log(alerts);

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

    return (
        <main>a
            <div className='p-10 mt-10'>
                <h6 className='text-5xl'>Users</h6>
                <div className='flex mt-10 gap-10 flex-row justify-between h-200 overflow-scroll'>
                    <div className='w-full'>
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
                            <p className='text-5xl text-gray-400 mx-auto mt-20 col-span-2'>No Users :(</p>
                        )}
                    </div>
                    <div className='w-full'>
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
                                        <div className='flex p-3 justify-end gap-3'>
                                            <Link to={`/dimora/admin-dashboard/user-activities/${user._id}`}>
                                                <button className='bg-[#523D35] py-1 px-3 text-white font-bold rounded'>Activities</button>
                                            </Link>
                                            <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 py-1 px-3 text-white font-bold rounded'>Delete</button>
                                        </div>
                                    </div>
                                ) : null
                            ))
                        ) : (
                            <p className='text-5xl text-gray-400 mx-auto mt-20 col-span-2'>No Users :(</p>
                        )}
                    </div>
                    <div className='w-full'>
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
                                        <div className='flex p-3 justify-end'>
                                            <button onClick={() => handleDeleteUser(user._id)} className='bg-red-500 py-1 px-3 text-white font-bold rounded'>Delete</button>
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
                    <h6 className='mt-10 text-3xl mb-5'>Verify Requests from Users</h6>
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
                    <h6 className='mt-10 text-3xl text-red-600'>Security Alerts</h6>
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
            </div>
        </main>
    );
}
