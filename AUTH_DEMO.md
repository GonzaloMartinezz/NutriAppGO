# 🔐 Sistema de Autenticación - NutriApp

## ✅ Implementación Completada

Se ha implementado un sistema completo de **Login y Registro** con las siguientes características:

### 📋 Características del Sistema

#### 1. **Registro de Usuarios**
- **Tipos de Cuenta:**
  - Estudiante
  - Nutricionista
  
- **Campos Requeridos:**
  - Nombre Completo
  - Email
  - Contraseña (mínimo 6 caracteres)
  - Matrícula / Legajo (Ej: EST-12345, NUT-12345)
  - Especialización (Ej: Nutrición Clínica, Nutrición Deportiva)

#### 2. **Determinación de Admin**
- Un usuario es **Admin** si:
  - Es **Nutricionista** Y
  - Su matrícula comienza con "NUT"
  - Ejemplo: NUT-12345 ✅ Es Admin

#### 3. **Login**
- Email y contraseña
- Validación segura
- Persistencia de sesión en localStorage

#### 4. **Protección de Rutas**
- Si no está autenticado → Redirige a Login
- Si está autenticado → Acceso a todas las funcionalidades

### 🧪 Datos de Prueba

#### Crear una cuenta para probar:

**Opción 1: Registro nuevo**
1. Ve a http://localhost:5174
2. Click en "Crear nueva cuenta"
3. Completa el formulario:
   - Nombre: Juan Pérez
   - Tipo: Nutricionista
   - Matrícula: **NUT-12345** (será Admin)
   - Especialización: Nutrición Deportiva
   - Email: juan@nutriapp.com
   - Contraseña: Pass123

**Opción 2: Registro como Estudiante**
1. Nombre: María López
2. Tipo: Estudiante
3. Matrícula: EST-45678
4. Especialización: Nutrición Clínica
5. Email: maria@nutriapp.com
6. Contraseña: Pass123

### 🎯 Funcionalidades Nuevas

✅ **AuthContext** - Gestión centralizada de autenticación
✅ **Auth Page** - Login y Registro en una sola página
✅ **Logout** - Botón en el menú de usuario
✅ **Persistencia** - Los datos de usuarios se guardan en localStorage
✅ **Validaciones** - Email único, contraseñas coincidentes, campos obligatorios
✅ **Responsive Design** - Totalmente adaptado a móvil

### 🔐 Seguridad

⚠️ **Nota:** Este es un sistema de demostración local. En producción:
- Usar autenticación con backend (OAuth, JWT)
- Nunca guardar contraseñas en localStorage
- Implementar HTTPS
- Usar tokens seguros

### 📱 Responsividad Móvil

La pantalla de autenticación es totalmente responsive:
- ✅ Mobile (375px)
- ✅ Tablet (768px)
- ✅ Desktop (1280px+)

### 🚀 Próximas Mejoras

Para completar la aplicación:
1. **Dashboard Admin** - Panel exclusivo para administradores
2. **Gestión de Pacientes** - Asignación por nutricionista
3. **Reportes** - Filtrados por rol
4. **Permisos** - Funcionalidades específicas por rol

### 📝 Archivos Creados/Modificados

**Nuevos:**
- `/src/contexts/AuthContext.jsx` - Lógica de autenticación
- `/src/pages/Auth.jsx` - Componente de Login/Registro
- `/src/styles/auth.css` - Estilos de autenticación

**Modificados:**
- `/src/main.jsx` - Agregado AuthProvider
- `/src/App.jsx` - Protección de rutas y logout
- `/src/components/Settings.jsx` - Integración con AuthContext

### 🔗 URLs de Acceso

```
Desarrollo: http://localhost:5174
Producción: https://nutriappgo.vercel.app
```

---

**¿Listo para probar?** Abre http://localhost:5174 en tu navegador 🎉
