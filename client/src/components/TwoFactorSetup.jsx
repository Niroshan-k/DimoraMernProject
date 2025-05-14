import React, { useState } from 'react';

export default function TwoFactorSetup() {
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [message, setMessage] = useState('');

    const generate2FA = async () => {
        try {
            const res = await fetch('/api/user/generate-2fa-secret', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token
                },
            });

            const data = await res.json();
            if (data.success) {
                setQrCodeUrl(data.qrCodeUrl); // Set the QR code URL
            } else {
                setMessage(data.message || 'Failed to generate 2FA secret.');
            }
        } catch (error) {
            console.error('Error generating 2FA secret:', error);
            setMessage('An error occurred while generating the QR code.');
        }
    };

    return (
        <div>
            <h1>Enable Two-Factor Authentication</h1>
            <button onClick={generate2FA} className="bg-blue-500 text-white p-2 rounded">
                Generate QR Code
            </button>
            {qrCodeUrl && (
                <div>
                    <p>Scan this QR code with your authenticator app:</p>
                    <img src={qrCodeUrl} alt="QR Code" />
                </div>
            )}
            {message && <p>{message}</p>}
        </div>
    );
}