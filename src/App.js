import React, { useState } from 'react';

// Main App component for the Prompt Enhancer
const App = () => {
  // State to hold the user's input prompt
  const [promptBefore, setPromptBefore] = useState('');
  // State to hold the enhanced prompt from the API
  const [promptAfter, setPromptAfter] = useState('');
  // State to manage loading status during API calls
  const [isLoading, setIsLoading] = useState(false);
  // State to store any error messages
  const [error, setError] = useState(null);
  // State for copy feedback message
  const [copyFeedback, setCopyFeedback] = useState('');

  /**
   * Handles the prompt enhancement process.
   * Sends the 'promptBefore' to the Gemini API and updates 'promptAfter'.
   */
  const handleEnhancePrompt = async () => {
    setIsLoading(true); // Set loading to true when starting the process
    setError(null); // Clear any previous errors
    setPromptAfter(''); // Clear previous enhanced prompt
    setCopyFeedback(''); // Clear copy feedback

    // API key provided by the user.
    // In a real application, this should be handled more securely (e.g., environment variables).
    const apiKey = "AIzaSyCVNAQSIVC1h4rY9r_UsMrJGQK4jFxeYYQ";
    // Construct the API URL for the Gemini 2.0 Flash model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // The instruction prompt for the Gemini API.
    // Reverted to "highly detailed, vivid, and descriptive" as requested.
    // It still preserves Malay dialogue with slang/accent.
    // Added the new "Example output 2" as requested.
    const instructionPrompt = `You are a creative prompt enhancer. Take the following concise prompt and expand it into a highly detailed, vivid, and descriptive prompt suitable for generating images or scenes, primarily in English. Crucially, any dialogue provided in Malay with slang or accent MUST be preserved exactly as is, without translation or modification. Include sensory details, camera angles, lighting, environment, character appearance, actions, dialogue, and overall mood/vibe. The output should ONLY be the enhanced prompt, without any conversational text or introductions.

Example input: "Perempuan melayu rambut emo gothic style. Tengah ajar cara make-up dgn viewer tiktok dia sambil sia cakap : Salam guys! Kalini aku nak cuba-cuba make style gothic..!"
Example output: "A vertical handheld shot in a softly lit bedroom filled with black lace curtains, band posters, and dim purple LED lights. A young Malay woman with choppy black emo-goth hair, dark eyeliner, and piercings looks straight into her phone camera. She's sitting cross-legged in front of a mirror, makeup brushes and palettes scattered around her. She smiles slightly, raising a compact foundation in one hand and says with casual energy, “Salam guys! Kalini aku nak cuba-cuba make style gothic..!” She begins applying makeup with focused intensity, occasionally glancing at the camera. Background audio hums with lo-fi gothic music, and soft tapping sounds from the brush add to the cozy, intimate TikTok vibe. Her tone is playful but sincere, capturing the aesthetic and attitude of the subculture with a local twist."

Example input: "Buat orang tua melayu naik wheelchair tengah berlumba dengan beca sambil dia cakap : Atuk ada style..!"
Example output: "A bustling street scene in a vibrant Malaysian city. An elderly Malay man with a mischievous grin, wearing a traditional songkok, is seated in a motorized wheelchair, expertly maneuvering it through the crowd. Beside him, a colorful trishaw (beca) driver, pedaling furiously, is engaged in a friendly, exhilarating race. The old man leans forward, a twinkle in his eye, and exclaims with a playful wink, “Atuk ada style..!” The sounds of city life, distant laughter, and the rhythmic pedaling of the trishaw fill the air. The atmosphere is lighthearted and full of local charm."

Now, enhance the following prompt: "${promptBefore}"`;

    // Prepare the chat history for the API request
    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: instructionPrompt }] });

    // Define the payload for the API request
    const payload = {
      contents: chatHistory,
    };

    try {
      // Make the API call to Gemini
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      // Parse the JSON response
      const result = await response.json();

      // Extract the enhanced prompt from the API response
      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setPromptAfter(text); // Update the state with the enhanced prompt
      } else {
        // Handle cases where the response structure is unexpected or content is missing
        setError("No enhanced prompt found in the API response. Please try again.");
      }
    } catch (err) {
      // Catch and display any errors during the API call
      console.error("Error enhancing prompt:", err);
      setError(`Failed to enhance prompt: ${err.message}`);
    } finally {
      setIsLoading(false); // Set loading to false once the process is complete (success or failure)
    }
  };

  /**
   * Copies the content of the promptAfter (plain text) to the clipboard.
   * Provides visual feedback to the user.
   */
  const copyToClipboard = () => {
    // Create a temporary textarea to hold the plain text for copying
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = promptAfter; // Use the plain text from state
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, 99999); // For mobile devices
    try {
      document.execCommand('copy');
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000); // Clear feedback after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyFeedback('Failed to copy!');
    } finally {
      document.body.removeChild(tempTextArea); // Clean up the temporary textarea
    }
  };

  /**
   * Resets both prompt input and output fields, and clears feedback/errors.
   */
  const handleResetPrompt = () => {
    setPromptBefore('');
    setPromptAfter('');
    setError(null);
    setCopyFeedback('');
    setIsLoading(false);
  };

  /**
   * Renders the enhanced prompt with dialogue highlighted.
   * Assumes dialogue is enclosed in smart quotes (“, ”) or standard quotes (", ").
   */
  const renderHighlightedPrompt = () => {
    if (!promptAfter) return null;

    // Regex to find text within smart quotes or standard quotes
    // It captures the quote marks as well to re-include them.
    const parts = promptAfter.split(/((?:“|”|")[^“|”|"]*(?:”|"|))/g);

    return parts.map((part, index) => {
      // Check if the part starts and ends with a quote, indicating dialogue
      if (part.match(/^(?:“|”|").*(?:”|")$/)) {
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
    // Main container for the application, styled with Tailwind CSS for full-screen gradient background
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-sans p-4 sm:p-8 flex items-center justify-center">
      {/* Content wrapper with rounded corners, shadow, and border */}
      <div className="bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-700">
        {/* Application title - Added "VEO3" */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-purple-400">
          Prompt Enhancer VEO3
        </h1>
        {/* Subtitle/description */}
        <p className="text-center text-gray-400 mb-8">
          Masukkan prompt ringkas, dan biarkan AI mengubahnya menjadi penerangan yang kaya dan terperinci.
        </p>

        {/* Section for "Prompt Before" input */}
        <div className="mb-6">
          <label htmlFor="prompt-before" className="block text-lg font-medium text-gray-300 mb-2">
            Prompt Sebelum (text to video):
          </label>
          <textarea
            id="prompt-before"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-500 h-32 resize-y"
            placeholder="Contoh: Perempuan melayu rambut emo gothic style. Tengah ajar cara make-up dgn viewer tiktok dia sambil sia cakap : Salam guys! Kalini aku nak cuba-cuba make style gothic..!&#10;Contoh: Buat orang tua melayu naik wheelchair tengah berlumba dengan beca sambil dia cakap : Atuk ada style..!"
            value={promptBefore}
            onChange={(e) => setPromptBefore(e.target.value)} // Update state on input change
          ></textarea>
        </div>

        {/* Buttons for Enhance and Reset */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <button
            onClick={handleEnhancePrompt}
            // Disable button if loading or if the input prompt is empty
            disabled={isLoading || !promptBefore.trim()}
            className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
          >
            {isLoading ? (
              // Loading spinner SVG
              <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Enhance Prompt' // Button text
            )}
          </button>
          <button
            onClick={handleResetPrompt}
            className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-75 transition duration-300 ease-in-out w-full sm:w-auto"
          >
            Reset Prompt
          </button>
        </div>

        {/* Display error message if any */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 p-4 rounded-lg mb-6 text-center">
            Ralat: {error}
          </div>
        )}

        {/* Section for "Prompt After" output, only visible when there's an enhanced prompt */}
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
                  Copy {/* Changed button text to "Copy" */}
                </button>
              </div>
            </div>
            {/* Replaced textarea with a div for rich text rendering */}
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

export default App;
