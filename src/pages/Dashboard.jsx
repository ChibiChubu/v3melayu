// src/pages/Dashboard.jsx (atau src/Dashboard.jsx jika anda letak terus dalam src)

import React, { useEffect, useState } from 'react';
// Penting: Pastikan path ke firebase-config.js betul
// Jika Dashboard.jsx ada di src/pages/ dan firebase-config.js di src/, guna '../firebase-config'
// Jika Dashboard.jsx ada di src/ dan firebase-config.js di src/, guna './firebase-config'
import { auth } from '../firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Import signOut dan onAuthStateChanged
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // State untuk menyimpan maklumat pengguna yang sedang log masuk
    const [user, setUser] = useState(null);
    // State untuk menunjukkan status loading (sedang semak status login)
    const [loading, setLoading] = useState(true);
    // Hook dari react-router-dom untuk navigasi (mengalihkan halaman)
    const navigate = useNavigate();

    // Gunakan useEffect untuk semak status login apabila komponen dimuatkan
    useEffect(() => {
        // onAuthStateChanged adalah listener Firebase yang akan memberitahu kita status login
        // Ini akan dipanggil setiap kali status login berubah (log masuk, log keluar)
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                // Jika ada pengguna yang sedang log masuk, simpan maklumat pengguna
                setUser(currentUser);
            } else {
                // Jika tiada pengguna log masuk, alihkan mereka ke halaman login
                setUser(null);
                navigate('/login');
            }
            setLoading(false); // Selesai loading, paparkan kandungan
        });

        // Clean-up function: penting untuk berhenti mendengar apabila komponen dibuang
        // Ini elakkan memory leak dan masalah lain
        return () => unsubscribe();
    }, [navigate]); // navigate sebagai dependency supaya useEffect re-run jika navigate berubah

    // Fungsi untuk mengendalikan proses log keluar
    const handleLogout = async () => {
        try {
            await signOut(auth); // Log keluar dari Firebase
            navigate('/login'); // Kembali ke halaman login
            alert("Anda telah log keluar.");
        } catch (error) {
            console.error("Ralat semasa log keluar:", error);
            alert("Gagal log keluar. Sila cuba lagi.");
        }
    };

    // Jika masih loading, paparkan mesej "Loading..."
    if (loading) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                minHeight: '100vh', backgroundColor: '#282c34', color: 'white', fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    // Jika tiada pengguna (bermakna sudah dialihkan ke login atau ada masalah), jangan paparkan apa-apa
    if (!user) {
        return null;
    }

    // Jika pengguna sudah log masuk dan bukan loading, paparkan dashboard
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            minHeight: '100vh', backgroundColor: '#282c34', color: 'white', textAlign: 'center'
        }}>
            <h1 style={{ color: '#e0b0ff', marginBottom: '20px' }}>Selamat Datang, Admin Hafiz!</h1>
            <p style={{ fontSize: '18px', marginBottom: '30px' }}>Ini adalah halaman dashboard rahsia anda.</p>
            <p>Email yang digunakan: {user.email}</p>
            <button onClick={handleLogout} style={{
                backgroundColor: '#dc3545', // Warna butang merah
                color: 'white',
                padding: '12px 25px',
                borderRadius: '5px',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
            }}>Log Keluar</button>
        </div>
    );
};

export default Dashboard;