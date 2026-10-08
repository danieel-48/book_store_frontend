/** SectionHeader: presenta el título, la descripción y las acciones de una pantalla. Historias: HU-02 a HU-07. Props: SectionHeaderProps (title, description y actions opcionales). */
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
    {actions}
  </header>
)
