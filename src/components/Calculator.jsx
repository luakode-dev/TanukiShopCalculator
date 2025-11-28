import { useState, useEffect } from 'react'
import { useCurrency } from '../contexts/CurrencyContext'

export default function Calculator() {
    const { getCurrentBcvRate, getCurrentParaleloRate } = useCurrency()

    // Form state
    const [productName, setProductName] = useState('')
    const [category, setCategory] = useState('Textil')
    const [selectedCurrency, setSelectedCurrency] = useState('paralelo') // 'bcv' or 'paralelo'
    const [editingId, setEditingId] = useState(null) // ID of product being edited

    // Direct costs
    const [baseCost, setBaseCost] = useState(0)
    const [transferPaperCost, setTransferPaperCost] = useState(0)
    const [inkCost, setInkCost] = useState(0)
    const [packagingCost, setPackagingCost] = useState(0)

    // Indirect costs
    const [productionTime, setProductionTime] = useState(0) // minutes
    const [pressingTime, setPressingTime] = useState(0) // seconds

    // Margins and channels
    const [profitMargin, setProfitMargin] = useState(30)
    const [taxRate, setTaxRate] = useState(21) // IVA
    const [isMercadoLibre, setIsMercadoLibre] = useState(false)
    const [platformCommission, setPlatformCommission] = useState(15)

    // Configuration values (default values, will be editable)
    const [hourlyRate, setHourlyRate] = useState(500) // Cost per hour for labor
    const [electricityCostPerHour, setElectricityCostPerHour] = useState(100) // Cost per hour for electricity

    // Calculated values
    const [laborCost, setLaborCost] = useState(0)
    const [electricityCost, setElectricityCost] = useState(0)
    const [totalManufacturingCost, setTotalManufacturingCost] = useState(0)
    const [suggestedPrice, setSuggestedPrice] = useState(0)
    const [exactPrice, setExactPrice] = useState(0)
    const [netProfit, setNetProfit] = useState(0)

    // Load saved state and global settings on mount
    useEffect(() => {
        // Check if we are editing a product
        const productToEdit = localStorage.getItem('tanuki_product_to_edit')
        if (productToEdit) {
            try {
                const product = JSON.parse(productToEdit)
                setEditingId(product.id)
                setProductName(product.name)
                setCategory(product.category)
                setBaseCost(product.baseCost)
                setTransferPaperCost(product.transferPaperCost)
                setInkCost(product.inkCost)
                setPackagingCost(product.packagingCost)
                setProductionTime(product.productionTime)
                setPressingTime(product.pressingTime)
                setProfitMargin(product.profitMargin)
                setTaxRate(product.taxRate)
                setIsMercadoLibre(product.isMercadoLibre)
                setPlatformCommission(product.platformCommission)

                // Clear the edit flag so it doesn't persist on reload if user navigates away
                localStorage.removeItem('tanuki_product_to_edit')
                return // Skip loading other states if editing
            } catch (e) {
                console.error('Error loading product to edit:', e)
            }
        }

        // Load global settings first
        const savedSettings = localStorage.getItem('tanuki_settings')
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings)
                if (settings.hourlyRate) setHourlyRate(settings.hourlyRate)
                if (settings.electricityCostPerHour) setElectricityCostPerHour(settings.electricityCostPerHour)
            } catch (e) {
                console.error('Error loading settings:', e)
            }
        }

        // Then load calculator state (which can override settings)
        const savedState = localStorage.getItem('tanuki_calculator_state')
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState)
                setProductName(parsed.productName || '')
                setCategory(parsed.category || 'Textil')
                setBaseCost(parsed.baseCost || 0)
                setTransferPaperCost(parsed.transferPaperCost || 0)
                setInkCost(parsed.inkCost || 0)
                setPackagingCost(parsed.packagingCost || 0)
                setProductionTime(parsed.productionTime || 0)
                setPressingTime(parsed.pressingTime || 0)
                setProfitMargin(parsed.profitMargin || 30)
                setTaxRate(parsed.taxRate || 21)
                setIsMercadoLibre(parsed.isMercadoLibre || false)
                setPlatformCommission(parsed.platformCommission || 15)
            } catch (e) {
                console.error('Error loading calculator state:', e)
            }
        }
    }, [])

    // Save state on changes
    useEffect(() => {
        const stateToSave = {
            productName,
            category,
            baseCost,
            transferPaperCost,
            inkCost,
            packagingCost,
            productionTime,
            pressingTime,
            profitMargin,
            taxRate,
            isMercadoLibre,
            platformCommission,
            hourlyRate,
            electricityCostPerHour
        }
        localStorage.setItem('tanuki_calculator_state', JSON.stringify(stateToSave))
    }, [productName, category, baseCost, transferPaperCost, inkCost, packagingCost,
        productionTime, pressingTime, profitMargin, taxRate, isMercadoLibre,
        platformCommission, hourlyRate, electricityCostPerHour])

    // Calculate costs in real-time
    useEffect(() => {
        // Calculate labor cost from production time
        const calculatedLaborCost = (productionTime / 60) * hourlyRate
        setLaborCost(calculatedLaborCost)

        // Calculate electricity cost from pressing time
        const calculatedElectricityCost = (pressingTime / 3600) * electricityCostPerHour
        setElectricityCost(calculatedElectricityCost)

        // Calculate total manufacturing cost
        const directCosts = baseCost + transferPaperCost + inkCost + packagingCost
        const indirectCosts = calculatedLaborCost + calculatedElectricityCost
        const totalCost = directCosts + indirectCosts
        setTotalManufacturingCost(totalCost)

        // Calculate suggested price with profit margin
        const priceWithMargin = totalCost * (1 + profitMargin / 100)

        // Apply platform commission if Mercado Libre
        let finalPrice = priceWithMargin
        if (isMercadoLibre) {
            // Price needs to cover the commission
            finalPrice = priceWithMargin / (1 - platformCommission / 100)
        }

        // Apply taxes
        // Apply taxes
        const priceWithTax = finalPrice * (1 + taxRate / 100)

        // Rounding logic: Round UP to nearest integer
        const roundedPrice = Math.ceil(priceWithTax)

        setSuggestedPrice(roundedPrice)
        setExactPrice(priceWithTax)

        // Calculate net profit based on ROUNDED price
        let platformFee = 0
        if (isMercadoLibre) {
            platformFee = roundedPrice * (platformCommission / 100)
        }
        const profit = roundedPrice - totalCost - platformFee
        setNetProfit(profit)

    }, [baseCost, transferPaperCost, inkCost, packagingCost, productionTime, pressingTime,
        profitMargin, taxRate, isMercadoLibre, platformCommission, hourlyRate, electricityCostPerHour])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(value)
    }

    const formatBolivares = (usdValue) => {
        const rate = selectedCurrency === 'bcv' ? getCurrentBcvRate() : getCurrentParaleloRate()
        const bsValue = usdValue * rate
        return new Intl.NumberFormat('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(bsValue)
    }

    const getCurrentRate = () => {
        return selectedCurrency === 'bcv' ? getCurrentBcvRate() : getCurrentParaleloRate()
    }

    const cancelEdit = () => {
        setEditingId(null)
        setProductName('')
        setBaseCost(0)
        setTransferPaperCost(0)
        setInkCost(0)
        setPackagingCost(0)
        setProductionTime(0)
        setPressingTime(0)
        // Reset to defaults or keep current settings? Keeping settings seems better.
        alert('Edición cancelada')
    }

    const saveProduct = () => {
        // Validate product name
        if (!productName.trim()) {
            alert('Por favor, ingresa un nombre para el producto')
            return
        }

        // Create product object
        const product = {
            id: editingId || Date.now(), // Use existing ID if editing, else new timestamp
            name: productName,
            category: category,
            baseCost: baseCost,
            transferPaperCost: transferPaperCost,
            inkCost: inkCost,
            packagingCost: packagingCost,
            productionTime: productionTime,
            pressingTime: pressingTime,
            laborCost: laborCost,
            electricityCost: electricityCost,
            totalManufacturingCost: totalManufacturingCost,
            profitMargin: profitMargin,
            taxRate: taxRate,
            isMercadoLibre: isMercadoLibre,
            platformCommission: platformCommission,
            suggestedPrice: suggestedPrice,
            netProfit: netProfit,
            createdAt: editingId ? undefined : new Date().toISOString() // Keep original date if editing
        }

        // Load existing products
        let products = []
        try {
            const savedProducts = localStorage.getItem('tanuki_products')
            if (savedProducts) {
                products = JSON.parse(savedProducts)
            }
        } catch (e) {
            console.error('Error loading products:', e)
        }

        if (editingId) {
            // Update existing product
            const index = products.findIndex(p => p.id === editingId)
            if (index !== -1) {
                // Preserve original createdAt
                product.createdAt = products[index].createdAt
                products[index] = product
                alert(`✅ Producto "${productName}" actualizado exitosamente`)
            } else {
                // If not found (weird), add as new
                product.createdAt = new Date().toISOString()
                products.push(product)
                alert(`⚠️ No se encontró el original, se guardó como nuevo: "${productName}"`)
            }
            setEditingId(null) // Exit edit mode
        } else {
            // Add new product
            products.push(product)
            alert(`✅ Producto "${productName}" guardado exitosamente`)
        }

        // Save to localStorage
        try {
            localStorage.setItem('tanuki_products', JSON.stringify(products))
        } catch (e) {
            console.error('Error saving product:', e)
            alert('❌ Error al guardar el producto. Por favor, intenta nuevamente.')
        }
    }

    return (
        <section className="content-fade-in">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de Costos</h2>
                <p className="text-gray-600">Calcula el costo total de tus productos de sublimación</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product Information */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-tanuki-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-tanuki-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            Información del Producto
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Producto
                                </label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="ej: Taza 11oz, Remera Blanca Adulto"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Categoría
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                >
                                    <option value="Textil">Textil</option>
                                    <option value="Cerámica">Cerámica</option>
                                    <option value="Aluminio">Aluminio</option>
                                    <option value="Gorras">Gorras</option>
                                    <option value="DTF">DTF</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Direct Costs */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Costos Directos
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Costo del Producto Base
                                </label>
                                <input
                                    type="number"
                                    value={baseCost}
                                    onChange={(e) => setBaseCost(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Costo del Papel Transfer
                                </label>
                                <input
                                    type="number"
                                    value={transferPaperCost}
                                    onChange={(e) => setTransferPaperCost(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Costo de Tinta
                                </label>
                                <input
                                    type="number"
                                    value={inkCost}
                                    onChange={(e) => setInkCost(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Costo de Empaque/Packaging
                                </label>
                                <input
                                    type="number"
                                    value={packagingCost}
                                    onChange={(e) => setPackagingCost(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Indirect Costs */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            Costos Indirectos
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiempo de Producción (minutos)
                                </label>
                                <input
                                    type="number"
                                    value={productionTime}
                                    onChange={(e) => setProductionTime(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    step="1"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Costo calculado: {formatCurrency(laborCost)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiempo de Planchado (segundos)
                                </label>
                                <input
                                    type="number"
                                    value={pressingTime}
                                    onChange={(e) => setPressingTime(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="0"
                                    step="1"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Costo de luz: {formatCurrency(electricityCost)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Costo Hora Mano de Obra
                                </label>
                                <input
                                    type="number"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="500"
                                    step="10"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Costo Hora Electricidad
                                </label>
                                <input
                                    type="number"
                                    value={electricityCostPerHour}
                                    onChange={(e) => setElectricityCostPerHour(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="100"
                                    step="10"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Margins and Sales Channels */}
                    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            Márgenes y Canales de Venta
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Margen de Ganancia (%)
                                </label>
                                <input
                                    type="number"
                                    value={profitMargin}
                                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="30"
                                    step="1"
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Impuestos / IVA (%)
                                </label>
                                <input
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="21"
                                    step="0.5"
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Currency Selector */}
                            <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    💱 Tasa de Cambio para Conversión a Bolívares
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <label className="flex items-center space-x-3 cursor-pointer group flex-1 bg-white rounded-lg p-3 border-2 transition-all hover:border-green-300"
                                        style={{ borderColor: selectedCurrency === 'bcv' ? '#10b981' : '#e5e7eb' }}>
                                        <input
                                            type="radio"
                                            name="currency"
                                            value="bcv"
                                            checked={selectedCurrency === 'bcv'}
                                            onChange={(e) => setSelectedCurrency(e.target.value)}
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                🏛️ BCV (Oficial)
                                            </span>
                                            <span className="text-xs text-green-700 font-semibold">
                                                1 USD = Bs {getCurrentBcvRate().toFixed(2)}
                                            </span>
                                        </div>
                                    </label>

                                    <label className="flex items-center space-x-3 cursor-pointer group flex-1 bg-white rounded-lg p-3 border-2 transition-all hover:border-green-300"
                                        style={{ borderColor: selectedCurrency === 'paralelo' ? '#10b981' : '#e5e7eb' }}>
                                        <input
                                            type="radio"
                                            name="currency"
                                            value="paralelo"
                                            checked={selectedCurrency === 'paralelo'}
                                            onChange={(e) => setSelectedCurrency(e.target.value)}
                                            className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 cursor-pointer"
                                        />
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                💸 Paralelo
                                            </span>
                                            <span className="text-xs text-green-700 font-semibold">
                                                1 USD = Bs {getCurrentParaleloRate().toFixed(2)}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={isMercadoLibre}
                                        onChange={(e) => setIsMercadoLibre(e.target.checked)}
                                        className="w-5 h-5 text-tanuki-600 border-gray-300 rounded-sm focus:ring-tanuki-500 cursor-pointer"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-tanuki-600 transition-colors">
                                        ¿Es venta por Mercado Libre?
                                    </span>
                                </label>
                            </div>

                            {isMercadoLibre && (
                                <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comisión de Plataforma (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={platformCommission}
                                        onChange={(e) => setPlatformCommission(parseFloat(e.target.value) || 0)}
                                        onFocus={(e) => e.target.select()}
                                        placeholder="15"
                                        step="0.5"
                                        min="0"
                                        max="100"
                                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="sticky top-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultados</h3>

                        {/* Manufacturing Cost Card */}
                        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-blue-100 text-sm font-medium">Costo Total de Fabricación</span>
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {formatCurrency(totalManufacturingCost)}
                            </p>
                            <p className="text-lg text-white/80 font-medium mb-1">
                                ≈ {formatBolivares(totalManufacturingCost)}
                            </p>
                            <p className="text-xs text-blue-100">
                                Incluye costos directos e indirectos
                            </p>
                        </div>

                        {/* Suggested Price Card */}
                        <div className="bg-linear-to-br from-tanuki-500 to-tanuki-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-tanuki-100 text-sm font-medium">Precio de Venta Sugerido</span>
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex items-baseline flex-wrap gap-x-2 mb-1">
                                <p className="text-3xl font-bold text-white">
                                    {formatCurrency(exactPrice)}
                                </p>
                                <div className="flex items-center text-tanuki-100 bg-white/10 px-2 py-0.5 rounded-md">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    <span className="text-lg font-semibold">{formatCurrency(suggestedPrice)}</span>
                                </div>
                            </div>
                            <p className="text-lg text-white/80 font-medium mb-1">
                                ≈ {formatBolivares(suggestedPrice)}
                            </p>
                            <p className="text-xs text-tanuki-100">
                                Con margen, impuestos {isMercadoLibre && '+ comisión ML'}
                            </p>
                        </div>

                        {/* Net Profit Card */}
                        <div className={`bg-linear-to-br ${netProfit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/90 text-sm font-medium">Ganancia Neta Real</span>
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {formatCurrency(netProfit)}
                            </p>
                            <p className="text-lg text-white/80 font-medium mb-1">
                                ≈ {formatBolivares(netProfit)}
                            </p>
                            <p className="text-xs text-white/90">
                                {totalManufacturingCost > 0
                                    ? `${((netProfit / totalManufacturingCost) * 100).toFixed(1)}% de rentabilidad`
                                    : 'Ingresa los costos para calcular'
                                }
                            </p>
                        </div>

                        {/* Save Button */}
                        <div className="flex gap-3 mt-4">
                            {editingId && (
                                <button
                                    onClick={cancelEdit}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                onClick={saveProduct}
                                className="flex-1 bg-gradient-to-r from-tanuki-500 to-tanuki-600 hover:from-tanuki-600 hover:to-tanuki-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                <span>{editingId ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                            </button>
                        </div>

                        {/* Info Card */}
                        <div className="bg-gray-50 rounded-xl p-4 mt-4 border border-gray-200">
                            <p className="text-xs text-gray-600 leading-relaxed">
                                💡 <strong>Tip:</strong> Los valores de mano de obra y electricidad pueden configurarse desde la sección de Configuración para aplicarlos automáticamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
