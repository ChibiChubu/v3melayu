import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Jika guna Firestore
// import { ref, onValue } from "firebase/database"; // Jika guna Realtime Database
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const localSessionId = localStorage.getItem('currentSessionId');
                const localUid = localStorage.getItem('uid');

                if (!localSessionId || !localUid || localUid !== currentUser.uid) {
                    // Jika tiada sesi tempatan atau uid tidak sepadan, log keluar paksa
                    await signOut(auth);
                    navigate('/login');
                    return;
                }

                // Semak status sesi dari Firestore
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    if (data.currentSessionId !== localSessionId) {
                        alert("Anda telah log masuk dari peranti lain. Sesi ini akan ditamatkan.");
                        await signOut(auth);
                        navigate('/login');
                        return;
                    }
                } else {
                    // Jika tiada rekod sesi di Firestore, mungkin ada masalah
                    // Atau ini adalah log masuk pertama kali dengan cara baru
                    await signOut(auth);
                    navigate('/login');
                    return;
                }

                setUser(currentUser);
            } else {
                setUser(null);
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            // Sebelum log keluar, kita boleh kosongkan rekod sesi di Firestore
            // Ini tidak wajib jika anda mahu sesi yang terakhir sahaja yang sah
            // Contoh: await setDoc(doc(db, "users", user.uid), { currentSessionId: null }, { merge: true });
            await signOut(auth);
            localStorage.removeItem('currentSessionId');
            localStorage.removeItem('uid');
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return null; // Akan dialihkan ke login
    }

    return (
        <div>
            <h1>Selamat Datang, {user.email}!</h1>
            {/* Kandungan dashboard anda di sini */}
            <button onClick={handleLogout}>Log Keluar</button>
        </div>
    );
};

export default Dashboard;