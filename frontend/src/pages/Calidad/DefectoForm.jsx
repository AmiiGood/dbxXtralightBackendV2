import { useState, useEffect } from 'react';
import defectoService from '../../services/defectoService';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const DefectoForm = ({ defecto, catalogos, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    turnoId: '',
    areaProduccionId: '',
    tipoDefectoId: '',
    paresRechazados: '',
    observaciones: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [turnoActual, setTurnoActual] = useState(null);

  useEffect(() => {
    loadTurnoActual();
    if (defecto) {
      setFormData({
        turnoId: defecto.turno_id || '',
        areaProduccionId: defecto.area_produccion_id || '',
        tipoDefectoId: defecto.tipo_defecto_id || '',
        paresRechazados: defecto.pares_rechazados || '',
        observaciones: defecto.observaciones || '',
      });
    }
  }, [defecto]);

  const loadTurnoActual = async () => {
    const result = await defectoService.getTurnoActual();
    if (result.success) {
      setTurnoActual(result.data);
      if (!defecto) {
        setFormData((prev) => ({ ...prev, turnoId: result.data.id }));
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Convertir a números
    const dataToSend = {
      ...formData,
      turnoId: parseInt(formData.turnoId),
      areaProduccionId: parseInt(formData.areaProduccionId),
      tipoDefectoId: parseInt(formData.tipoDefectoId),
      paresRechazados: parseInt(formData.paresRechazados),
    };

    const result = defecto
      ? await defectoService.updateDefecto(defecto.id, dataToSend)
      : await defectoService.createDefecto(dataToSend);

    if (result.success) {
      onSuccess(result.message); // Pasar el mensaje al componente padre
    } else {
      if (result.errors) {
        const newErrors = {};
        result.errors.forEach((error) => {
          newErrors[error.param] = error.msg;
        });
        setErrors(newErrors);
      } else {
        alert(result.message);
      }
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        label="Turno"
        name="turnoId"
        value={formData.turnoId}
        onChange={handleChange}
        options={catalogos?.turnos?.map((t) => ({ value: t.id, label: t.nombre })) || []}
        required
        error={errors.turnoId}
      />
      {turnoActual && !defecto && (
        <p className="text-sm text-gray-600 -mt-2 mb-4">
          Turno actual detectado: <span className="font-medium">{turnoActual.nombre}</span>
        </p>
      )}

      <Select
        label="Área de Producción"
        name="areaProduccionId"
        value={formData.areaProduccionId}
        onChange={handleChange}
        options={catalogos?.areasProduccion?.map((a) => ({ value: a.id, label: a.nombre })) || []}
        required
        error={errors.areaProduccionId}
      />

      <Select
        label="Tipo de Defecto"
        name="tipoDefectoId"
        value={formData.tipoDefectoId}
        onChange={handleChange}
        options={catalogos?.tiposDefecto?.map((t) => ({ value: t.id, label: t.nombre })) || []}
        required
        error={errors.tipoDefectoId}
      />

      <Input
        label="Pares Rechazados"
        type="number"
        name="paresRechazados"
        value={formData.paresRechazados}
        onChange={handleChange}
        min="1"
        required
        error={errors.paresRechazados}
      />

      <div className="mb-4">
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-1">
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          rows="3"
          maxLength="500"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Observaciones opcionales (máx. 500 caracteres)"
        />
        {errors.observaciones && (
          <p className="mt-1 text-sm text-red-500">{errors.observaciones}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : defecto ? 'Actualizar' : 'Registrar'}
        </Button>
      </div>
    </form>
  );
};

export default DefectoForm;
