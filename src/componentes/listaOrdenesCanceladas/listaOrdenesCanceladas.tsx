import '../workOrder/workOrder.css';

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

interface ListaOrdenesCanceladasProps {
  ordenes: WorkOrder[];
}

export const ListaOrdenesCanceladas = ({ ordenes }: ListaOrdenesCanceladasProps) => {
  const ordenesCanceladas = ordenes.filter((orden) => orden.status === 'CANCELADA');

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

  return (
    <div className="workorder-container">
      {/* Listado de Órdenes Canceladas */}
      <div className="listado-ordenes">
        <h2>🚫 Órdenes Canceladas</h2>
        {ordenesCanceladas.length === 0 ? (
          <div className="sin-datos">
            <p>No hay órdenes canceladas registradas</p>
          </div>
        ) : (
          <div className="tabla-ordenes">
            {ordenesCanceladas.map((orden) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
