// src/hooks/useProveedores.js
import { useState, useEffect } from 'react';
import { proveedorService } from '../services/proveedor.service';

export const useProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [catalogs, setCatalogs] = useState({ tipos_identificacion: [], estados: [], parroquias: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar proveedores
    const loadProveedores = async (filtros = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await proveedorService.getProveedores(filtros);
            setProveedores(response.proveedores || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar catálogos
    const loadCatalogs = async () => {
        try {
            const response = await proveedorService.getCatalogs();
            setCatalogs({
                tipos_identificacion: response.tipos_identificacion || [],
                estados: response.estados || [],
                parroquias: response.parroquias || []
            });
        } catch (err) {
            console.error('Error al cargar catálogos:', err);
        }
    };

    // Crear proveedor
    const createProveedor = async (data) => {
        try {
            setError(null);
            const response = await proveedorService.createProveedor(data);
            loadProveedores();
            return response;
        } catch (err) {
            throw err;
        }
    };

    // Actualizar proveedor
    const updateProveedor = async (id, data) => {
        try {
            setError(null);
            const response = await proveedorService.updateProveedor(id, data);
            loadProveedores();
            return response;
        } catch (err) {
            throw err;
        }
    };

    // Cambiar estado
    const changeState = async (id, estado) => {
        try {
            setError(null);
            const response = await proveedorService.changeState(id, estado);
            loadProveedores();
            return response;
        } catch (err) {
            throw err;
        }
    };

    // Cargar datos iniciales
    useEffect(() => {
        loadProveedores();
        loadCatalogs();
    }, []);

    return {
        proveedores,
        catalogs,
        loading,
        error,
        createProveedor,
        updateProveedor,
        changeState,
        reloadProveedores: loadProveedores
    };
};
