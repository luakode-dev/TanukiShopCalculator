export default function Dashboard() {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-gray-600">Vista general de tu negocio de sublimación</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Productos</span>
                        <div className="w-8 h-8 bg-tanuki-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-tanuki-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500 mt-1">En catálogo</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Cálculos</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500 mt-1">Realizados hoy</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Costo Promedio</span>
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                    <p className="text-xs text-gray-500 mt-1">Por producto</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Margen</span>
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0%</p>
                    <p className="text-xs text-gray-500 mt-1">Promedio</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bienvenido a Tanuki Shop Admin</h3>
                <p className="text-gray-600 mb-4">
                    Esta es tu herramienta para gestionar los costos de sublimación. Comienza por:
                </p>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                        <svg className="w-5 h-5 text-tanuki-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Configurar tus costos fijos en la sección de <strong>Configuración</strong></span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-5 h-5 text-tanuki-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Usar la <strong>Calculadora de Costos</strong> para calcular precios de productos</span>
                    </li>
                    <li className="flex items-start">
                        <svg className="w-5 h-5 text-tanuki-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Revisar tus productos guardados en el <strong>Catálogo</strong></span>
                    </li>
                </ul>
            </div>
        </section>
    )
}
