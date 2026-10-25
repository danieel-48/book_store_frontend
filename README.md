# Frontend de BookStore

Aplicación web para administrar libros, clientes, ventas, usuarios y reportes de una libreria. Esta construida con React, TypeScript, Vite y Tailwind CSS, y consume la API REST de BookStore.

## Estructura

- `src/components/`: componentes reutilizables y formularios modales.
- `src/pages/`: pantallas conectadas por las rutas.
- `src/services/`: comunicación con la API.
- `src/hooks/`: lógica reutilizable de la interfaz.
- `src/types/`: tipos del dominio.
- `src/utils/`: formato, validación y utilidades.
- `src/app/`: enrutamiento y estado de autenticación.

## Tabla de trazabilidad

Configura `VITE_API_URL` en `.env` con la URL base del servidor, por ejemplo `http://localhost:8080`. Los servicios agregan sus rutas `/api/...`; los componentes no conocen la URL base.

| Historia de usuario           | Componente(s) | Archivo | Endpoint de la API (AA3) |
| --- | --- | --- | --- |
| HU-01 Registro (crear cuenta) | `UsersPage` · `useUsersPage` | `pages/UsersPage.tsx` | `POST /api/auth/register` (consulta: `GET /api/users/profile?email=`) |
| HU-02 Inicio de sesión        | `LoginPage` · `useLoginForm` · `ProtectedRoute` | `pages/LoginPage.tsx` | `POST /api/auth/login` (sin JWT; la sesión guarda el usuario devuelto) |
| HU-03 Perfil de usuario       | `UsersPage` · `useUsersPage` · `AuthContext` | `pages/UsersPage.tsx` | `GET /api/users/profile?email=` · `PUT /api/users/{id}` |
| HU-04 Buscar libros           | `BooksPage` (campo de búsqueda) | `pages/BooksPage.tsx` | `GET /api/books` (búsqueda por ID/título en el cliente) |
| HU-05 Filtrar libros          | `BooksPage` · `ReportsPage` (filtros por libro, cliente, usuario y periodo) | `pages/BooksPage.tsx` | `GET /api/books` · `GET /api/sales?idClient=&idUser=` · `GET /api/sale-details` |
| HU-06 Ver detalle del libro   | `BookFormModal` | `components/books/BookFormModal.tsx` | `GET /api/books` (alta: `POST /api/books`, edición: `PUT /api/books/{id}`; no hay eliminación) |
| HU-07 Agregar al carrito      | `SalesPage` · `useSalesPOS` | `pages/SalesPage.tsx` | `GET /api/books` (el carrito se maneja en el estado del cliente) |
| HU-08 Comprar libros          | `SalesPage` · `useSalesPage` | `pages/SalesPage.tsx` | `POST /api/sales` + `POST /api/sale-details` |
| HU-9 Ver historial de compras | `ReportsPage` · `SalesPage` (detalle) | `pages/ReportsPage.tsx` | `GET /api/sales` · `GET /api/sale-details` |

> Nota: la aplicación es un panel administrativo/POS de libreria (rol `ADMIN`/`EMPLOYEE`). Las historias de comprador se implementan desde el punto de vista del personal que opera la venta.
