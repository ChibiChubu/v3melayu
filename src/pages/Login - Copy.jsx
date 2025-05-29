// src/pages/Login.jsx

import React, { useState } from 'react';
// Penting: Pastikan path ke firebase-config.js betul
// Jika firebase-config.js ada di src/, guna '../firebase-config'
// Jika Login.jsx ada di src/pages/ dan firebase-config.js di src/, guna '../firebase-config'
import { auth } from '../firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Semakan username di frontend: HANYA Hafizveo dibenarkan
        if (username !== "Hafizveo") {
            setError("Username tidak sah. Hanya 'Hafizveo' dibenarkan.");
            return;
        }

        // Cuba login ke Firebase dengan email admin dan password yang dimasukkan
        try {
            // SANGAT PENTING: "hafiz@veo.com" MESTI sama dengan email yang anda DAFTAR di Firebase Console!
            await signInWithEmailAndPassword(auth, "hafiz@veo.com", password);

            alert("Log masuk berjaya!");
            navigate('/dashboard'); // Alihkan ke halaman dashboard
        } catch (err) {
            console.error("Ralat semasa log masuk Firebase:", err.code, err.message);

            switch (err.code) {
                case "auth/invalid-credential":
                    setError("Nama pengguna atau kata laluan tidak sah.");
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
                        <label htmlFor="username" style={{
                            display: 'block',
                            textAlign: 'left',
                            marginBottom: '8px',
                            color: '#e0b0ff'
                        }}>Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: 'calc(100% - 20px)',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#444',
                                color: 'white'
                            }}
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: '30px' }}>
                        <label htmlFor="password" style={{
                            display: 'block',
                            textAlign: 'left',
                            marginBottom: '8px',
                            color: '#e0b0ff'
                        }}>Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: 'calc(100% - 20px)',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #555',
                                backgroundColor: '#444',
                                color: 'white'
                            }}
                        />
                    </div>
                    {error && <p className="error-message" style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}
                    <button type="submit" style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#8a2be2',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                    }}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;