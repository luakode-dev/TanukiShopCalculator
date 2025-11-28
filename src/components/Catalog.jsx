import { useState, useEffect } from 'react'

export default function Catalog() {
    const [products, setProducts] = useState([])

    // Load products from localStorage
    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = () => {
        try {
            const savedProducts = localStorage.getItem('tanuki_products')
            if (savedProducts) {
                const parsedProducts = JSON.parse(savedProducts)
                // Sort by creation date, newest first
                parsedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                setProducts(parsedProducts)
            }
        } catch (e) {
            console.error('Error loading products:', e)
        }
    }

    const deleteProduct = (productId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                const updatedProducts = products.filter(p => p.id !== productId)
                localStorage.setItem('tanuki_products', JSON.stringify(updatedProducts))
                setProducts(updatedProducts)
            } catch (e) {
                console.error('Error deleting product:', e)
                alert('❌ Error al eliminar el producto')
            }
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <section className="content-fade-in">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h2>
                <p className="text-gray-600">Todos tus cálculos guardados en un solo lugar</p>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-50">
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
            ) : (
                <div className="bg-white rounded-2xl shadow-xs border border-gray-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Costo Fabricación
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Precio Venta
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Ganancia
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                                <span className="text-xs text-gray-500">{formatDate(product.createdAt)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tanuki-100 text-tanuki-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(product.totalManufacturingCost)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(product.suggestedPrice)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-semibold ${product.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {formatCurrency(product.netProfit)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-110"
                                                title="Eliminar producto"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Total de productos: <strong className="text-gray-900">{products.length}</strong>
                            </span>
                            <span className="text-gray-600">
                                Ganancia total estimada: <strong className="text-green-600">
                                    {formatCurrency(products.reduce((sum, p) => sum + p.netProfit, 0))}
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
