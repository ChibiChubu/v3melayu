// src/pages/Login.jsx

import React, { useState } from 'react';
// Penting: Pastikan path ke firebase-config.js betul
// Jika firebase-config.js ada di src/, guna '../firebase-config'
// Jika Login.jsx ada di src/pages/ dan firebase-config.js di src/, guna '../firebase-config'
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState(''); // ✅ BETUL: Gunakan 'email' state
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // **PENTING:** Buang semakan username hardcoded ini.
        // if (username !== "Hafizveo") {
        //     setError("Username tidak sah. Hanya 'Hafizveo' dibenarkan.");
        //     return;
        // }
        // ✅ BETUL: Bahagian ini telah dikomen, yang bermaksud ia tidak aktif. Ini bagus!

        // Cuba login ke Firebase dengan email dan password yang dimasukkan
        try {
            await signInWithEmailAndPassword(auth, email, password); // ✅ BETUL: Gunakan 'email' dari state
            alert("Log masuk berjaya!");
            navigate('/dashboard'); // Alihkan ke halaman dashboard
        } catch (err) {
            console.error("Ralat semasa log masuk Firebase:", err.code, err.message);

            switch (err.code) {
                case "auth/invalid-credential":
                    setError("Email atau kata laluan tidak sah.");
                    break;
                case "auth/user-disabled":
                    setError("Akaun anda telah dinyahaktifkan.");
                    break;
                default:
                    setError("Ralat semasa log masuk. Sila cuba lagi.");
            }
        }
    };

    return (
        <div className="login-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#282c34',
            color: 'white'
        }}>
            <div className="login-box" style={{
                backgroundColor: '#3a3f4c',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                width: '350px'
            }}>
                <h2 style={{
                    color: '#e0b0ff',
                    marginBottom: '10px'
                }}>Prompt Enhancer VEO3</h2>
                <p style={{
                    color: '#ccc',
                    marginBottom: '30px'
                }}>Please login to continue</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="email" style={{ /* ... */ }}>Email</label> {/* ✅ BETUL: Label 'Email' */}
                        <input
                            type="email" // ✅ BETUL: Type 'email'
                            id="email" // ✅ BETUL: ID 'email'
                            placeholder="Enter your email" // ✅ BETUL: Placeholder 'email'
                            value={email} // ✅ BETUL: Guna 'email' state
                            onChange={(e) => setEmail(e.target.value)} // ✅ BETUL: Set 'email' state
                            required
                            style={{ /* ... */ }}
                        />
                    </div>
                    {/* ... (bahagian password dan error) ... */}
                </form>
            </div>
        </div>
    );
};

export default Login;