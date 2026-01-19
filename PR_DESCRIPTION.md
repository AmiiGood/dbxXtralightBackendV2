# Pull Request: Implementar Frontend con React + Vite para Sistema Centralizado

## 📝 Descripción

Implementación completa del frontend del sistema centralizado usando React 18 y Vite, con dos módulos principales: Admin/TI y Calidad.

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Sistema de login con JWT
- Rutas protegidas con ProtectedRoute
- Manejo automático de sesiones expiradas
- Context API para gestión de estado global de autenticación

### 🎨 UI/UX
- Diseño responsivo con Tailwind CSS v4
- Componentes reutilizables (Button, Input, Select, Table, Modal, Card)
- Layout con Navbar y Sidebar dinámico según permisos
- Loading states y manejo de errores

### 👥 Módulo Admin/TI - Gestión de Usuarios
- ✅ Listar usuarios con filtros (activos/inactivos)
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Activar/Desactivar usuarios
- ✅ Resetear contraseñas
- ✅ Validación de formularios

### 📊 Módulo Calidad - Registro de Defectos
- ✅ Registrar defectos de producción
- ✅ Editar registros existentes
- ✅ Eliminar registros (solo admin)
- ✅ Filtros avanzados (fecha, turno, área, tipo de defecto)
- ✅ Detección automática de turno actual
- ✅ Observaciones opcionales

## 🛠️ Stack Tecnológico

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación y rutas
- **Axios** - Cliente HTTP
- **Tailwind CSS v4** - Framework de estilos
- **date-fns** - Manejo de fechas

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/           # Componentes reutilizables
│   │   └── layout/           # Layout (Navbar, Sidebar)
│   ├── contexts/             # Context API (Auth)
│   ├── pages/                # Páginas
│   │   ├── Login/
│   │   ├── Admin/            # Gestión de usuarios
│   │   ├── Calidad/          # Registro de defectos
│   │   └── Dashboard.jsx
│   ├── services/             # Servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── usuarioService.js
│   │   └── defectoService.js
│   └── App.jsx
└── README.md
```

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3000/api
```

### Backend
Asegurarse de configurar CORS en el backend:
```env
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Instalación y Uso

```bash
# Instalar dependencias
cd frontend
npm install

# Desarrollo
npm run dev

# Build
npm run build
```

## 🐛 Debugging

Se agregaron logs detallados en:
- Flujo de autenticación (login, token storage)
- Interceptores de Axios (requests/responses)
- ProtectedRoute (verificación de autenticación)
- Middleware de autenticación del backend

## 📚 Documentación

- `frontend/README.md` - Documentación del frontend
- `INICIO_RAPIDO.md` - Guía de inicio rápido y troubleshooting

## ✅ Testing Manual

- [x] Login funciona correctamente
- [x] Logout limpia la sesión
- [x] Navegación entre módulos
- [x] CRUD de usuarios (Admin/TI)
- [x] CRUD de defectos (Calidad)
- [x] Filtros y búsquedas
- [x] Validación de formularios
- [x] Manejo de errores

## 📋 Próximos Pasos Sugeridos

- [ ] Agregar paginación en las tablas
- [ ] Implementar reportes y gráficas
- [ ] Exportar datos a Excel/PDF
- [ ] Agregar sistema de notificaciones
- [ ] Implementar cambio de contraseña desde el perfil
- [ ] Dark mode

## 🔗 Commits Incluidos

- `76b5ba9` - Implementar frontend del sistema centralizado con React y Vite
- `5c6eb21` - Actualizar configuración de Tailwind CSS para usar @tailwindcss/postcss
- `2122159` - Actualizar frontend para Tailwind v4 y mejorar manejo de errores
- `51cef78` - Agregar logs detallados para depurar problema de autenticación

---

## 📸 Screenshots

_Agregar screenshots del login, dashboard, gestión de usuarios y registro de defectos_

---

**Desarrollado para Foam Creations** 🎉
