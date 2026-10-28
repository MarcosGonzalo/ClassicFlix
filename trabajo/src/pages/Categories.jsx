import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

const Categories = () => {
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/movies.json')
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        // Extraemos las categorías únicas del JSON y añadimos la opción "Todas" al inicio
        const uniqueCategories = ['Todas', ...new Set(data.map(movie => movie.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(error => console.error("Error cargando categorías:", error));
  }, []);

  if (loading) {
    return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando categorías...</h2>;
  }

  // Lógica de filtrado
  const filteredMovies = selectedCategory === 'Todas' 
    ? movies 
    : movies.filter(movie => movie.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', padding: '30px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: 'white', marginBottom: '30px' }}>Explorar por Categorías</h1>
      
      {/* Botones de filtro dinámicos */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              backgroundColor: selectedCategory === cat ? '#E50914' : '#333',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla de películas filtradas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Categories;