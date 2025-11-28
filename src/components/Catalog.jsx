export default function Catalog() {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h2>
                <p className="text-gray-600">Todos tus cálculos guardados en un solo lugar</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-gray-600 mb-2">No hay productos guardados aún</p>
                    <p className="text-sm text-gray-500">Usa la calculadora para crear tu primer producto</p>
                </div>
            </div>
        </section>
    )
}
