import { useEffect } from 'react'

const navItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        id: 'calculator',
        label: 'Calculadora de Costos',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        id: 'catalog',
        label: 'Catálogo de Productos',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        )
    },
    {
        id: 'settings',
        label: 'Configuración',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    }
]

export default function Layout({
    currentSection,
    navigateToSection,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    children
}) {
    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    // Close mobile menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                closeMobileMenu()
            }
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [closeMobileMenu])

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`
          w-[280px] bg-gradient-to-b from-tanuki-600 to-tanuki-700 
          border-r border-white/10 transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 fixed top-0 left-0 bottom-0 z-30
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-2xl lg:shadow-none
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Header */}
                    <div className="px-4 py-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-tanuki-300 to-tanuki-400 rounded-xl flex items-center justify-center text-2xl shadow-lg hover:scale-105 transition-transform">
                                🦝
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Tanuki Shop</h1>
                                <p className="text-xs text-tanuki-200">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={closeMobileMenu}
                            className="lg:hidden text-white hover:bg-tanuki-700 p-2 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => navigateToSection(item.id)}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  text-sm font-medium transition-all duration-200
                  relative overflow-hidden group
                  ${currentSection === item.id
                                        ? 'bg-white/15 text-white shadow-sm'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
                                    }
                `}
                            >
                                {currentSection === item.id && (
                                    <div className="absolute left-0 top-0 h-full w-1 bg-tanuki-300" />
                                )}
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="px-4 py-4 border-t border-white/10 bg-black/10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-tanuki-500 flex items-center justify-center text-white font-semibold">
                                TS
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Tanuki Shop</p>
                                <p className="text-xs text-tanuki-200 truncate">admin@tanukishop.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    onClick={closeMobileMenu}
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-tanuki-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">Tanuki Shop Admin</h2>
                        <div className="w-6" />
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 lg:p-8">
                    <div className="content-fade-in">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
