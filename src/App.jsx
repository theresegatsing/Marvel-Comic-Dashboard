import { useState, useEffect } from 'react';
import md5 from 'crypto-js/md5';
import './App.css';

const Public_Key = "1233b51f2cbc6f5a0e98a76dd42b57da";
const Private_Key = "a9c50750aac33ca8a07487d4b319374097c3850f";

function App() {
  const [characters, setCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [location, setLocation] = useState('New York, USA');

  // Fetch characters data
  useEffect(() => {
    const fetchMarvelData = async () => {
      const ts = Date.now().toString();
      const hash = md5(ts + Private_Key + Public_Key).toString();
      const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${Public_Key}&hash=${hash}&limit=20`;
      
      try {
        const response = await fetch(url);
        const json = await response.json();
        setCharacters(json.data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMarvelData();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter characters based on search and filter
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filter === 'comics') {
      matchesFilter = character.comics.available > 50;
    } else if (filter === 'series') {
      matchesFilter = character.series.available > 10;
    }
    
    return matchesSearch && matchesFilter;
  });

  // Statistics calculations
  const totalCharacters = characters.length;
  const totalComics = characters.reduce((sum, char) => sum + char.comics.available, 0);
  const avgComics = totalCharacters > 0 ? (totalComics / totalCharacters).toFixed(1) : 0;

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="logo-container">
          <div className="marvel-logo">MarvelDash</div>
        </div>
        
        <nav className="nav-links">
          <span>🏠 Dashboard</span>
          <span>🔍 Search</span>
          <span>ℹ️ About</span>
        </nav>
        
        <div className="location-time">
          <div>{location}</div>
          <div>{currentTime}</div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Characters</h3>
          <p>{totalCharacters}</p>
        </div>
        <div className="stat-card">
          <h3>Total Comics</h3>
          <p>{totalComics}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Comics</h3>
          <p>{avgComics}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Characters</option>
          <option value="comics">Popular (50+ comics)</option>
          <option value="series">Featured (10+ series)</option>
        </select>
      </div>

      {/* Characters Table */}
      <div className="characters-table">
        <div className="table-header">
          <span>Character</span>
          <span>Comics</span>
          <span>Series</span>
          <span>Last Appearance</span>
        </div>
        
        {filteredCharacters.map(character => (
          <div key={character.id} className="character-row">
            <div className="character-info">
              <img 
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`} 
                alt={character.name}
                className="character-image"
              />
              <span>{character.name}</span>
            </div>
            <span>{character.comics.available}</span>
            <span>{character.series.available}</span>
            <span>{character.modified.split('T')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;