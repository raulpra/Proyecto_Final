# STI - Sistema de Talleres Integrado 🚗🛠️

**STI** es una plataforma web completa diseñada para la gestión integral de talleres mecánicos. Su objetivo es digitalizar y optimizar el flujo de trabajo diario, permitiendo llevar un control riguroso de los clientes, sus vehículos y las reparaciones realizadas.

## 🌟 Características Principales

El sistema está dividido en módulos accesibles según el rol del usuario (Administrador o Técnico):

- 🔒 **Seguridad y Accesos**: Autenticación mediante JWT (JSON Web Tokens) con control de roles.
- 👥 **Gestión de Clientes**: Base de datos de clientes con historial de altas, datos de contacto y facturación.
- 🚙 **Gestión de Vehículos**: Registro del parque móvil del taller vinculado a sus respectivos dueños.
- 📋 **Órdenes de Reparación**: Ciclo de vida completo de una reparación:
  - Estado en tiempo real: *Pendiente*, *En Curso*, *Finalizado*, *Cancelado*.
  - Presupuesto estimado vs. Precio final.
  - Historial de averías por matrícula.

## 💻 Pila Tecnológica (Tech Stack)

### Backend (API REST)
- **Lenguaje:** Java 21
- **Framework:** Spring Boot 3
- **Persistencia:** Spring Data JPA + Hibernate
- **Base de Datos:** MariaDB (Relacional)
- **Seguridad:** Spring Security + JWT Stateless

### Frontend (SPA)
- **Librería:** React 18
- **Lenguaje:** TypeScript
- **Bundler:** Vite
- **Estilos:** Vanilla CSS (Diseño adaptativo "GMS")

### DevOps & Despliegue
- **Contenedores:** Docker y Docker Compose (Multi-stage builds)
- **Infraestructura:** Preparado para despliegue Cloud (AWS EC2)

## 🚀 Instalación y Ejecución Local

Gracias a la orquestación con Docker, el proyecto puede ser levantado con un solo comando sin necesidad de instalar Java, Node.js o MariaDB en tu máquina.

1. Clona este repositorio.
2. Abre una terminal en la raíz del proyecto.
3. Ejecuta el siguiente comando:
   ```bash
   docker-compose up -d --build
   ```
4. Accede a la aplicación desde tu navegador:
   - **Frontend:** http://localhost:80
   - **Backend API:** http://localhost:8080/api

*Credenciales por defecto del sistema:*
- **Usuario:** `admin`
- **Contraseña:** `admin`

## 📂 Estructura del Proyecto

- `/src` y `pom.xml`: Código fuente del Backend (Spring Boot).
- `/frontend`: Código fuente del Frontend (React + Vite).
- `/postman`: Colección de pruebas de la API listas para importar.
- `docker-compose.yaml`: Fichero de orquestación de servicios (App, BD y Web).
