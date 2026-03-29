# ToolTrack

Aplicación full stack para la gestión de herramientas, empleados, préstamos y devoluciones en entornos de mantenimiento e industria.

## Demo

* Aplicación online: [https://tooltrack-delta.vercel.app/](https://tooltrack-delta.vercel.app/)
* Repositorio: [https://github.com/dovalehugo/tooltrack](https://github.com/dovalehugo/tooltrack)

### Acceso demo

La aplicación incluye una cuenta demo pública para poder probar el sistema con permisos limitados.

**Credenciales demo**

* Correo: `demo@tooltrack.com`
* Contraseña: `Demo1234*`

### Restricciones de la cuenta demo

La cuenta demo permite explorar la aplicación y probar su funcionamiento real, pero con restricciones para proteger el entorno público:

* acceso permitido a dashboard, empleados, herramientas y préstamos
* sin acceso al módulo de usuarios
* sin acceso a configuración
* sin importación CSV de empleados
* sin importación CSV de herramientas
* sin acciones administrativas
* límite de uso por tipo de acción para evitar abusos en la demo pública

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
* control de acceso por roles (`admin`, `user`, `demo`)
* cuenta demo pública con permisos restringidos

## Stack tecnológico

### Frontend

* Next.js
* React
* Tailwind CSS
* Axios
* react-hook-form
* react-toastify
* lucide-react
* papaparse

### Backend

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* bcryptjs

### Despliegue

* Vercel
* Render
* MongoDB Atlas

## Estructura del proyecto

```bash
tooltrack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── employee.controller.js
│   │   │   ├── loan.controller.js
│   │   │   ├── setting.controller.js
│   │   │   ├── tool.controller.js
│   │   │   └── user.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── demoLimit.middleware.js
│   │   │   └── role.middleware.js
│   │   ├── models/
│   │   │   ├── Employee.js
│   │   │   ├── Loan.js
│   │   │   ├── Setting.js
│   │   │   ├── Tool.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── employee.routes.js
│   │   │   ├── loan.routes.js
│   │   │   ├── setting.routes.js
│   │   │   ├── tool.routes.js
│   │   │   └── user.routes.js
│   │   ├── seeds/
│   │   │   └── createAdmin.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── app/
    │   ├── login/
    │   │   └── page.jsx
    │   └── (panel)/
    │       ├── dashboard/
    │       │   └── page.jsx
    │       ├── employees/
    │       │   └── page.jsx
    │       ├── loans/
    │       │   └── page.jsx
    │       ├── tools/
    │       │   └── page.jsx
    │       ├── users/
    │       │   └── page.jsx
    │       └── layout.jsx
    ├── components/
    │   ├── EmployeeForm.jsx
    │   └── Sidebar.jsx
    ├── services/
    │   └── api.js
    └── package.json
```

### Resumen de estructura

* `backend/`: API REST, modelos, controladores, middlewares y lógica de negocio
* `frontend/`: interfaz de usuario desarrollada con Next.js
* `middlewares/demoLimit.middleware.js`: controla el uso máximo permitido para la cuenta demo
* `models/User.js`: incluye los roles del sistema y los contadores `demoLimits`

## Sistema de roles

ToolTrack utiliza control de acceso por roles para separar permisos dentro de la aplicación.

### `admin`

Puede acceder a toda la plataforma y gestionar:

* usuarios
* empleados
* herramientas
* préstamos
* configuración

### `user`

Puede utilizar la operativa principal de la aplicación sin acceso a administración de cuentas ni configuración sensible.

### `demo`

Rol diseñado para portfolio y pruebas públicas.

Puede usar la aplicación con restricciones para evitar abuso del entorno y proteger los datos de la demo.

## Funcionalidad del rol demo

La cuenta demo puede:

* ver dashboard
* ver empleados
* ver herramientas
* ver préstamos
* crear empleados
* eliminar empleados
* crear herramientas
* eliminar herramientas
* crear préstamos
* registrar devoluciones

La cuenta demo no puede:

* acceder al módulo de usuarios
* crear admins
* cambiar roles
* acceder a settings
* importar empleados por CSV
* importar herramientas por CSV
* realizar acciones administrativas

## Límites de uso de la demo

El sistema demo utiliza contadores por usuario para limitar acciones concretas.

Los límites se guardan en el modelo `User` dentro del objeto:

```js
demoLimits: {
  employeeCreates,
  employeeDeletes,
  toolCreates,
  toolDeletes,
  loanCreates,
  loanReturns
}
```

Estos contadores permiten controlar el uso del entorno público sin bloquear la navegación ni la visualización de la aplicación.

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
* implementación de una cuenta demo pública restringida para portfolio

## Próximas mejoras

* añadir tests básicos
* mejorar documentación técnica
* documentar endpoints principales
* reforzar validaciones del backend
* mejorar manejo de errores
* añadir más capturas y documentación visual
* automatizar el reseteo de límites de la cuenta demo

## Autor

**Hugo Do Vale**
GitHub: [https://github.com/dovalehugo](https://github.com/dovalehugo)
LinkedIn: [https://www.linkedin.com/in/dovalehugo](https://www.linkedin.com/in/dovalehugo)
