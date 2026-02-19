import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './inicio.css';

interface ResumenOrdenes {
  recibida: number;
  diagnostico: number;
  enProceso: number;
  lista: number;
  entregada: number;
  cancelada: number;
}

export const Inicio = () => {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<ResumenOrdenes>({
    recibida: 0,
    diagnostico: 0,
    enProceso: 0,
    lista: 0,
    entregada: 0,
    cancelada: 0,
  });

  // Simular datos - Reemplazar con llamada a API
  useEffect(() => {
    // TODO: Llamar a la API para obtener el resumen
    setResumen({
      recibida: 5,
      diagnostico: 3,
      enProceso: 8,
      lista: 2,
      entregada: 15,
      cancelada: 1,
    });
  }, []);

  const totalOrdenes = Object.values(resumen).reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🏍️ Taller de Motos - PAVAS S.A.S</h1>
          <p>Sistema de Control de Alistamientos y Reparaciones</p>
        </div>
      </header>

      {/* Menú de Navegación Principal */}
      <nav className="menu-principal">
        <div className="menu-contenedor">
          <button
            className="menu-boton"
            onClick={() => navigate('/ordenes')}
          >
            <span className="menu-icono">📋</span>
            <div className="menu-texto">
              <h3>Ver Órdenes</h3>
              <p>Listado y gestión de todas las órdenes</p>
            </div>
            <span className="menu-flecha">→</span>
          </button>

          <button
            className="menu-boton"
            onClick={() => navigate('/ordenes/crear')}
          >
            <span className="menu-icono">➕</span>
            <div className="menu-texto">
              <h3>Crear Orden Nueva</h3>
              <p>Registrar una nueva orden de trabajo</p>
            </div>
            <span className="menu-flecha">→</span>
          </button>

          <button
            className="menu-boton"
            onClick={() => navigate('/clientes')}
          >
            <span className="menu-icono">👥</span>
            <div className="menu-texto">
              <h3>Gestionar Clientes</h3>
              <p>Ver y crear clientes</p>
            </div>
            <span className="menu-flecha">→</span>
          </button>

          <button
            className="menu-boton"
            onClick={() => navigate('/motos')}
          >
            <span className="menu-icono">🏍️</span>
            <div className="menu-texto">
              <h3>Gestionar Motos</h3>
              <p>Registrar y editar motos</p>
            </div>
            <span className="menu-flecha">→</span>
          </button>
        </div>
      </nav>

      {/* Resumen de Órdenes */}
      <section className="resumen-ordenes">
        <h2>📊 Resumen de Órdenes</h2>
        <div className="resumen-grid">
          <div className="tarjeta-estado recibida">
            <div className="estado-numero">{resumen.recibida}</div>
            <div className="estado-nombre">Recibida</div>
            <div className="estado-subtitulo">Nuevas órdenes</div>
          </div>

          <div className="tarjeta-estado diagnostico">
            <div className="estado-numero">{resumen.diagnostico}</div>
            <div className="estado-nombre">Diagnóstico</div>
            <div className="estado-subtitulo">Analizando</div>
          </div>

          <div className="tarjeta-estado en-proceso">
            <div className="estado-numero">{resumen.enProceso}</div>
            <div className="estado-nombre">En Proceso</div>
            <div className="estado-subtitulo">En reparación</div>
          </div>

          <div className="tarjeta-estado lista">
            <div className="estado-numero">{resumen.lista}</div>
            <div className="estado-nombre">Lista</div>
            <div className="estado-subtitulo">Listas para entregar</div>
          </div>

          <div className="tarjeta-estado entregada">
            <div className="estado-numero">{resumen.entregada}</div>
            <div className="estado-nombre">Entregada</div>
            <div className="estado-subtitulo">Completadas</div>
          </div>

          <div className="tarjeta-estado cancelada">
            <div className="estado-numero">{resumen.cancelada}</div>
            <div className="estado-nombre">Cancelada</div>
            <div className="estado-subtitulo">Canceladas</div>
          </div>

          <div className="tarjeta-total">
            <div className="estado-numero">{totalOrdenes}</div>
            <div className="estado-nombre">Total</div>
            <div className="estado-subtitulo">Todas las órdenes</div>
          </div>
        </div>
      </section>

      {/* Acciones Rápidas */}
      <section className="acciones-rapidas">
        <h2>⚡ Acciones Rápidas</h2>
        <div className="acciones-grid">
          <button className="accion-rapida urgente" onClick={() => navigate('/ordenes')}>
            <span className="accion-icono">🔴</span>
            <span className="accion-texto">Ver órdenes en proceso</span>
          </button>

          <button className="accion-rapida" onClick={() => navigate('/ordenes/crear')}>
            <span className="accion-icono">✍️</span>
            <span className="accion-texto">Registrar nueva orden</span>
          </button>

          <button className="accion-rapida" onClick={() => navigate('/clientes')}>
            <span className="accion-icono">🆕</span>
            <span className="accion-texto">Añadir cliente</span>
          </button>

          <button className="accion-rapida" onClick={() => navigate('/motos')}>
            <span className="accion-icono">🏗️</span>
            <span className="accion-texto">Registrar moto</span>
          </button>
        </div>
      </section>

      {/* Información de Ayuda */}
      <section className="seccion-ayuda">
        <h2>ℹ️ Información Importante</h2>
        <div className="ayuda-contenedor">
          <div className="ayuda-card">
            <h3>📈 Flujo de Estados</h3>
            <p>RECIBIDA → DIAGNOSTICO → EN_PROCESO → LISTA → ENTREGADA</p>
            <small>Puedes cancelar desde cualquier estado excepto ENTREGADA</small>
          </div>

          <div className="ayuda-card">
            <h3>💡 Crear Orden</h3>
            <p>Selecciona una moto existente o crea una nueva con su cliente.</p>
            <small>Agrega ítems de MANO_OBRA o REPUESTO</small>
          </div>

          <div className="ayuda-card">
            <h3>✅ Validaciones</h3>
            <p>Placa única por moto, cantidad  0, valor = 0</p>
            <small>El sistema valida todas las transacciones</small>
          </div>
        </div>
      </section>
    </div>
  );
};
