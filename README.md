# Sistema Integral de Gestión KALLARI (SIG-KALLARI)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Una **Aplicación Web Progresiva (PWA)** diseñada para la **Asociación KALLARI**, dedicada a la comercialización de productos derivados del cacao, vainilla, macambo y otros. El sistema permite gestionar inventario, registrar ventas, administrar clientes y predecir la demanda de productos, incluso en zonas con conectividad intermitente.

✅ **Funciona completamente offline**  
🔄 **Sincronización automática al recuperar conexión**  
📱 **Instalable como app en dispositivos móviles**  
📊 **Modelo predictivo integrado basado en historial de ventas**

---

## 🌟 Características principales

- **Gestión de inventario**: registro de productos, control de stock, alertas de stock mínimo.
- **Ventas y clientes**: creación de órdenes, cálculo automático de IVA (15%), historial de transacciones.
- **Modo offline**: todas las operaciones se almacenan localmente y se sincronizan cuando hay conexión.
- **Predicción de demanda**: análisis de productos más vendidos, tendencias mensuales y recomendaciones de reposición.
- **Interfaz responsiva**: optimizada para móviles, tablets y escritorio.
- **Seguridad**: autenticación JWT, comunicación HTTPS, validación de entradas.

---

## 🛠️ Tecnologías utilizadas

| Capa          | Tecnología                     |
|---------------|--------------------------------|
| Frontend      | React + JavaScript          |
| PWA           | Workbox, Manifest, IndexedDB   |
| Backend       | Node.js + Express              |
| Base de datos | PostgreSQL                     |
| Almacenamiento offline | IndexedDB wrapper |

---

## 🚀 Inicio rápido (Desarrollo local)

### Requisitos previos
- Node.js ≥ 18
- PostgreSQL ≥ 12
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sig-kallari.git
cd sig-kallari
