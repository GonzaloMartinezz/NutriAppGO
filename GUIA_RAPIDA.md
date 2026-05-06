# ⚡ Guía Rápida - NutriApp con Autenticación

## 🚀 Iniciar

```bash
# En desarrollo
npm run dev
# → http://localhost:5174

# Abrir en navegador
# Verás la pantalla de Login/Registro
```

## 👤 Crear una Cuenta

### Opción Fácil: Copiar y Pegar

**Click en "Crear nueva cuenta" y completa:**

```
Nombre Completo:     Juan Pérez
Tipo de cuenta:      Nutricionista
Matrícula:           NUT-12345
Especialización:     Nutrición Deportiva
Email:               juan@example.com
Contraseña:          Pass123!
Confirmar:           Pass123!
```

**Resultado:** 
- ✅ Cuenta creada
- ✅ Admin automáticamente
- ✅ Acceso inmediato a la app

---

## 🔓 Hacer Login

**En la pantalla de Login:**

```
Email:       juan@example.com
Contraseña:  Pass123!
```

Click en **"Inicia sesión"** → ✅ Acceso

---

## 🎯 Qué Puedes Hacer

### En la App (Después de Login)

| Función | Ubicación | Lo que hace |
|---------|-----------|------------|
| 🏠 Inicio | Menú | Dashboard principal |
| 🧮 Calculadora SARA | Menú | Cálculos nutricionales |
| 👥 Pacientes | Menú | Gestionar pacientes |
| 🍽️ Planes Nutricionales | Menú | Crear planes |
| 📖 Recetario | Menú | Ver recetas |
| 📚 Biblioteca | Menú | Material educativo |
| ⚙️ Configuración | Menú o Avatar | Editar perfil |
| 🌙 Modo Oscuro | Avatar → Menú | Cambiar tema |
| 🚪 Cerrar Sesión | Avatar → Menú | Logout |

---

## 👥 Tipos de Usuarios

### Nutricionista con Admin (NUT-*)
```
Matrícula: NUT-12345 ✅ Admin
```
- Acceso total
- Gestión de pacientes
- Reportes completos

### Estudiante
```
Matrícula: EST-12345 ❌ No Admin
```
- Acceso limitado
- Solo lectura de algunas áreas
- Calculadora y recetario

### Nutricionista sin Admin (MP-*, otros)
```
Matrícula: MP-98765 ❌ No Admin
```
- Acceso limitado
- Sin dashboard admin

---

## 🧪 Pruebas Rápidas

### Test 1: Registro
1. Click "Crear nueva cuenta"
2. Completa todos los campos
3. Click "Crear cuenta"
4. ✅ Deberías estar logueado

### Test 2: Validaciones
1. Intenta registrar con email duplicado → ❌ Error
2. Intenta contraseñas distintas → ❌ Error
3. Intenta contraseña muy corta → ❌ Error

### Test 3: Login
1. Click "Inicia sesión"
2. Ingresa credenciales
3. ✅ Acceso a la app

### Test 4: Logout
1. Click en tu avatar (arriba a la derecha)
2. Click "Cerrar sesión"
3. ✅ Vuelves al Login

### Test 5: Mobile
1. Abre en móvil (o redimensiona navegador a 375px)
2. El formulario debería ser usable
3. Todos los campos visibles
4. Click "Crear cuenta" funciona

---

## 🐛 Problemas Comunes

### "El email ya está registrado"
- ✅ Usa otro email
- O borra localStorage y empieza de nuevo

### "Las contraseñas no coinciden"
- ✅ Verifica que sean idénticas
- Case-sensitive (mayúsculas importan)

### "Contraseña incorrecta"
- ✅ Verifica que sea exacta
- No hay recuperación de contraseña aún

### No aparece el Login
- ✅ Limpia localStorage: `localStorage.clear()`
- Recarga: `Ctrl+Shift+R` (refresh forzado)

---

## 🔑 Datos de Prueba Listos

### Pre-configurado en localStorage:

Si ejecutas `localStorage.getItem('nutri_users')` en consola, verás todos los usuarios registrados.

---

## 📱 Responsive Design

| Dispositivo | Ancho | Funciona |
|------------|-------|----------|
| 📱 Móvil | 375px | ✅ Sí |
| 📊 Tablet | 768px | ✅ Sí |
| 💻 Desktop | 1280px+ | ✅ Sí |

**Prueba:** 
- Abre DevTools (F12)
- Toggle device toolbar
- Selecciona dispositivo
- Todo debería verse bien

---

## 🌙 Modo Oscuro

1. Click en tu avatar (arriba a la derecha)
2. Click "Modo Oscuro" (o "Modo Claro")
3. ✅ Tema cambia inmediatamente

Se guarda en localStorage automáticamente.

---

## 📊 Información de Cuenta

### Ver tu perfil:
1. Click en avatar
2. Click "Configuración"
3. Verás tu información

### Editar perfil:
1. Ve a Configuración
2. Edita nombre o matrícula
3. Click "Guardar Cambios"

**Nota:** Email y rol no se pueden cambiar (por seguridad)

---

## 🎨 Características Visuales

- 🟢 Color principal: Verde (Nutrición)
- 🌙 Modo oscuro: Oscuro elegante
- 📱 Menú móvil: Hamburguesa (arriba a la izquierda)
- 🔄 Animaciones: Suaves y rápidas
- ♿ Accesibilidad: Iconos + Texto

---

## 🔐 Seguridad

⚠️ **Importante:** Este es un sistema de demostración.

**En Producción (próximamente):**
- Contraseñas hasheadas
- Backend seguro
- HTTPS obligatorio
- JWT tokens
- 2FA opcional

---

## 📞 Ayuda Rápida

**¿Olvidaste tu contraseña?**
- 🔄 Borra localStorage y crea una nueva cuenta

**¿Quieres cambiar tu tipo de cuenta?**
- ❌ No es posible aún (próxima versión)

**¿Quieres que alguien sea Admin?**
- ✅ Dale una matrícula que comience con "NUT"

**¿Necesitas más ayuda?**
- 📧 gonchimartinez9@gmail.com
- 🔗 https://github.com/GonzaloMartinezz/NutriAppGO

---

**¡Listo! Ahora puedes usar NutriApp con autenticación.** 🎉

Visita: http://localhost:5174 o https://nutriappgo.vercel.app
