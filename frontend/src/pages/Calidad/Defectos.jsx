import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import defectoService from '../../services/defectoService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import DefectoForm from './DefectoForm';
import Select from '../../components/common/Select';

const Defectos = () => {
  const [defectos, setDefectos] = useState([]);
  const [catalogos, setCatalogos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDefecto, setSelectedDefecto] = useState(null);
  const [filters, setFilters] = useState({
    fechaInicio: format(new Date(), 'yyyy-MM-dd'),
    fechaFin: format(new Date(), 'yyyy-MM-dd'),
    turnoId: '',
    areaProduccionId: '',
    tipoDefectoId: '',
    orderBy: 'fecha_registro',
    orderDir: 'DESC',
  });

  useEffect(() => {
    loadCatalogos();
  }, []);

  useEffect(() => {
    if (catalogos) {
      loadDefectos();
    }
  }, [filters, catalogos]);

  const loadCatalogos = async () => {
    const result = await defectoService.getCatalogos();
    if (result.success) {
      setCatalogos(result.data);
    }
  };

  const loadDefectos = async () => {
    setLoading(true);
    const result = await defectoService.getDefectos(filters);
    if (result.success) {
      setDefectos(result.data);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setSelectedDefecto(null);
    setShowModal(true);
  };

  const handleEdit = (defecto) => {
    setSelectedDefecto(defecto);
    setShowModal(true);
  };

  const handleDelete = async (defecto) => {
    const confirmed = window.confirm(
      `¿Está seguro que desea eliminar este registro de defecto?`
    );

    if (confirmed) {
      const result = await defectoService.deleteDefecto(defecto.id);
      if (result.success) {
        alert(result.message);
        loadDefectos();
      } else {
        alert(result.message);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    loadDefectos();
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    {
      header: 'Fecha',
      render: (row) => format(new Date(row.fecha_registro), 'dd/MM/yyyy HH:mm'),
    },
    {
      header: 'Turno',
      accessor: 'turno_nombre',
    },
    {
      header: 'Área',
      accessor: 'area_produccion_nombre',
    },
    {
      header: 'Tipo de Defecto',
      accessor: 'tipo_defecto_nombre',
    },
    {
      header: 'Pares Rechazados',
      render: (row) => (
        <span className="font-semibold text-red-600">{row.pares_rechazados}</span>
      ),
    },
    {
      header: 'Observaciones',
      render: (row) => (
        <span className="text-sm">{row.observaciones || 'N/A'}</span>
      ),
    },
    {
      header: 'Registrado por',
      accessor: 'nombre_completo_usuario',
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
              handleDelete(row);
            }}
            className="text-red-600 hover:text-red-800"
            title="Eliminar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  if (!catalogos) {
    return <Loading message="Cargando catálogos..." />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Registro de Defectos</h1>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              name="fechaInicio"
              value={filters.fechaInicio}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              name="fechaFin"
              value={filters.fechaFin}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <Select
            label="Turno"
            name="turnoId"
            value={filters.turnoId}
            onChange={handleFilterChange}
            options={catalogos?.turnos?.map((t) => ({ value: t.id, label: t.nombre })) || []}
            placeholder="Todos"
          />
          <Select
            label="Área"
            name="areaProduccionId"
            value={filters.areaProduccionId}
            onChange={handleFilterChange}
            options={catalogos?.areasProduccion?.map((a) => ({ value: a.id, label: a.nombre })) || []}
            placeholder="Todas"
          />
          <Select
            label="Tipo de Defecto"
            name="tipoDefectoId"
            value={filters.tipoDefectoId}
            onChange={handleFilterChange}
            options={catalogos?.tiposDefecto?.map((t) => ({ value: t.id, label: t.nombre })) || []}
            placeholder="Todos"
          />
        </div>
      </Card>

      {/* Tabla */}
      <Card
        actions={<Button onClick={handleCreate}>Registrar Defecto</Button>}
      >
        {loading ? <Loading /> : <Table columns={columns} data={defectos} />}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDefecto ? 'Editar Registro' : 'Registrar Defecto'}
        size="medium"
      >
        <DefectoForm
          defecto={selectedDefecto}
          catalogos={catalogos}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Defectos;
