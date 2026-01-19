# Frontend - Sistema Centralizado Foam Creations

Frontend desarrollado en React con Vite para el sistema centralizado de gestión empresarial de Foam Creations.

## Características

- **Autenticación JWT**: Sistema de login seguro con tokens
- **Gestión por Roles**: Acceso diferenciado según área y rol del usuario
- **Módulo Admin/TI**: Gestión completa de usuarios del sistema
- **Módulo Calidad**: Registro y seguimiento de defectos de producción
- **Diseño Responsivo**: Interfaz moderna con Tailwind CSS
- **Navegación por Áreas**: Menú dinámico según permisos del usuario

## Tecnologías

- **React 18**: Librería de UI
- **Vite**: Build tool y dev server
- **React Router DOM**: Manejo de rutas
- **Axios**: Cliente HTTP para API
- **Tailwind CSS**: Framework de estilos
- **date-fns**: Manejo de fechas

## Requisitos Previos

- Node.js 16 o superior
- npm o yarn
- Backend corriendo en `http://localhost:3000`

## Instalación

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` si el backend está en otra URL:
```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecución

### Modo Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para Producción
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── common/         # Botones, inputs, tablas, etc.
│   │   └── layout/         # Navbar, Sidebar, Layout
│   ├── contexts/           # Context API (Auth)
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Login/          # Página de login
│   │   ├── Admin/          # Módulo de Admin/TI
│   │   ├── Calidad/        # Módulo de Calidad
│   │   └── Dashboard.jsx   # Página principal
│   ├── services/           # Servicios de API
│   └── App.jsx             # Componente principal
└── README.md
```

## Módulos Disponibles

### 1. Login
- Pantalla de inicio de sesión
- Validación de credenciales
- Almacenamiento seguro de token JWT

### 2. Dashboard
- Página principal después del login
- Información del usuario actual
- Accesos rápidos a módulos disponibles

### 3. Gestión de Usuarios (Admin/TI)
- Listar usuarios del sistema
- Crear nuevos usuarios
- Editar información de usuarios
- Activar/Desactivar usuarios
- Resetear contraseñas

### 4. Registro de Defectos (Calidad)
- Registrar defectos de producción
- Editar registros existentes
- Filtrar por fechas, turno, área y tipo de defecto
- Detección automática de turno actual

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Genera build de producción
- `npm run preview` - Preview del build

---

**Desarrollado para Foam Creations** © 2025
