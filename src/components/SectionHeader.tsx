// SectionHeader: encabezado estándar con título, descripción y botones de acción · HU-02 a HU-08
// Props: title (título de la pantalla), description (descripción de la funcionalidad), actions (botones de acción opcionales)
type SectionHeaderProps = {
  title: string
  description: string
  actions?: React.ReactNode
}

export const SectionHeader = ({ title, description, actions }: SectionHeaderProps) => (
  <header className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
    {/* Acciones principales de la vista (ej: botones nuevo elemento o filtros) */}
    {actions}
  </header>
)
