// src/hooks/useCuentasPorPagar.js
import { useState, useEffect } from 'react';
import { cuentaPorPagarService } from '../services/cuentaPorPagar.service';

export const useCuentasPorPagar = () => {
    const [cuentas, setCuentas] = useState([]);
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCuentas = async (filtros = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cuentaPorPagarService.getCuentas(filtros);
            setCuentas(response.cuentas || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadResumen = async () => {
        try {
            const response = await cuentaPorPagarService.getResumen();
            setResumen(response.resumen || null);
        } catch (err) {
            console.error('Error al cargar resumen:', err);
        }
    };

    const createCuenta = async (data) => {
        try {
            setError(null);
            const response = await cuentaPorPagarService.createCuenta(data);
            loadCuentas();
            loadResumen();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const registrarPago = async (idCuenta, data) => {
        try {
            setError(null);
            const response = await cuentaPorPagarService.registrarPago(idCuenta, data);
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
    }, []);

    return {
        cuentas,
        resumen,
        loading,
        error,
        createCuenta,
        registrarPago,
        reloadCuentas: loadCuentas,
        reloadResumen: loadResumen
    };
};
