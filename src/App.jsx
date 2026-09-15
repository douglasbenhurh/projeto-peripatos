import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Obra from './pages/Obra';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminObraForm from './pages/AdminObraForm';
import LabelGenerator from './pages/LabelGenerator';
import ProtectedRoute from './components/ProtectedRoute';
import ScanPage from './pages/ScanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/obra" element={<Obra />} />
        <Route path="/login" element={<Login />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/nova-obra"
          element={
            <ProtectedRoute>
              <AdminObraForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editar/:id"
          element={
            <ProtectedRoute>
              <AdminObraForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/etiqueta"
          element={
            <ProtectedRoute>
              <LabelGenerator />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <Layout>
      <div className="text-center py-12">
        <h2 className="text-xl font-serif font-bold text-brand-green mb-4">Bem-vindo</h2>
        <p className="mb-6 text-gray-600">Aponte sua câmera para o QR Code de uma obra para iniciar a experiência.</p>
        <div className="inline-block p-4 border-2 border-dashed border-brand-yellow rounded-lg bg-yellow-50">
          <Link to="/scan" className="text-4xl no-underline" role="img" aria-label="camera">📷</Link>
        </div>
        <div className="mt-4">
          <Link to="/scan" className="text-brand-green font-bold hover:underline">
            Abrir Scanner
          </Link>
        </div>
      </div>
    </Layout>
  );
}

function Admin() {
  return (
    <Layout>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Painel Administrativo</h2>
        <p>Área restrita.</p>
      </div>
    </Layout>
  );
}

export default App;
