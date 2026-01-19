import { useState, useEffect } from 'react';
import usuarioService from '../../services/usuarioService';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';

const UsuarioForm = ({ usuario, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    email: '',
    password: '',
    nombreCompleto: '',
    rolId: '',
    areaId: '',
  });
  const [roles, setRoles] = useState([]);
  const [areas, setAreas] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCatalogos();
    if (usuario) {
      setFormData({
        nombreUsuario: usuario.nombreUsuario || '',
        email: usuario.email || '',
        password: '',
        nombreCompleto: usuario.nombreCompleto || '',
        rolId: usuario.rolId || '',
        areaId: usuario.areaId || '',
      });
    }
  }, [usuario]);

  const loadCatalogos = async () => {
    const [rolesResult, areasResult] = await Promise.all([
      usuarioService.getRoles(),
      usuarioService.getAreas(),
    ]);

    if (rolesResult.success) {
      setRoles(rolesResult.data);
    }
    if (areasResult.success) {
      setAreas(areasResult.data);
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

    // Si es edición y no se cambió la contraseña, no enviarla
    const dataToSend = { ...formData };
    if (usuario && !dataToSend.password) {
      delete dataToSend.password;
    }

    const result = usuario
      ? await usuarioService.updateUsuario(usuario.id, dataToSend)
      : await usuarioService.createUsuario(dataToSend);

    if (result.success) {
      alert(result.message);
      onSuccess();
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
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre de Usuario"
        name="nombreUsuario"
        value={formData.nombreUsuario}
        onChange={handleChange}
        required
        error={errors.nombreUsuario}
        disabled={!!usuario}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        error={errors.email}
      />

      <Input
        label={usuario ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required={!usuario}
        error={errors.password}
      />

      <Input
        label="Nombre Completo"
        name="nombreCompleto"
        value={formData.nombreCompleto}
        onChange={handleChange}
        required
        error={errors.nombreCompleto}
      />

      <Select
        label="Rol"
        name="rolId"
        value={formData.rolId}
        onChange={handleChange}
        options={roles.map((rol) => ({ value: rol.id, label: rol.nombre }))}
        required
        error={errors.rolId}
      />

      <Select
        label="Área"
        name="areaId"
        value={formData.areaId}
        onChange={handleChange}
        options={areas.map((area) => ({ value: area.id, label: area.nombre }))}
        required
        error={errors.areaId}
      />

      <div className="flex gap-2 justify-end mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};

export default UsuarioForm;
