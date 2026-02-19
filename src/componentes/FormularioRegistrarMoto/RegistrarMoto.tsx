import { useForm } from 'react-hook-form';
import axios from 'axios';
import './RegistrarMoto.css';

interface FormMoto {
  placa: string;
  brand: string;
  model: string;
  cylinder: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono: string;
}

interface RegistrarMotoProps {
  cargando: boolean;
  setError: (error: string | null) => void;
  setCargando: (cargando: boolean) => void;
  onMotoCreada: (placa: string) => void;
  onCancelar: () => void;
  cargarMotos: () => Promise<void>;
}

export const RegistrarMoto = ({
  cargando,
  setError,
  setCargando,
  onMotoCreada,
  onCancelar,
  cargarMotos,
}: RegistrarMotoProps) => {
  const API_BASE = 'http://localhost:3000/api';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormMoto>({
    mode: 'onBlur',
    defaultValues: {
      placa: '',
      brand: '',
      model: '',
      cylinder: '',
      clienteNombre: '',
      clienteEmail: '',
      clienteTelefono: '',
    },
  });

  const crearNuevaMoto = async (data: FormMoto) => {
    try {
      setCargando(true);
      const payload = {
        placa: data.placa,
        brand: data.brand,
        model: data.model,
        cylinder: data.cylinder,
        cliente: {
          nombre: data.clienteNombre,
          email: data.clienteEmail || null,
          telefono: parseInt(data.clienteTelefono),
        },
      };

      //dad

      const response = await axios.post(`${API_BASE}/bikes`, payload);

      if (response.data && response.data.data) {
        onMotoCreada(response.data.data.placa);
        reset();
        setError(null);
        // Recargar las motos desde workOrder
        await cargarMotos();
      }
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || 'Error al crear la moto';
      setError(errorMessage);
      console.error('Error al crear moto:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registrar-moto-form">
      <h4>Datos de Nueva Moto y Cliente</h4>
      <form onSubmit={handleSubmit(crearNuevaMoto)}>
        <div className="form-section-header">
          <h5>📋 Información del Cliente</h5>
        </div>
        <div className="registrar-moto-inputs">
          <div>
            <label>Nombre del Cliente *</label>
            <input
              type="text"
              placeholder="Juan Pérez"
              {...register('clienteNombre', {
                required: 'El nombre del cliente es requerido',
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres',
                },
              })}
            />
            {errors.clienteNombre && <span className="error-message">{errors.clienteNombre.message}</span>}
          </div>
          <div>
            <label>Email del Cliente</label>
            <input
              type="email"
              placeholder="juan@email.com"
              {...register('clienteEmail', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
            />
            {errors.clienteEmail && <span className="error-message">{errors.clienteEmail.message}</span>}
          </div>
          <div>
            <label>Teléfono del Cliente *</label>
            <input
              type="tel"
              placeholder="3101234567"
              {...register('clienteTelefono', {
                required: 'El teléfono es requerido',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Teléfono debe tener 10 dígitos',
                },
              })}
            />
            {errors.clienteTelefono && <span className="error-message">{errors.clienteTelefono.message}</span>}
          </div>
        </div>

        <div className="form-section-header">
          <h5>🏍️ Información de la Moto</h5>
        </div>
        <div className="registrar-moto-inputs">
          <div>
            <label>Placa *</label>
            <input
              type="text"
              placeholder="ABC-123"
              {...register('placa', {
                required: 'La placa es requerida',
                pattern: {
                  value: /^[A-Z]{3}-\d{3}$/,
                  message: 'Formato inválido. Use: ABC-123',
                },
              })}
            />
            {errors.placa && <span className="error-message">{errors.placa.message}</span>}
          </div>
          <div>
            <label>Marca *</label>
            <input
              type="text"
              placeholder="Honda"
              {...register('brand', {
                required: 'La marca es requerida',
                minLength: {
                  value: 2,
                  message: 'La marca debe tener al menos 2 caracteres',
                },
              })}
            />
            {errors.brand && <span className="error-message">{errors.brand.message}</span>}
          </div>
          <div>
            <label>Modelo *</label>
            <input
              type="text"
              placeholder="CB500"
              {...register('model', {
                required: 'El modelo es requerido',
                minLength: {
                  value: 2,
                  message: 'El modelo debe tener al menos 2 caracteres',
                },
              })}
            />
            {errors.model && <span className="error-message">{errors.model.message}</span>}
          </div>
          <div>
            <label>Cilindraje *</label>
            <input
              type="text"
              placeholder="500cc"
              {...register('cylinder', {
                required: 'El cilindraje es requerido',
                pattern: {
                  value: /^\d+cc$/,
                  message: 'Formato inválido. Use: 500cc',
                },
              })}
            />
            {errors.cylinder && <span className="error-message">{errors.cylinder.message}</span>}
          </div>
        </div>
        <div className="registrar-moto-botones">
          <button
            type="submit"
            disabled={cargando}
            className="registrar-moto-guardar"
          >
            ✅ Guardar Moto y Cliente
          </button>
          <button
            type="button"
            onClick={onCancelar}
            className="registrar-moto-cancelar"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
