# Acceso al Área de Administración de Django

## 🔗 URL de Acceso

La ruta del panel de administración de Django es:

```
http://localhost:8000/django-admin/
```

**Nota:** Si el backend está corriendo en un puerto diferente, ajusta el puerto en la URL.

## 📋 Credenciales de Acceso

```
Usuario:     admin
Email:       admin@alphasentinel.com
Contraseña:  Admin123!@#
```

## 🚀 Cómo Iniciar el Servidor Backend

Si el servidor backend no está corriendo, inícialo con:

```bash
cd /Volumes/DATOS/scripts/Smart\ Solution\ Febrero\ 2026/backend

# Activar entorno virtual (si existe)
source venv/bin/activate

# Iniciar servidor Django
python manage.py runserver 8000
```

## 📱 Pasos para Acceder

1. **Asegúrate de que el backend esté corriendo** en el puerto 8000
2. **Abre tu navegador** y ve a: `http://localhost:8000/django-admin/`
3. **Ingresa las credenciales:**
   - Usuario: `admin`
   - Contraseña: `Admin123!@#`
4. **¡Listo!** Ya estás en el panel de administración

## 🎯 Funcionalidades del Admin

Desde el panel de administración de Django puedes:

- ✅ Ver y editar usuarios
- ✅ Gestionar planes de inversión
- ✅ Ver pagos y transferencias
- ✅ Administrar retiros
- ✅ Configurar ajustes generales
- ✅ Ver el árbol de referidos
- ✅ Gestionar todas las tablas de la base de datos

## ⚠️ Importante

- **Cambia la contraseña** después del primer login por seguridad
- El usuario `admin` tiene **permisos completos** (superusuario)
- Puedes crear más usuarios administradores desde el panel

## 🔍 Verificar Puerto del Backend

Para verificar en qué puerto está corriendo el backend:

```bash
# Ver procesos de Django
ps aux | grep "manage.py runserver"

# O revisar la configuración
cat /Volumes/DATOS/scripts/Smart\ Solution\ Febrero\ 2026/backend/.env
```

## 📸 Captura del Panel

El panel de administración de Django tiene esta apariencia:

- Menú lateral con todas las aplicaciones
- Lista de modelos disponibles
- Opciones para agregar, editar y eliminar registros
- Búsqueda y filtros avanzados
