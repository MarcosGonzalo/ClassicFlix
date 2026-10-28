import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div style={{ 
      backgroundColor: '#222', 
      borderRadius: '8px', 
      color: 'white', 
      overflow: 'hidden', // Esto hace que la imagen respete los bordes redondeados
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Etiqueta de la imagen de portada */}
      <img 
        src={movie.imageUrl} 
        alt={`Portada de ${movie.title}`} 
        style={{ 
          width: '100%', 
          height: '160px', 
          objectFit: 'cover', 
          backgroundColor: '#333' // Color de fondo por si la imagen tarda en cargar
        }} 
      />
      
      {/* Contenedor de la información (texto y botón) */}
      <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{movie.title}</h3>
        <p style={{ fontSize: '12px', color: '#aaa', margin: '0 0 15px 0', flexGrow: 1 }}>
          {movie.year} • {movie.category}
        </p>
        
        <Link 
          to={`/watch/${movie.id}`} 
          style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: '#E50914',
            color: 'white',
            textDecoration: 'none',
            padding: '10px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Ver ahora
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;