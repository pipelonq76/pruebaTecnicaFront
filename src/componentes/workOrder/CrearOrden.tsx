import { useState, useEffect } from 'react';
import axios from 'axios';
import './CrearOrden.css';
import { RegistrarMoto } from '../FormularioRegistrarMoto/RegistrarMoto';

interface Moto {
  id: number;
  placa: string;
  brand: string;
  model: string;
  cylinder: string;
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
}

interface CrearOrdenProps {
  motos: Moto[];
  ordenes: WorkOrder[];
  cargando: boolean;
  error: string | null;
  onGuardarOrden: (nuevaOrden: WorkOrder) => void;
  onCancelar: () => void;
  setError: (error: string | null) => void;
  setCargando: (cargando: boolean) => void;
  cargarMotos: () => Promise<void>;
}

export const CrearOrden = ({
  motos,
  ordenes,
  cargando,
  error,
  onGuardarOrden,
  onCancelar,
  setError,
  setCargando,
  cargarMotos,
}: CrearOrdenProps) => {
  const API_BASE = 'http://localhost:3000/api';

  const [formData, setFormData] = useState<WorkOrder>({
    motoPlaca: '',
    entryDate: new Date().toISOString().split('T')[0],
    faultDescription: '',
    status: 'RECIBIDA',
    total: 0,
    items: [],
  });

  const [nuevoItem, setNuevoItem] = useState<Item>({
    type: 'REPUESTO',
    description: '',
    count: 1,
    unitValue: 0,
  });

  const [mostrarFormularioMoto, setMostrarFormularioMoto] = useState(false);
  const [busquedaMoto, setBusquedaMoto] = useState('');

  // Efecto para actualizar la búsqueda cuando cambian las motos
  useEffect(() => {
    if (formData.motoPlaca) {
      const motoSeleccionada = motos.find((m) => m.placa === formData.motoPlaca);
      if (motoSeleccionada) {
        setBusquedaMoto(`${motoSeleccionada.placa} - ${motoSeleccionada.brand} ${motoSeleccionada.model}`);
      }
    }
  }, [motos, formData.motoPlaca]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNuevoItem({
      ...nuevoItem,
      [name]: name === 'count' || name === 'unitValue' ? Number(value) : value,
    });
  };

  const agregarItem = () => {
    if (!nuevoItem.description || nuevoItem.count <= 0 || nuevoItem.unitValue < 0) {
      setError('Completa todos los campos del ítem correctamente');
      return;
    }

    const itemWithId = {
      ...nuevoItem,
      id: Date.now(),
    };

    setFormData({
      ...formData,
      items: [...(formData.items || []), itemWithId],
    });

    setNuevoItem({
      type: 'REPUESTO',
      description: '',
      count: 1,
      unitValue: 0,
    });

    setError(null);
  };

  const eliminarItem = (id: number | undefined) => {
    setFormData({
      ...formData,
      items: formData.items?.filter((item) => item.id !== id) || [],
    });
  };

  const calcularTotal = (): number => {
    return (
      formData.items?.reduce((sum, item) => sum + item.count * item.unitValue, 0) || 0
    );
  };

  const motosFiltradas = motos.filter((moto) =>
    moto.placa.toLowerCase().includes(busquedaMoto.toLowerCase()) ||
    moto.brand.toLowerCase().includes(busquedaMoto.toLowerCase())
  );

  const guardarOrden = async () => {
    try {
      if (!formData.motoPlaca || !formData.faultDescription) {
        setError('Completa los campos requeridos');
        return;
      }

      if ((formData.items || []).length === 0) {
        setError('Agrega al menos un ítem');
        return;
      }

      setCargando(true);
      const ordenFinal = {
        motoPlaca: formData.motoPlaca,
        entryDate: formData.entryDate,
        faultDescription: formData.faultDescription,
        status: formData.status,
        total: calcularTotal(),
      };

      // Enviar a la API
      const response = await axios.post(`${API_BASE}/workOrders`, ordenFinal);

      if (response.data && response.data.data) {
        // Mapear la respuesta correctamente
        const nuevaOrden: WorkOrder = {
          id: response.data.data.id,
          motoPlaca: response.data.data.motoPlaca,
          entryDate: response.data.data.entryDate,
          faultDescription: response.data.data.faultDescription,
          status: response.data.data.status,
          total: typeof response.data.data.total === 'number' ? response.data.data.total : parseFloat(response.data.data.total) || 0,
          items: Array.isArray(response.data.data.items) ? response.data.data.items.map((item: any) => ({
            id: item.id,
            type: item.type,
            description: item.description,
            count: typeof item.count === 'number' ? item.count : parseInt(item.count) || 0,
            unitValue: typeof item.unitValue === 'number' ? item.unitValue : parseFloat(item.unitValue) || 0,
          })) : [],
        };

        onGuardarOrden(nuevaOrden);
        setError(null);
      }
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || 'Error al guardar la orden';
      setError(errorMessage);
      console.error('Error al guardar orden:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="formulario-orden">
      <h2>➕ Crear Nueva Orden</h2>

      <div className="form-section">
        <h3>1. Datos Principales</h3>

        <div className="form-group">
          <label>Seleccionar o Registrar Moto *</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Busca por placa o marca..."
              value={busquedaMoto}
              onChange={(e) => {
                setBusquedaMoto(e.target.value);
                setFormData({
                  ...formData,
                  motoPlaca: '',
                });
              }}
              style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
            />
            {busquedaMoto && motosFiltradas.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {motosFiltradas.map((moto) => (
                  <div
                    key={moto.id}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        motoPlaca: moto.placa,
                      });
                      setBusquedaMoto(`${moto.placa} - ${moto.brand} ${moto.model}`);
                    }}
                    style={{
                      padding: '10px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      backgroundColor: formData.motoPlaca === moto.placa ? '#f0f0f0' : 'white',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        formData.motoPlaca === moto.placa ? '#f0f0f0' : 'white')
                    }
                  >
                    <strong>{moto.placa}</strong> - {moto.brand} {moto.model}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!mostrarFormularioMoto && (
            <button
              type="button"
              onClick={() => setMostrarFormularioMoto(true)  }
              className="registrar-moto-btn"
            >
              ➕ Registrar Nueva Moto
            </button>
          )}

          {mostrarFormularioMoto && (
            <RegistrarMoto
              cargando={cargando}
              setError={setError}
              setCargando={setCargando}
              cargarMotos={cargarMotos}
              onMotoCreada={(placa) => {
                setFormData({
                  ...formData,
                  motoPlaca: placa,
                });
                setMostrarFormularioMoto(false);
              }}
              onCancelar={() => {
                setMostrarFormularioMoto(false);
              }}
            />
          )}

          {formData.motoPlaca && (
            <div className="moto-info">
              {motos
                .filter((m) => m.placa === formData.motoPlaca)
                .map((moto) => (
                  <div key={moto.id}>
                    <p>
                      <strong>Marca:</strong> {moto.brand}
                    </p>
                    <p>
                      <strong>Modelo:</strong> {moto.model}
                    </p>
                    <p>
                      <strong>Cilindraje:</strong> {moto.cylinder}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Fecha de Entrada</label>
          <input
            type="date"
            name="entryDate"
            value={formData.entryDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Descripción de la Falla *</label>
          <textarea
            name="faultDescription"
            value={formData.faultDescription}
            onChange={handleInputChange}
            placeholder="Describe los problemas identificados..."
          />
        </div>
      </div>

      {/* Agregar Ítems */}
      <div className="form-section">
        <h3>2. Agregar Ítems</h3>

        <div className="item-form">
          <div className="form-group">
            <label>Tipo *</label>
            <select name="type" value={nuevoItem.type} onChange={handleItemChange}>
              <option value="REPUESTO">🔧 Repuesto</option>
              <option value="MANO_OBRA">👷 Mano de Obra</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descripción *</label>
            <input
              type="text"
              name="description"
              value={nuevoItem.description}
              onChange={handleItemChange}
              placeholder="Ej: Cambio de aceite"
            />
          </div>

          <div className="form-group">
            <label>Cantidad *</label>
            <input
              type="number"
              name="count"
              min="1"
              value={nuevoItem.count}
              onChange={handleItemChange}
            />
          </div>

          <div className="form-group">
            <label>Valor Unitario *</label>
            <input
              type="number"
              name="unitValue"
              min="0"
              step="0.01"
              value={nuevoItem.unitValue}
              onChange={handleItemChange}
            />
          </div>

          <button onClick={agregarItem} className="btn-agregar">
            ➕ Agregar Ítem
          </button>
        </div>

        {/* Lista de Ítems */}
        {formData.items && formData.items.length > 0 && (
          <div className="items-lista">
            <h4>Ítems Agregados:</h4>
            <table>
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>V. Unitario</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="tipo-badge">{item.type}</span>
                    </td>
                    <td>{item.description}</td>
                    <td>{item.count}</td>
                    <td>${typeof item.unitValue === 'number' ? item.unitValue.toFixed(2) : parseFloat(item.unitValue as any).toFixed(2)}</td>
                    <td className="total-item">
                      ${((typeof item.count === 'number' ? item.count : parseInt(item.count as any)) * (typeof item.unitValue === 'number' ? item.unitValue : parseFloat(item.unitValue as any))).toFixed(2)}
                    </td>
                    <td>
                      <button
                        onClick={() => eliminarItem(item.id)}
                        className="btn-eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total-orden">
              <strong>Total Orden: ${calcularTotal().toFixed(2)}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="form-acciones">
        <button onClick={guardarOrden} className="btn-primario" disabled={cargando}>
          💾 Guardar Orden
        </button>
        <button onClick={onCancelar} className="btn-secundario">
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
};
