import { ProveedorService } from '../services/proveedor.service.js';

const proveedorService = new ProveedorService();

export class ProveedorController {

    async create(req, res) {
        try {
            const data = req.validatedData;
            const proveedor = await proveedorService.create(data);

            res.status(201).json({
                success: true,
                message: 'Proveedor registrado exitosamente.',
                proveedor
            });
        } catch (error) {
            const status = error.message.includes('ya existe') ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.validatedParams;
            const data = req.validatedData;
            const proveedor = await proveedorService.update(id, data);

            res.status(200).json({
                success: true,
                message: 'Proveedor actualizado correctamente.',
                proveedor
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const filtros = {
                estado: req.query.estado,
                busqueda: req.query.q
            };
            const proveedores = await proveedorService.getAll(filtros);

            res.status(200).json({
                success: true,
                proveedores
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.validatedParams;
            const proveedor = await proveedorService.getById(id);

            res.status(200).json({
                success: true,
                proveedor
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async changeState(req, res) {
        try {
            const { id } = req.validatedParams;
            const { estado } = req.validatedData;
            const proveedor = await proveedorService.changeState(id, estado);

            res.status(200).json({
                success: true,
                message: `Estado del proveedor actualizado a: ${estado}`,
                proveedor
            });
        } catch (error) {
            if (error.message.includes('no encontrado') || error.message.includes('no válido')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(400).json({ success: false, message: error.message });
        }
    }

    async getCatalogs(req, res) {
        try {
            const catalogs = await proveedorService.getCatalogs();
            res.status(200).json({
                success: true,
                ...catalogs
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getResumenCuentas(req, res) {
        try {
            const { id } = req.validatedParams;
            const resumen = await proveedorService.getResumenCuentas(id);

            res.status(200).json({
                success: true,
                ...resumen
            });
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
