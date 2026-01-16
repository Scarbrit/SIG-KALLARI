import { DataTypes } from 'sequelize';
// 1. Importa tu instancia de Sequelize desde tu archivo de base de datos
import db from '../database/database.js';
const { sequelize } = db;

// 2. Importa todas las definiciones de modelos de tu carpeta
import AsientoContableModel from './contabilidad/AsientoContable.js';
import AuditoriaModel from './auditoria/Auditoria.js';
import ParroquiaModel from './catalogo/Parroquia.js';
import CantonModel from './catalogo/Canton.js';
import EstadoCategoriaModel from './catalogo/EstadoCategoria.js';
import CategoriaProductoModel from './inventario/CategoriaProducto.js';
import ClienteModel from './ventas/Cliente.js';
import ConfiguracionBloqueoModel from './configuracion/ConfiguracionBloqueo.js';
import ConfiguracionTokenModel from './configuracion/ConfiguracionToken.js';
import DetalleAsientoModel from './contabilidad/DetalleAsiento.js';
import DetalleFacturaModel from './ventas/DetalleFactura.js';
import ErrorModel from './auditoria/Error.js';
import EstadoSriModel from './catalogo/EstadoSri.js';
import EstadoUsuarioModel from './seguridad/EstadoUsuario.js';
import FacturaModel from './ventas/Factura.js';
import MovimientoInventarioModel from './inventario/MovimientoInventario.js';
import PlanCuentaModel from './contabilidad/PlanCuenta.js';
import EstadoProductoModel from './catalogo/EstadoProducto.js';
import ProductoModel from './inventario/Producto.js';
import NotificacionesStockModel from './inventario/NotificacionesStock.js';
import ProvinciaModel from './catalogo/Provincia.js';
import RolModel from './seguridad/Rol.js';
import TipoIdentificacionModel from './catalogo/TipoIdentificacion.js';
import TipoMovimientoModel from './catalogo/TipoMovimiento.js';
import UsuarioModel from './seguridad/Usuario.js';
import ValorIvaModel from './catalogo/ValorIva.js';
import DescuentoModel from './ventas/Descuento.js';
import MetodoPagoModel from './catalogo/MetodoPago.js';
import ConfiguracionSriModel from './configuracion/ConfiguracionSri.js';
import CertificadoDigitalModel from './configuracion/CertificadoDigital.js';
import CuentaPorCobrarModel from './contabilidad/CuentaPorCobrar.js';
import PagoCuentaCobrarModel from './contabilidad/PagoCuentaCobrar.js';
import ClienteIdentificacionModel from './ventas/ClienteIdentificacion.js';
import EstadoClienteModel from './catalogo/EstadoCliente.js';
// Nuevos modelos para contabilidad completa
import TipoCuentaBancariaModel from './catalogo/TipoCuentaBancaria.js';
import EstadoProveedorModel from './catalogo/EstadoProveedor.js';
import ProveedorModel from './contabilidad/Proveedor.js';
import CuentaPorPagarModel from './contabilidad/CuentaPorPagar.js';
import PagoCuentaPagarModel from './contabilidad/PagoCuentaPagar.js';
import PeriodoContableModel from './contabilidad/PeriodoContable.js';
import CuentaBancariaModel from './contabilidad/CuentaBancaria.js';
import MovimientoCajaBancoModel from './contabilidad/MovimientoCajaBanco.js';

// 3. Inicializa cada modelo
const AsientoContable = AsientoContableModel(sequelize, DataTypes);
const Auditoria = AuditoriaModel(sequelize, DataTypes);
const Parroquia = ParroquiaModel(sequelize, DataTypes);
const Canton = CantonModel(sequelize, DataTypes);
const EstadoCategoria = EstadoCategoriaModel(sequelize, DataTypes);
const CategoriaProducto = CategoriaProductoModel(sequelize, DataTypes);
const Cliente = ClienteModel(sequelize, DataTypes);
const ConfiguracionBloqueo = ConfiguracionBloqueoModel(sequelize, DataTypes);
const ConfiguracionToken = ConfiguracionTokenModel(sequelize, DataTypes);
const DetalleAsiento = DetalleAsientoModel(sequelize, DataTypes);
const DetalleFactura = DetalleFacturaModel(sequelize, DataTypes);
const Error = ErrorModel(sequelize, DataTypes);
const EstadoSri = EstadoSriModel(sequelize, DataTypes);
const EstadoUsuario = EstadoUsuarioModel(sequelize, DataTypes);
const Factura = FacturaModel(sequelize, DataTypes);
const MovimientoInventario = MovimientoInventarioModel(sequelize, DataTypes);
const PlanCuenta = PlanCuentaModel(sequelize, DataTypes);
const EstadoProducto = EstadoProductoModel(sequelize, DataTypes);
const Producto = ProductoModel(sequelize, DataTypes);
const NotificacionesStock = NotificacionesStockModel(sequelize, DataTypes);
const Provincia = ProvinciaModel(sequelize, DataTypes);
const Rol = RolModel(sequelize, DataTypes);
const TipoIdentificacion = TipoIdentificacionModel(sequelize, DataTypes);
const TipoMovimiento = TipoMovimientoModel(sequelize, DataTypes);
const Usuario = UsuarioModel(sequelize, DataTypes);
const ValorIva = ValorIvaModel(sequelize, DataTypes);
const Descuento = DescuentoModel(sequelize, DataTypes);
const MetodoPago = MetodoPagoModel(sequelize, DataTypes);
const ConfiguracionSri = ConfiguracionSriModel(sequelize, DataTypes);
const CertificadoDigital = CertificadoDigitalModel(sequelize, DataTypes);
const CuentaPorCobrar = CuentaPorCobrarModel(sequelize, DataTypes);
const PagoCuentaCobrar = PagoCuentaCobrarModel(sequelize, DataTypes);
const ClienteIdentificacion = ClienteIdentificacionModel(sequelize, DataTypes);
const EstadoCliente = EstadoClienteModel(sequelize, DataTypes);
// Nuevos modelos inicializados
const TipoCuentaBancaria = TipoCuentaBancariaModel(sequelize, DataTypes);
const EstadoProveedor = EstadoProveedorModel(sequelize, DataTypes);
const Proveedor = ProveedorModel(sequelize, DataTypes);
const CuentaPorPagar = CuentaPorPagarModel(sequelize, DataTypes);
const PagoCuentaPagar = PagoCuentaPagarModel(sequelize, DataTypes);
const PeriodoContable = PeriodoContableModel(sequelize, DataTypes);
const CuentaBancaria = CuentaBancariaModel(sequelize, DataTypes);
const MovimientoCajaBanco = MovimientoCajaBancoModel(sequelize, DataTypes);

// 4. Agrupa todos los modelos en un objeto
// Esto permite que el bucle de asociaciones funcione
const models = {
    AsientoContable,
    Auditoria,
    Parroquia,
    Canton,
    EstadoCategoria,
    CategoriaProducto,
    Cliente,
    ConfiguracionBloqueo,
    ConfiguracionToken,
    DetalleAsiento,
    DetalleFactura,
    Error,
    EstadoSri,
    EstadoUsuario,
    Factura,
    MovimientoInventario,
    PlanCuenta,
    EstadoProducto,
    Producto,
    NotificacionesStock,
    Provincia,
    Rol,
    TipoIdentificacion,
    TipoMovimiento,
    Usuario,
    ValorIva,
    Descuento,
    MetodoPago,
    ConfiguracionSri,
    CertificadoDigital,
    CuentaPorCobrar,
    PagoCuentaCobrar,
    ClienteIdentificacion,
    EstadoCliente,
    // Nuevos modelos
    TipoCuentaBancaria,
    EstadoProveedor,
    Proveedor,
    CuentaPorPagar,
    PagoCuentaPagar,
    PeriodoContable,
    CuentaBancaria,
    MovimientoCajaBanco
};

// 5. Ejecuta el método .associate() de cada modelo (si existe)
// ¡Esto es lo que crea las relaciones (belongsTo, hasMany, etc.)!
Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

// 6. Exporta todos los modelos para que tus servicios puedan usarlos
export {
    AsientoContable,
    Auditoria,
    Parroquia,
    Canton,
    EstadoCategoria,
    CategoriaProducto,
    Cliente,
    ConfiguracionBloqueo,
    ConfiguracionToken,
    DetalleAsiento,
    DetalleFactura,
    Error,
    EstadoSri,
    EstadoUsuario,
    Factura,
    MovimientoInventario,
    PlanCuenta,
    EstadoProducto,
    Producto,
    NotificacionesStock,
    Provincia,
    Rol,
    TipoIdentificacion,
    TipoMovimiento,
    Usuario,
    ValorIva,
    Descuento,
    MetodoPago,
    ConfiguracionSri,
    CertificadoDigital,
    CuentaPorCobrar,
    PagoCuentaCobrar,
    ClienteIdentificacion,
    EstadoCliente,
    // Nuevos modelos exportados
    TipoCuentaBancaria,
    EstadoProveedor,
    Proveedor,
    CuentaPorPagar,
    PagoCuentaPagar,
    PeriodoContable,
    CuentaBancaria,
    MovimientoCajaBanco
};

// Exporta también la instancia de conexión de sequelize
export default db;