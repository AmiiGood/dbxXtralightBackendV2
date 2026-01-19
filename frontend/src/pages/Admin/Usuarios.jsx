import { useState, useEffect } from 'react';
import usuarioService from '../../services/usuarioService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import UsuarioForm from './UsuarioForm';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [filters, setFilters] = useState({
    activo: true,
  });

  useEffect(() => {
    loadUsuarios();
  }, [filters]);

  const loadUsuarios = async () => {
    setLoading(true);
    const result = await usuarioService.getUsuarios(filters);
    if (result.success) {
      setUsuarios(result.data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setShowModal(true);
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setShowModal(true);
  };

  const handleToggleActive = async (usuario) => {
    const confirmed = window.confirm(
      `¿Está seguro que desea ${usuario.activo ? 'desactivar' : 'activar'} a ${usuario.nombreCompleto}?`
    );

    if (confirmed) {
      const result = usuario.activo
        ? await usuarioService.desactivarUsuario(usuario.id)
        : await usuarioService.activarUsuario(usuario.id);

      if (result.success) {
        alert(result.message);
        loadUsuarios();
      } else {
        alert(result.message);
      }
    }
  };

  const handleResetPassword = async (usuario) => {
    const nuevaPassword = prompt(`Ingrese la nueva contraseña para ${usuario.nombreCompleto}:`);

    if (nuevaPassword && nuevaPassword.length >= 6) {
      const result = await usuarioService.resetPassword(usuario.id, nuevaPassword);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message);
      }
    } else if (nuevaPassword) {
      alert('La contraseña debe tener al menos 6 caracteres');
    }
  };

  const handleFormSuccess = (message) => {
    setShowModal(false);
    loadUsuarios();
    // Mostrar mensaje después de cerrar el modal
    if (message) {
      setTimeout(() => alert(message), 100);
    }
  };

  const columns = [
    {
      header: 'Usuario',
      accessor: 'nombreUsuario',
    },
    {
      header: 'Nombre Completo',
      accessor: 'nombreCompleto',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Rol',
      render: (row) => row.rol?.nombre || 'N/A',
    },
    {
      header: 'Área',
      render: (row) => row.area?.nombre || 'N/A',
    },
    {
      header: 'Estado',
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            row.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="Editar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActive(row);
            }}
            className={row.activo ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
            title={row.activo ? 'Desactivar' : 'Activar'}
          >
            {row.activo ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetPassword(row);
            }}
            className="text-yellow-600 hover:text-yellow-800"
            title="Resetear Contraseña"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>

      <Card
        actions={
          <>
            <Button onClick={handleCreate}>Nuevo Usuario</Button>
            <select
              value={filters.activo}
              onChange={(e) => setFilters({ ...filters, activo: e.target.value === 'true' })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </>
        }
      >
        {loading ? <Loading /> : <Table columns={columns} data={usuarios} />}
      </Card>

      {/* Modal para crear/editar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        size="medium"
      >
        <UsuarioForm
          usuario={selectedUsuario}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Usuarios;
