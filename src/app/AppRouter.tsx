/** AppRouter: conecta cada ruta con su pantalla y protege el área administrativa. Historias: HU-01, HU-08. Props: ninguna. */
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
