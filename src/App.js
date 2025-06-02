import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app"; // Import initializeApp
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; // Import getAuth

// Firebase configuration (moved from firebase-config.js)
const firebaseConfig = {
  apiKey: "AIzaSyCFzCb1qZoM3Up25VTopNeh7-qEW4HqSeY",
  authDomain: "promptenhancerveo3.firebaseapp.com",
  projectId: "promptenhancerveo3",
  storageBucket: "promptenhancerveo3.firebasestorage.app",
  messagingSenderId: "873932851824",
  appId: "1:873932851824:web:64b82ad6512985650a82b5"
};

// Initialize Firebase (moved from firebase-config.js)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login Component (unchanged)
const LoginPage = ({ setLoginError, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error("Firebase Login Error:", err.code, err.message);
        switch (err.code) {
            case "auth/invalid-credential":
                setLoginError("Email atau kata laluan tidak sah.");
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
            PROMPT ENHANCER {/* Changed from Prompt Enhancer VEO3 */}
          </h1>
          <p className="text-gray-400">Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
              placeholder="Enter your email"
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

// Text-to-Video Enhancer Component (renamed from PromptEnhancerApp)
const TextToVideoEnhancer = ({ onLogout, currentUser }) => {
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

    const apiKey = "AIzaSyCVNAQSIVC1h4rY9r_UsMrJGQK4jFxeYYQ"; // Updated with the provided API key

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const instructionPrompt = `You are a creative prompt enhancer. Take the following concise prompt and expand it into a highly detailed, vivid, and descriptive prompt suitable for generating images or scenes, primarily in English. Crucially, any dialogue provided in Malay with slang or accent MUST be preserved exactly as is, without translation or modification. The output should ONLY be the enhanced prompt, without any conversational text or introductions. Dialogue within the prompt MUST be enclosed in double quotation marks (e.g., "This is dialogue!"), and no other parts of the prompt should be quoted. Include sensory details, camera angles, lighting, environment, character appearance, actions, and overall mood/vibe.

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
    <>
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
    </>
  );
};

// Image-to-Text Enhancer Component
const ImageToTextEnhancer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [enhancedText, setEnhancedText] = useState('');
  const [motionPrompt, setMotionPrompt] = useState(''); // New state for motion prompt
  const [isLoading, setIsLoading] = useState(false);
  const [isMotionLoading, setIsMotionLoading] = useState(false); // New loading state for motion
  const [error, setError] = useState(null);
  const [motionError, setMotionError] = useState(null); // New error state for motion
  const [copyFeedback, setCopyFeedback] = useState('');
  const [motionCopyFeedback, setMotionCopyFeedback] = useState(''); // New copy feedback for motion

  const IMAGE_PROMPT_WRITING_GUIDE = `PROMPT WRITING GUIDE – IMAGE Enchance Prompt
Your Role: You are a good analyze and expert prompt engineer specializing in transforming still images into vivid.
Please Enchance the prompt with the good visual when generate the image.

Final Output Rules:
- Max ~800 characters
- One flowing paragraph
- No introductions or commentary
- Output the prompt only`;

  const MOTION_PROMPT_WRITING_GUIDE = `Prompt: A medium shot frames an old sailor, his knitted blue sailor hat casting a shadow over his eyes, a thick grey beard obscuring his chin. He holds his pipe in one hand, gesturing with it towards the churning, grey sea beyond the ship's railing. "This ocean, it's a force, a wild, untamed might. And she commands your awe, with every breaking light.    
  
Prompt: A detective interrogates a nervous-looking rubber duck. "Where were you on the night of the bubble bath?!" he quacks. Audio: Detective's stern quack, nervous squeaks from rubber duck.    
    
Prompt: A close up of spies exchanging information in a crowded train station with uniformed guards patrolling nearby "The microfilm is in your ticket" he murmured pretending to check his watch "They're watching the north exit" she warned casually adjusting her scarf "Use the service tunnel" Commuters rush past oblivious to the covert exchange happening amid announcements of arrivals and departures.    
    
Based on reference prompt atas. Aku nk jadikan balik prompt mcm atas as guide bila aku nk prompt balik in english. But only tukar dialog dialect in Malay with slang/accent malay must.Format Prompt Guide (Based on Your Examples):
Start: Describe the scene with cinematic framing (e.g., medium shot, close-up).

Subject(s): Mention key characters, their physical features, attire, expressions, props.

Action: Include clear action or gesture.

Dialogue: In dialect Malay, with slang/aksen (e.g. “Aku cakap, jangan main-main dengan sabun tu!”).

Surrounding Atmosphere: Use environmental context (e.g., "commuters rush past," or "churning, grey sea").

Tone: Can range from serious to absurd. Audio cues (optional): wind, screams, announcements, etc.

Important: Dialogue remains in Malay dialect only, everything else in English.

🧠 Memory Saved:
When you say “jadikan balik prompt mcm atas,” I’ll now:

Convert your input into cinematic-style English prompt.

Keep the dialogue in Malay with dialect/slang, as in the examples.

Maintain consistent tone, framing, and action per prompt.

Prioritize realism, clarity, and style (e.g., found footage, noir, theatrical, etc.).`;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setEnhancedText('');
      setMotionPrompt(''); // Clear motion prompt on new image upload
      setError(null);
      setMotionError(null); // Clear motion error
      setCopyFeedback('');
      setMotionCopyFeedback(''); // Clear motion copy feedback
    } else {
      setSelectedImage(null);
      setImagePreview(null);
      setEnhancedText('');
      setMotionPrompt('');
    }
  };

  const handleEnhanceImage = async () => {
    if (!selectedImage) {
      setError("Sila muat naik imej terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEnhancedText('');
    setMotionPrompt(''); // Clear motion prompt when generating new image text
    setCopyFeedback('');

    const apiKey = "AIzaSyCVNAQSIVC1h4rY9r_UsMrJGQK4jFxeYYQ";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = async () => {
      const base64ImageData = reader.result.split(',')[1];

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: IMAGE_PROMPT_WRITING_GUIDE },
              {
                inlineData: {
                  mimeType: selectedImage.type,
                  data: base64ImageData
                }
              }
            ]
          }
        ],
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
          setEnhancedText(text);
        } else {
          setError("Tiada penerangan imej ditemui dalam respons API. Sila cuba lagi.");
        }
      } catch (err) {
        console.error("Error enhancing image:", err);
        setError(`Gagal mempertingkatkan imej: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  };

  const handleMotionPrompt = async () => {
    if (!enhancedText) {
      setMotionError("Sila hasilkan prompt imej terlebih dahulu.");
      return;
    }

    setIsMotionLoading(true);
    setMotionError(null);
    setMotionPrompt('');
    setMotionCopyFeedback('');

    const apiKey = "AIzaSyCVNAQSIVC1h4rY9r_UsMrJGQK4jFxeYYQ";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const instructionPrompt = `${MOTION_PROMPT_WRITING_GUIDE}\n\nInput prompt to animate: "${enhancedText}"`;

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
        setMotionPrompt(text);
      } else {
        setMotionError("Tiada prompt gerakan ditemui dalam respons API. Sila cuba lagi.");
      }
    } catch (err) {
      console.error("Error generating motion prompt:", err);
      setMotionError(`Gagal menjana prompt gerakan: ${err.message}`);
    } finally {
      setIsMotionLoading(false);
    }
  };

  const copyToClipboard = (textToCopy, setFeedback) => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      setFeedback('Copied!');
      setTimeout(() => setFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setFeedback('Failed to copy!');
    } finally {
      document.body.removeChild(tempTextArea);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setEnhancedText('');
    setMotionPrompt(''); // Clear motion prompt on reset
    setError(null);
    setMotionError(null); // Clear motion error on reset
    setCopyFeedback('');
    setMotionCopyFeedback(''); // Clear motion copy feedback on reset
    setIsLoading(false);
    setIsMotionLoading(false); // Reset motion loading state
  };

  return (
    <>
      <p className="text-center text-gray-400 mb-8">
        Masukkan gambar
      </p>

      <div className="mb-6">
        <label htmlFor="image-upload" className="block text-lg font-medium text-gray-300 mb-2">
          Muat Naik Imej:
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
        />
        {imagePreview && (
          <div className="mt-4 flex justify-center">
            <img src={imagePreview} alt="Image Preview" className="max-w-full h-auto rounded-lg shadow-lg max-h-64 object-contain" />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <button
          onClick={handleEnhanceImage}
          disabled={isLoading || !selectedImage}
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Submit'
          )}
        </button>
        <button
          onClick={handleReset}
          className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300 ease-in-out w-full sm:w-auto"
        >
          Reset
        </button>
        <button
          onClick={handleMotionPrompt}
          disabled={isMotionLoading || !enhancedText} /* Disabled when no enhancedText */
          className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
        >
          {isMotionLoading ? (
            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Motion'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg mb-6 text-center">
          Ralat: {error}
        </div>
      )}

      {enhancedText && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="enhanced-text-display" className="block text-lg font-medium text-gray-300">
              Prompt Selepas (Image to Text):
            </label>
            <div className="flex items-center">
              {copyFeedback && (
                <span className="text-sm text-green-400 mr-2">{copyFeedback}</span>
              )}
              <button
                onClick={() => copyToClipboard(enhancedText, setCopyFeedback)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <div
            id="enhanced-text-display"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-gray-200 h-80 resize-y overflow-auto"
          >
            {enhancedText}
          </div>

          {motionError && (
            <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg mt-6 text-center">
              Ralat Gerakan: {motionError}
            </div>
          )}

          {motionPrompt && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="motion-prompt-display" className="block text-lg font-medium text-gray-300">
                  Prompt Gerakan:
                </label>
                <div className="flex items-center">
                  {motionCopyFeedback && (
                    <span className="text-sm text-green-400 mr-2">{motionCopyFeedback}</span>
                  )}
                  <button
                    onClick={() => copyToClipboard(motionPrompt, setMotionCopyFeedback)}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div
                id="motion-prompt-display"
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none text-gray-200 h-80 resize-y overflow-auto"
              >
                {motionPrompt}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};


// Main App component that handles authentication and tab switching
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('text-to-video'); // State for active tab

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-700">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-purple-400">
              PROMPT ENHANCER {/* Changed from Prompt Enhancer VEO3 */}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome, {currentUser.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab('text-to-video')}
            className={`px-6 py-3 rounded-l-lg font-semibold transition duration-300 ease-in-out ${
              activeTab === 'text-to-video'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Text to Video
          </button>
          <button
            onClick={() => setActiveTab('image-to-text')}
            className={`px-6 py-3 rounded-r-lg font-semibold transition duration-300 ease-in-out ${
              activeTab === 'image-to-text'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Image to Text
          </button>
        </div>

        {/* Conditional rendering based on active tab */}
        {activeTab === 'text-to-video' ? (
          <TextToVideoEnhancer onLogout={handleLogout} currentUser={currentUser.email} />
        ) : (
          <ImageToTextEnhancer />
        )}
      </div>
    </div>
  );
};

export default App;
