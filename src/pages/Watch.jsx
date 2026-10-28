import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // Estado para los comentarios

  useEffect(() => {
    fetch('/movies.json')
      .then(response => response.json())
      .then(data => {
        const foundMovie = data.find(m => m.id === id);
        
        if (foundMovie) {
          setMovie(foundMovie);
          
          // Guardar historial para recomendaciones
          const history = JSON.parse(localStorage.getItem('classicflix_history')) || [];
          const newHistory = history.filter(h => h.id !== foundMovie.id);
          newHistory.unshift({ id: foundMovie.id, category: foundMovie.category });
          localStorage.setItem('classicflix_history', JSON.stringify(newHistory));

          // Cargar comentarios previos de esta película específica
          const savedReviews = JSON.parse(localStorage.getItem(`classicflix_reviews_${id}`)) || [];
          setReviews(savedReviews);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error cargando el video:", error);
        setLoading(false);
      });
  }, [id]);

  // Configuración de Formik y Yup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      comment: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .required('El nombre es obligatorio'),
      email: Yup.string()
        .email('El formato del correo es inválido')
        .required('El correo electrónico es obligatorio'),
      comment: Yup.string()
        .min(10, 'El comentario es muy corto (mínimo 10 caracteres)')
        .required('Debes escribir un comentario')
    }),
    onSubmit: (values, { resetForm }) => {
      // Crear el nuevo comentario con fecha
      const newReview = { 
        ...values, 
        date: new Date().toLocaleDateString() 
      };
      
      // Actualizar el estado y guardar en localStorage
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      localStorage.setItem(`classicflix_reviews_${id}`, JSON.stringify(updatedReviews));
      
      // Limpiar el formulario tras enviar
      resetForm();
    }
  });

  if (loading) {
    return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Cargando reproductor...</h2>;
  }

  if (!movie) {
    return (
      <div style={{ backgroundColor: '#141414', minHeight: '100vh', textAlign: 'center', padding: '50px', color: 'white' }}>
        <h2>Película no encontrada</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '20px' }}>
          Volver al inicio
        </button>
      </div>
    );
  }

  // Estilo reutilizable para los inputs
  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '5px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#333',
    color: 'white'
  };

  // Estilo reutilizable para los mensajes de error de Yup
  const errorStyle = {
    color: '#E50914',
    fontSize: '12px',
    marginBottom: '15px',
    marginTop: '0'
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', padding: '30px', color: 'white', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate('/')}
        style={{ 
          backgroundColor: 'transparent', color: 'white', border: '1px solid #fff', 
          padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold'
        }}
      >
        ← Volver al catálogo
      </button>
      
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <video 
          controls 
          autoPlay
          src={movie.videoUrl} 
          style={{ width: '100%', borderRadius: '8px', backgroundColor: 'black', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
        />
        
        <h1 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '2.5rem' }}>{movie.title}</h1>
        <div style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          <span>{movie.year}</span> <span style={{ margin: '0 10px' }}>|</span> <span>{movie.category}</span>
        </div>
        <p style={{ lineHeight: '1.6', fontSize: '16px', color: '#ddd', marginBottom: '40px' }}>{movie.synopsis}</p>

        {/* SECCIÓN DE RESEÑAS Y FORMULARIO */}
        <hr style={{ borderColor: '#333', marginBottom: '30px' }} />
        <h2>Deja tu reseña</h2>
        
        <form onSubmit={formik.handleSubmit} style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', marginBottom: '40px' }}>
          
          <input
            type="text"
            name="name"
            placeholder="Tu nombre"
            style={inputStyle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? <p style={errorStyle}>{formik.errors.name}</p> : <div style={{marginBottom: '15px'}}></div>}

          <input
            type="email"
            name="email"
            placeholder="Tu correo electrónico"
            style={inputStyle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? <p style={errorStyle}>{formik.errors.email}</p> : <div style={{marginBottom: '15px'}}></div>}

          <textarea
            name="comment"
            placeholder="¿Qué te pareció esta película?"
            rows="4"
            style={{ ...inputStyle, resize: 'vertical' }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.comment}
          />
          {formik.touched.comment && formik.errors.comment ? <p style={errorStyle}>{formik.errors.comment}</p> : <div style={{marginBottom: '15px'}}></div>}

          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#E50914', color: 'white', border: 'none', 
              padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%' 
            }}
          >
            Publicar reseña
          </button>
        </form>

        {/* LISTA DE RESEÑAS GUARDADAS */}
        <h3>Comentarios ({reviews.length})</h3>
        {reviews.length === 0 ? (
          <p style={{ color: '#aaa' }}>Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ color: '#E50914' }}>{review.name}</strong>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{review.date}</span>
              </div>
              <p style={{ margin: 0, color: '#ddd' }}>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Watch;