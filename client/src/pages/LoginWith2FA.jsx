import React, { useState } from 'react';

export default function LoginWith2FA() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, token }),
            });

            const data = await res.json();
            if (data.success) {
                setMessage('Login successful!');
                localStorage.setItem('token', data.access_token); // Save JWT token
            } else {
                setMessage(data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <div>
            <h1>Login with 2FA</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="2FA Code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="border p-2 rounded"
            />
            <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
                Login
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}