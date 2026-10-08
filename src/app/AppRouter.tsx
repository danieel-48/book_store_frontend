/** AppRouter: conecta cada ruta con su pantalla y protege el área administrativa. Historias: HU-01, HU-08. Props: ninguna. */
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '../features/auth/components/LoginPage'
import { BooksPage } from '../features/books/components/BooksPage'
import { ClientsPage } from '../features/clients/components/ClientsPage'
import { DashboardPage } from '../features/dashboard/components/DashboardPage'
import { ReportsPage } from '../features/reports/components/ReportsPage'
import { SalesPage } from '../features/sales/components/SalesPage'
import { UsersPage } from '../features/users/components/UsersPage'
import { SidebarLayout } from '../shared/components/SidebarLayout'
import { ProtectedRoute } from './ProtectedRoute'

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<SidebarLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
