## Tabla de trazabilidad de historias de usuario

Configura `VITE_API_URL` en `.env` con la URL base del servidor, por ejemplo `http://localhost:8080`. Los servicios agregan sus rutas `/api/...`; los componentes no conocen la URL base.

| Historia de usuario | Funcionalidad en la aplicación | Componente(s) | Archivo | Endpoint de la API |
| --- | --- | --- | --- | --- |
| **HU-01: Inicio y control de sesión** | Autenticación con correo y contraseña, protección de rutas privadas y cierre de sesión manual o automático por inactividad. | `LoginPage` · `useLoginForm` · `ProtectedRoute` · `AuthContext` | `src/pages/LoginPage.tsx` | `POST /api/auth/login` |
| **HU-02: Panel de control (Dashboard)** | Resumen general con indicadores clave (ventas totales, ingresos recaudados, títulos en catálogo y existencias) y accesos directos. | `DashboardPage` · `useDashboard` | `src/pages/DashboardPage.tsx` | `GET /api/books` · `GET /api/sales` |
| **HU-03: Perfil del usuario logeado** | Consulta de la información del usuario autenticado y edición de sus datos reutilizando el modal y la ruta de actualización. | `UsersPage` · `useUsersPage` · `Modal` | `src/pages/UsersPage.tsx` | `GET /api/users/profile?email=` · `PUT /api/users/{id}` |
| **HU-04: Gestión de clientes** | Consulta paginada, edición y registro de clientes con campos obligatorios (nombre, cédula/identificación, correo electrónico y teléfono). | `ClientsPage` · `useClientsPage` · `ClientFormModal` | `src/pages/ClientsPage.tsx` | `GET /api/clients` · `POST /api/clients` · `PUT /api/clients/{id}` |
| **HU-05: Inventario y catálogo de libros** | Visualización paginada, búsqueda por ID/título, filtrado por precio y stock, así como registro y edición de libros. | `BooksPage` · `useBooksPage` · `BookFormModal` | `src/pages/BooksPage.tsx` | `GET /api/books` · `POST /api/books` · `PUT /api/books/{id}` |
| **HU-06: Ventas POS y facturación** | Selección de cliente, filtrado de libros por categoría y precio (`/api/books?category=&minPrice=&maxPrice=`), carrito interactivo con control de existencias, cálculo de impuestos, registro de venta y generación de factura PDF. | `SalesPage` · `useSalesPOS` · `useSalesPage` · `CartQuantityInput` | `src/pages/SalesPage.tsx` | `POST /api/sales` · `POST /api/sale-details` · `GET /api/books?category=&minPrice=&maxPrice=` · `GET /api/clients` |
| **HU-07: Reportes e historial de ventas** | Historial de transacciones con filtros por cliente, vendedor y fechas, detalle de artículos vendidos y exportación de reportes a PDF. | `ReportsPage` · `useReportsPage` | `src/pages/ReportsPage.tsx` | `GET /api/sales` · `GET /api/sale-details` |
| **HU-08: Administración de personal** | Registro de nuevos usuarios con rol (`ADMIN`/`EMPLOYEE`), búsqueda por correo y listado de usuarios del sistema (exclusivo para ADMIN). | `UsersPage` · `useUsersPage` | `src/pages/UsersPage.tsx` | `POST /api/auth/register` · `GET /api/users` · `GET /api/users/profile?email=` · `PUT /api/users/{id}` |

