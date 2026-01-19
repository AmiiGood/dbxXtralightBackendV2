# Frontend - DBX Xtralight

Frontend desarrollado en React con Vite para el sistema de gestión DBX Xtralight.

## Características

- Autenticación con JWT
- Diseño moderno y responsive
- Manejo de estado global con Context API
- Rutas protegidas
- Integración con backend Express

## Tecnologías

- React 18
- Vite
- React Router DOM
- Axios
- CSS3 (sin librerías externas)

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
```bash
cp .env.example .env
```

3. Edita el archivo `.env` si tu backend está en un puerto diferente:
```
VITE_API_URL=http://localhost:3000/api
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   └── ProtectedRoute.jsx
├── context/          # Contextos de React
│   └── AuthContext.jsx
├── pages/            # Páginas de la aplicación
│   ├── Login.jsx
│   ├── Login.css
│   ├── Dashboard.jsx
│   └── Dashboard.css
├── services/         # Servicios de API
│   └── api.js
├── utils/            # Utilidades
├── App.jsx           # Componente principal
├── main.jsx          # Punto de entrada
└── index.css         # Estilos globales
```

## Uso

### Iniciar Sesión

1. Accede a `http://localhost:5173/login`
2. Ingresa tus credenciales:
   - Usuario: tu nombre de usuario
   - Contraseña: tu contraseña
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido al Dashboard

### Dashboard

El dashboard muestra:
- Información del usuario autenticado
- Rol y área del usuario
- Badge de administrador (si aplica)
- Acciones rápidas (placeholder para futuras funcionalidades)

## Credenciales de Prueba

Usa las credenciales configuradas en tu backend para hacer login.

## Construcción para Producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Vista Previa de Producción

```bash
npm run preview
```

## Conectar con el Backend

Asegúrate de que:

1. El backend esté corriendo en `http://localhost:3000` (o el puerto configurado)
2. La variable `VITE_API_URL` en `.env` apunte al backend correcto
3. El backend tenga CORS configurado para permitir peticiones desde `http://localhost:5173`

## Flujo de Autenticación

1. El usuario ingresa credenciales en el formulario de login
2. Se envía una petición POST a `/api/auth/login`
3. Si las credenciales son correctas, el backend devuelve un token JWT
4. El token se guarda en `localStorage`
5. Se guarda la información del usuario en `localStorage` y en el contexto
6. Se redirige al usuario al Dashboard
7. Las rutas protegidas verifican el token antes de permitir el acceso
8. El token se incluye automáticamente en todas las peticiones mediante interceptores de Axios

## Mejoras Futuras

- Implementar cambio de contraseña desde la UI
- Agregar funcionalidad a las "Acciones Rápidas"
- Implementar manejo de roles y permisos
- Agregar más páginas (reportes, configuración, etc.)
- Implementar refresh token
- Agregar notificaciones toast
- Implementar modo oscuro

## Soporte

Si encuentras algún problema, verifica:

1. Que el backend esté corriendo
2. Que la URL del backend en `.env` sea correcta
3. Que las credenciales sean válidas
4. Que el CORS esté configurado correctamente en el backend
