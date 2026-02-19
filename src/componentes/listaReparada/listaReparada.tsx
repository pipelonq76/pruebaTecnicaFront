import { useState, useEffect } from 'react';
import axios from 'axios';
import './listaReparada.css';

interface Moto {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  fechaReparacion: string;
  estado: string;
}

export const ListaReparada = () => {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarMotos = async () => {
      try {
        const respuesta = await axios.get('http://localhost:3000/api/bikes');
        setMotos(respuesta.data);
        setCargando(false);
        setError(null);
      } catch (err) {
        setError('Error al cargar las motos reparadas');
        setCargando(false);
        console.error('Error:', err);
      }
    };

    cargarMotos();
  }, []);

  if (cargando) {
    return <div className="cargando">Cargando motos reparadas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="lista-reparada-container">
      <h1>Motos Reparadas</h1>
      {motos.length === 0 ? (
        <p className="sin-datos">No hay motos reparadas registradas</p>
      ) : (
        <table className="tabla-motos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Fecha de Reparación</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {motos.map((moto) => (
              <tr key={moto.id}>
                <td>{moto.id}</td>
                <td>{moto.marca}</td>
                <td>{moto.modelo}</td>
                <td>{moto.placa}</td>
                <td>{new Date(moto.fechaReparacion).toLocaleDateString('es-ES')}</td>
                <td>
                  <span className={`estado ${moto.estado.toLowerCase()}`}>
                    {moto.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
