# Configuración Backend - NutriApp

## ¿Qué se ha hecho?

Se ha creado un backend completo en Node.js/Express que proporciona:

1. **API REST** con endpoints para:
   - Autenticación (login/registro) con JWT
   - Gestión de pacientes (CRUD)
   - Mediciones antropométricas
   - Gestión de usuarios

2. **Base de datos** con persistencia en JSON (data/users.json y data/patients.json)

3. **Seguridad**:
   - Contraseñas hasheadas con bcryptjs
   - JWT tokens con expiración de 24 horas
   - Middleware de autenticación

4. **Admin automático**: El usuario con rol Nutricionista y matrícula que comienza con "NUT" es automáticamente admin

## Credenciales de Prueba

```
Email: admin@nutriapp.com
Password: adminmartinez
```

## Cómo ejecutar

### 1. Terminal 1 - Backend

```bash
cd D:/Dev/REPOSITORIOS\ VSCODE\ \(GITHUB\ PROYECTOS\)/PROYECTOS\ EN\ PROCESO/NutriAppGO-Backend
npm start
```

El backend estará disponible en `http://localhost:5000`

### 2. Terminal 2 - Frontend

```bash
cd D:/Dev/REPOSITORIOS\ VSCODE\ \(GITHUB\ PROYECTOS\)/PROYECTOS\ EN\ PROCESO/NutriAppGO/.claude/worktrees/nifty-mclean-301c8d
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Cambios en el Frontend

### AuthContext (src/contexts/AuthContext.jsx)

- ✅ Login y registro ahora usan API del backend
- ✅ JWT tokens se guardan en localStorage
- ✅ Token se envía en header Authorization para requests autenticados
- ✅ Usuario se carga desde `/api/auth/me` al iniciar sesión

### Pacientes (src/components/Patients.jsx)

- ✅ Cargar pacientes desde `/api/patients` al montar el componente
- ✅ Crear paciente con POST a `/api/patients`
- ✅ Agregar medición con POST a `/api/patients/:id/anthropometry`

## Estructura del Backend

```
NutriAppGO-Backend/
├── src/
│   ├── server.js                 # Punto de entrada
│   ├── config/
│   │   └── database.js           # Manejo de datos JSON
│   ├── controllers/
│   │   ├── authController.js     # Lógica de auth
│   │   └── patientsController.js # Lógica de pacientes
│   ├── middleware/
│   │   └── auth.js               # Validación de JWT
│   └── routes/
│       ├── auth.js               # Rutas de autenticación
│       └── patients.js           # Rutas de pacientes
├── data/
│   ├── users.json                # BD de usuarios
│   └── patients.json             # BD de pacientes
└── package.json
```

## API Endpoints

### Autenticación

```
POST   /api/auth/register      - Registrar usuario
POST   /api/auth/login         - Login
GET    /api/auth/me            - Usuario actual (requiere token)
PUT    /api/auth/profile       - Actualizar perfil (requiere token)
```

### Pacientes

```
GET    /api/patients                   - Listar pacientes
GET    /api/patients/:id               - Obtener paciente
POST   /api/patients                   - Crear paciente
PUT    /api/patients/:id               - Actualizar paciente
DELETE /api/patients/:id               - Eliminar paciente (admin only)
POST   /api/patients/:id/anthropometry - Agregar medición
```

## Datos Persistidos

- **users.json**: Contiene todos los usuarios registrados
- **patients.json**: Contiene todos los pacientes

Los datos se guardan automáticamente cuando haces cambios.

## Próximas Mejoras (Opcional)

Para producción, considerar:
- Cambiar a MongoDB o PostgreSQL
- Agregar validación adicional
- Implementar refresh tokens
- Agregar más endpoints (reportes, estadísticas)
- Agregar autenticación de 2FA

## Troubleshooting

### Error "CORS"
Si ves errores CORS, asegúrate que:
1. El backend está corriendo en puerto 5000
2. El frontend está en localhost:5173

### Error "Token inválido"
- El token expira después de 24 horas
- Login de nuevo para obtener un nuevo token
- Verifica que localStorage tenga `nutriapp_token`

### Error "Patient not found"
- Verifica que el paciente existe en data/patients.json
- Intenta recargar la página

## Testing con curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nutriapp.com","password":"adminmartinez"}'

# Listar pacientes (reemplaza TOKEN con el token obtenido)
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer TOKEN"

# Crear paciente
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "firstName":"Juan",
    "lastName":"Pérez",
    "dni":"12345678",
    "email":"juan@example.com",
    "phone":"555-1234"
  }'
```

¡Listo! El backend está completamente funcional y conectado con el frontend.
