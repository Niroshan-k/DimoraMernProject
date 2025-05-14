import React, { useState } from 'react';

export default function Verify2FA() {
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const verify2FA = async () => {
        try {
            const res = await fetch('/api/user/enable-2fa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage('2FA has been successfully enabled!');
            } else {
                setMessage(data.message || 'Invalid 2FA token.');
            }
        } catch (error) {
            console.error('Error verifying 2FA token:', error);
            setMessage('An error occurred while verifying the 2FA token.');
        }
    };

    return (
        <div>
            <h1>Verify Two-Factor Authentication</h1>
            <input
                type="text"
                placeholder="Enter 2FA Code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="border p-2 rounded"
            />
            <button onClick={verify2FA} className="bg-green-500 text-white p-2 rounded">
                Verify
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}