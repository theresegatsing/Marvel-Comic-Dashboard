const CryptoJS = require('crypto-js');

const PUBLIC_KEY = "1233b51f2cbc6f5a0e98a76dd42b57da"; // Marvel's test key
const PRIVATE_KEY = "a9c50750aac33ca8a07487d4b319374097c3850f"; // Marvel's test key
const ts = "1";
const hash = "ffd275c5130566a2916217b101f26150"; // Precomputed hash for ts=1

const testURL = `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

console.log("Final URL:", testURL);

// 4. Make the request
const fetchMarvelData = async () => {
  try {
    const response = await fetch(testURL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    
    if (data.code === 200 && data.data?.results) {
      console.log("Success! First result:", data.data.results[0]?.name);
    } else {
      console.error("API Error:", data);
    }
  } catch (error) {
    console.error("Request Failed:", error.message);
  }
};

fetchMarvelData();