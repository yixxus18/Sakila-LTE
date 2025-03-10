# Sistema de Gestión LTE

Aplicación React para la administración de videoclub con funcionalidades CRUD completas y gestión de relaciones complejas.

## Características Principales
- Gestión completa de entidades (Clientes, Películas, Tiendas, Alquileres, Pagos)
- Sistema de direcciones jerárquico (Países → Ciudades → Direcciones)
- Tablas interactivas con paginación, búsqueda y ordenamiento
- Panel administrativo con métricas en tiempo real
- Sistema de autenticación y permisos
- Diseño responsive con sidebar configurable

## Stack Tecnológico
- **Frontend**: 
  - React 18 + Vite
  - React Router 6
  - Bootstrap 5 + Plugins
  - Axios para comunicación HTTP
- **Backend**:
  - API RESTful (No especificada en el proyecto actual)
- **Herramientas**:
  - Custom Hooks (useFetch)
  - Context API para estado global
  - Validación de formularios integrada

## Estructura del Proyecto
```
Practica-LTE/
├── public/              # Assets estáticos y plugins de Bootstrap
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── CustomersTable.jsx  # Gestión de clientes
│   │   ├── FilmsTable.jsx      # Administración de películas
│   │   ├── DataTable.jsx       # Componente base para tablas
│   │   ├── Sidebar.jsx         # Navegación principal
│   │   └── ... (20+ componentes)
│   │
│   ├── pages/           # Vistas principales
│   │   ├── Home.jsx     # Dashboard con métricas
│   │   ├── customers/   # Gestión completa de clientes
│   │   ├── films/       # Administración de películas
│   │   └── stores/      # Control de tiendas e inventario
│   │
│   ├── hooks/           # Lógica reusable
│   │   └── useFetch.js  # Manejo de fetching de datos
│   │
│   ├── utils/           # Utilidades y configuraciones
│   │   └── fetchData.js # Configuración global de Axios
│   │
│   └── styles/          # Hojas de estilo globales
│       └── global.css   # Estilos base del sistema
```

## Componentes Clave

### 1. Sistema de Tablas (DataTable.jsx)
- Componente base para todas las tablas interactivas
- Funcionalidades:
  - Paginación dinámica
  - Búsqueda en tiempo real
  - Ordenamiento multi-campo
  - Acciones CRUD contextuales
  - Soporte para relaciones complejas

### 2. Gestión de Direcciones
- Jerarquía completa: Países → Ciudades → Direcciones
- Componentes especializados:
  - `CountriesTable.jsx`: Administración de países
  - `CitiesTable.jsx`: Gestión de ciudades por país
  - `AddressesTable.jsx`: Detalle de direcciones físicas

### 3. Sistema de Películas
- `FilmsTable.jsx`: Catálogo completo de películas
- Relaciones integradas:
  - Categorías de películas
  - Idiomas disponibles
  - Sistema de actores y repartos
  - Gestión de inventario por tienda

## Instalación y Uso

1. Clonar repositorio:
```bash
git clone [URL del repositorio]
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (crear .env basado en .env.example):
```bash
cp .env.example .env
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## Scripts Disponibles
| Comando           | Descripción                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Inicia servidor de desarrollo            |
| `npm run build`   | Crea versión optimizada para producción  |
| `npm run lint`    | Ejecuta análisis de código estático      |
| `npm run preview` | Previsualiza build de producción localmente |

## Configuración Avanzada
El sistema utiliza el archivo `sakilaConfig.js` para:
- Definir endpoints de la API
- Configurar parámetros globales
- Establecer relaciones entre entidades
- Personalizar opciones de visualización
