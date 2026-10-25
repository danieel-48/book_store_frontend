// LoginPage: presenta el formulario de acceso al sistema · HU-01 inicio de sesión
// Props: ninguna (página conectada a AppRouter)
import { BookOpenText } from 'lucide-react'
import { useLoginForm } from '@/hooks/auth/useLoginForm.ts'

export const LoginPage = () => {
  // Hook que gestiona las credenciales, validación y autenticación en la API (HU-01)
  const { email, password, error, isSubmitting, setEmail, setPassword, submit } = useLoginForm()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ffffff,_#f8fafc_34%,_#e2e8f0)] p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-5xl items-center gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl backdrop-blur">
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Plataforma BookStore</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Vende mejor, administra más rápido</h1>
          <p className="mt-4 text-slate-600">
            Flujos de caja seguros, visibilidad de inventario y administración por roles en un solo panel.
          </p>
        </div>

        {/* onSubmit ejecuta submit para validar credenciales y llamar a POST /api/auth/login (HU-01) */}
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-10 text-slate-900 shadow-2xl">
          <div className="mb-8 flex items-center gap-3">
            <BookOpenText className="h-7 w-7 text-slate-500" />
            <h2 className="text-2xl font-semibold">Iniciar sesión</h2>
          </div>

          <label className="mb-4 block text-sm">
            Correo electrónico
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-slate-400"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="mb-4 block text-sm">
            Contraseña
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 focus:border-slate-400"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

          {/* Botón de acceso: bloqueado mientras se procesa la solicitud a la API */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
