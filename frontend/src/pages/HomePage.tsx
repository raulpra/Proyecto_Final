import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '../types/auth';
import type { Cliente } from '../types/cliente';
import type { Vehiculo } from '../types/vehiculo';
import type { OrdenReparacion } from '../types/orden';
import { API_BASE_URL } from '../data/constants';
import './HomePage.css';

const IconUsers = () => (
  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconCar = () => (
  <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconTool = () => (
  <svg viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);

export default function HomePage({ user }: { user: AuthUser | null }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [ordenes, setOrdenes] = useState<OrdenReparacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/clientes`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/vehiculos`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/ordenes`).then((r) => r.json()),
    ])
      .then(([c, v, o]) => { setClientes(c); setVehiculos(v); setOrdenes(o); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const pendientes = ordenes.filter((o) => o.estado === 'PENDIENTE').length;
  const enCurso = ordenes.filter((o) => o.estado === 'EN_CURSO').length;

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (busqueda.trim()) navigate(`/ordenes?matricula=${encodeURIComponent(busqueda.trim().toUpperCase())}`);
  };

  const kpis = [
    { label: 'Clientes registrados', value: clientes.length, icon: <IconUsers /> },
    { label: 'Vehículos en flota', value: vehiculos.length, icon: <IconCar /> },
    { label: 'Órdenes pendientes', value: pendientes, icon: <IconClock /> },
    { label: 'Trabajos en curso', value: enCurso, icon: <IconTool /> },
  ];

  return (
    <main className="home-page">
      <div className="container-xl px-4">

        {/* Saludo */}
        <div className="mb-4">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
            Bienvenido, {user?.nombre ?? user?.username}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* KPIs */}
        <div className="section-title mb-3">Resumen operativo</div>

        {loading ? (
          <div style={{ padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Cargando datos...
          </div>
        ) : (
          <div className="row g-3 mb-4">
            {kpis.map((kpi) => (
              <div className="col-12 col-sm-6 col-md-3" key={kpi.label}>
                <div className="card h-100 kpi-card">
                  <div className="card-body d-flex align-items-start gap-3">
                    <div className="kpi-icon-wrap">{kpi.icon}</div>
                    <div className="kpi-data">
                      <div className="kpi-value">{kpi.value}</div>
                      <div className="kpi-label">{kpi.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Búsqueda por matrícula */}
        <div className="search-panel">
          <h6>Consulta de historial por matrícula</h6>
          <form onSubmit={handleBuscar} className="search-row">
            <input
              type="text"
              className="sti-input search-input"
              placeholder="Ej: 1234ABC"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn-primary-sti">
              <IconSearch /> Ver historial
            </button>
          </form>
        </div>

        {/* Accesos rápidos */}
        <div className="section-title mb-3">Acceso rápido</div>
        <div className="row g-2">
          {[
            { label: 'Gestionar clientes', path: '/clientes', icon: <IconUsers /> },
            { label: 'Gestionar vehículos', path: '/vehiculos', icon: <IconCar /> },
            { label: 'Ver todas las órdenes', path: '/ordenes', icon: <IconChevron /> },
            ...(user?.rol === 'ADMIN' ? [{ label: 'Gestión de usuarios', path: '/usuarios', icon: <IconShield /> }] : []),
          ].map((item) => (
            <div className="col-12 col-md-4" key={item.path}>
              <button
                className="w-100 quick-link-btn"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
