import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>DBX Xtralight</h2>
        </div>
        <div className="nav-actions">
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h1>Bienvenido, {usuario?.nombreCompleto || usuario?.nombreUsuario}!</h1>
          <p className="welcome-subtitle">Has iniciado sesión exitosamente</p>
        </div>

        <div className="user-info-grid">
          <div className="info-card">
            <div className="info-icon">👤</div>
            <div className="info-content">
              <h3>Usuario</h3>
              <p>{usuario?.nombreUsuario}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📧</div>
            <div className="info-content">
              <h3>Email</h3>
              <p>{usuario?.email || 'No disponible'}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🎭</div>
            <div className="info-content">
              <h3>Rol</h3>
              <p>{usuario?.rol?.nombre || 'No disponible'}</p>
              {usuario?.rol?.esAdmin && (
                <span className="admin-badge">Administrador</span>
              )}
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🏢</div>
            <div className="info-content">
              <h3>Área</h3>
              <p>{usuario?.area?.nombre || 'No disponible'}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <button className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-label">Ver Reportes</span>
            </button>
            <button className="action-card">
              <span className="action-icon">⚙️</span>
              <span className="action-label">Configuración</span>
            </button>
            <button className="action-card">
              <span className="action-icon">🔐</span>
              <span className="action-label">Cambiar Contraseña</span>
            </button>
            <button className="action-card">
              <span className="action-icon">📝</span>
              <span className="action-label">Ver Logs</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
