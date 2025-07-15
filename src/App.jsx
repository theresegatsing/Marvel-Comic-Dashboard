import { useState, useEffect } from 'react';
import md5 from 'crypto-js/md5';

const Public_Key = "1233b51f2cbc6f5a0e98a76dd42b57da";
const Private_Key = "a9c50750aac33ca8a07487d4b319374097c3850f";

function App() {
  const [list, setList] = useState(null);

  useEffect(() => {
    const fetchMarvelData = async () => {
      // Generate a fresh timestamp for each request
      const ts = Date.now().toString();
        
      // Create hash: md5(ts + privateKey + publicKey)
      const hash = md5(ts + Private_Key + Public_Key).toString();

      // Correct URL - added /characters endpoint and fixed query parameters
      const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${Public_Key}&hash=${hash}`; 
      const response = await fetch(url); 
      const json_data = await response.json();
      setList(json_data)
    
    };

    fetchMarvelData();
  }, []);

  return null; 
}

export default App;