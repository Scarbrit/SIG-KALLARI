// src/hooks/useSalesStats.js
import { useState, useEffect } from 'react';
import { salesService } from '../services/sales.service';
import { clientService } from '../services/client.service';
import { productService } from '../services/product.service';

export const useSalesStats = () => {
    const [stats, setStats] = useState({
        ventasHoy: 0,
        ventasSemana: 0,
        ventasMes: 0,
        totalClientes: 0,
        productosStock: 0,
        facturasRecientes: [],
        loading: true,
        error: null
    });

    const loadStats = async () => {
        try {
            // Fechas
            const hoy = new Date();
            const inicioSemana = new Date(hoy);
            inicioSemana.setDate(hoy.getDate() - hoy.getDay());
            const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

            // Obtener ventas del día
            const [ventasHoy, ventasSemana, ventasMes, clientes, productos] = await Promise.all([
                salesService.getSalesHistory({
                    fecha_desde: hoy.toISOString().split('T')[0],
                    fecha_hasta: hoy.toISOString().split('T')[0],
                    limit: 100
                }).catch(() => ({ facturas: [], totales: { total_ventas: 0 } })),
                salesService.getSalesHistory({
                    fecha_desde: inicioSemana.toISOString().split('T')[0],
                    fecha_hasta: hoy.toISOString().split('T')[0],
                    limit: 100
                }).catch(() => ({ facturas: [], totales: { total_ventas: 0 } })),
                salesService.getSalesHistory({
                    fecha_desde: inicioMes.toISOString().split('T')[0],
                    fecha_hasta: hoy.toISOString().split('T')[0],
                    limit: 10
                }).catch(() => ({ facturas: [], totales: { total_ventas: 0 } })),
                clientService.getClients().catch(() => ({ clients: [] })),
                productService.getProducts().catch(() => ({ products: [] }))
            ]);

            setStats({
                ventasHoy: ventasHoy.totales?.total_ventas || 0,
                ventasSemana: ventasSemana.totales?.total_ventas || 0,
                ventasMes: ventasMes.totales?.total_ventas || 0,
                totalClientes: clientes.clients?.length || 0,
                productosStock: productos.products?.filter(p => p.stock > 0).length || 0,
                facturasRecientes: ventasMes.facturas?.slice(0, 5) || [],
                loading: false,
                error: null
            });
        } catch (error) {
            setStats(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    return { ...stats, refresh: loadStats };
};
