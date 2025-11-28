import { useState, useEffect } from 'react'

export default function Settings() {
    const [hourlyRate, setHourlyRate] = useState(500)
    const [electricityCostPerHour, setElectricityCostPerHour] = useState(100)
    const [saveStatus, setSaveStatus] = useState('')

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('tanuki_settings')
            if (savedSettings) {
                const settings = JSON.parse(savedSettings)
                if (settings.hourlyRate) setHourlyRate(settings.hourlyRate)
                if (settings.electricityCostPerHour) setElectricityCostPerHour(settings.electricityCostPerHour)
            }
        } catch (e) {
            console.error('Error loading settings:', e)
        }
    }, [])

    // Auto-save settings when they change
    useEffect(() => {
        const settings = {
            hourlyRate,
            electricityCostPerHour
        }

        try {
            localStorage.setItem('tanuki_settings', JSON.stringify(settings))
            setSaveStatus('✅ Guardado automáticamente')

            // Clear status after 2 seconds
            const timer = setTimeout(() => {
                setSaveStatus('')
            }, 2000)

            return () => clearTimeout(timer)
        } catch (e) {
            console.error('Error saving settings:', e)
            setSaveStatus('❌ Error al guardar')
        }
    }, [hourlyRate, electricityCostPerHour])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(value)
    }

    return (
        <section className="content-fade-in">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h2>
                <p className="text-gray-600">Define tus costos fijos y parámetros del negocio</p>
            </div>

            <div className="max-w-3xl">
                {/* Global Settings Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-50 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-tanuki-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-tanuki-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Costos Globales</h3>
                                <p className="text-sm text-gray-500">Estos valores se aplicarán por defecto en la calculadora</p>
                            </div>
                        </div>
                        {saveStatus && (
                            <span className="text-sm font-medium text-gray-600 animate-fade-in">
                                {saveStatus}
                            </span>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Hourly Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Valor Hora Hombre
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="500"
                                    step="10"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <span className="text-gray-500 text-sm">ARS/hora</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Costo actual: <strong className="text-tanuki-600">{formatCurrency(hourlyRate)}</strong> por hora de trabajo
                            </p>
                        </div>

                        {/* Electricity Cost */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Costo KWh Luz
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={electricityCostPerHour}
                                    onChange={(e) => setElectricityCostPerHour(parseFloat(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    placeholder="100"
                                    step="10"
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tanuki-500 focus:border-transparent transition-all"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <span className="text-gray-500 text-sm">ARS/hora</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Costo actual: <strong className="text-tanuki-600">{formatCurrency(electricityCostPerHour)}</strong> por hora de uso de plancha
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900 mb-1">Guardado Automático</h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Los cambios se guardan automáticamente y se aplicarán en todos los cálculos nuevos.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-tanuki-50 rounded-xl p-4 border border-tanuki-100">
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-tanuki-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <svg className="w-5 h-5 text-tanuki-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-tanuki-900 mb-1">Uso en Calculadora</h4>
                                <p className="text-xs text-tanuki-700 leading-relaxed">
                                    Estos valores se usan como predeterminados en la calculadora de costos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Example Calculation */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Ejemplo de Cálculo
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-3">
                            <p className="text-gray-600 text-xs mb-1">30 minutos de trabajo</p>
                            <p className="text-gray-900 font-semibold">{formatCurrency((hourlyRate / 60) * 30)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                            <p className="text-gray-600 text-xs mb-1">60 segundos de planchado</p>
                            <p className="text-gray-900 font-semibold">{formatCurrency((electricityCostPerHour / 3600) * 60)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
