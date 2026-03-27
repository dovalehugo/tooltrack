# ToolTrack

Aplicación full stack para la gestión de herramientas, empleados, préstamos y devoluciones en entornos de mantenimiento e industria.

## Demo

* Aplicación online: [https://tooltrack-delta.vercel.app/](https://tooltrack-delta.vercel.app/)
* Repositorio: [https://github.com/dovalehugo/tooltrack](https://github.com/dovalehugo/tooltrack)

## Descripción

ToolTrack es una aplicación web desarrollada para digitalizar el control de herramientas en un entorno técnico o industrial.

Permite gestionar herramientas, empleados, préstamos, devoluciones y stock desde una interfaz centralizada, con autenticación y control de roles. El proyecto está planteado como una solución útil para un caso de uso real, no como una aplicación CRUD genérica.

## Problema que resuelve

En muchos entornos de mantenimiento, taller o trabajo técnico, el control de herramientas sigue haciéndose de forma manual o poco estructurada. Esto puede provocar:

* poca trazabilidad sobre quién tiene cada herramienta
* errores en préstamos y devoluciones
* falta de control del stock disponible
* dificultad para detectar herramientas críticas o movimientos recientes
* menor visibilidad general del inventario

ToolTrack nace para resolver ese problema mediante una aplicación web con lógica de negocio real y estructura full stack.

## Funcionalidades principales

* gestión de herramientas
* gestión de empleados
* registro de préstamos y devoluciones
* control de stock
* dashboard con información resumida
* gestión de usuarios y roles
* autenticación con JWT
* importación de datos mediante CSV

## Stack tecnológico

### Frontend

* Next.js
* Tailwind CSS

### Backend

* Node.js
* Express

### Base de datos

* MongoDB
* Mongoose

### Autenticación

* JWT

### Despliegue

* Vercel
* Render

## Estructura del proyecto

```bash
tooltrack/
├── backend/
└── frontend/
```

* `backend/`: API REST y lógica de negocio
* `frontend/`: interfaz de usuario desarrollada con Next.js

## Instalación en local

### 1. Clonar el repositorio

```bash
git clone https://github.com/dovalehugo/tooltrack.git
cd tooltrack
```

### 2. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

## Variables de entorno necesarias

Crea un archivo `.env` dentro de `backend/` con estas variables:

```env
PORT=5000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Ejecución en local

### Backend

Desde la carpeta `backend/`:

```bash
npm run dev
```

### Frontend

Desde la carpeta `frontend/`:

```bash
npm run dev
```

## Estado del proyecto

ToolTrack es un proyecto funcional y desplegado, planteado como una solución real para la gestión de herramientas en entornos técnicos.

Actualmente sigue en mejora continua en aspectos como:

* validaciones
* documentación técnica
* manejo de errores
* tests
* seguridad
* presentación del proyecto

## Qué demuestra este proyecto

Este proyecto me permite mostrar conocimientos y práctica en:

* desarrollo full stack
* diseño de API REST
* conexión con base de datos
* autenticación y control de acceso por roles
* lógica de negocio aplicada a un caso real
* despliegue de frontend y backend por separado
* organización de un proyecto web completo

## Próximas mejoras

* añadir tests básicos
* mejorar documentación técnica
* documentar endpoints principales
* reforzar validaciones del backend
* mejorar manejo de errores
* añadir más capturas y documentación visual

## Autor

**Hugo Do Vale**
GitHub: [https://github.com/dovalehugo](https://github.com/dovalehugo)
LinkedIn: [https://www.linkedin.com/in/dovalehugo](https://www.linkedin.com/in/dovalehugo)
