# ToolTrack

Aplicación full stack para la gestión de herramientas, empleados, préstamos y devoluciones en entornos de mantenimiento, talleres, almacenes e industria.

## Demo

- Aplicación online: [https://tooltrack-delta.vercel.app/](https://tooltrack-delta.vercel.app/)
- Repositorio: [https://github.com/dovalehugo/tooltrack](https://github.com/dovalehugo/tooltrack)

### Acceso demo

La aplicación incluye una cuenta demo pública para poder probar el sistema con permisos limitados y sin comprometer funciones sensibles.

**Credenciales demo**

- Correo: `demo@tooltrack.com`
- Contraseña: `Demo1234*`

### Nota sobre la primera carga

**Importante:** la primera carga puede tardar unos segundos. El backend está alojado en un servicio gratuito y puede entrar en reposo tras un tiempo de inactividad.

### Restricciones de la cuenta demo

La cuenta demo permite explorar la aplicación y probar su funcionamiento real, pero con restricciones para proteger el entorno público y evitar abusos.

La cuenta demo:

- puede acceder al dashboard
- puede acceder al módulo de empleados
- puede acceder al módulo de herramientas
- puede acceder al módulo de préstamos
- puede crear empleados
- puede eliminar empleados
- puede crear herramientas
- puede eliminar herramientas
- puede crear préstamos
- puede registrar devoluciones

La cuenta demo no puede:

- acceder al módulo de usuarios
- crear administradores
- cambiar roles
- acceder al módulo de configuración
- importar empleados por CSV
- importar herramientas por CSV
- realizar acciones administrativas sensibles

Además, el sistema incluye límites de uso por tipo de acción para mantener la demo pública controlada.

---

## Descripción

ToolTrack es una aplicación web desarrollada para digitalizar el control de herramientas en un entorno técnico o industrial.

Permite gestionar herramientas, empleados, préstamos, devoluciones y stock desde una interfaz centralizada, con autenticación, control de acceso por roles y lógica de negocio orientada a un caso de uso real.

El proyecto está planteado como una solución práctica para un problema habitual en empresas técnicas: conocer en todo momento qué herramientas existen, cuántas unidades hay disponibles, quién tiene cada una y cómo evoluciona el inventario.

---

## Problema que resuelve

En muchos entornos de mantenimiento y trabajo técnico, el control de herramientas sigue realizándose de forma manual o poco estructurada. Esto genera problemas como:

- poca trazabilidad sobre quién tiene cada herramienta
- errores al prestar o devolver material
- pérdida de control del stock disponible
- dificultad para detectar herramientas agotadas o críticas
- duplicidad de operaciones
- historial poco claro
- fricción operativa cuando un empleado necesita varias herramientas a la vez

ToolTrack nace para resolver ese problema mediante una aplicación web centralizada, con frontend y backend desacoplados, persistencia en base de datos y reglas de negocio reales.

---

## Objetivo del proyecto

El objetivo de ToolTrack es ofrecer una solución funcional, clara y escalable para la gestión de herramientas dentro de un entorno laboral real.

También está pensado como proyecto de portfolio para demostrar conocimientos en:

- desarrollo full stack
- diseño de API REST
- autenticación con JWT
- control de acceso por roles
- modelado de datos con MongoDB y Mongoose
- lógica de negocio aplicada
- diseño de interfaces orientadas a operativa real
- despliegue de frontend y backend por separado
- preparación de una demo pública segura

---

## Funcionalidades principales

Actualmente la aplicación incluye:

- gestión de herramientas
- gestión de empleados
- registro de préstamos y devoluciones
- control de stock en tiempo real
- dashboard con resumen general del sistema
- gestión de usuarios
- sistema de roles
- autenticación mediante JWT
- importación de empleados por CSV
- importación de herramientas por CSV
- cuenta demo pública con permisos restringidos
- validaciones de negocio para evitar inconsistencias

---

## Novedades implementadas

Durante la evolución del proyecto se han incorporado varias mejoras importantes tanto a nivel funcional como de experiencia de uso.

### Rol demo para portfolio y pruebas públicas

Se añadió un rol específico `demo` con el objetivo de permitir que cualquier persona pueda probar la aplicación sin exponer funciones sensibles ni comprometer la seguridad del sistema.

Este rol incluye:

- acceso a módulos principales
- restricciones de navegación
- límites de uso por acción
- ocultación de determinadas funciones en frontend
- protección real mediante validaciones en backend

### Aviso de servidor en reposo en el login

La pantalla de acceso fue actualizada para informar al usuario de que la primera carga puede tardar unos segundos, ya que el backend está alojado en un servicio gratuito y puede encontrarse temporalmente en reposo.

Esto mejora la experiencia de quien prueba la aplicación y evita que interprete el retraso inicial como un fallo.

### Confirmaciones y feedback visual en acciones críticas

Se mejoró la experiencia de usuario en operaciones sensibles, especialmente en eliminaciones.

Ahora se muestran:

- advertencias antes de eliminar
- mensajes de éxito tras eliminar correctamente
- mensajes de error claros cuando una acción no puede completarse

### Bloqueo de eliminación de empleados con préstamos activos

Se añadió una validación de negocio para impedir que un empleado pueda eliminarse si mantiene préstamos activos.

Esto evita dejar datos incoherentes y protege la integridad entre empleados y préstamos.

### Bloqueo de eliminación de herramientas con préstamos activos

También se añadió una validación para impedir que una herramienta pueda eliminarse si está asociada a un préstamo activo.

De este modo, no se puede borrar inventario que sigue estando en uso.

### Nuevo sistema de préstamos múltiples

El módulo de préstamos fue ampliado para reflejar mejor una situación real.

Antes, un préstamo equivalía a una sola herramienta por operación. Ahora, un préstamo puede incluir varias herramientas para un mismo empleado en una única operación.

Esto reduce fricción operativa y evita repetir el mismo flujo varias veces.

### Preparación de préstamo tipo lista

En la creación de préstamos se incorporó una lógica de selección múltiple, donde el usuario puede:

- seleccionar un empleado
- ir añadiendo herramientas a una lista temporal
- revisar las herramientas preparadas antes de confirmar
- eliminar herramientas una a una
- vaciar la lista completa
- guardar la operación al final

### Reutilización del préstamo activo del mismo día

Se incorporó una regla de negocio para evitar duplicidad de operaciones.

Si un empleado ya tiene un préstamo activo en el día actual, al intentar crear un nuevo préstamo no se genera otro registro separado. En su lugar:

- se reutiliza el préstamo activo existente
- se añaden a ese préstamo las herramientas nuevas seleccionadas

Esto mantiene el historial más limpio y coherente.

### Separación entre préstamos activos y préstamos devueltos

La interfaz del módulo de préstamos fue reorganizada para separar visualmente:

- préstamos activos
- préstamos devueltos

Esto mejora la lectura, la gestión diaria y la comprensión del estado de cada operación.

### Edición de préstamos activos

Se añadió la posibilidad de editar préstamos activos, permitiendo:

- añadir nuevas herramientas a un préstamo ya abierto
- quitar herramientas concretas del préstamo
- devolver el préstamo completo

### Dashboard adaptado al nuevo modelo de préstamos

El dashboard fue actualizado para funcionar correctamente con el nuevo sistema de préstamos múltiples.

Se revisó la carga de datos para que:

- muestre actividad reciente compatible con préstamos con varias herramientas
- muestre préstamos activos correctamente
- siga reflejando el estado general del inventario

---

## Stack tecnológico

### Frontend

- Next.js
- React
- Tailwind CSS
- Axios
- react-hook-form
- react-toastify
- lucide-react
- papaparse

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Despliegue

- Vercel
- Render
- MongoDB Atlas

---

## Arquitectura general

ToolTrack sigue una arquitectura separada entre frontend y backend.

### Frontend

El frontend se encarga de:

- renderizar la interfaz
- gestionar formularios
- consumir la API
- mostrar feedback visual
- adaptar la experiencia según el rol del usuario

### Backend

El backend se encarga de:

- exponer la API REST
- autenticar usuarios
- validar permisos
- aplicar reglas de negocio
- gestionar stock
- persistir la información en base de datos

### Base de datos

MongoDB almacena la información relativa a:

- usuarios
- empleados
- herramientas
- préstamos
- configuración

---

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

Resumen de estructura
backend/: contiene la API REST, la conexión con la base de datos, los modelos, controladores, middlewares y la lógica principal de negocio
frontend/: contiene la interfaz de usuario desarrollada con Next.js y React
controllers/loan.controller.js: concentra la lógica principal del sistema de préstamos
controllers/dashboard.controller.js: prepara los datos necesarios para el dashboard
middlewares/auth.middleware.js: protege rutas privadas
middlewares/role.middleware.js: limita el acceso según rol
middlewares/demoLimit.middleware.js: aplica restricciones de uso al rol demo
models/User.js: define usuarios, roles y contadores de límites demo
models/Loan.js: define la estructura de los préstamos y su relación con empleados y herramientas
Modelos principales
Usuario

El modelo User representa a los usuarios del sistema.

Incluye, entre otros datos:

nombre
apellido
email
password
role
demoLimits

Los roles soportados actualmente son:

admin
user
demo
Empleado

El modelo Employee representa a cada empleado que puede recibir herramientas en préstamo.

Incluye información básica como:

nombre
apellido
departamento
Herramienta

El modelo Tool representa cada herramienta gestionada en el inventario.

Incluye campos como:

nombre
cantidadTotal
cantidadDisponible

Esto permite controlar el stock real en todo momento.

Préstamo

El modelo Loan fue ampliado para soportar múltiples herramientas en una sola operación.

Actualmente representa:

el empleado al que se presta
la colección de herramientas incluidas en el préstamo
fecha de préstamo
fecha de devolución real
estado del préstamo
Sistema de roles

ToolTrack utiliza control de acceso por roles para separar permisos dentro de la aplicación.

admin

Puede acceder a toda la plataforma y gestionar:

usuarios
empleados
herramientas
préstamos
configuración

Tiene control total sobre la aplicación.

user

Puede utilizar la operativa principal de la plataforma, incluyendo la gestión funcional del sistema, pero sin acceso a administración sensible.

Puede trabajar con:

dashboard
empleados
herramientas
préstamos

No puede gestionar administración avanzada de usuarios ni configuraciones sensibles.

demo

Rol diseñado para portfolio y pruebas públicas.

Permite probar la aplicación con limitaciones que evitan abusos, cambios críticos o exposición de funcionalidades administrativas.

Funcionalidad del rol demo

La cuenta demo puede:

ver dashboard
ver empleados
ver herramientas
ver préstamos
crear empleados
eliminar empleados
crear herramientas
eliminar herramientas
crear préstamos
registrar devoluciones

La cuenta demo no puede:

acceder al módulo de usuarios
crear administradores
cambiar roles
acceder a settings
importar empleados por CSV
importar herramientas por CSV
realizar acciones administrativas
Límites de uso de la demo

El sistema demo utiliza contadores por usuario para limitar acciones concretas.

Los límites se guardan en el modelo User dentro del objeto:

demoLimits: {
  employeeCreates,
  employeeDeletes,
  toolCreates,
  toolDeletes,
  loanCreates,
  loanReturns
}

Estos contadores permiten controlar el uso del entorno público sin bloquear la navegación ni la visualización de la aplicación.

Su propósito es permitir que la demo sea funcional y realista, pero manteniendo control sobre el uso del sistema.

Lógica del sistema de préstamos

El módulo de préstamos fue ampliado para reflejar mejor un caso de uso real.

Comportamiento actual
un préstamo puede contener una o varias herramientas
un empleado puede tener un único préstamo activo por día
si el mismo empleado solicita más herramientas ese mismo día, se añaden al préstamo activo existente
el usuario puede preparar una lista de herramientas antes de confirmar
el usuario puede eliminar herramientas de la lista antes de guardar
un préstamo activo puede editarse para añadir nuevas herramientas
un préstamo activo puede editarse para quitar herramientas concretas
si se elimina la última herramienta de un préstamo activo, el préstamo pasa automáticamente a estado devuelto
también se puede devolver el préstamo completo de una sola vez
la interfaz separa claramente préstamos activos y préstamos devueltos
Beneficios de este enfoque
evita duplicar préstamos innecesarios
mejora la trazabilidad
simplifica la operativa diaria
acerca el comportamiento del sistema a un caso de uso real
mejora la experiencia cuando un empleado necesita varias herramientas a la vez
reduce fricción operativa
mantiene el historial más limpio y coherente
Reglas de negocio implementadas

Entre las validaciones más relevantes del sistema se encuentran las siguientes:

no se puede prestar una herramienta sin stock disponible
no se puede crear un préstamo sin empleado
no se puede crear un préstamo sin herramientas
no se puede duplicar la misma herramienta dentro del mismo préstamo
no se puede eliminar un empleado con préstamos activos
no se puede eliminar una herramienta con préstamos activos
no se puede reducir el stock total por debajo del número de unidades actualmente prestadas
no se puede editar un préstamo ya devuelto
no se pueden añadir herramientas agotadas a un préstamo activo

Estas validaciones se aplican principalmente en backend para garantizar que no puedan saltarse desde el cliente.

Dashboard

El dashboard ofrece una visión resumida del estado general del sistema.

Actualmente muestra:

empleados totales
herramientas totales
herramientas disponibles
herramientas prestadas
herramientas sin stock
inventario crítico
actividad reciente
préstamos activos

Tras la evolución del módulo de préstamos, el dashboard fue ajustado para seguir funcionando con préstamos que contienen múltiples herramientas.

Importación CSV

ToolTrack permite importar datos mediante archivos CSV para acelerar la carga inicial de información.

Actualmente se soporta la importación de:

empleados
herramientas

Esto resulta útil especialmente cuando se quiere poblar el sistema rápidamente desde datos preexistentes.

La cuenta demo no puede utilizar esta funcionalidad.

Seguridad y control de acceso

La aplicación incluye varias capas de seguridad:

autenticación basada en JWT
contraseñas cifradas con bcryptjs
rutas protegidas
control de acceso por rol
restricciones específicas para la cuenta demo
validaciones de negocio en backend

La intención es que las restricciones importantes no dependan únicamente del frontend, sino también del servidor.

Instalación en local
1. Clonar el repositorio
git clone https://github.com/dovalehugo/tooltrack.git
cd tooltrack
2. Instalar dependencias
Backend
cd backend
npm install
Frontend
cd ../frontend
npm install
Variables de entorno necesarias

Crea un archivo .env dentro de backend/ con estas variables:

PORT=5000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000

Estas variables permiten configurar:

el puerto del servidor
la conexión con MongoDB
la firma del token JWT
el modo de ejecución
la URL permitida del cliente
Ejecución en local
Backend

Desde la carpeta backend/:

npm run dev
Frontend

Desde la carpeta frontend/:

npm run dev

Con ambos servicios levantados, la aplicación quedará disponible en entorno local.

Estado actual del proyecto

ToolTrack es un proyecto funcional, desplegado y en evolución continua.

Actualmente cuenta con:

autenticación y autorización con JWT
gestión de usuarios y roles
CRUD de empleados
CRUD de herramientas
préstamos con múltiples herramientas
devoluciones
reutilización del préstamo activo del día por empleado
edición de préstamos activos
control de stock real
dashboard operativo
importación CSV
cuenta demo pública con restricciones
despliegue completo frontend/backend
Qué demuestra este proyecto

Este proyecto me permite mostrar conocimientos y práctica en:

desarrollo full stack
diseño de API REST
separación frontend/backend
modelado de datos con MongoDB
autenticación y autorización
control de acceso por roles
lógica de negocio aplicada a un caso real
diseño de una demo pública segura
despliegue de una aplicación web completa
evolución funcional de un producto a partir de necesidades reales
Próximas mejoras

Aunque la aplicación ya es funcional, todavía hay margen de mejora en distintos aspectos.

Entre las siguientes líneas de evolución se encuentran:

añadir tests básicos
mejorar la documentación técnica
documentar endpoints principales
reforzar aún más validaciones del backend
mejorar el manejo global de errores
añadir capturas y documentación visual
automatizar el reseteo de límites de la cuenta demo
pulir aún más la experiencia de edición de préstamos
añadir métricas más avanzadas al dashboard
introducir mejoras de UX adicionales en móviles
seguir refinando la experiencia de portfolio y demostración pública
Autor

Hugo Do Vale
GitHub: https://github.com/dovalehugo

LinkedIn: https://www.linkedin.com/in/dovalehugo    