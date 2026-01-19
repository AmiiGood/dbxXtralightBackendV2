import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';

const Dashboard = () => {
  const { usuario, isAdmin, hasArea } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Bienvenida */}
      <Card className="mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bienvenido, {usuario?.nombreCompleto}
          </h2>
          <p className="text-gray-600">
            Rol: <span className="font-medium">{usuario?.rol?.nombre}</span>
          </p>
          <p className="text-gray-600">
            Área: <span className="font-medium">{usuario?.area?.nombre}</span>
          </p>
        </div>
      </Card>

      {/* Módulos disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Módulo de Admin/TI */}
        {(isAdmin() || hasArea('TI')) && (
          <Card>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Gestión de Usuarios</h3>
                <p className="text-sm text-gray-600">Administrar usuarios del sistema</p>
              </div>
            </div>
          </Card>
        )}

        {/* Módulo de Calidad */}
        {(hasArea('Calidad') || isAdmin()) && (
          <Card>
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Registro de Defectos</h3>
                <p className="text-sm text-gray-600">Control de calidad de producción</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
