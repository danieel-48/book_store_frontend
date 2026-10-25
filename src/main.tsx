// main.tsx: punto de entrada principal que monta la aplicación en el DOM · HU-01 a HU-08
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/index.css'
import App from '@/App.tsx'
import { AuthProvider } from '@/app/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Proveedor global de autenticación y control de inactividad */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
