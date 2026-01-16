// src/hooks/useCuentasBancarias.js
import { useState, useEffect } from 'react';
import { cuentaBancariaService } from '../services/cuentaBancaria.service';

export const useCuentasBancarias = () => {
    const [cuentas, setCuentas] = useState([]);
    const [catalogs, setCatalogs] = useState({ tipos: [], cuentas_contables: [] });
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCuentas = async (filtros = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cuentaBancariaService.getCuentas(filtros);
            setCuentas(response.cuentas || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadResumen = async () => {
        try {
            const response = await cuentaBancariaService.getResumen();
            setResumen(response.resumen || null);
        } catch (err) {
            console.error('Error al cargar resumen:', err);
        }
    };

    const loadCatalogs = async () => {
        try {
            const response = await cuentaBancariaService.getCatalogs();
            setCatalogs({
                tipos: response.tipos || [],
                cuentas_contables: response.cuentas_contables || []
            });
        } catch (err) {
            console.error('Error al cargar catálogos:', err);
        }
    };

    const createCuenta = async (data) => {
        try {
            const response = await cuentaBancariaService.createCuenta(data);
            loadCuentas();
            loadResumen();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const updateCuenta = async (id, data) => {
        try {
            const response = await cuentaBancariaService.updateCuenta(id, data);
            loadCuentas();
            loadResumen();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const registrarMovimiento = async (data) => {
        try {
            const response = await cuentaBancariaService.registrarMovimiento(data);
            loadCuentas();
            loadResumen();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const transferir = async (data) => {
        try {
            const response = await cuentaBancariaService.transferir(data);
            loadCuentas();
            loadResumen();
            return response;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        loadCuentas();
        loadResumen();
        loadCatalogs();
    }, []);

    return {
        cuentas,
        catalogs,
        resumen,
        loading,
        error,
        createCuenta,
        updateCuenta,
        registrarMovimiento,
        transferir,
        reloadCuentas: loadCuentas
    };
};
