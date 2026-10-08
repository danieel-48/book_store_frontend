/** DashboardPage: muestra indicadores principales y accesos a los módulos. Historia: HU-02. Props: ninguna; carga los datos mediante useDashboard. */
import { BookOpen, DollarSign, Receipt, UsersRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '../../../shared/components/SectionHeader'
import { formatCurrency } from '../../../shared/utils/format'
import { useDashboard } from '../hooks/useDashboard'

export const DashboardPage = () => {
  const { stats } = useDashboard()
  const navigate = useNavigate()

  const cards = [
    { label: 'Libros en inventario', value: stats.totalBooks, icon: BookOpen, color: 'from-amber-100 to-orange-50', iconColor: 'text-amber-700', to: '/books' },
    { label: 'Clientes registrados', value: stats.totalClients, icon: UsersRound, color: 'from-sky-100 to-cyan-50', iconColor: 'text-sky-700', to: '/clients' },
    {
      label: 'Ventas de hoy',
      value: formatCurrency(stats.salesToday),
      icon: DollarSign,
      color: 'from-emerald-100 to-lime-50',
      iconColor: 'text-emerald-700',
      to: '/sales',
    },
    { label: 'Transacciones de hoy', value: stats.transactionsToday, icon: Receipt, color: 'from-rose-100 to-pink-50', iconColor: 'text-rose-700', to: '/reports' },
  ]

  return (
    <div>
      <SectionHeader
        title="Panel principal"
        description="Resumen del inventario, los clientes y el desempeño de ventas de hoy."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => navigate(card.to)}
              className={`rounded-2xl bg-gradient-to-br ${card.color} p-5 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300`}
            >
              <div className="mb-10 flex items-center justify-between">
                <p className="text-sm text-slate-600">{card.label}</p>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
