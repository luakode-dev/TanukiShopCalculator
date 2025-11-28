import { useState, useEffect } from 'react'
import { CurrencyProvider } from './contexts/CurrencyContext'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Calculator from './components/Calculator'
import Catalog from './components/Catalog'
import Settings from './components/Settings'

function App() {
    const [currentSection, setCurrentSection] = useState('dashboard')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Load saved section from localStorage on mount
    useEffect(() => {
        const hash = window.location.hash.substring(1)
        const savedSection = localStorage.getItem('tanukiShop_currentSection')

        if (hash) {
            setCurrentSection(hash)
        } else if (savedSection) {
            setCurrentSection(savedSection)
            window.location.hash = savedSection
        } else {
            window.location.hash = 'dashboard'
        }
    }, [])

    // Handle hash changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1)
            if (hash && hash !== currentSection) {
                setCurrentSection(hash)
            }
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [currentSection])

    // Save current section to localStorage
    useEffect(() => {
        localStorage.setItem('tanukiShop_currentSection', currentSection)
    }, [currentSection])

    const navigateToSection = (section) => {
        setCurrentSection(section)
        window.location.hash = section
        setIsMobileMenuOpen(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false)
    }

    const renderSection = () => {
        switch (currentSection) {
            case 'dashboard':
                return <Dashboard />
            case 'calculator':
                return <Calculator />
            case 'catalog':
                return <Catalog navigateToSection={navigateToSection} />
            case 'settings':
                return <Settings />
            default:
                return <Dashboard />
        }
    }

    return (
        <CurrencyProvider>
            <Layout
                currentSection={currentSection}
                navigateToSection={navigateToSection}
                isMobileMenuOpen={isMobileMenuOpen}
                toggleMobileMenu={toggleMobileMenu}
                closeMobileMenu={closeMobileMenu}
            >
                {renderSection()}
            </Layout>
        </CurrencyProvider>
    )
}

export default App
