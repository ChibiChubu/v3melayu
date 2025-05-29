import React, { useState } from 'react';
import { auth } from '../firebase-config'; // Import auth dari firebase-config.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Untuk paparan ralat
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Kosongkan ralat sebelumnya

        // Ini adalah bahagian paling kritikal:
        // Hanya benarkan username "Hafizveo" (atau email admin yang anda daftar di Firebase)
        // Walaupun user masukkan "Hafizveo", kita akan cuba login guna email admin yang sebenar
        // yang anda daftar di Firebase (contoh: hafiz@veo.com)
        // Ini hanyalah logik di frontend untuk memastikan hanya 'Hafizveo' boleh cuba login.
        // Firebase akan mengesahkan email dan password sebenar.
        if (username !== "Hafizveo") {
            setError("Username tidak sah.");
            return;
        }

        try {
            // Gunakan email admin yang anda daftarkan di Firebase
            // **Penting:** Gantikan "admin@veo.com" dengan email sebenar akaun admin Firebase anda.
            await signInWithEmailAndPassword(auth, "hafiz@veo.com", password);
            // Jika berjaya login, alihkan ke dashboard atau halaman utama
            navigate('/dashboard'); // Gantikan dengan laluan yang betul selepas login
        } catch (err) {
            console.error("Error logging in:", err.code, err.message);
            // Berikan mesej ralat yang lebih mesra pengguna
            switch (err.code) {
                case "auth/invalid-credential": // or auth/invalid-email, auth/wrong-password
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
        <div className="login-container">
            <div className="login-box">
                <h2>Prompt Enhancer VEO3</h2>
                <p>Please login to continue</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;