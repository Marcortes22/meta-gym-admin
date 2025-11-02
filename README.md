# MetaGym Admin

Panel de administración para Meta Gym - Sistema de gestión de gimnasios.

## 🔧 Configuración de Variables de Entorno

### Variables Requeridas

```bash
# ==============================================
# FIREBASE CONFIGURATION
# ==============================================

# Firebase Web App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (Server-side only)
# FIREBASE_PROJECT_ID=your_project_id
# FIREBASE_CLIENT_EMAIL=your_service_account_email
# FIREBASE_PRIVATE_KEY=your_private_key
```

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🎨 Paleta de Colores

- **Background**: `#0f0f10` - Negro oscuro
- **Accent**: `#fe6b24` - Naranja vibrante

## 🔐 Autenticación

El sistema utiliza Firebase Authentication con verificación en Firestore:
- Solo usuarios registrados en la colección `global_users` pueden acceder
- Autenticación mediante email/password
- Cookie de sesión para mantener el estado

## 📁 Estructura del Proyecto

```
app/
  (admin)/          # Rutas protegidas con layout y sidebar
    dashboard/      # Páginas del dashboard
  login/           # Página de login (pública)
modules/
  auth/            # Módulo de autenticación
shared/
  components/      # Componentes reutilizables (UI)
  hooks/          # Custom hooks
  lib/            # Utilidades y configuraciones
```
