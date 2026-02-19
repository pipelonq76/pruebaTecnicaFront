import { useState, useEffect } from 'react';
import axios from 'axios';
import './workOrder.css';
import { CrearOrden } from './CrearOrden';
import { ListaOrdenesCanceladas } from '../listaOrdenesCanceladas';

// Interfaces
interface Moto {
    id: number;
    placa: string;
    brand: string;
    model: string;
    cylinder: string;
}

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
}

interface Item {
    id?: number;
    type: 'MANO_OBRA' | 'REPUESTO';
    description: string;
    count: number;
    unitValue: number;
}

interface WorkOrder {
    id?: number;
    motoPlaca: string;
    entryDate: string;
    faultDescription: string;
    status: 'RECIBIDA' | 'DIAGNOSTICO' | 'EN_PROCESO' | 'LISTA' | 'ENTREGADA' | 'CANCELADA';
    total: number;
    items?: Item[];
    clienteId?: number;
    cliente?: Cliente;
}

export const WorkOrder = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [motos, setMotos] = useState<Moto[]>([]);
    const [ordenes, setOrdenes] = useState<WorkOrder[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vistaActual, setVistaActual] = useState<'listado' | 'crear' | 'canceladas' | 'entregadas'>('listado');

    // API Base URL
    const API_BASE = 'http://localhost:3000/api';


    useEffect(() => {
        cargarMotos();
        cargarOrdenes();
    }, []);

    const cargarMotos = async () => {
        try {
            setCargando(true);
            const response = await axios.get(`${API_BASE}/bikes`);

            if (response.data && response.data.data) {
                setMotos(response.data.data);
            } else {
                setMotos([]);
            }
            setError(null);
        } catch (err) {
            console.error('Error al cargar motos:', err);
            setError('Error al cargar las motos');
            setMotos([]);
        } finally {
            setCargando(false);
        }
    };

    const cargarOrdenes = async () => {
        try {
            setCargando(true);
            const response = await axios.get(`${API_BASE}/workOrders`);

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                // Mapear correctamente los datos de la API
                const ordenesFormateadas = response.data.data.map((orden: any) => ({
                    id: orden.id,
                    motoPlaca: orden.motoPlaca,
                    entryDate: orden.entryDate,
                    faultDescription: orden.faultDescription,
                    status: orden.status,
                    total: typeof orden.total === 'number' ? orden.total : parseFloat(orden.total) || 0,
                    clienteId: orden.clienteId,
                    cliente: orden.cliente ? {
                        id: orden.cliente.id,
                        nombre: orden.cliente.nombre,
                        telefono: orden.cliente.telefono,
                        email: orden.cliente.email,
                    } : undefined,
                    items: Array.isArray(orden.items) ? orden.items.map((item: any) => ({
                        id: item.id,
                        type: item.type,
                        description: item.description,
                        count: typeof item.count === 'number' ? item.count : parseInt(item.count) || 0,
                        unitValue: typeof item.unitValue === 'number' ? item.unitValue : parseFloat(item.unitValue) || 0,
                    })) : [],
                }));

                setOrdenes(ordenesFormateadas);
                setError(null);
            } else {
                setOrdenes([]);
            }
        } catch (err) {
            console.error('Error al cargar órdenes:', err);
            setError('Error al cargar las órdenes');
            setOrdenes([]);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (ordenId: number | undefined, nuevoEstado: string) => {
        try {
            if (!ordenId) {
                setError('ID de orden inválido');
                return;
            }

            setCargando(true);
            const response = await axios.patch(
                `${API_BASE}/workOrders/${ordenId}/status`,
                { status: nuevoEstado }
            );

            if (response.data && response.data.data) {
                // Mapear la respuesta correctamente
                setOrdenes(
                    ordenes.map((orden) =>
                        orden.id === ordenId
                            ? {
                                ...orden,
                                status: response.data.data.status as WorkOrder['status'],
                            }
                            : orden
                    )
                );
                setError(null);
            }
        } catch (err) {
            const errorMessage = (err as any).response?.data?.message || 'Error al cambiar el estado';
            setError(errorMessage);
            console.error('Error al cambiar estado:', err);
        } finally {
            setCargando(false);
        }
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            RECIBIDA: '#3498db',
            DIAGNOSTICO: '#f39c12',
            EN_PROCESO: '#e74c3c',
            LISTA: '#f1c40f',
            ENTREGADA: '#2ecc71',
            CANCELADA: '#95a5a6',
        };
        return colors[status] || '#999';
    };

    const transicionesValidas: Record<string, string[]> = {
        RECIBIDA: ['DIAGNOSTICO', 'CANCELADA'],
        DIAGNOSTICO: ['EN_PROCESO', 'CANCELADA'],
        EN_PROCESO: ['LISTA', 'CANCELADA'],
        LISTA: ['ENTREGADA', 'CANCELADA'],
        ENTREGADA: [],
        CANCELADA: [],
    };

    return (
        <div className="workorder-container">
            {/* Selector de Vista */}
            <div className="vista-selector">
                <button
                    className={`vista-btn ${vistaActual === 'listado' ? 'activa' : ''}`}
                    onClick={() => setVistaActual('listado')}
                >
                    📋 Ver Órdenes
                </button>
                <button
                    className={`vista-btn ${vistaActual === 'crear' ? 'activa' : ''}`}
                    onClick={() => {
                        setVistaActual('crear');
                        setMostrarFormulario(true);
                    }}
                >
                    ➕ Nueva Orden
                </button>
                <button
                    className={`vista-btn ${vistaActual === 'canceladas' ? 'activa' : ''}`}
                    onClick={() => {
                        setVistaActual('canceladas');
                    }}
                >
                    🚫 Órdenes Canceladas
                </button>
            </div>

            {/* Mensajes */}
            {error && <div className="alert alert-error">{error}</div>}
            {cargando && <div className="alert alert-info">⏳ Cargando...</div>}

            {/* Listado de Órdenes */}
            {vistaActual === 'listado' && (
                <div className="listado-ordenes">
                    <h2>📋 Órdenes de Trabajo</h2>
                    {ordenes.length === 0 ? (
                        <div className="sin-datos">
                            <p>No hay órdenes registradas</p>
                            <button onClick={() => setVistaActual('crear')} className="btn-primario">
                                Crear Primera Orden
                            </button>
                        </div>
                    ) : (
                        <div className="tabla-ordenes">
                            {ordenes.map((orden) => (
                                <div key={orden.id} className="orden-card">
                                    <div className="orden-header">
                                        <div className="orden-info">
                                            <h3>Placa: {orden.motoPlaca}</h3>
                                            <p>{orden.faultDescription}</p>
                                        </div>
                                        <div
                                            className="estado-badge"
                                            style={{ backgroundColor: getStatusColor(orden.status) }}
                                        >
                                            {orden.status}
                                        </div>
                                    </div>

                                    <div className="orden-detalles">
                                        <div className="detalle">
                                            <span className="label">Fecha Entrada:</span>
                                            <span>{new Date(orden.entryDate).toLocaleDateString('es-ES')}</span>
                                        </div>
                                        <div className="detalle">
                                            <span className="label">Total:</span>
                                            <span className="total">${typeof orden.total === 'number' ? orden.total.toFixed(2) : parseFloat(orden.total as any).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Datos del Cliente */}
                                    {orden.cliente && (
                                        <div className="cliente-info">
                                            <h4>👤 Datos del Cliente</h4>
                                            <div className="cliente-detalles">
                                                <div className="detalle">
                                                    <span className="label">Nombre:</span>
                                                    <span>{orden.cliente.nombre}</span>
                                                </div>
                                                <div className="detalle">
                                                    <span className="label">Teléfono:</span>
                                                    <span>{orden.cliente.telefono}</span>
                                                </div>
                                                <div className="detalle">
                                                    <span className="label">Email:</span>
                                                    <span>{orden.cliente.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Items */}
                                    {orden.items && orden.items.length > 0 && (
                                        <div className="orden-items">
                                            <h4>Ítems:</h4>
                                            <ul>
                                                {orden.items.map((item) => (
                                                    <li key={item.id}>
                                                        <span className="tipo-badge">{item.type}</span>
                                                        <span>{item.description}</span>
                                                        <span className="cantidad">x{item.count}</span>
                                                        <span className="precio">${((typeof item.unitValue === 'number' ? item.unitValue : parseFloat(item.unitValue as any)) * (typeof item.count === 'number' ? item.count : parseInt(item.count as any))).toFixed(2)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Cambio de Estado */}
                                    <div className="cambio-estado">
                                        <label>Cambiar Estado:</label>
                                        <select
                                            value={orden.status}
                                            onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                                            disabled={(transicionesValidas[orden.status] || []).length === 0}
                                        >
                                            <option value={orden.status}>{orden.status}</option>
                                            {(transicionesValidas[orden.status] || []).map((estado) => (
                                                <option key={estado} value={estado}>
                                                    {estado}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Formulario de Crear Orden */}
            {vistaActual === 'crear' && (
                <CrearOrden
                    motos={motos}
                    ordenes={ordenes}
                    cargando={cargando}
                    error={error}
                    onGuardarOrden={(nuevaOrden) => {
                        setOrdenes([...ordenes, nuevaOrden]);
                        setVistaActual('listado');
                        setError(null);
                    }}
                    onCancelar={() => {
                        setVistaActual('listado');
                        setError(null);
                    }}
                    setError={setError}
                    setCargando={setCargando}
                    cargarMotos={cargarMotos}
                />
            )}

            {vistaActual === 'canceladas' && (
                <ListaOrdenesCanceladas ordenes={ordenes} />
            )}
        </div>
    );
};
