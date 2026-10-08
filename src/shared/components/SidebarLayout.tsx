/** SidebarLayout: presenta navegación, sesión y contenido de las pantallas privadas. Historia: HU-08. Props: ninguna; consume el contexto de autenticación y renderiza la ruta activa. */
import { BarChart3, Book, ClipboardList, Home, LogOut, ReceiptText, ShieldUser, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../app/useAuth'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/sales', label: 'Ventas POS', icon: ReceiptText },
  { to: '/books', label: 'Inventario', icon: Book },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/users', label: 'Usuarios', icon: ShieldUser },
  { to: '/reports', label: 'Reportes', icon: BarChart3 },
]

export const SidebarLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1600px] items-start gap-6 p-4 lg:p-6">
        <aside className="hidden w-72 shrink-0 self-start rounded-3xl bg-slate-900 p-6 text-slate-100 shadow-2xl lg:block">
          <div className="mb-8 flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-slate-300" />
            <div>
              <p className="text-lg font-semibold">BookStore</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Centro de control</p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                      isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-8 rounded-xl border border-slate-700 p-4 text-xs">
            <p className="font-semibold text-slate-200">{user?.name}</p>
            <p className="mt-1 text-slate-400">{user?.role === 'ADMIN' ? 'Administrador' : 'Empleado'}</p>
            <button
              onClick={() => logout()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-3xl bg-white p-4 shadow-xl lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
