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

| HU-01 Registro (crear cuenta) | `UsersPage` · `useUsersPage` | `pages/UsersPage.tsx` | `POST /users` |
| HU-02 Inicio de sesión        | `LoginPage` · `useLoginForm` · `ProtectedRoute` | `pages/LoginPage.tsx` | `POST /auth/login` (cierre de sesión: `POST /auth/logout`) |
| HU-03 Perfil de usuario       | `AuthContext` · `SidebarLayout` | `app/AuthContext.tsx` | `GET /auth/me` |
| HU-04 Buscar libros           | `BooksPage` (campo de búsqueda) | `pages/BooksPage.tsx` | `GET /books` (búsqueda por ID/título en el cliente) |
| HU-05 Filtrar libros          | `BooksPage` · `ReportsPage` (filtros por libro, cliente, usuario y periodo) | `pages/BooksPage.tsx` | `GET /books` · `GET /reports/sales?period=&book_id=&client_id=&user_id=&date=` |
| HU-06 Ver detalle del libro   | `BookFormModal` | `components/books/BookFormModal.tsx` | `GET /books` (alta: `POST /books`, edición: `PUT /books/{id}`, baja: `DELETE /books/{id}`) |
| HU-07 Agregar al carrito      | `SalesPage` · `useSalesPOS` | `pages/SalesPage.tsx` | `GET /books` (el carrito se maneja en el estado del cliente) |
| HU-08 Comprar libros          | `SalesPage` · `useSalesPage` | `pages/SalesPage.tsx` | `POST /sales` |
| HU-9 Ver historial de compras | `ReportsPage` · `SalesPage` (detalle) | `pages/ReportsPage.tsx` | `GET /reports/sales` · `GET /sales/{id}` |

> Nota: la aplicación es un panel administrativo/POS de libreria (rol `ADMIN`/`EMPLOYEE`). Las historias de comprador se implementan desde el punto de vista del personal que opera la venta. HU-03 no forma parte de la lista indicada.
