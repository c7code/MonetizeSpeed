import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './store/auth'
import { useDataStore } from './store/dataStore'

export default function App() {
  const { token, logout } = useAuth()
  const loadData = useDataStore((state) => state.loadData)
  const error = useDataStore((state) => state.error)
  const clearError = useDataStore((state) => state.clearError)

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token, loadData])
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/transactions', label: 'Transações' },
    { to: '/budgets', label: 'Orçamentos' },
    { to: '/reports', label: 'Relatórios' },
    { to: '/goals', label: 'Metas' },
    { to: '/bank-import', label: 'Integração Bancos' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-semibold text-lg md:text-xl text-white">MonetizeSpeed</span>
              <nav className="hidden md:flex gap-2 text-sm">
                {navItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-1 rounded-full transition-colors ${pathname === item.to ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                  >{item.label}</Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="md:hidden px-2 py-1 text-white hover:bg-white/10 rounded"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <button
                className="px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white text-red-600 hover:bg-red-50 text-sm md:text-base"
                onClick={() => { logout(); navigate('/login') }}
              >Sair</button>
            </div>
          </div>
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pb-2 flex flex-col gap-2">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-full transition-colors text-sm ${pathname === item.to ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
                >{item.label}</Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-3 md:p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={clearError}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
