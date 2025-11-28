# Tanuki Shop Admin Panel

Panel de administración para gestión de costos y productos de sublimación.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Build tool y dev server ultrarrápido
- **Tailwind CSS** - Framework de CSS utility-first
- **JavaScript (ES6+)** - Lenguaje de programación

## 📋 Requisitos

- Node.js 18+ 
- npm 9+

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/luakode-dev/TanukiShopCalculator.git
cd TanukiShopCalculator
```

2. Instala las dependencias:
```bash
npm install
```

## 🎯 Uso

### Modo Desarrollo

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de Producción

Crea una build optimizada para producción:
```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/`

### Preview de Producción

Previsualiza la build de producción localmente:
```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
tanuki-shop-admin/
├── src/
│   ├── components/
│   │   ├── Layout.jsx        # Layout principal con sidebar
│   │   ├── Dashboard.jsx     # Vista del dashboard
│   │   ├── Calculator.jsx    # Calculadora de costos
│   │   ├── Catalog.jsx       # Catálogo de productos
│   │   └── Settings.jsx      # Configuración
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales
├── public/                   # Archivos estáticos
├── index.html                # HTML principal
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
├── tailwind.config.js        # Configuración de Tailwind
└── postcss.config.js         # Configuración de PostCSS
```

## ✨ Características

- 🎨 Diseño moderno y responsive con Tailwind CSS
- 🦝 Tema personalizado con colores Tanuki
- 📱 Totalmente responsive (mobile-first)
- ⚡ Navegación rápida con React Router
- 💾 Persistencia de estado con localStorage
- 🎯 Componentes reutilizables

## 🎨 Paleta de Colores

El proyecto utiliza una paleta de colores personalizada "Tanuki":
- Primario: Naranja (#EA580C - #F97316)
- Secundario: Marrón (#44403C - #78716C)

## 📝 Secciones

1. **Dashboard** - Vista general del negocio
2. **Calculadora de Costos** - Calcula precios de productos
3. **Catálogo de Productos** - Gestiona productos guardados
4. **Configuración** - Define costos fijos y parámetros

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**luakode-dev**
- GitHub: [@luakode-dev](https://github.com/luakode-dev)
- Email: lua.kode@gmail.com

---

Hecho con ❤️ y 🦝 por luakode-dev
