import React, { useState, useEffect } from 'react';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

// Login Component
const LoginPage = ({ setLoginError, error }) => {
  const [email, setEmail] = useState(''); // Ubah dari username ke email
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    // **PENTING:** Buang semakan username hardcoded ini.
    // if (username !== "Hafizveo") {
    //     setLoginError("Username tidak sah.");
    //     setIsLoading(false);
    //     return;
    // }

    try {
        // Guna email dari state (input borang) untuk login Firebase
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error("Firebase Login Error:", err.code, err.message);
        switch (err.code) {
            case "auth/invalid-credential":
                setLoginError("Email atau kata laluan tidak sah."); // Ubah mesej ralat
                break;
            case "auth/user-disabled":
                setLoginError("Akaun anda telah dinyahaktifkan.");
                break;
            default:
                setLoginError("Ralat semasa log masuk. Sila cuba lagi.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-400 mb-2">
            Prompt Enhancer VEO3
          </h1>
          <p className="text-gray-400">Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email" // Ubah ID
              type="email" // Lebih baik guna type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Set state 'email'
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
              placeholder="Enter your email" // Ubah placeholder
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 p-3 rounded-lg text-center text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
        </div>
      </div>
    </div>
  );
};

// Main App component for the Prompt Enhancer (Dashboard)
const PromptEnhancerApp = ({ onLogout, currentUser }) => {
  const [promptBefore, setPromptBefore] = useState('');
  const [promptAfter, setPromptAfter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  const handleEnhancePrompt = async () => {
    setIsLoading(true);
    setError(null);
    setPromptAfter('');
    setCopyFeedback('');

    // Pastikan anda menggunakan REACT_APP_GEMINI_API_KEY di Vercel
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY; // <-- Ini cara yang betul!

    if (!apiKey) {
      setError("Gemini API Key tidak ditemui. Sila semak Environment Variables.");
      setIsLoading(false);
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const instructionPrompt = `You are a creative prompt enhancer. Take the following concise prompt and expand it into a highly detailed, vivid, and descriptive prompt suitable for generating images or scenes, primarily in English. Crucially, any dialogue provided in Malay with slang or accent MUST be preserved exactly as is, without translation or modification. Include sensory details, camera angles, lighting, environment, character appearance, actions, dialogue, and overall mood/vibe. The output should ONLY be the enhanced prompt, without any conversational text or introductions.

Example input: "Perempuan melayu rambut emo gothic style. Tengah ajar cara make-up dgn viewer tiktok dia sambil sia cakap : Salam guys! Kalini aku nak cuba-cuba make style gothic..!"
Example output: "A vertical handheld shot in a softly lit bedroom filled with black lace curtains, band posters, and dim purple LED lights. A young Malay woman with choppy black emo-goth hair, dark eyeliner, and piercings looks straight into her phone camera. She's sitting cross-legged in front of a mirror, makeup brushes and palettes scattered around her. She smiles slightly, raising a compact foundation in one hand and says with casual energy, "Salam guys! Kalini aku nak cuba-cuba make style gothic..!" She begins applying makeup with focused intensity, occasionally glancing at the camera. Background audio hums with lo-fi gothic music, and soft tapping sounds from the brush add to the cozy, intimate TikTok vibe. Her tone is playful but sincere, capturing the aesthetic and attitude of the subculture with a local twist."

Example input: "Buat orang tua melayu naik wheelchair tengah berlumba dengan beca sambil dia cakap : Atuk ada style..!"
Example output: "A bustling street scene in a vibrant Malaysian city. An elderly Malay man with a mischievous grin, wearing a traditional songkok, is seated in a motorized wheelchair, expertly maneuvering it through the crowd. Beside him, a colorful trishaw (beca) driver, pedaling furiously, is engaged in a friendly, exhilarating race. The old man leans forward, a twinkle in his eye, and exclaims with a playful wink, "Atuk ada style..!" The sounds of city life, distant laughter, and the rhythmic pedaling of the trishaw fill the air. The atmosphere is lighthearted and full of local charm."

Now, enhance the following prompt: "${promptBefore}"`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: instructionPrompt }] });

    const payload = {
      contents: chatHistory,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setPromptAfter(text);
      } else {
        setError("No enhanced prompt found in the API response. Please try again.");
      }
    } catch (err) {
      console.error("Error enhancing prompt:", err);
      setError(`Failed to enhance prompt: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = promptAfter;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyFeedback('Failed to copy!');
    } finally {
      document.body.removeChild(tempTextArea);
    }
  };

  const handleResetPrompt = () => {
    setPromptBefore('');
    setPromptAfter('');
    setError(null);
    setCopyFeedback('');
    setIsLoading(false);
  };

  const renderHighlightedPrompt = () => {
    if (!promptAfter) return null;

    const parts = promptAfter.split(/((?:"[^"]*")|(?:'[^']*'))/g);

    return parts.map((part, index) => {
        if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
            return (
                <span key={index} className="bg-yellow-700 bg-opacity-50 rounded px-1 py-0.5 text-yellow-200">
                    {part}
                </span>
            );
        }
        return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-700">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-purple-400">
              Prompt Enhancer VEO3
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome, {currentUser}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out text-sm"
          >
            Logout
          </button>
        </div>

        <p className="text-center text-gray-400 mb-8">
          Masukkan prompt ringkas, dan biarkan AI mengubahnya menjadi penerangan yang kaya dan terperinci.
        </p>

        <div className="mb-6">
          <label htmlFor="prompt-before" className="block text-lg font-medium text-gray-300 mb-2">
            Prompt Sebelum (text to video):
          </label>
          <textarea
            id="prompt-before"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-500 h-32 resize-y"
            placeholder="Contoh: Perempuan melayu rambut emo gothic style. Tengah ajar cara make-up dgn viewer tiktok dia sambil sia cakap : Salam guys! Kalini aku nak cuba-cuba make style gothic..!&#10;Contoh: Buat orang tua melayu naik wheelchair tengah berlumba dengan beca sambil dia cakap : Atuk ada style..!"
            value={promptBefore}
            onChange={(e) => setPromptBefore(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <button
            onClick={handleEnhancePrompt}
            disabled={isLoading || !promptBefore.trim()}
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Enhance Prompt'
            )}
          </button>
          <button
            onClick={handleResetPrompt}
            className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300 ease-in-out w-full sm:w-auto"
          >
            Reset Prompt
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg mb-6 text-center">
            Ralat: {error}
          </div>
        )}

        {promptAfter && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="prompt-after-display" className="block text-lg font-medium text-gray-300">
                Prompt Selepas:
              </label>
              <div className="flex items-center">
                {copyFeedback && (
                  <span className="text-sm text-green-400 mr-2">{copyFeedback}</span>
                )}
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            <div
              id="prompt-after-display"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-gray-200 h-80 resize-y overflow-auto"
            >
              {renderHighlightedPrompt()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App component that handles authentication
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoginError('');
      } else {
        setCurrentUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoginError('');
    } catch (error) {
      console.error("Error signing out:", error);
      setLoginError("Gagal log keluar.");
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex items-center justify-center text-xl">
        Memuatkan autentikasi...
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage setLoginError={setLoginError} error={loginError} />;
  }

  return <PromptEnhancerApp onLogout={handleLogout} currentUser={currentUser.email} />;
};

export default App;