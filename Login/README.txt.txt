# 🚀 Sistema de Autenticación Pro - Angular 19 & Tailwind v4

¡Hola! Soy un desarrollador FullStack Junior y este es el último proyecto realizado hasta la fecha. Mi objetivo era construir una base sólida para aplicaciones empresariales, centrada en la seguridad, el rendimiento y una experiencia de usuario moderna.

### 🛠️ Tecnologías y Herramientas
* **Angular 19:** Implementación de **Signals** para una gestión de estado reactiva y eficiente.
* **Tailwind CSS v4:** Diseño moderno con efectos de Glassmorphism, variables dinámicas y transiciones fluidas.
* **TypeScript:** Aplicando tipado estricto para un código robusto y mantenible.
* **RxJS:** Manejo avanzado de flujos de datos asíncronos en servicios e interceptores.

### ✨ Características Principales
* **Seguridad Profesional:** Implementación de `authGuard` con redirección inteligente (guarda la URL de origen mediante `returnUrl`).
* **Interceptores HTTP:** Centralización de credenciales JWT y gestión global de errores (401, 403, 500) con feedback visual mediante un **Toast Service**.
* **Validaciones Avanzadas:** Formularios reactivos con validadores personalizados (confirmación de contraseñas) y feedback en tiempo real.
* **Rendimiento Optimizado:** Uso de **Lazy Loading** para una carga modular y rápida de la aplicación.
* **UI/UX Moderna:** Animaciones de entrada con `@angular/animations` y diseño "mobile-first".

### 📂 Estructura del Proyecto
* `/guards`: Protección de rutas.
* `/interceptors`: Lógica de seguridad en peticiones HTTP.
* `/services`: Comunicación con API y lógica de negocio.
* `/components`: UI modular (Login, Register, Dashboard).

¿Qué hace el proyecto? Se trata de una aplicación Fullstack que permite el flujo completo de un usuario: desde el registro seguro hasta la gestión de su perfil (edición y borrado), asegurando que solo los usuarios autenticados accedan al panel principal.