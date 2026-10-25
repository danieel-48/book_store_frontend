// AppRouter: define las rutas públicas y protegidas de la aplicación · HU-01 y HU-08
// Props: ninguna
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage.tsx'
import { BooksPage } from '@/pages/BooksPage.tsx'
import { ClientsPage } from '@/pages/ClientsPage.tsx'
import { DashboardPage } from '@/pages/DashboardPage.tsx'
import { ReportsPage } from '@/pages/ReportsPage.tsx'
import { SalesPage } from '@/pages/SalesPage.tsx'
import { UsersPage } from '@/pages/UsersPage.tsx'
import { SidebarLayout } from '@/components/SidebarLayout.tsx'
import { ProtectedRoute } from '@/app/ProtectedRoute'

export const AppRouter = () => (
  <Routes>
    {/* HU-01: ruta pública para inicio de sesión */}
    <Route path="/login" element={<LoginPage />} />

    {/* HU-01: rutas protegidas accesibles solo con sesión activa */}
    <Route element={<ProtectedRoute />}>
      <Route element={<SidebarLayout />}>
        {/* HU-02: panel de control / dashboard con métricas */}
        <Route path="/" element={<DashboardPage />} />
        {/* HU-06: punto de venta / facturación y registro de ventas */}
        <Route path="/sales" element={<SalesPage />} />
        {/* HU-05: inventario y catálogo de libros */}
        <Route path="/books" element={<BooksPage />} />
        {/* HU-04: gestión y directorio de clientes */}
        <Route path="/clients" element={<ClientsPage />} />
        {/* HU-03 y HU-08: perfil propio y administración de personal */}
        <Route path="/users" element={<UsersPage />} />
        {/* HU-07: reportes de ventas y exportación de comprobantes */}
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Route>

    {/* Redirección por defecto a inicio */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
