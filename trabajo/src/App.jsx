import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Categories from './pages/Categories'; // Importamos la nueva vista

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/categorias" element={<Categories />} /> {/* Habilitamos la ruta */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;