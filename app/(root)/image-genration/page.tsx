'use client';
import React, { useState } from 'react';
import { OpenAI } from 'openai';
import { set } from 'mongoose';

// Create a new OpenAI instance with the API key
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [image, setImage] = useState("https://picsum.photos/200/300");
  const [isLoaded, setIsLoaded] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Async function to fetch the image
  async function fetchData() {
    try {
      setIsLoaded(true);
      const response = await openai.images.generate({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });
      setImage(response?.data[0]?.url || "https://picsum.photos/200/300");
      setIsLoaded(false);
    } catch (e) {
      console.log(e);
      setIsLoaded(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Image Generator</h1>
      <div className="flex gap-4 mb-6">
        <input
          className="border-2 border-blue-500 p-3 rounded-md text-lg focus:outline-none focus:border-blue-700"
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter your prompt'
        />
        <button
          className="bg-blue-500 text-white py-3 px-5 rounded-md text-lg hover:bg-blue-700 transition"
          onClick={fetchData}
        >
          Generate Image
        </button>
      </div>
      <div className="flex flex-col items-center mt-6">
        {isLoaded ? (
          <div>Loading...</div>
        ) : (
          <img src={image} alt="Generated Image" />
        )}
      </div>
    </div>
  );
}

export default App;
