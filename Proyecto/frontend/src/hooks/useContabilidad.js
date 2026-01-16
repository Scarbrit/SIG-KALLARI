// src/hooks/useContabilidad.js
import { useState, useEffect } from 'react';
import { contabilidadService } from '../services/contabilidad.service';

export const useContabilidad = () => {
    const [periodos, setPeriodos] = useState([]);
    const [asientos, setAsientos] = useState([]);
    const [planCuentas, setPlanCuentas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadPeriodos = async () => {
        try {
            setLoading(true);
            const response = await contabilidadService.getPeriodos();
            setPeriodos(response.periodos || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadAsientos = async (filtros = {}) => {
        try {
            setLoading(true);
            const response = await contabilidadService.getAsientos(filtros);
            setAsientos(response.asientos || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadPlanCuentas = async () => {
        try {
            const response = await contabilidadService.getPlanCuentas();
            setPlanCuentas(response.plan_cuentas || []);
        } catch (err) {
            console.error('Error al cargar plan de cuentas:', err);
        }
    };

    const createPeriodo = async (data) => {
        try {
            const response = await contabilidadService.createPeriodo(data);
            loadPeriodos();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const closePeriodo = async (id) => {
        try {
            const response = await contabilidadService.closePeriodo(id);
            loadPeriodos();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const createAsiento = async (data) => {
        try {
            const response = await contabilidadService.createAsiento(data);
            loadAsientos();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const approveAsiento = async (id) => {
        try {
            const response = await contabilidadService.approveAsiento(id);
            loadAsientos();
            return response;
        } catch (err) {
            throw err;
        }
    };

    const annulAsiento = async (id, motivo) => {
        try {
            const response = await contabilidadService.annulAsiento(id, motivo);
            loadAsientos();
            return response;
        } catch (err) {
            throw err;
        }
    };

    useEffect(() => {
        loadPeriodos();
        loadAsientos();
        loadPlanCuentas();
    }, []);

    return {
        periodos,
        asientos,
        planCuentas,
        loading,
        error,
        createPeriodo,
        closePeriodo,
        createAsiento,
        approveAsiento,
        annulAsiento,
        reloadPeriodos: loadPeriodos,
        reloadAsientos: loadAsientos
    };
};
