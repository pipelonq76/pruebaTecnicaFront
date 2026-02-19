import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Inicio } from './componentes/inicio';
import { WorkOrder } from './componentes/workOrder';
import { ListaOrdenesCanceladas } from './componentes/listaOrdenesCanceladas';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/ordenes" element={<WorkOrder />} />
          <Route path="/ordenes/crear" element={<WorkOrder />} />
          <Route path="/ordenes/:id" element={<div className="pagina-placeholder"><h1>📌 Detalle de Orden</h1><p>Próximamente...</p></div>} />
          <Route path="/clientes" element={<div className="pagina-placeholder"><h1>👥 Gestionar Clientes</h1><p>Próximamente...</p></div>} />
          <Route path="/motos" element={<div className="pagina-placeholder"><h1>🏍️ Gestionar Motos</h1><p>Próximamente...</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
