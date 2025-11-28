import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
}

export function CurrencyProvider({ children }) {
    const [bcvRate, setBcvRate] = useState(null)
    const [paraleloRate, setParaleloRate] = useState(null)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [useManualRates, setUseManualRates] = useState(false)
    const [manualBcv, setManualBcv] = useState(null)
    const [manualParalelo, setManualParalelo] = useState(null)

    // Load saved data from localStorage on mount
    useEffect(() => {
        try {
            const savedRates = localStorage.getItem('tanuki_currency_rates')
            const savedManualRates = localStorage.getItem('tanuki_manual_currency_rates')

            if (savedRates) {
                const rates = JSON.parse(savedRates)
                setBcvRate(rates.bcvRate)
                setParaleloRate(rates.paraleloRate)
                setLastUpdate(rates.lastUpdate)
            }

            if (savedManualRates) {
                const manual = JSON.parse(savedManualRates)
                setUseManualRates(manual.useManualRates || false)
                setManualBcv(manual.manualBcv)
                setManualParalelo(manual.manualParalelo)
            }
        } catch (e) {
            console.error('Error loading saved currency data:', e)
        }
    }, [])

    // Fetch rates from API
    const fetchRates = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch('https://ve.dolarapi.com/v1/dolares')

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            // Filter BCV (Oficial) and Paralelo rates
            const bcv = data.find(item =>
                item.nombre === 'Oficial' || item.fuente === 'oficial'
            )
            const paralelo = data.find(item =>
                item.nombre === 'Paralelo' || item.fuente === 'paralelo'
            )

            if (bcv && paralelo) {
                const bcvData = {
                    promedio: bcv.promedio,
                    fechaActualizacion: bcv.fechaActualizacion
                }
                const paraleloData = {
                    promedio: paralelo.promedio,
                    fechaActualizacion: paralelo.fechaActualizacion
                }

                setBcvRate(bcvData)
                setParaleloRate(paraleloData)
                setLastUpdate(new Date().toISOString())

                // Save to localStorage
                localStorage.setItem('tanuki_currency_rates', JSON.stringify({
                    bcvRate: bcvData,
                    paraleloRate: paraleloData,
                    lastUpdate: new Date().toISOString()
                }))
            } else {
                throw new Error('No se encontraron las tasas BCV o Paralelo en la respuesta')
            }
        } catch (err) {
            console.error('Error fetching currency rates:', err)
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch rates on mount
    useEffect(() => {
        if (!useManualRates) {
            fetchRates()
        } else {
            setIsLoading(false)
        }
    }, [useManualRates])

    // Refresh rates manually
    const refreshRates = () => {
        if (!useManualRates) {
            fetchRates()
        }
    }

    // Set manual rates
    const setManualRates = (bcv, paralelo) => {
        setManualBcv(bcv)
        setManualParalelo(paralelo)

        // Save to localStorage
        localStorage.setItem('tanuki_manual_currency_rates', JSON.stringify({
            useManualRates,
            manualBcv: bcv,
            manualParalelo: paralelo
        }))
    }

    // Toggle manual rates
    const toggleManualRates = (enabled) => {
        setUseManualRates(enabled)

        // Save to localStorage
        localStorage.setItem('tanuki_manual_currency_rates', JSON.stringify({
            useManualRates: enabled,
            manualBcv,
            manualParalelo
        }))

        // If switching to API mode, fetch fresh rates
        if (!enabled) {
            fetchRates()
        }
    }

    // Get current active rates
    const getCurrentBcvRate = () => {
        if (useManualRates && manualBcv) {
            return manualBcv
        }
        return bcvRate?.promedio || 0
    }

    const getCurrentParaleloRate = () => {
        if (useManualRates && manualParalelo) {
            return manualParalelo
        }
        return paraleloRate?.promedio || 0
    }

    const value = {
        bcvRate,
        paraleloRate,
        lastUpdate,
        isLoading,
        error,
        useManualRates,
        manualBcv,
        manualParalelo,
        refreshRates,
        setManualRates,
        toggleManualRates,
        getCurrentBcvRate,
        getCurrentParaleloRate
    }

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    )
}
