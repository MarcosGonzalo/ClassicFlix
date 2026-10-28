import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NUEVO: Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/movies.json')
      .then(response => response.json())
      .then(data => {
        setMovies(data);

        // --- SISTEMA DE RECOMENDACIONES LOCAL ---
        const fullHistory = JSON.parse(localStorage.getItem('classicflix_history')) || [];
        if (fullHistory.length > 0) {
          const recentHistory = fullHistory.slice(0, 5);
          const categoryCounts = {};
          recentHistory.forEach(item => {
            categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
          });
          
          let topCategory = recentHistory[0].category; 
          let maxCount = 0;
          
          recentHistory.slice().reverse().forEach(item => {
            const cat = item.category;
            if (categoryCounts[cat] >= maxCount) {
              maxCount = categoryCounts[cat];
              topCategory = cat;
            }
          });

          const recommended = data.filter(movie => 
            movie.category === topCategory && movie.id !== recentHistory[0].id
          );
          setRecommendedMovies(recommended);
        }
        setLoading(false);
      })
      .catch(error => console.error("Error cargando el catálogo local:", error));
  }, []);

  // NUEVO: Lógica de filtrado por búsqueda
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NUEVO: Agrupar películas por categoría dinámicamente
  const moviesByCategory = filteredMovies.reduce((acc, movie) => {
    if (!acc[movie.category]) acc[movie.category] = [];
    acc[movie.category].push(movie);
    return acc;
  }, {});

  if (loading) {
    return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando ClassicFlix...</h2>;
  }

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      
      {/* BARRA DE BÚSQUEDA */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="Buscar películas por título..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: '12px 20px',
            borderRadius: '30px',
            border: 'none',
            backgroundColor: '#333',
            color: 'white',
            fontSize: '1rem',
            outline: 'none'
          }}
        />
      </div>

      {/* SECCIÓN DE RECOMENDADOS (Se oculta si el usuario está usando el buscador) */}
      {recommendedMovies.length > 0 && searchTerm === '' && (
        <div style={{ 
          marginBottom: '50px', padding: '20px', backgroundColor: '#222', 
          borderRadius: '8px', borderLeft: '5px solid #E50914' 
        }}>
          <h2 style={{ color: 'white', margin: '0 0 20px 0', fontSize: '1.5rem' }}>🌟 Recomendados para ti</h2>
          <p style={{ color: '#aaa', marginTop: '-15px', marginBottom: '20px', fontSize: '0.9rem' }}>
            Basado en tu interés por la categoría: <strong>{recommendedMovies[0]?.category}</strong>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {recommendedMovies.map(movie => (
              <MovieCard key={`rec-${movie.id}`} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* CATÁLOGO GENERAL AGRUPADO POR CATEGORÍAS */}
      {Object.keys(moviesByCategory).length === 0 ? (
        <h3 style={{ color: 'white', textAlign: 'center' }}>No se encontraron películas.</h3>
      ) : (
        Object.keys(moviesByCategory).map(category => (
          <div key={category} style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#e5e5e5', 
              borderBottom: '1px solid #333', 
              paddingBottom: '10px',
              marginBottom: '20px', 
              fontSize: '1.4rem' 
            }}>
              {category}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {moviesByCategory[category].map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;